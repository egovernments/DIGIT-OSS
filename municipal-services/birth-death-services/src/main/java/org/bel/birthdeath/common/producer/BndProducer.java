package org.bel.birthdeath.common.producer;

import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BndProducer {

	@Autowired
	private CustomKafkaTemplate<String, Object> kafkaTemplate;

	public void push(String topic, Object value) {
            kafkaTemplate.send(topic, value);
	}
}
