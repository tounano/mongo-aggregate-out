var MongoClient = require('mongodb').MongoClient;
var mongoVersion = require('mongo-version');
var compareVersion = require('compare-version');
var _ = require('underscore');

module.exports = function aggregateOut(collection, array, options, cb) {
  // No options or No out arg: passthrough
  if (!cb || !options.out) return collection.aggregate(array, options, cb);

  isLegacy(collection.db, function (err, isLegacy) {
    if (err) return cb(err);

    if (!isLegacy)
      return collection.aggregate(array, options, cb);

    collection.db.collection(options.out,  function (err, out) {
      if (err) return cb(err);
      delete options.out;
      overrideCollection(out, function (err, out) {
        if (err) return cb(err);

        var cur = collection.aggregate(array, _.extend({}, options, {cursor:{batchSize:100}}));

        cur.on('data', function (d) {
          out.insert(d, function(err){
            if (err) cur.emit('error', err);
          });
        }).on('error', function (err) {
            cb(err);
          })
          .on('end', function () {
            cb(null,[]);
          })
      })
    })
  })
}

function overrideCollection(collection, cb) {
  var db = collection.db;
  var collectionName = collection.collectionName;
  collection.drop( function (err) {
    db.collection(collectionName, cb);
  })
}

function isLegacy(db, cb) {
  mongoVersion(db, function (err, ver) {
    if (err) return cb(err);
    cb(null,compareVersion('2.6.0', ver)>0);
  })
}