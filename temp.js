const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb://localhost:27017/";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

client.connect(function(err) {
  if (err) return console.log(err);

  console.log("Connected to MongoDB Atlas.");
});

const obj = client.db("roadDatabase").collection("data");
  obj.find({ postid: 101 }, function(err, result) {
    if (err) return console.log(err);

    result.toArray(function(err, results) {
      console.log(JSON.stringify(results[0]));
    });
  });