const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: "    YYYY-MM-DD HH:mm:ss.SSSZZ" }),
    format.simple()
  ),
  transports: [new transports.Console()]
});

//export default logger;
module.exports = { logger};
