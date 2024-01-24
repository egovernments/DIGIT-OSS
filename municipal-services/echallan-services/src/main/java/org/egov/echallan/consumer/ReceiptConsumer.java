package org.egov.echallan.consumer;

import java.util.HashMap;

import org.egov.echallan.service.PaymentUpdateService;
import org.egov.echallan.util.ChallanConstants;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;



@Slf4j
@Component
public class ReceiptConsumer {

    private PaymentUpdateService paymentUpdateService;
    
    @Value("${state.level.tenant.id}")
	private String stateLevelTenantID;

    @Autowired
    public ReceiptConsumer(PaymentUpdateService paymentUpdateService) {
        this.paymentUpdateService = paymentUpdateService;
    }

    @KafkaListener(topicPattern = "${kafka.topics.receipt.topic.pattern}")
    public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
		try {
			
			// Adding in MDC so that tracer can add it in header
			MDC.put(ChallanConstants.TENANTID_MDC_STRING, stateLevelTenantID);
			paymentUpdateService.process(record);
		} catch (final Exception e) {
            log.error("Error while listening to value: " + record + " on topic: " + topic + ": ", e.getMessage());
        }
    }
}
