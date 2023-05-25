package org.egov.dataupload.producer;


import org.egov.dataupload.model.UploaderRequest;
import org.egov.tracer.kafka.LogAwareKafkaTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class DataUploadProducer {

	public static final Logger logger = LoggerFactory.getLogger(DataUploadProducer.class);

	@Autowired
    private LogAwareKafkaTemplate<String, Object> kafkaTemplate;
	
    @Value("${kafka.topics.dataupload}")
    private String topic;
    
    @Value("${kafka.topics.dataupload.key}")
    private String key;

	public void producer(UploaderRequest value) {
		
		logger.info("Value being pushed to the queue: {}", value);
		kafkaTemplate.send(topic, key , value);
	}


	public void push(String topic, Object value) {

		logger.info("Value being pushed to the queue: {}", value);
		kafkaTemplate.send(topic, value);
	}
}