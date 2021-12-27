const express = require("express");
const config = require("./config");
const { RecordRoute } = require("./routes");
const loaders = require("./loaders");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

config();
loaders();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "logs/network", "access.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/records", RecordRoute);
app.all("*", (req, res) => {
  res.status(404).json({
    code: 404,
    msg: "Not Found",
    error: "Invalid url",
  });
});

module.exports = app;
