package org.egov.userevent.producer;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class UserEventsProducer {

    @Autowired
    private CustomKafkaTemplate<String, Object> kafkaTemplate;

    @Autowired
    private MultiStateInstanceUtil multiStateInstanceUtil;

    /**
     * Kafka Producer.
     * 
     * @param topic
     * @param value
     */
    public void push(String tenantId, String topic, Object value) {
        String updatedTopic = multiStateInstanceUtil.getStateSpecificTopicName(tenantId, topic);
        log.info("Topic: "+updatedTopic);
        kafkaTemplate.send(updatedTopic, value);
    }
}
