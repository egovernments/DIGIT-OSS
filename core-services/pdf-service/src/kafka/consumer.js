const kafka = require("kafka-node");
import envVariables from "../EnvironmentVariables";
import logger from "../config/logger";
import { createNoSave } from "../index";


export const listenConsumer = async(topic)=>{
//let receiveJob = envVariables.KAFKA_RECEIVE_CREATE_JOB_TOPIC;
let receiveJob = topic;


var topicList = [];
for (var i in receiveJob) {
  topicList.push(receiveJob[i]);
}

var options = {
  // connect directly to kafka broker (instantiates a KafkaClient)
  kafkaHost: envVariables.KAFKA_BROKER_HOST,
  autoCommit: true,
  groupId: "bulk-pdf",
  // An array of partition assignment protocols ordered by preference. 'roundrobin' or 'range' string for
  // built ins (see below to pass in custom assignment protocol)
  protocol: ["roundrobin"],
  // Offsets to use for new groups other options could be 'earliest' or 'none'
  // (none will emit an error if no offsets were saved) equivalent to Java client's auto.offset.reset
  fromOffset: "latest",
  // how to recover from OutOfRangeOffset error (where save offset is past server retention)
  // accepts same value as fromOffset
  outOfRangeOffset: "earliest"
};

var consumerGroup = new kafka.ConsumerGroup(options, topicList);

consumerGroup.on("ready", function() {
  logger.info("Consumer is ready");
});

consumerGroup.on("message", function(message) {
  logger.info("record received on consumer for create");
  try {
    var data = JSON.parse(message.value);
    //console.log(JSON.stringify(data));
    createNoSave(
      data,
      null,
      () => {},
      () => {}
    )
      .then(() => {
        logger.info("record created for consumer request");
      })
      .catch(error => {
        logger.error(error.stack || error);
      });
  } catch (error) {
    logger.error("error in create request by consumer " + error.message);
    logger.error(error.stack || error);
  }
});

consumerGroup.on("error", function(err) {
  console.log("Error:", err);
});

consumerGroup.on("offsetOutOfRange", function(err) {
  console.log("offsetOutOfRange:", err);
});

}