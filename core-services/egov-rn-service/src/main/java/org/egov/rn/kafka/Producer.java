package org.egov.rn.kafka;

import org.egov.rn.exception.ProducerException;
import org.egov.rn.web.utils.ExceptionUtils;
import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class Producer {
    private CustomKafkaTemplate<String, Object> kafkaTemplate;

    @Autowired
    public Producer(CustomKafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }


    public void send(String topic, Object payload) {
        try {
            kafkaTemplate.send(topic, payload);
        } catch (Exception ex) {
            throw new ProducerException(ExceptionUtils.getErrorMessage("Topic: " + topic + " " +
                    ex.getMessage()), ex);
        }
    }
}
