package org.egov.swcalculation.consumer;

import java.util.HashMap;

import org.egov.swcalculation.service.PaymentNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class BillingNotificationConsumer {
	
	
	@Autowired
	PaymentNotificationService service;
	
	
	@KafkaListener(topics = { "${kafka.topics.billgen.topic}" })
	public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
		try {
			log.info("Consuming record: " + record);
			service.process(record, topic);
		} catch (final Exception e) {
			StringBuilder builder = new StringBuilder();
			builder.append("Error while listening to value: ").append(record).append(" on topic: ").append(topic).append(": ").append(e);
			log.error(builder.toString());
		}

	}

}
