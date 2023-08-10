package org.egov.waterconnection.consumer;

import java.util.HashMap;

import org.egov.waterconnection.service.PaymentUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class ReceiptConsumer {
	@Autowired
	private PaymentUpdateService paymentUpdateService;

    @KafkaListener(topicPattern = "${kafka.topics.receipt.topic.pattern}")
    public void listenPayments(final HashMap<String, Object> record) {
        paymentUpdateService.process(record);
    }
}
