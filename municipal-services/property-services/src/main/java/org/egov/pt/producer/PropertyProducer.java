package org.egov.pt.producer;

import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.pt.models.Property;
import org.egov.pt.util.EncryptionDecryptionUtil;
import org.egov.pt.web.contracts.PropertyRequest;
import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PropertyProducer {

	@Autowired
	private CustomKafkaTemplate<String, Object> kafkaTemplate;

	@Autowired
	private EncryptionDecryptionUtil encryptionDecryptionUtil;
	
	@Autowired
	private MultiStateInstanceUtil centralInstanceUtil;
	
	public void push(String tenantId, String topic, Object value) {

		String updatedTopic = centralInstanceUtil.getStateSpecificTopicName(tenantId, topic);
		log.info("The Kafka topic for the tenantId : " + tenantId + " is : " + updatedTopic);
		kafkaTemplate.send(updatedTopic, value);
	}

	public void pushAfterEncrytpion(String topic, PropertyRequest request) {
		request.setProperty(encryptionDecryptionUtil.encryptObject(request.getProperty(), "Property", Property.class));
		push(request.getProperty().getTenantId(),topic, request);
	}
}
