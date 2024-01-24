package org.egov.tl.consumer;

import java.util.HashMap;

import org.egov.tl.service.PaymentUpdateService;
import org.egov.tl.service.notification.PaymentNotificationService;
import org.egov.tl.util.TLConstants;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class ReceiptConsumer {

    private PaymentUpdateService paymentUpdateService;

    private PaymentNotificationService paymentNotificationService;
    
    @Value("${state.level.tenant.id}")
	private String stateLevelTenantID;


    @Autowired
    public ReceiptConsumer(PaymentUpdateService paymentUpdateService, PaymentNotificationService paymentNotificationService) {
        this.paymentUpdateService = paymentUpdateService;
        this.paymentNotificationService = paymentNotificationService;
    }



    @KafkaListener(topicPattern = "${kafka.topics.receipt.topic.pattern}")
    public void listenPayments(final HashMap<String, Object> record) {
    	
    	// Adding in MDC so that tracer can add it in header
    	MDC.put(TLConstants.TENANTID_MDC_STRING, stateLevelTenantID);
    				
        paymentUpdateService.process(record);
        paymentNotificationService.process(record);
    }
}
