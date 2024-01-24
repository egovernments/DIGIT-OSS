package org.egov.noc.consumer;

import java.util.HashMap;

import org.egov.noc.service.notification.NOCNotificationService;
import org.egov.noc.util.NOCConstants;
import org.egov.noc.web.model.NocRequest;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
@Slf4j
@Component
public class NOCConsumer {

	@Autowired
	private NOCNotificationService notificationService;
	
	@KafkaListener(topics = { "${persister.save.noc.topic}", "${persister.update.noc.topic}",
			"${persister.update.noc.workflow.topic}" })
	public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
		ObjectMapper mapper = new ObjectMapper();
		NocRequest nocRequest = new NocRequest();
		try {
			log.debug("Consuming record: " + record);
			nocRequest = mapper.convertValue(record, NocRequest.class);
		} catch (final Exception e) {
			log.error("Error while listening to value: " + record + " on topic: " + topic + ": " + e);
		}
		log.debug("BPA Received: " + nocRequest.getNoc().getApplicationNo());
		
		// Adding in MDC so that tracer can add it in header
		MDC.put(NOCConstants.TENANTID_MDC_STRING, nocRequest.getNoc().getTenantId());

		notificationService.process(nocRequest);
	}
}
