package org.egov.fsm.consumer;

import java.util.HashMap;

import org.egov.fsm.service.PaymentUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class ReceiptConsumer {

	private PaymentUpdateService paymentUpdateService;

	@Autowired
	public ReceiptConsumer(PaymentUpdateService paymentUpdateService) {
		this.paymentUpdateService = paymentUpdateService;
	}

	@KafkaListener(topics = { "${kafka.topics.receipt.create}" })
	public void listenPayments(final HashMap<String, Object> record) {
		log.info("Reached the method for updating the status from payment pending to Assign DSO::@@@");
		paymentUpdateService.process(record);
	}
}
