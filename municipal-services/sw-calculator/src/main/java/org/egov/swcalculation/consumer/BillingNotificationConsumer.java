package org.egov.swcalculation.consumer;

import java.util.HashMap;

import org.egov.swcalculation.constants.SWCalculationConstant;
import org.egov.swcalculation.service.PaymentNotificationService;
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
public class BillingNotificationConsumer {
	
	
	@Autowired
	PaymentNotificationService service;
	
	@Value("${state.level.tenant.id}")
	private String stateLevelTenantID;
	
	@KafkaListener(topics = { "${kafka.topics.billgen.topic}" })
	public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
		try {
			log.info("Consuming record: " + record);
			
			// Adding in MDC so that tracer can add it in header
			MDC.put(SWCalculationConstant.TENANTID_MDC_STRING, stateLevelTenantID);
						
			service.process(record, topic);
		} catch (final Exception e) {
			StringBuilder builder = new StringBuilder();
			builder.append("Error while listening to value: ").append(record).append(" on topic: ").append(topic).append(": ").append(e);
			log.error(builder.toString());
		}

	}

}
