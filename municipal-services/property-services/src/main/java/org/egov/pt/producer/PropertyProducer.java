
package org.egov.pt.producer;

import org.egov.pt.models.Property;
import org.egov.pt.util.EncryptionDecryptionUtil;
import org.egov.pt.util.PTConstants;
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
	
	public void push(String topic, Object value) {
		kafkaTemplate.send(topic, value);
	}

	public void pushAfterEncrytpion(String topic, PropertyRequest request) {
		request.setProperty(encryptionDecryptionUtil.encryptObject(request.getProperty(), PTConstants.PROPERTY_MODEL, Property.class));
		push(topic, request);
	}
}
