package org.egov.pt.consumer;


import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.pt.service.AssessmentNotificationService;
import org.egov.pt.web.contracts.AssessmentRequest;
import org.springframework.beans.factory.annotation.Autowired;
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


    @Autowired
    public AssessmentConsumer(ObjectMapper mapper, AssessmentNotificationService assessmentNotificationService) {
        this.mapper = mapper;
        this.assessmentNotificationService = assessmentNotificationService;
    }

    @KafkaListener(topics = {"${egov.pt.assessment.create.topic}","${egov.pt.assessment.update.topic}"})
    public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {

        try {
            AssessmentRequest request = mapper.convertValue(record, AssessmentRequest.class);
            assessmentNotificationService.process(topic, request);

        } catch (final Exception e) {

            log.error("Error while listening to value: " + record + " on topic: " + topic + ": " + e);
        }
    }



}
