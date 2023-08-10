package org.egov.bpa.consumer;

import java.util.HashMap;

import org.egov.bpa.service.notification.BPANotificationService;
import org.egov.bpa.util.BPAConstants;
import org.egov.bpa.web.model.BPARequest;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

import static org.egov.bpa.util.BPAConstants.TENANTID_MDC_STRING;

@Slf4j
@Component
public class BPAConsumer {

	@Autowired
	private BPANotificationService notificationService;
	
	@KafkaListener(topics = { "${persister.update.buildingplan.topic}", "${persister.save.buildingplan.topic}",
			"${persister.update.buildingplan.workflow.topic}" })
	public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
		ObjectMapper mapper = new ObjectMapper();
		BPARequest bpaRequest = new BPARequest();
		try {
			log.debug("Consuming record: " + record);
			bpaRequest = mapper.convertValue(record, BPARequest.class);
		} catch (final Exception e) {
			log.error("Error while listening to value: " + record + " on topic: " + topic + ": " + e);
		}
		log.debug("BPA Received: " + bpaRequest.getBPA().getApplicationNo());
		String tenantId = bpaRequest.getBPA().getTenantId();

		// Adding in MDC so that tracer can add it in header
		MDC.put(TENANTID_MDC_STRING, tenantId);
		notificationService.process(bpaRequest);
	}
}
