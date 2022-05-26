var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var config = require("./config");
var epassRouter = require("./routes/epass");
var tlRouter = require("./routes/tl");
var ptRouter = require("./routes/pt");
var paymentRouter = require("./routes/payments");
var mcollectRouter = require("./routes/mcollect");
var billRouter = require("./routes/bills");
var wnsRouter = require("./routes/wns");
var {listenConsumer} = require("./consumer")
var birthDeath =require("./routes/birth-death");

var app = express();
app.disable('x-powered-by');

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(config.app.contextPath + "/download/epass", epassRouter);
app.use(config.app.contextPath + "/download/TL", tlRouter);
app.use(config.app.contextPath + "/download/PT", ptRouter);
app.use(config.app.contextPath + "/download/UC", mcollectRouter);
app.use(config.app.contextPath + "/download/PAYMENT", paymentRouter);
app.use(config.app.contextPath + "/download/BILL", billRouter);
app.use(config.app.contextPath + "/download/WNS", wnsRouter);
app.use(config.app.contextPath + "/download/BIRTHDEATH", birthDeath);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
listenConsumer();
module.exports = app;
