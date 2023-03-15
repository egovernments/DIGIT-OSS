package com.ingestpipeline.consumer;

import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;

import com.ingestpipeline.model.IncomingData;

import java.util.Map;

public interface KafkaConsumer {
	
	public void processMessage(final Map incomingData,
			@Header(KafkaHeaders.RECEIVED_TOPIC) final String topic); 

}
