const kafka = require('kafka-node');
const config = require('../../env-variables');

const consumerGroupOptions = {
  kafkaHost: config.kafka.kafkaBootstrapServer,
  groupId: config.kafka.kafkaConsumerGroupId,
  autoCommit: true,
  protocol: ['roundrobin'],
  fromOffset: 'latest',
  outOfRangeOffset: 'earliest',
};

module.exports = consumerGroupOptions;
