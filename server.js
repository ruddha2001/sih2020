const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const multer = require("multer");
const path = require("path");

const mysql = require("mysql");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "SuperUser@2020"
});

const upload = multer();

const app = express(); //Creating an Express App

//Using the middlewares for various functionalities
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());

// Serve only the static files form the dist directory
app.use(express.static(__dirname + "/dist/sih2020"));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/dist/sih2020/index.html"));
});

app.get("/loginstatus", function(req, res) {
  res.sendStatus(300);
});

app.get("/weather", function(req, res) {
  axios
    .get(
      "http://api.openweathermap.org/data/2.5/weather?APPID=02baf8d8f23b2aa7f426a50995e39b45&q=" +
        req.query.city +
        ",in"
    )
    .then(function(response) {
      res.send(response.data);
    })
    .catch(function(error) {
      return console.log(error);
    });
});

app.post("/front", function(req, res) {
  console.log(req.body);
  res.redirect("http://localhost:4200/graph");
});

app.get("/speedlimit", function(req, res) {
  let pid = req.query.pid;
  con.query(
    "SELECT * FROM `sys`.`speedLogs` WHERE `pid`= "+pid+" ORDER BY `row` DESC LIMIT 1",
    function(err, result, fields) {
      if (err) throw err;
      console.log(result[0].speedLimit);
      res.send(JSON.stringify(result[0].speedLimit));
    }
  );
});

let port = 8080;
app.listen(port, function(err) {
  if (err) return console.log(err);
  console.log(`Server started on Port ${port}`);
});
