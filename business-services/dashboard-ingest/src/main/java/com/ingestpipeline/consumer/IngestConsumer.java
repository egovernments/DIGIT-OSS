package com.ingestpipeline.consumer;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import com.ingestpipeline.model.IncomingData;
import com.ingestpipeline.service.IngestService;
import com.ingestpipeline.util.Constants;

@Service
public class IngestConsumer{
	public static final Logger LOGGER = LoggerFactory.getLogger(IngestConsumer.class);
	
	@Autowired
	private IngestService ingestService; 
	
	@KafkaListener(topics = { "${kafka.topics.incoming.collection}" }, containerFactory = Constants.BeanContainerFactory.INCOMING_KAFKA_LISTENER)
	public void processMessage(Map data,
							   @Header(KafkaHeaders.RECEIVED_TOPIC) final String topic) {
		LOGGER.info("##KafkaMessageAlert## : key:" + topic + ":" + "value:" + data.size());
		try {
			LOGGER.info("IngestConsumer ## get data ## " +data +" ## TOPIC ## "+topic);
			IncomingData incomingData = ingestService.getContextForIncomingTopic(topic);
			// LOGGER.info("## incomingData: "+incomingData);
			incomingData.setDataObject(data.get("Data"));
			//incomingData.setDataObject(data);
			ingestService.ingestToPipeline(incomingData);
		} catch (final Exception e) {
			LOGGER.error("Exception Encountered while processing the received message : " + e.getMessage());
		}
	}
	

}
