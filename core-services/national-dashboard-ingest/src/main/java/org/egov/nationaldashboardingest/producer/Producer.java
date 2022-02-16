package org.egov.nationaldashboardingest.producer;

import lombok.extern.slf4j.Slf4j;
import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class Producer {

    @Autowired
    private CustomKafkaTemplate<String, Object> kafkaTemplate;

    @Autowired
    private KafkaTemplate<String, Object> plainKafkaTemplate;

    public void push(String topic, Object value) {
        plainKafkaTemplate.send(topic, value);
    }
}
