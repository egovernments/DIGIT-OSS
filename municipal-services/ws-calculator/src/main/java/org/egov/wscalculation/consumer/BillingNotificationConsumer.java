package org.egov.wscalculation.consumer;

import java.util.HashMap;

import org.egov.wscalculation.service.PaymentNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class BillingNotificationConsumer {

	@Autowired
	PaymentNotificationService paymentService;

	/**
	 * 
	 * @param record bill Object
	 * @param topic Topic Name
	 */
	@KafkaListener(topics = { "${kafka.topics.billgen.topic}" })
	public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
			log.info("Consuming record: " + record);
			paymentService.process(record, topic);
	}
}
