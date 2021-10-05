package org.egov.collection.producer;


import org.egov.collection.config.ApplicationProperties;
import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CollectionProducer {

	@Autowired
    private CustomKafkaTemplate<String, Object> kafkaTemplate;

    @Autowired
    private ApplicationProperties configs;

    public void push(String tenantId, String topic, Object value) {

        String updatedTopic = topic;
        if (configs.getIsEnvironmentCentralInstance()) {

            String[] tenants = tenantId.split("\\.");
            if (tenants.length > 1)
                updatedTopic = tenants[1].concat("-").concat(topic);
        }
        log.info("The Kafka topic for the tenantId : " + tenantId + " is : " + updatedTopic);
        kafkaTemplate.send(topic, value);
        kafkaTemplate.send(updatedTopic, value);
    }


}