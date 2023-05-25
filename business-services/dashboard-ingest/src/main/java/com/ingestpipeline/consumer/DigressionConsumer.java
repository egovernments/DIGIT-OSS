package com.ingestpipeline.consumer;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;

import com.ingestpipeline.service.DigressService;
import com.ingestpipeline.util.Constants;

public class DigressionConsumer implements KafkaConsumer {
	public static final Logger LOGGER = LoggerFactory.getLogger(DigressionConsumer.class);
	public static final String INTENT = "digress";
	
	@Autowired 
	private DigressService digressService; 
	
	@Override
	@KafkaListener(topics = { Constants.KafkaTopics.VALID_DATA }, containerFactory = Constants.BeanContainerFactory.INCOMING_KAFKA_LISTENER)
	public void processMessage(Map incomingData,
							   @Header(KafkaHeaders.RECEIVED_TOPIC) final String topic) {
		LOGGER.info("##KafkaMessageAlert## : key:" + topic + ":" + "value:" + incomingData.size());
		try {
			
		} catch (final Exception e) {
			LOGGER.error("Exception Encountered while processing the received message : " + e.getMessage());
		}
	}

}
