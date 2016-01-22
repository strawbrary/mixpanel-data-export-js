Mixpanel Data Export (v 1.8.2)
==============================
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
var MixpanelExport = require('mixpanel-data-export');

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
