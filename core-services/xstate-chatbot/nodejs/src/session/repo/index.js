const config = require('../../env-variables');
const postgresRepo = require('./postgres-repo');
const inMemoryRepo = require('./in-memory-repo');

if(config.repoProvider === 'InMemory') {
    module.exports = inMemoryRepo;
}
else {
    module.exports = postgresRepo;
}
