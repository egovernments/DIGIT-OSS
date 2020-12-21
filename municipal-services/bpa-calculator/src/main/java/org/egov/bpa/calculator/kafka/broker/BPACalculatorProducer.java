package org.egov.bpa.calculator.kafka.broker;

import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class BPACalculatorProducer {

	@Autowired
	private CustomKafkaTemplate kafkaTemplate;
	
	/**
	 * Listener method to push records to kafka queue.
	 * @param topic The kafka topic to push to
	 * @param value The object to be pushed
	 */
	public void push(String topic, Object value) {
		kafkaTemplate.send(topic, value);
	}

}
