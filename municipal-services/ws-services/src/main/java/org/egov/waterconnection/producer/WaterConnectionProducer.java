package org.egov.waterconnection.producer;

import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.egov.waterconnection.config.WSConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import static org.egov.waterconnection.constants.WCConstants.TOPICS_TO_AVOID;

@Service
@Slf4j
public class WaterConnectionProducer {

	@Autowired
	private CustomKafkaTemplate<String, Object> kafkaTemplate;

	@Autowired
	private WSConfiguration configs;

	/*public void push(String topic, Object value) {
		kafkaTemplate.send(topic, value);
	}*/

	public void push(String tenantId, String topic, Object value) {

		String updatedTopic = topic;
		if (configs.getIsEnvironmentCentralInstance() && !TOPICS_TO_AVOID.contains(topic)) {

			String[] tenants = tenantId.split("\\.");
			if (tenants.length > 1)
				updatedTopic = tenants[1].concat("-").concat(topic);
		}
		log.info("The Kafka topic for the tenantId : " + tenantId + " is : " + updatedTopic);
		kafkaTemplate.send(updatedTopic, value);
	}
}