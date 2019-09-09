const kafka = require("kafka-node");
const Consumer = kafka.Consumer;
let client;

if (process.env.NODE_ENV === "development") {
  client= new kafka.Client();
}
else {
  client = new kafka.KafkaClient({ kafkaHost: "kafka-0.kafka.backbone:9092" });
}


const consumer = new Consumer(client, [{ topic: "SMS", offset: 0 }], {
  autoCommit: false
});

consumer.on("message", function(message) {
  console.log(message.value);
});

consumer.on("error", function(err) {
  console.log("Error:", err);
});

consumer.on("offsetOutOfRange", function(err) {
  console.log("offsetOutOfRange:", err);
});
