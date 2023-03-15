package org.egov.echallan.consumer;

import java.util.HashMap;

import org.egov.echallan.config.ChallanConfiguration;
import org.egov.echallan.repository.ChallanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class CancelReceiptConsumer {
	
	@Autowired
    private ChallanRepository challanRepository;

	@Autowired
	private ChallanConfiguration config;
	
	@KafkaListener(topics = {"${kafka.topics.receipt.cancel.name}"})
    public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
		try {
			if (config.getReceiptCancelTopic().equalsIgnoreCase(topic)) {
				log.info("received cancel receipt request--");
				challanRepository.updateChallanOnCancelReceipt(record);
			}
		} catch (final Exception e) {
			log.error("Error while listening to value: " + record + " on topic: " + topic + ": ", e.getMessage());
		}
    }
}
