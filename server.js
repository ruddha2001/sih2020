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

let port = 8080;
app.listen(port, function(err) {
  if (err) return console.log(err);
  console.log(`Server started on Port ${port}`);
});
