const { Pool } = require('pg');
const config = require('../../env-variables');

const pool = new Pool({
    user: config.postgresConfig.dbUsername,
    password: config.postgresConfig.dbPassword,
    host: config.postgresConfig.dbHost,
    database: config.postgresConfig.dbName,
    port: config.postgresConfig.dbPort
});

pool.on('error', (err, client) => {
    console.error('Error:', err);
});

module.exports = pool;