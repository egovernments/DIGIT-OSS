const config = require('../../env-variables');

if(config.serviceProvider === 'eGov') {
    console.log("Using eGov Services");
    module.exports.billService = require('./egov-bill');
    module.exports.receiptService = require('./egov-receipts');
    if(config.pgrUseCase.pgrVersion == 'v2') {
        console.log('Using PGR v2');
        module.exports.pgrService = require('./egov-pgr');
    } else if(config.pgrUseCase.pgrVersion == 'v1') {
        console.log('Using PGR v1');
        module.exports.pgrService = require('./egov-pgr-v1');
    }
}
else {
    console.log("Using Dummy Services");
    module.exports.pgrService = require('./dummy-pgr');
    module.exports.billService = require('./dummy-bill');
    module.exports.receiptService = require('./dummy-receipts');
}

if(config.kafka.kafkaConsumerEnabled) {
    if(config.pgrUseCase.pgrVersion == 'v2') {
        module.exports.pgrStatusUpdateEvents = require('./pgr-status-update-events');
    } else if(config.pgrUseCase.pgrVersion == 'v1') {
        module.exports.pgrStatusUpdateEvents = require('./pgr-v1-status-update-events');
    }
    module.exports.paymentStatusUpdateEvents = require('./payment-status-update-event');
}
