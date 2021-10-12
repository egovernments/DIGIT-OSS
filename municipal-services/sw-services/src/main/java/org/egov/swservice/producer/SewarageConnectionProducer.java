package org.egov.swservice.producer;

import lombok.extern.slf4j.Slf4j;
import org.egov.swservice.config.SWConfiguration;
import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static org.egov.swservice.util.SWConstants.TOPICS_TO_AVOID;


@Service
@Slf4j
public class SewarageConnectionProducer {

	@Autowired
	private CustomKafkaTemplate<String, Object> kafkaTemplate;

	@Autowired
	private SWConfiguration configs;

	/*public void push(String topic, Object value) {
		kafkaTemplate.send(topic, value);
	}*/

	public void push(String tenantId, String topic, Object value) {

		String updatedTopic = topic;
		if (configs.getIsEnvironmentCentralInstance()) {

			String[] tenants = tenantId.split("\\.");
			if (tenants.length > 1)
				updatedTopic = tenants[1].concat("-").concat(topic);
		}
		log.info("The Kafka topic for the tenantId : " + tenantId + " is : " + updatedTopic);
		kafkaTemplate.send(updatedTopic, value);
	}

}
