package org.egov.wf.producer;

import lombok.extern.slf4j.Slf4j;
import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.egov.wf.config.WorkflowConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class Producer {

    @Autowired
    private WorkflowConfig config;

    @Autowired
    private CustomKafkaTemplate<String, Object> kafkaTemplate;

    public void push(String tenantId, String topic, Object value) {

        String updatedTopic = topic;
        if (config.getIsEnvironmentCentralInstance()) {

            String[] tenants = tenantId.split("\\.");
            if (tenants.length > 1)
                updatedTopic = tenants[1].concat("-").concat(topic);
        }
        log.info("The Kafka topic for the tenantId : " + tenantId + " is : " + updatedTopic);
        kafkaTemplate.send(updatedTopic, value);
    }
}
