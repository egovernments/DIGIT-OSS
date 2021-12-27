const uuid = require('uuid');
const config = require('../env-variables');
const producer = require('./kafka/kafka-producer');

class Telemetry {
  async log(userId, type, data) {
    const object = {
      id: uuid.v4(),
      date: new Date().getTime(),
      user: userId,
      type,
      data,
    };

    const payloads = [{
      topic: config.kafka.chatbotTelemetryTopic,
      messages: JSON.stringify(object),
    }];

    producer.send(payloads, (err, data) => {});
  }
}

module.exports = new Telemetry();
