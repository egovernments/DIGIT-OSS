var config = require("./config");
var kafka = require("kafka-node");
const logger = require("./logger").logger;


const Producer = kafka.Producer;
let client;
// if (process.env.NODE_ENV === "development") {
// client = new kafka.Client();
client = new kafka.KafkaClient({ kafkaHost: config.KAFKA_BROKER_HOST, connectRetryOptions: {retries: 1} });
//   console.log("local - ");
// } else {
//   client = new kafka.KafkaClient({ kafkaHost: envVariables.KAFKA_BROKER_HOST });
//   console.log("cloud - ");
// }

const producer = new Producer(client,{partitionerType:2});

producer.on("ready", function() {
  logger.info("Producer is ready");
});

producer.on("error", function(err) {
  logger.error("Producer is in error state");
  logger.error(err.stack || err);
});

//export default producer;
module.exports = { producer};
