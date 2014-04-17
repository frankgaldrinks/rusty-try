var MongoClient = require('mongodb').MongoClient;

module.exports = function () {
  MongoClient.connect('mongodb://localhost:27017/socketui', function(err, db) {
    "use strict";
    if(err) throw err;

    return db;
  });
};

