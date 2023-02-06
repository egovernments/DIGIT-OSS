package org.egov.egovsurveyservices.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.egovsurveyservices.service.NotificationService;
import org.egov.egovsurveyservices.web.models.SurveyRequest;
import org.egov.egovsurveyservices.web.models.enums.Status;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;

import java.util.HashMap;

@Component
@Slf4j
public class NotificationConsumer {

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private NotificationService notificationService;

    @KafkaListener(topics = {"${egov.ss.survey.create.topic}"})
    public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {

        try {
            SurveyRequest request = mapper.convertValue(record, SurveyRequest.class);
            //log.info(request.toString());
            notificationService.prepareEventAndSend(request);

        } catch (final Exception e) {

            log.error("Error while listening to value: " + record + " on topic: " + topic + ": ", e);
        }
    }



}
