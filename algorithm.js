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

//Using middlewares for functionalities
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Trust proxies - Express Rate Limit
app.set("trust proxy", 1);
//Express Rate Limit
app.use("/speedlimit", apiLimiter);

//Post request from YOLOv3
app.post("/opencv", function(req, res) {
  let id = req.body.postid;
  let count = req.body.count;
  con.query(
    "INSERT INTO `sys`.`rawLogs`(`row`,`density`,`pid`) VALUES(NULL,?,?)",
    [count, id],
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
          let finalSpeed;
          let baseSpeed = 20;
          let factor = 5;

          //Algorithmic Calculations
          if (finalData.condition == "Expressway") {
            finalSpeed = 120;
          } else if (finalData.condition == "Highway") {
            finalSpeed = 100;
          } else {
            finalSpeed = 80;
          }

          if (finalData.zone == "School" || finalData.zone == "Hospital") {
            factor = factor - 0.75;
          }

          if (
            response.data["weather"][0].main == "Mist" ||
            response.data["weather"][0].main == "Rain"
          ) {
            factor = factor - 1;
          } else if (response.data["weather"][0].main == "Snow") {
            factor = factor - 1.25;
          }

          if (response.data["visibility"] <= 1000) {
            factor = factor - 2;
          } else if (
            response.data["visibility"] >= 1001 &&
            response.data["visibility"] <= 3000
          ) {
            factor = factor - 1;
          }

          if (count <= 5) {
            factor = factor + 0.5;
          } else if (count >= 6 && count <= 10) {
            factor = factor - 1;
          } else {
            factor = factor - 1.5;
          }

          if (finalSpeed > baseSpeed * factor) {
            finalSpeed = baseSpeed * factor;
          }

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

//POST request from Welcome page of the dashboard
app.post("/front", function(req, res) {
  obj.find({ postid: req.body.pid }, function(err, result) {
    if (err) return console.log(err);

    result.toArray(function(err, results) {
      if (err) return console.log(err);
      let finalData = results[0];
      axios
        .get("http://localhost:8080/weather?city=" + finalData.city)
        .then(function(response) {
          res.redirect("http://localhost:4200/graph?pid="+req.body.pid+"&weather="+response.data["weather"][0].main+"&roadCondition="+finalData.condition+"&visibility="+response.data["visibility"]);
        });
    });
  });
  console.log(req.body);
});


//Listening on Port 9000
app.listen(9000, function(err) {
  if (err) return console.log(err);
  console.log("Algorithm Server started on Port 9000");
});
