const express = require("express");
const cors = require("cors");
const axios = require("axios");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");

//MongoCLient connection to database
const uri = "mongodb://localhost:27017/";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

client.connect(function(err) {
  if (err) return console.log(err);

  console.log("Connected to MongoDB.");
});
const obj = client.db("roadDatabase").collection("data"); //Creating a MongoDB object

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/speedlimit", function(req, res) {
  console.log();
  let id = req.query.postid;
  obj.find({ postid: id }, function(err, result) {
    if (err) return console.log(err);

    result.toArray(function(err, results) {
      if (err) return console.log(err);
      let finalData = results[0];
      axios
        .get("http://localhost:8080/weather?city=" + finalData.city)
        .then(function(response) {
          console.log(response.data);
          console.log(finalData.condition);
          console.log(finalData.zone);
          let date_ob = new Date();
          console.log(date_ob);
        })
        .catch(function(err) {
          if (err) return console.log(err);
        });
    });
  });
  res.send("Gita Chutiya Nahi Hy");
});

app.listen(9000, function(err) {
  if (err) return console.log(err);
  console.log("Algorithm Server started on Port 9000");
});
