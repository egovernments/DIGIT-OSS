const { Pool } = require("pg");
import envVariables from "./envVariables";

// Use connection pool to limit max active DB connections
var ssl = envVariables.DB_SSL;
if(typeof ssl =="string")
  ssl = (ssl.toLowerCase() == "true");

const pool = new Pool({
  user: envVariables.DB_USER,
  host: envVariables.DB_HOST,
  database: envVariables.DB_NAME,
  password: envVariables.DB_PASSWORD,
  ssl: ssl,
  port: envVariables.DB_PORT,
  max: envVariables.DB_MAX_POOL_SIZE,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// Expose method, log query, initiate trace etc at single point later on.
module.exports = {
  query: (text, params) => pool.query(text, params)
};
