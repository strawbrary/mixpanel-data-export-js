Mixpanel Data Export
==============================
[![NPM version][npm-img]][npm-url]
[![Build status][travis-img]][travis-url]
[![Dependency status][david-img]][david-url]

This is a fork of [michaelcarter/mixpanel-data-export-js](https://github.com/michaelcarter/mixpanel-data-export-js) which has been optimized for Node.js (no browser support). It has just 2 dependencies: [bluebird](https://www.npmjs.com/package/bluebird) and [needle](https://www.npmjs.com/package/needle).

Simply put, this is a JavaScript library that makes [Mixpanel's data export API](https://mixpanel.com/docs/api-documentation/data-export-api#libs-js) easy to use. Simply instantiate the class with your API secret and key and then make calls to api methods and get correctly formatted data back via a promise.

## Installation
```
npm install --save mixpanel-data-export-node
```

## Usage Instructions

Every method detailed on [Mixpanel's data export api page](https://mixpanel.com/docs/api-documentation/data-export-api#libs-js) is available in the library. However, some of the namings have been adjusted to read more semantically, for example, `topEventProperties` , and `eventPropertyValues`. The full list of methods is as follows...

**Annotations:**
 - `annotations(parameters)`
 - `createAnnotation(parameters)`
 - `updateAnnotation(parameters)`

**Export:**
 - `export(parameters)`
 - `exportStream(parameters)`

**Events:**
 - `events(parameters)`
 - `topEvents(parameters)`
 - `eventNames(parameters)`

**Event Properties:**
 - `eventProperties(parameters)`
 - `topEventProperties(parameters)`
 - `eventPropertyValues(parameters)`

**Funnels:**
 - `funnels(parameters)`
 - `listFunnels(parameters)`

**Segmentation:**
 - `segmentation(parameters)`
 - `numericSegmentation(parameters)`
 - `sumSegmentation(parameters)`
 - `averageSegmentation(parameters)`

**Retention:**
 - `retention(parameters)`
 - `addiction(parameters)`

**People Analytics:**
 - `engage(parameters)`

An example usage might be:

```javascript
var MixpanelExport = require('mixpanel-data-export-node');

var panel = new MixpanelExport({
  api_key: "my_api_key",
  api_secret: "my_api_secret"
});

panel.retention({
  from_date: "2014-02-28",
  to_date: "2014-03-10",
  born_event: "Rendering items"
}).then(function(data) {
  console.log(data);
});
```

A full list of available API methods is detailed on [Mixpanel's data export api page](https://mixpanel.com/docs/api-documentation/data-export-api#libs-js). If you find any that are missing please let me know, or better yet put in a pull request.

## Undocumented Endpoints
For any other requests (e.g. undocumented API endpoints), you can make raw requests to the API using `get`. The library will still handle all of param ordering and md5 signature stuff that the API requires, so you'll just need to supply a request type & parameters:

 - `panel.get(requestType, parameters)` 

 `requestType` expects an array forming a path to the endpoint. Taking the "top events" endpoint as an example - it's available at `http://mixpanel.com/api/2.0/events/top/`, so to request it you'd call `panel.get(['events', 'top'], parameters)`.

## Streaming Exports

Due to the large size of an export response, it's often appropriate to stream the data instead of waiting for it all:

```javascript
// Create a stream object
var exportStream = panel.exportStream({
    from_date: "2015-03-01",
    to_date: "2015-03-02"
});

// Listen on stream data
exportStream.on('readable', () => {
  var data;
  while (data = this.read()) {
    // handle data
  }
});

// Listen for the end of the stream
exportStream.on('end', () => {
  // move on to do other stuff
});
```

[npm-img]: https://img.shields.io/npm/v/mixpanel-data-export-node.svg?style=flat-square
[npm-url]: https://npmjs.org/package/mixpanel-data-export-node
[travis-img]: https://img.shields.io/travis/strawbrary/mixpanel-data-export-js/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/strawbrary/mixpanel-data-export-js
[david-img]: https://img.shields.io/david/strawbrary/mixpanel-data-export-js.svg?style=flat-square
[david-url]: https://david-dm.org/strawbrary/mixpanel-data-export-js
