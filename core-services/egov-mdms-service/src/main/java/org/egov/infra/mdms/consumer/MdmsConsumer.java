package org.egov.infra.mdms.consumer;

import java.util.Map;

import org.egov.MDMSApplicationRunnerImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class MdmsConsumer {
	
	@Autowired
	private MDMSApplicationRunnerImpl applicationRunnerImpl;

	@KafkaListener(topics = {"${egov.kafka.topics.reload}"})
	public void processMessage(Map<String, Object> consumerRecord, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
		log.info("MdmsConsumer key:" + topic + ":" + "value:" + consumerRecord);
		applicationRunnerImpl.prepareTenantMap(consumerRecord);
	}

}
