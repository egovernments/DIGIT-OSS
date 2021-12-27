const kafka = require('kafka-node');
const config = require('../../env-variables');

const { HighLevelProducer } = kafka;

const client = new kafka.KafkaClient({ kafkaHost: config.kafka.kafkaBootstrapServer });
const producer = new HighLevelProducer(client);

producer.on('error', (err) => { console.log('Failed to put record on kafka'); });

module.exports = producer;
