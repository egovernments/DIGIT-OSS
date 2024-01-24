package org.egov.swservice.producer;

import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;


@Service
@Slf4j
public class SewarageConnectionProducer {

	@Autowired
	private CustomKafkaTemplate<String, Object> kafkaTemplate;

	@Autowired
	private MultiStateInstanceUtil centralInstanceUtil;

	/*public void push(String topic, Object value) {
		kafkaTemplate.send(topic, value);
	}*/

	public void push(String tenantId, String topic, Object value) {
		String updatedTopic = centralInstanceUtil.getStateSpecificTopicName(tenantId, topic);
		log.info("The Kafka topic for the tenantId : " + tenantId + " is : " + updatedTopic);
		kafkaTemplate.send(updatedTopic, value);
	}

}
