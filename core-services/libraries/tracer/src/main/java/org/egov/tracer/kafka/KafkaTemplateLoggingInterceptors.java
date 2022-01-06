package org.egov.tracer.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerInterceptor;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.OffsetAndMetadata;
import org.apache.kafka.clients.producer.ProducerInterceptor;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.apache.kafka.common.TopicPartition;
import org.slf4j.MDC;
import org.springframework.util.ObjectUtils;

import java.util.Map;

import static java.util.Objects.isNull;
import static org.egov.tracer.constants.TracerConstants.*;
import static org.springframework.util.StringUtils.isEmpty;

@Slf4j
public class KafkaTemplateLoggingInterceptors<K,V> implements ConsumerInterceptor<K,V>, ProducerInterceptor<K,V> {

    private static final String EMPTY_BODY = "<EMPTY BODY>";
    private static final String SEND_SUCCESS_MESSAGE =
        "Sending message to topic: {}, partition: {} with key: {} .";
    private static final String BODY_JSON_SERIALIZATION_ERROR = "Serialization of body failed while attempting to log" +
        " the body";
    private static final String SEND_SUCCESS_MESSAGE_WITH_BODY =
        "Sending message to topic: {}, partition: {}, body: {} with key: {} .";
    private static final String SEND_FAILURE_MESSAGE = "Sending of message to topic: %s, partition %s failed.";

    private static final String RECEIVED_MESSAGE_WITH_BODY = "Received message from topic: {}, partition: {}, body: {} with key: {}";
    private static final String RECEIVED_MESSAGE = "Received message from topic: {}, partition: {}, with key: {}";

    private final ObjectMapper objectMapper = new ObjectMapper();

    public KafkaTemplateLoggingInterceptors() {
    }

    @Override
    public ConsumerRecords<K, V> onConsume(ConsumerRecords<K, V> consumerRecords) {
        for (ConsumerRecord<K, V> consumerRecord : consumerRecords) {
            final String keyAsString = ObjectUtils.nullSafeToString(consumerRecord.key());
            String correlationId = getCorrelationIdFromBody(consumerRecord.value());

            if(!isEmpty(correlationId))
                MDC.put(CORRELATION_ID_MDC, correlationId);

            if (log.isDebugEnabled()) {
                final String bodyAsJsonString = getMessageBodyAsJsonString(consumerRecord.value());
                log.debug(RECEIVED_MESSAGE_WITH_BODY, consumerRecord.topic(), consumerRecord.partition(), bodyAsJsonString,
                    keyAsString);
            } else {
                log.info(RECEIVED_MESSAGE, consumerRecord.topic(), consumerRecord.topic(), consumerRecord.key());
            }
        }
        return consumerRecords;
    }

    @Override
    public void onCommit(Map<TopicPartition, OffsetAndMetadata> map) {

    }

    @Override
    public ProducerRecord<K, V> onSend(ProducerRecord<K, V> producerRecord) {
        final String keyAsString = ObjectUtils.nullSafeToString(producerRecord.key());

        if (log.isDebugEnabled()) {
            final String bodyAsJsonString = getMessageBodyAsJsonString(producerRecord.value());
            log.debug(SEND_SUCCESS_MESSAGE_WITH_BODY, producerRecord.topic(), producerRecord.partition(), bodyAsJsonString,
                keyAsString);
        } else {
            log.info(SEND_SUCCESS_MESSAGE, producerRecord.topic(), producerRecord.partition(), keyAsString);
        }
        return producerRecord;
    }

    @Override
    public void onAcknowledgement(RecordMetadata recordMetadata, Exception e) {
        if (!isNull(e)) {
            final String message =
                String.format(SEND_FAILURE_MESSAGE, recordMetadata.topic(), recordMetadata.partition());
            log.error(message, e);
        }
    }

    @Override
    public void close() {

    }

    @Override
    public void configure(Map<String, ?> map) {

    }

    private String getMessageBodyAsJsonString(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            log.warn(BODY_JSON_SERIALIZATION_ERROR);
            return EMPTY_BODY;
        }
    }

    @SuppressWarnings("unchecked")
    private String getCorrelationIdFromBody(Object value) {
        String correlationId = null;
        try {
            Map<String, Object> requestMap = objectMapper.convertValue(value, Map.class);

            Object requestInfo = requestMap.containsKey(REQUEST_INFO_FIELD_NAME_IN_JAVA_CLASS_CASE) ? requestMap.get
                (REQUEST_INFO_FIELD_NAME_IN_JAVA_CLASS_CASE) : requestMap.get(REQUEST_INFO_IN_CAMEL_CASE);

            if (isNull(requestInfo))
                return null;
            else {
                if (requestInfo instanceof Map) {
                    correlationId = (String) ((Map) requestInfo).get(CORRELATION_ID_FIELD_NAME);
                }
            }
        } catch (Exception ignored){}

        return correlationId;
    }

}
