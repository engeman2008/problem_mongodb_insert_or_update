import mongodb from "mongodb";
const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = (callback) => {
  MongoClient.connect("mongodb://localhost:27017/test")
    .then((client) => {
      console.log("connected");
      _db = client.db();
      callback();
    })
    .catch((error) => {
      console.log(error);
      throw error;
    });
};

export const getDb = () => {
  if (_db) {
    return _db;
  }
  //   throw "No Database Found";
};

export default mongoConnect;
