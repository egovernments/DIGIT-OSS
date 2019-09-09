package org.egov.tracer.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.tracer.config.ObjectMapperFactory;
import org.egov.tracer.config.TracerProperties;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;

import java.util.concurrent.ExecutionException;

@Slf4j
@Component
public class LogAwareKafkaTemplate<K, V> {

    private static final String EMPTY_BODY = "<EMPTY BODY>";
    private static final String SEND_SUCCESS_MESSAGE =
        "Sending of message to topic: {}, partition: {} with key: {} succeeded.";
    private static final String BODY_JSON_SERIALIZATION_ERROR = "Serialization of body failed";
    private static final String SEND_SUCCESS_MESSAGE_WITH_BODY =
        "Sending of message to topic: {}, partition: {}, body: {} with key: {} succeeded.";
    private static final String SEND_FAILURE_MESSAGE_WITH_TOPIC =
        "Sending of message to topic: %s failed.";
    private static final String SEND_FAILURE_MESSAGE_WITH_TOPIC_KEY =
        "Sending of message to topic: %s, key: %s failed.";
    private static final String SEND_FAILURE_MESSAGE_WITH_TOPIC_KEY_PARTITION =
        "Sending of message to topic: %s, partition: %s, key: %s failed.";
    private TracerProperties tracerProperties;
    private KafkaTemplate<K, V> kafkaTemplate;
    private ObjectMapper objectMapper;

    public LogAwareKafkaTemplate(TracerProperties tracerProperties,
                                 KafkaTemplate<K, V> kafkaTemplate,
                                 ObjectMapperFactory objectMapperFactory) {
        this.tracerProperties = tracerProperties;
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapperFactory.getObjectMapper();
    }

    public SendResult<K, V> send(String topic, V value) {
        try {
            final SendResult<K, V> result = kafkaTemplate.send(topic, value).get();
            logSuccessMessage(value, result);
            return result;
        } catch (InterruptedException | ExecutionException e) {
            log.error(String.format(SEND_FAILURE_MESSAGE_WITH_TOPIC, topic), e);
            throw new RuntimeException(e);
        }
    }

    public SendResult<K, V> send(String topic, K key, V value) {
        try {
            final SendResult<K, V> result = kafkaTemplate.send(topic, key, value).get();
            logSuccessMessage(value, result);
            return result;
        } catch (InterruptedException | ExecutionException e) {
            log.error(String.format(SEND_FAILURE_MESSAGE_WITH_TOPIC_KEY, topic, key), e);
            throw new RuntimeException(e);
        }
    }

    public SendResult<K, V> send(String topic, K key, int partition, V value) {
        try {
            final SendResult<K, V> result = kafkaTemplate.send(topic, partition, key, value).get();
            logSuccessMessage(value, result);
            return result;
        } catch (InterruptedException | ExecutionException e) {
            log.error(String.format(SEND_FAILURE_MESSAGE_WITH_TOPIC_KEY_PARTITION, topic, key, partition), e);
            throw new RuntimeException(e);
        }
    }

    private void logSuccessMessage(V message, SendResult<K, V> result) {
        final String topic = result.getProducerRecord().topic();
        final Integer partition = result.getProducerRecord().partition();
        final String key = ObjectUtils.nullSafeToString(result.getProducerRecord().key());
        if (tracerProperties.isKafkaMessageLoggingEnabled()) {
			final String bodyAsJsonString = getMessageBodyAsJsonString(message);
			log.info(SEND_SUCCESS_MESSAGE_WITH_BODY, topic, partition, bodyAsJsonString, key);
		} else {
			log.info(SEND_SUCCESS_MESSAGE, topic, partition, key);
		}
    }

    private String getMessageBodyAsJsonString(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            log.error(BODY_JSON_SERIALIZATION_ERROR);
            return EMPTY_BODY;
        }
    }

}