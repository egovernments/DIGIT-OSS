package org.egov.bpa.consumer;

import java.util.HashMap;

import org.egov.bpa.service.PaymentUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import static org.egov.bpa.util.BPAConstants.TENANTID_MDC_STRING;

@Component
public class ReceiptConsumer {

	private PaymentUpdateService paymentUpdateService;

	@Autowired
	public ReceiptConsumer(PaymentUpdateService paymentUpdateService) {
		this.paymentUpdateService = paymentUpdateService;
	}

	@KafkaListener(topicPattern = "${kafka.topics.receipt.create.pattern}" )
	public void listenPayments(final HashMap<String, Object> record) {
		paymentUpdateService.process(record);
	}
}
