var kafka = require("kafka-node");
import envVariables from "../envVariables";

const Producer = kafka.Producer;
let client;

if (process.env.NODE_ENV === "development") {
  client = new kafka.Client();
} else {
  client = new kafka.KafkaClient({
    kafkaHost: envVariables.KAFKA_BOOTSTRAP_SERVER
  });
}

const producer = new Producer(client);

producer.on("ready", function() {
});

producer.on("error", function(err) {
});

export default producer;
