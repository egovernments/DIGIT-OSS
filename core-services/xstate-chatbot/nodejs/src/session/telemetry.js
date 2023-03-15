const config = require('../env-variables');
const producer = require('./kafka/kafka-producer');
const uuid = require('uuid');

class Telemetry {
    async log(userId, type, data) {
        let object = {
            id: uuid.v4(),
            date: new Date().getTime(),
            user: userId,
            type: type,
            data: data
        }

        // TODO: Put object on a kafka queue

        // console.log('Telemetry: ' + JSON.stringify(object));

        let payloads = [ {
            topic: config.kafka.chatbotTelemetryTopic,
            messages: JSON.stringify(object)
        } ]

        producer.send(payloads, function(err, data) {});
    }
};

module.exports = new Telemetry();