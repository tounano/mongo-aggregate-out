# mongo-aggregate-out

Save aggregation results in a collection for Mongo < 2.6.

Starting from MongoDB 2.6 a new feature has been added to the aggregation framework. This feature is to store results of
an aggregation pipeline to a new collection.

This module adds a legacy support for this feature.

If your MongoDB version is 2.6 or newer, the module would behave as passthrough and will use the native feature.

## Usage

```js
var aggregateOut = require('mongo-aggregate-out');

aggregateOut(collection, pipelineArray, {out: "newCollection"}, function (err) {
  var cur = db.collection('newCollection').find();
});
```

## install

With [npm](https://npmjs.org) do:

```
npm install mongo-aggregate-out
```

## license

MIT