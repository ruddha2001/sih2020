const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");

const app = express(); //Creating an Express App

//Using the middlewares for various functionalities
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve only the static files form the dist directory
app.use(express.static(__dirname + "/dist/sih2020"));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/dist/sih2020/index.html"));
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

// app.get("/condition", function(req, res) {
//   if (req.query.roadName == "College Road") res.send("Good");
//   else res.send("Road Not Listed in Database");
// });

// app.get("/zone",function(req,res){
//   if (req.query.zone == "School") res.send("School");
//   else res.send == "Normal";
// })

let port = 8080;
app.listen(port, function(err) {
  if (err) return console.log(err);
  console.log(`Server started on Port ${port}`);
});
