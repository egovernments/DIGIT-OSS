package org.egov.userevent.consumer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import lombok.extern.slf4j.Slf4j;
import org.egov.userevent.config.PropertiesManager;
import org.egov.userevent.model.ProducerPOJO;
import org.egov.userevent.producer.UserEventsProducer;
import org.egov.userevent.service.UserEventsService;
import org.egov.userevent.web.contract.EventRequest;
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
public class NationalDashboardEventsConsumer {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserEventsService service;

    @Autowired
    private PropertiesManager props;

    @Autowired
    private UserEventsProducer producer;


    @Value("#{${module.index.mapping}}")
    private Map<String, String> moduleIndexMapping;


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
