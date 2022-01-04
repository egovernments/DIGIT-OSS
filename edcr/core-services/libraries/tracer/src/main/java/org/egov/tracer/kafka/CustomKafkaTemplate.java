package org.egov.tracer.kafka;

import lombok.extern.slf4j.Slf4j;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;


@Component("customKafkaTemplate")
@Slf4j
public class CustomKafkaTemplate<K, V> {

    private KafkaTemplate<K, V> kafkaTemplate;

    private static final String KAFKA_SEND_ERROR_CODE = "EVENT_BUS_FAILURE";
    private static final String KAFKA_SEND_ERROR_MSG = "Failed to push event onto the event bus";

    private static final String KAFKA_ERROR_LOG = "Failed to push data to kafka queue";

    @Autowired
    public CustomKafkaTemplate(KafkaTemplate<K, V> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public SendResult<K, V> send(String topic, V value) {
        try {
            final SendResult<K, V> result = kafkaTemplate.send(topic, value).get();
            return result;
        } catch (Exception e) {
            log.error(KAFKA_ERROR_LOG, e);
            throw new CustomException(KAFKA_SEND_ERROR_CODE, KAFKA_SEND_ERROR_MSG);
        }
    }

    public SendResult<K, V> send(String topic, K key, V value) {
        try {
            final SendResult<K, V> result = kafkaTemplate.send(topic, key, value).get();
            return result;
        } catch (Exception e) {
            log.error(KAFKA_ERROR_LOG, e);
            throw new CustomException(KAFKA_SEND_ERROR_CODE, KAFKA_SEND_ERROR_MSG);
        }
    }

    public SendResult<K, V> send(String topic, K key, int partition, V value) {
        try {
            final SendResult<K, V> result = kafkaTemplate.send(topic, partition, key, value).get();
            return result;
        } catch (Exception e) {
            log.error(KAFKA_ERROR_LOG, e);
            throw new CustomException(KAFKA_SEND_ERROR_CODE, KAFKA_SEND_ERROR_MSG);
        }
    }

}
