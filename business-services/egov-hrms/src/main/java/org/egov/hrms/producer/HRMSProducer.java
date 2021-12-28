package org.egov.hrms.producer;

import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class HRMSProducer {
	
	@Autowired
	private MultiStateInstanceUtil centralInstanceUtil;

    @Autowired
    private CustomKafkaTemplate<String, Object> kafkaTemplate;

    public void push(String tenantId, String topic, Object value) {
    	
		String updatedTopic = centralInstanceUtil.getStateSpecificTopicName(tenantId, topic);
		log.info("The Kafka topic for the tenantId : " + tenantId + " is : " + updatedTopic);
        kafkaTemplate.send(updatedTopic, value);
    }
}
