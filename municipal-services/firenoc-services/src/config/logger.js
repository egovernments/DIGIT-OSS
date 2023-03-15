"use strict";

const { createLogger, format, transports } = require("winston");
import envVariables from "../envVariables";

const logger = createLogger({
  level: envVariables.LOG_LEVEL,
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSSZZ" }),
    format.json()
  ),
  transports: [new transports.Console()]
});

export default logger;
