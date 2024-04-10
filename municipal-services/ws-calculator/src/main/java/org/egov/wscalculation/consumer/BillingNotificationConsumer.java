package org.egov.wscalculation.consumer;

import java.util.HashMap;

import org.egov.wscalculation.constants.WSCalculationConstant;
import org.egov.wscalculation.service.PaymentNotificationService;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
	
	@Value("${state.level.tenant.id}")
	private String stateLevelTenantID;

	/**
	 * 
	 * @param record bill Object
	 * @param topic Topic Name
	 */
	@KafkaListener(topics = { "${kafka.topics.billgen.topic}" })
	public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
		
		// Adding in MDC so that tracer can add it in header
			MDC.put(WSCalculationConstant.TENANTID_MDC_STRING, stateLevelTenantID);
			
			log.info("Consuming record: " + record);
			paymentService.process(record, topic);
	}
}
