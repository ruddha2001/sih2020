const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/testapi", function(req, res) {
  res.send("Hello World");
});

let port = 8080 || process.env.port;

app.listen(port, function(err) {
  console.log(`App listening on port ${port}`);
});
