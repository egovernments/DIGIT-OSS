import logger from "../config/logger";
const uuidv4 = require("uuid/v4");
import envVariables from "../envVariables";

const CORRELATION_ID_HEADER = "x-correlation-id";
const CORRELATION_ID_BODY = "correlationId";

const getCorrelationIdFromRequest = req => {
  let correlationId = req.get(CORRELATION_ID_HEADER);

  if (typeof correlationId === "undefined") {
    if (req.body.RequestInfo && req.body.RequestInfo[CORRELATION_ID_BODY]) {
      correlationId = req.body.RequestInfo[CORRELATION_ID_BODY];
    }
  }

  if (typeof correlationId === "undefined") {
    correlationId = uuidv4();
    if (req.body.RequestInfo && req.body.RequestInfo[CORRELATION_ID_BODY]) {
      req.body.RequestInfo[CORRELATION_ID_BODY] = correlationId;
    }
  }

  return correlationId;
};

module.exports = function(options) {
  return function(req, res, next) {
    let obj = {};
    obj["CORRELATION-ID"] = getCorrelationIdFromRequest(req);

    logger.info(`Received request URI: ${req.originalUrl}`, obj);

    if (
      envVariables.TRACER_ENABLE_REQUEST_LOGGING &&
      req.method === "POST" &&
      req.is("application/json")
        ? true
        : false
    ) {
      logger.info(`Request body - ${JSON.stringify(req.body)}`, obj);
      logger.info(`Request body - ${JSON.stringify(req.query)}`, obj);
    }

    res.on("finish", function() {
      logger.info(`Response code sent: ${this.statusCode}`, obj);
    });

    next();
  };
};
