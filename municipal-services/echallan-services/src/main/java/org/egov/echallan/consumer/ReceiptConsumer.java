package org.egov.echallan.consumer;

import lombok.extern.slf4j.Slf4j;

import org.egov.echallan.service.PaymentUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import java.util.HashMap;



@Slf4j
@Component
public class ReceiptConsumer {

    private PaymentUpdateService paymentUpdateService;

    @Autowired
    public ReceiptConsumer(PaymentUpdateService paymentUpdateService) {
        this.paymentUpdateService = paymentUpdateService;
    }

    @KafkaListener(topics = {"${kafka.topics.receipt.create}"})
    public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        try {
        paymentUpdateService.process(record);
        } catch (final Exception e) {
            log.error("Error while listening to value: " + record + " on topic: " + topic + ": ", e.getMessage());
        }
    }
}
