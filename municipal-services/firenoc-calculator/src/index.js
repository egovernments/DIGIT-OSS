import http from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import config from "./config.json";
import swaggerTools from "swagger-tools";
import bodyParser from "body-parser";
import api from "./controller";
const { Pool } = require("pg");
import tracer from "./middleware/tracer";
import envVariables from "./envVariables";

const pool = new Pool({
  user: envVariables.DB_USERNAME,
  host: envVariables.DB_HOST,
  database: envVariables.DB_NAME,
  password: envVariables.DB_PASSWORD,
  port: envVariables.DB_PORT,
  ssl: envVariables.DB_SSL
});

const options = {
  controllers: "./src/api",
  useStubs: true // Conditionally turn on stubs (mock mode)
};

let app = express();
app.server = http.createServer(app);
app.use(bodyParser.json());

// logger
app.use(morgan("dev"));

// 3rd party middleware
app.use(
  cors({
    exposedHeaders: config.corsHeaders
  })
);

app.use(tracer());

let swaggerDoc = require("./swagger.json");

swaggerTools.initializeMiddleware(swaggerDoc, middleware => {
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  // app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  // app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());
  let serverPort = envVariables.SERVER_PORT;
  app.server.listen(serverPort, () => {
    console.log("port is ", serverPort);
  });
});
app.use("/", api(pool));

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

export default app;
