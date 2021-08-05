"use strict";

const express = require("express");
var bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const { createProxyMiddleware } = require('http-proxy-middleware');

const port_number = process.env.PORT || 8000;
const HOST = "localhost";
const API_SERVICE_URL = "https://api.twitch.tv/helix";

const app = express();
//this will give you HTTP requests log in console
app.use(cors());
app.use(morgan("tiny"));

app.use(bodyParser());

//requests for statics files will go to into the public folder.
// app.use(express.static("public"));

app
  .use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Methods",
      "OPTIONS, HEAD, GET, PUT, POST, DELETE"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    // res.header("Access-Control-Allow-Origin", "https://kidcademy.netlify.app/");
    next();
  })
  .use(express.static("./server/assets"))
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"));

//endpoints ------------------------------------------------------
app.get("/info", (req, res) => {
  res
    .status(200)
    .send(
      "twitchinsider-proxyserver"
    );
});

// Authorization
app.use('', (req, res, next) => {
  if (req.headers.authorization) {
      next();
  } else {
      res.sendStatus(403);
  }
});

// Proxy endpoints
app.use('/proxyapi', createProxyMiddleware({
  target: API_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
      [`^/proxyapi`]: '',
  },
}));

// this is the catch all endpoint ---------------------------------



//listen on port 8000

app.listen(port_number, () => {
  console.log("listening on port 8000");
});
