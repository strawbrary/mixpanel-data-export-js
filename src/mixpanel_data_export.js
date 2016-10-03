var crypto = require('crypto');
var bluebird = require('bluebird');
var needle = require('needle');

needle.getAsync = bluebird.promisify(needle.get);

function MixpanelExport(opts) {
  this.opts = opts;
  if (!this.opts.api_secret) {
    throw 'Error: api_secret must be passed to MixpanelExport constructor.';
  }
  this.api_key = this.opts.api_key;
  this.api_secret = this.opts.api_secret;
  this.timeout_after = this.opts.timeout_after || 10;

  needle.defaults({
    open_timeout: this.opts.open_timeout || 10000,
    read_timeout: this.opts.read_timeout || 0
  });
}

MixpanelExport.prototype.export = function(parameters) {
  return this.get('export', parameters);
};

MixpanelExport.prototype.exportStream = function(parameters) {
  var reqOpts = Object.assign(!!this.api_key ? {} : {username: this.api_secret}, {
    compressed: true,
    parse: true,
  });
  return needle.get(this._buildRequestURL('export', parameters), reqOpts);
};

MixpanelExport.prototype.engage = function(parameters) {
  return this.get(['engage'], parameters);
};

MixpanelExport.prototype.annotations = function(parameters) {
  return this.get('annotations', parameters);
};

MixpanelExport.prototype.createAnnotation = function(parameters) {
  return this.get(['annotations', 'create'], parameters);
};

MixpanelExport.prototype.updateAnnotation = function(parameters) {
  return this.get(['annotations', 'update'], parameters);
};

MixpanelExport.prototype.events = function(parameters) {
  return this.get('events', parameters);
};

MixpanelExport.prototype.topEvents = function(parameters) {
  return this.get(['events', 'top'], parameters);
};

MixpanelExport.prototype.eventNames = function(parameters) {
  return this.get(['events', 'names'], parameters);
};

MixpanelExport.prototype.eventProperties = function(parameters) {
  return this.get(['events', 'properties'], parameters);
};

MixpanelExport.prototype.topEventProperties = function(parameters) {
  return this.get(['events', 'properties', 'top'], parameters);
};

MixpanelExport.prototype.eventPropertyValues = function(parameters) {
  return this.get(['events', 'properties', 'values'], parameters);
};

MixpanelExport.prototype.funnels = function(parameters) {
  return this.get(['funnels'], parameters);
};

MixpanelExport.prototype.listFunnels = function(parameters) {
  return this.get(['funnels', 'list'], parameters);
};

MixpanelExport.prototype.segmentation = function(parameters) {
  return this.get(['segmentation'], parameters);
};

MixpanelExport.prototype.numericSegmentation = function(parameters) {
  return this.get(['segmentation', 'numeric'], parameters);
};

MixpanelExport.prototype.sumSegmentation = function(parameters) {
  return this.get(['segmentation', 'sum'], parameters);
};

MixpanelExport.prototype.averageSegmentation = function(parameters) {
  return this.get(['segmentation', 'average'], parameters);
};

MixpanelExport.prototype.retention = function(parameters) {
  return this.get(['retention'], parameters);
};

MixpanelExport.prototype.addiction = function(parameters) {
  return this.get(['retention', 'addiction'], parameters);
};

MixpanelExport.prototype.get = function(method, parameters) {
  var reqOpts = !!this.api_key ? {} : {username: this.api_secret};
  return needle.getAsync(this._buildRequestURL(method, parameters), reqOpts)
    .then((response) => {
      return this._parseResponse(method, parameters, response.body);
    });
};

// Parses Mixpanel's strange formatting for the export endpoint.
MixpanelExport.prototype._parseResponse = function(method, parameters, result) {
  if (parameters && parameters.format === 'csv') {
    return result;
  }

  if (typeof result === 'object') {
    return result;
  }

  if (method === 'export') {
    var step1 = result.replace(new RegExp('\n', 'g'), ',');
    var step2 = '['+step1+']';
    var result = step2.replace(',]', ']');
    return JSON.parse(result);
  }

  return JSON.parse(result);
};

MixpanelExport.prototype._buildRequestURL = function(method, parameters) {
  var apiStub = (method === 'export') ? 'https://data.mixpanel.com/api/2.0/' : 'https://mixpanel.com/api/2.0/';
  return '' + apiStub + ((typeof method.join === 'function' ? method.join('/') : void 0) || method) + '/?' + (this._requestParameterString(parameters));
};

MixpanelExport.prototype._requestParameterString = function(args) {
  var connection_params = Object.assign({}, args);
  if (!!this.api_key) {
    connection_params.api_key = this.api_key;
    connection_params.expire = this._expireAt();
  }
  var keys = Object.keys(connection_params).sort();

  // calculate sig only for deprecated key+secret auth
  var sig = '';
  if (!!this.api_key) {
    var sig_keys = keys.filter((key) => key !== 'callback');
    sig = '&sig=' + this._getSignature(sig_keys, connection_params);
  }

  return this._getParameterString(keys, connection_params) + sig;
};

MixpanelExport.prototype._getParameterString = function(keys, connection_params) {
  return keys.map((key) => {
    return '' + key + '=' + (this._urlEncode(connection_params[key]));
  }).join('&');
};

MixpanelExport.prototype._getSignature = function(keys, connection_params) {
  var sig = keys.map((key) => {
    return '' + key + '=' + (this._stringifyIfArray(connection_params[key]));
  }).join('') + this.api_secret;

  return crypto.createHash('md5').update(sig).digest('hex');
};

MixpanelExport.prototype._urlEncode = function(param) {
  return encodeURIComponent(this._stringifyIfArray(param));
};

MixpanelExport.prototype._stringifyIfArray = function(array) {
  if (!Array.isArray(array)) {
    return array;
  }

  return JSON.stringify(array);
};

MixpanelExport.prototype._expireAt = function() {
  return Math.round(new Date().getTime() / 1000) + this.timeout_after;
};

module.exports = MixpanelExport;
