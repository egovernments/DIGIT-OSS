package org.egov.fsm.consumer;

import java.util.HashMap;

import org.egov.fsm.service.notification.NotificationService;
import org.egov.fsm.web.model.FSMRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class FSMConsumer {

	@Autowired
	private NotificationService notificationService;
	
	@KafkaListener(topics = { "${persister.save.fsm.topic}", "${persister.update.fsm.topic}",
			"${persister.update.fsm.workflow.topic}" ,"${persister.update.fsm.adhoc.topic}"})
	public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
		ObjectMapper mapper = new ObjectMapper();
		FSMRequest fsmRequest = new FSMRequest();
		try {
			log.debug("Consuming record: " + record);
			fsmRequest = mapper.convertValue(record, FSMRequest.class);
		} catch (final Exception e) {
			log.error("Error while listening to value: " + record + " on topic: " + topic + ": " + e);
		}
		log.debug("FSM Received: " + fsmRequest.getFsm().getApplicationNo());
		 notificationService.process(fsmRequest);//TODO enable after implementation
	}
}