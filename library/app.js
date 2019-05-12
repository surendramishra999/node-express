const express = require("express");
const chalk = require("chalk");
const debug = require("debug")("app");
const morgan = require("morgan");
const path = require("path");
logger = require("./logger");
var app = express();

const PORT = 3000;

app.use(
  morgan("dev", {
    skip: function(req, res) {
      return res.statusCode < 400;
    },
    stream: process.stderr
  })
);

app.use(
  morgan("dev", {
    skip: function(req, res) {
      return res.statusCode >= 400;
    },
    stream: process.stdout
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/jquery/dist/"))
);
app.get("/", function(req, res) {
  logger.debug(chalk.yellow("Debug statement"));
  logger.info(chalk.blue("Info statement"));
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.use(function(req, res, next) {
  logger.error(chalk.red("404 page requested"));
  res.status(404).send("This page does not exist!");
});

app.listen(PORT, function() {
  logger.info(chalk.green("Example app listening on port " + PORT));
});
