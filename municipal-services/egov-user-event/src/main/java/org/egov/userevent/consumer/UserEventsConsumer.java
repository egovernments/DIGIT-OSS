package org.egov.userevent.consumer;

import java.util.HashMap;

import org.egov.userevent.config.PropertiesManager;
import org.egov.userevent.service.UserEventsService;
import org.egov.userevent.web.contract.EventRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserEventsConsumer {
	
	
    @Autowired
    private ObjectMapper objectMapper;
    
	@Autowired
	private UserEventsService service;
	
	@Autowired
	private PropertiesManager props;
	
	
	/**
	 * Kafka consumer
	 * 
	 * @param record
	 * @param topic
	 */
    @KafkaListener(topics = { "${kafka.topics.save.events}", "${kafka.topics.update.events}" })
	public void listen(HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
		try {
			EventRequest eventReq = objectMapper.convertValue(record, EventRequest.class);
			if(topic.contains(props.getSaveEventsTopic())) {
				service.createEvents(eventReq, false);
			}else if(topic.contains(props.getUpdateEventsTopic())) {
				service.updateEvents(eventReq);
			}
		}catch(Exception e) {
			log.error("Exception while reading from the queue: ", e);
		}
	}

}
