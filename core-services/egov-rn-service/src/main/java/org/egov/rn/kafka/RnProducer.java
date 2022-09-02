package org.egov.rn.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.rn.exception.ProducerException;
import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class RnProducer {
    private CustomKafkaTemplate<String, Object> kafkaTemplate;

    private ObjectMapper objectMapper;

    @Autowired
    public RnProducer(CustomKafkaTemplate<String, Object> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }


    public void send(String topic, Object payload) {
        try {
            String json = objectMapper.writeValueAsString(payload);
            log.info(json);
            kafkaTemplate.send(topic, objectMapper.writeValueAsString(payload));
        } catch (Exception ex) {
            throw new ProducerException("Topic: " + topic + " " +
                    ex.getMessage(), ex);
        }
    }
}
