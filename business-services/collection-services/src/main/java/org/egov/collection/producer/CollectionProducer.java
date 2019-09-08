package org.egov.collection.producer;


import org.egov.collection.config.CollectionServiceConstants;
import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.egov.tracer.model.CustomException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CollectionProducer {

	public static final Logger logger = LoggerFactory.getLogger(CollectionProducer.class);

	@Autowired
    private CustomKafkaTemplate<String, Object> kafkaTemplate;

    public void producer(String topicName, String key, Object value) {
        try {
            kafkaTemplate.send(topicName, key, value);
        } catch (Exception e) {
            logger.error("Pushing to Queue FAILED! ", e.getMessage());
            throw new CustomException("COLLECTIONS_KAFKA_PUSH_FAILED", CollectionServiceConstants
                    .KAFKA_PUSH_EXCEPTION_DESC);
        }
    	
    }
}
