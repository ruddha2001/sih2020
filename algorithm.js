const express = require("express");
const cors = require("cors");
const axios = require("axios");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "SuperUser@2020"
});

const apiLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 1
});

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
app.use(bodyParser.urlencoded({ extended: true }));

//Trust proxies - Express Rate Limit
app.set("trust proxy", 1);
//Express Rate Limit
app.use("/speedlimit", apiLimiter);

app.post("/opencvtest", function(req, res) {
  console.log(req.body);
  res.send("Accepted");
});

app.post("/opencv", function(req, res) {
  let id = req.query.postid;
  let td = req.query.td;
  let pd = req.query.pd;
  con.query(
    "INSERT INTO `sys`.`rawLogs`(`row`,`trafficDensity`,`pedDensity`,`pid`) VALUES(NULL,?,?,?)",
    [td, pd, id],
    function(err, result, fields) {
      if (err) throw err;
      console.log("MySQL Rows Affected rawLogs = " + result.affectedRows);
    }
  );

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

          let finalSpeed;
          let baseSpeed = 20;
          let factor = 5;

          if (finalData.zone == "School") factor = factor - 0.5;

          finalSpeed = baseSpeed * factor;
          console.log(finalSpeed);
          con.query(
            "INSERT INTO `sys`.`speedLogs`(`row`,`speedLimit`,`pid`,`timeStamp`) VALUES(NULL,?,?,CURRENT_TIMESTAMP())",
            [finalSpeed, id],
            function(err, result, fields) {
              if (err) throw err;
              console.log(
                "MySQL Rows Affected speedLogs = " + result.affectedRows
              );
            }
          );
        })
        .catch(function(err) {
          if (err) console.log(err);
        });
    });
  });
  res.send("Accepted");
});

app.listen(9000, function(err) {
  if (err) return console.log(err);
  console.log("Algorithm Server started on Port 9000");
});
