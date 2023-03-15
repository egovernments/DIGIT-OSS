require("babel-core/register");
require("babel-polyfill");
import http from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
// import util from "util";
import middleware from "./middleware";
import api from "./api";
import config from "./config.json";
import tracer from "./middleware/tracer";
import terminusOptions from "./utils/health";
import envVariables from "./envVariables";
import "./kafka/consumer";
var swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");
const { createTerminus } = require("@godaddy/terminus");

let app = express();
app.server = http.createServer(app);

// Enable health checks and kubernetes shutdown hooks
createTerminus(app.server, terminusOptions);

// logger
app.use(morgan("dev"));

// 3rd party middleware
app.use(
  cors({
    exposedHeaders: config.corsHeaders
  })
);

app.use(
  bodyParser.json({
    limit: config.bodyLimit
  })
);

app.use(tracer());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// internal middleware
app.use(middleware({ config }));

// app.use(validator(opts));

// api router

app.use("/", api({ config }));

//error handler middleware
app.use((err, req, res, next) => {
  console.log(err);
  if (!err.errorType) {
    res.status(err.status).json(err.data);
  } else if (err.errorType == "custom") {
    res.status(400).json(err.errorReponse);
  } else {
    res.status(500);
    res.send("Oops, something went wrong.");
  }
});

console.log(envVariables.SERVER_PORT);

app.server.listen(envVariables.SERVER_PORT, () => {
  console.log(`Started on port ${app.server.address().port}`);
});

export default app;
