package org.egov.bpa.calculator.kafka.broker;

import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class BPACalculatorProducer {

	@Autowired
	private CustomKafkaTemplate<String, Object> kafkaTemplate;
	
	@Autowired
        private MultiStateInstanceUtil centralInstanceUtil;
	
	/**
	 * Listener method to push records to kafka queue.
	 * @param topic The kafka topic to push to
	 * @param value The object to be pushed
	 */
        public void push(String tenantId, String topic, Object value) {
            String updatedTopic = centralInstanceUtil.getStateSpecificTopicName(tenantId, topic);
            log.info("The Kafka topic for the tenantId : " + tenantId + " is : " + updatedTopic);
            kafkaTemplate.send(updatedTopic, value);
        }

}
