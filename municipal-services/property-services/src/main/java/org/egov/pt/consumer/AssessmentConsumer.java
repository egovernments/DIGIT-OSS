package org.egov.pt.consumer;


import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.pt.service.AssessmentNotificationService;
import org.egov.pt.web.contracts.AssessmentRequest;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.util.HashMap;

@Component
@Slf4j
public class AssessmentConsumer {


    private ObjectMapper mapper;

    private AssessmentNotificationService assessmentNotificationService;

    @KafkaListener(topics = {"${persister.save.property.topic}","${persister.update.property.topic}"})
    public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {

        try {
            AssessmentRequest request = mapper.convertValue(record, AssessmentRequest.class);
            assessmentNotificationService.process(topic, request);

        } catch (final Exception e) {

            log.error("Error while listening to value: " + record + " on topic: " + topic + ": " + e);
        }
    }



}
