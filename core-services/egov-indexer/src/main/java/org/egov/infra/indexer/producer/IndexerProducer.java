package org.egov.infra.indexer.producer;

import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class IndexerProducer {
	
	public static final Logger logger = LoggerFactory.getLogger(IndexerProducer.class);

	@Autowired
    private CustomKafkaTemplate<String, Object> kafkaTemplate;
	
	/**
	 * Kafka Producer
	 * 
	 * @param topicName
	 * @param value
	 */
    public void producer(String topicName, Object value) {
    	kafkaTemplate.send(topicName, value);
    }

}
