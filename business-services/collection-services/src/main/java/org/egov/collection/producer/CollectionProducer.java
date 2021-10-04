package org.egov.collection.producer;


import org.egov.collection.config.CollectionServiceConstants;
import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CollectionProducer {

	@Autowired
    private CustomKafkaTemplate<String, Object> kafkaTemplate;

    public void push(String topicName, Object value) {
        try {
            kafkaTemplate.send(topicName, value);
        } catch (Exception e) {
            throw new CustomException("COLLECTIONS_KAFKA_PUSH_FAILED", CollectionServiceConstants
                    .KAFKA_PUSH_EXCEPTION_DESC);
        }

    }
}