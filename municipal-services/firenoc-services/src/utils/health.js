import logger from "../config/logger";
import db from "../db";

// Implement health checks [kubernetes]
//  - Check DB Connectivity
//  - Check Kafka Connectivity [TBD]

async function onHealthCheck() {
  // checks if the system is healthy, like the db connection is live
  // resolves, if health, rejects if not
  return db.query("SELECT 1");
}

// Delay shutdown for service cleanup via kubernetes
function beforeShutdown() {
  // given your readiness probes run every 5 second
  // may be worth using a bigger number so you won't
  // run into any race conditions
  return new Promise(resolve => {
    setTimeout(resolve, 5000);
  });
}

const options = {
  // healtcheck options
  healthChecks: {
    "/health": onHealthCheck // a promise returning function indicating service health
  },

  // cleanup options
  timeout: 5000, // [optional = 1000] number of milliseconds before forcefull exiting
  beforeShutdown, // [optional] called before the HTTP server starts its shutdown

  logger: logger.error // [optional] logger function to be called with errors
};

export default options;
