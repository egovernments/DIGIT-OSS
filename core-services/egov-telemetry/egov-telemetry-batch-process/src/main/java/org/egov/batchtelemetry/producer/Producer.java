package org.egov.batchtelemetry.producer;

import com.fasterxml.jackson.databind.JsonNode;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.egov.batchtelemetry.config.AppProperties;

import java.util.Properties;

public class Producer {

    private KafkaProducer kafkaProducer;

    private AppProperties appProperties;

    public Producer() {
        appProperties = new AppProperties();

        Properties configProperties = new Properties();
        configProperties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG,appProperties.getKafkaBootstrapServer());

        configProperties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,"org.apache.kafka.common.serialization.StringSerializer");
        configProperties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,"org.apache.kafka.connect.json.JsonSerializer");

        kafkaProducer = new KafkaProducer(configProperties);
    }

    public void push(String topic, String key, Long timestamp, JsonNode jsonNode) {
        ProducerRecord<String, JsonNode> record = new ProducerRecord<>(topic, null, timestamp, key, jsonNode);
        kafkaProducer.send(record);
    }

    public void close() {
        kafkaProducer.flush();
        kafkaProducer.close();
    }

}
