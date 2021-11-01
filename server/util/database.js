const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
let _db;
const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb://admin:9FzZrhjv5U9cWFP@cluster0-shard-00-00.fcfh0.mongodb.net:27017,cluster0-shard-00-01.fcfh0.mongodb.net:27017,cluster0-shard-00-02.fcfh0.mongodb.net:27017/dispatch_db?ssl=true&replicaSet=atlas-hj3cly-shard-0&authSource=admin&retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("Connected!");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No Such Database!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
