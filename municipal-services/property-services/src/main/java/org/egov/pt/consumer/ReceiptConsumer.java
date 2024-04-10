package org.egov.pt.consumer;

import java.util.HashMap;

import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.service.PaymentNotificationService;
import org.egov.pt.service.PaymentUpdateService;
import org.egov.pt.util.PTConstants;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

@Component
public class ReceiptConsumer {

	@Autowired
    private PaymentUpdateService paymentUpdateService;

	@Autowired
    private PaymentNotificationService paymentNotificationService;

	@Autowired
    private PropertyConfiguration config;
	
	@Value("${state.level.tenant.id}")
	private String stateLevelTenantID;

    @KafkaListener(topicPattern = "${kafka.topics.receipt.create.pattern}")
	public void listenPayments(final HashMap<String, Object> record,
			@Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {

		if (topic.matches(config.getReceiptTopicPattern())) {

			// Adding in MDC so that tracer can add it in header

			MDC.put(PTConstants.TENANTID_MDC_STRING, stateLevelTenantID);

			paymentUpdateService.process(record);
			paymentNotificationService.process(record, config.getReceiptTopic());
		}

	}
}
