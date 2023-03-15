const config = require('../../env-variables');
const kafka = require('kafka-node');

var consumerGroupOptions = {
    kafkaHost: config.kafka.kafkaBootstrapServer,
    groupId: config.kafka.kafkaConsumerGroupId,
    autoCommit: true,
    protocol: ["roundrobin"],
    fromOffset: "latest",
    outOfRangeOffset: "earliest"
};

module.exports = consumerGroupOptions;