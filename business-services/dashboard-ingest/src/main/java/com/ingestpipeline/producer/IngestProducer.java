package com.ingestpipeline.producer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;

@Service
public class IngestProducer {
	
	public static final Logger LOGGER = LoggerFactory.getLogger(IngestProducer.class);

	@Autowired
	private KafkaTemplate<String, Object> kafkaTemplate;
	
	public void pushToPipeline(Object object, String topic, String key) {
		LOGGER.info("Kafka Topic : " + topic + " Kafka Key : " + key);
		kafkaTemplate.send(topic, key, object);
	}
}
