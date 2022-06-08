package org.egov.nationaldashboardkafkapipeline.consumers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import lombok.extern.slf4j.Slf4j;
import org.egov.nationaldashboardkafkapipeline.models.ProducerPOJO;
import org.egov.nationaldashboardkafkapipeline.producer.Producer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class NationalDashboardPipelineListener {

    @Autowired
    private ObjectMapper objectMapper;

    @Value("#{${module.index.mapping}}")
    private Map<String, String> moduleIndexMapping;

    @Autowired
    private Producer producer;


    /**
     * Kafka consumer
     *
     * @param record
     * @param topic
     */
    @KafkaListener(topics = { "${kafka.topics.national.events}"})
    public void listen(HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        try {
            ProducerPOJO incomingData = objectMapper.convertValue(record, ProducerPOJO.class);
            for(JsonNode jsonNode : incomingData.getRecords()){
                String module = jsonNode.get("module").asText();
                producer.push(moduleIndexMapping.get(module), jsonNode);
            }

        }catch(Exception e) {
            log.error("Exception while reading from the queue: ", e);
        }
    }
}
