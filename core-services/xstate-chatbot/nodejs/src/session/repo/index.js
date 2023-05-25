const config = require('../../env-variables');
const postgresRepo = require('./postgres-repo');
const inMemoryRepo = require('./in-memory-repo');

console.log(`Found repoProvider <${config.repoProvider}>`);
if(config.repoProvider === 'InMemory') {
    console.log("Using In-memory Repo (default)");
    module.exports = inMemoryRepo;
}
else {
    console.log("Using PostgreSQL Repo");
    module.exports = postgresRepo;
}
