const kafka = require("kafka-node");
import envVariables from "../EnvironmentVariables";
import logger from "../config/logger";
import { createAndSave } from "../index";

let receiveJob = envVariables.KAFKA_RECEIVE_CREATE_JOB_TOPIC;
const Consumer = kafka.Consumer;
let client = new kafka.KafkaClient({
  kafkaHost: envVariables.KAFKA_BROKER_HOST
});

const consumer = new Consumer(client, [{ topic: receiveJob }], {
  autoCommit: false
});

consumer.on("ready", function() {
  logger.info("consumer is ready");
});

consumer.on("message", function(message) {
  logger.info("record received on consumer for create");
  try {
    createAndSave(
      JSON.parse(message.value),
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

consumer.on("error", function(err) {
  logger.error("error in consumer " + err.message);
  logger.error(err.stack || err);
});

consumer.on("offsetOutOfRange", function(err) {
  logger.error("offsetOutOfRange");
  logger.error(err.stack || err);
});
