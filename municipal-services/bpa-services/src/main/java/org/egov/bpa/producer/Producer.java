package org.egov.bpa.producer;

import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class Producer {

	@Autowired
	private CustomKafkaTemplate<String, Object> kafkaTemplate;

	@Autowired
	private MultiStateInstanceUtil centralInstanceUtil;

	public void push(String tenantId, String topic, Object value) {
		String updatedTopic = centralInstanceUtil.getStateSpecificTopicName(tenantId, topic);
		kafkaTemplate.send(updatedTopic, value);
	}
}
