package org.egov.pt.consumer;

import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.service.PaymentNotificationService;
import org.egov.pt.service.PaymentUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.util.HashMap;

@Component
public class ReceiptConsumerSaveTax {

	@Autowired
    private PaymentUpdateService paymentUpdateService;

	@Autowired
    private PaymentNotificationService paymentNotificationService;

	@Autowired
    private PropertyConfiguration config;

    @KafkaListener( topics = {"${kafka.topics.notification.pg.save.txns}"})
    public void listenPayments(final HashMap<String, Object> record,  @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
      paymentNotificationService.processTransaction(record, topic);
    }
}
