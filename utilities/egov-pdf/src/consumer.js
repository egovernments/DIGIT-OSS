var config = require("./config");
var kafka = require("kafka-node");
const logger = require("./logger").logger;
var {create_bulk_pdf} = require("./api");

const listenConsumer = async()=>{

  var options = {
    // connect directly to kafka broker (instantiates a KafkaClient)
    kafkaHost: config.KAFKA_BROKER_HOST,
    autoCommit: true,
    autoCommitIntervalMs: 5000,
    sessionTimeout: 15000,
    fetchMaxBytes: 10 * 1024 * 1024, // 10 MB
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

  var consumerGroup = new kafka.ConsumerGroup(options, [
    config.KAFKA_BULK_PDF_TOPIC,
  ]);

  consumerGroup.on("ready", function() {
    logger.info("Consumer is ready");
  });

  consumerGroup.on("message", function(message) {
    logger.info("record received on consumer for create");
    try {
      var data = JSON.parse(message.value);
      //console.log(JSON.stringify(data));
      create_bulk_pdf(data).then(() => {
          logger.info("record created for consumer request");
      }).catch(error => {
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

module.exports = { listenConsumer};