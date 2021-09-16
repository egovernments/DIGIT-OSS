package org.egov.pt.calculator.producer;

import lombok.extern.slf4j.Slf4j;
import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class Producer {

	@Autowired
	private CustomKafkaTemplate<String, Object> kafkaTemplate;

	@Value("${is.environment.central.instance}")
	private Boolean isEnvironmentCentralInstance;

	public void push(String tenantId,String topic, Object value) {


		String updatedTopic = topic;
		if (isEnvironmentCentralInstance) {

			String[] tenants = tenantId.split("\\.");
			if (tenants.length > 1)
				updatedTopic = tenants[1].concat("-").concat(topic);
		}

		kafkaTemplate.send(updatedTopic, value);
	}

}
