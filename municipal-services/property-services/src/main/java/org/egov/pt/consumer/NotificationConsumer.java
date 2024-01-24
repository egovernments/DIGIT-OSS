package org.egov.pt.consumer;


import java.util.HashMap;

import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.Property;
import org.egov.pt.service.AssessmentNotificationService;
import org.egov.pt.service.NotificationService;
import org.egov.pt.util.PTConstants;
import org.egov.pt.web.contracts.AssessmentRequest;
import org.egov.pt.web.contracts.PropertyRequest;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

import static org.egov.pt.util.PTConstants.TENANTID_MDC_STRING;

@Component
@Slf4j
public class NotificationConsumer {

	@Autowired
    private ObjectMapper mapper;
	
	@Autowired
	private PropertyConfiguration configs;

	@Autowired
    private AssessmentNotificationService assessmentNotificationService;
	
	@Autowired
	private NotificationService notifService;
	
    @KafkaListener(topicPattern = "${pt.kafka.notification.topic.pattern}")
    public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {

		try {

			if (topic.contains(configs.getCreateAssessmentTopic()) || topic.contains(configs.getUpdateAssessmentTopic())) {

				AssessmentRequest request = mapper.convertValue(record, AssessmentRequest.class);

				String tenantId = request.getAssessment().getTenantId();

				// Adding in MDC so that tracer can add it in header
				MDC.put(PTConstants.TENANTID_MDC_STRING, tenantId);

				assessmentNotificationService.process(topic, request);

			} else if (topic.contains(configs.getSavePropertyTopic()) || topic.contains(configs.getUpdatePropertyTopic())) {

				PropertyRequest request = mapper.convertValue(record, PropertyRequest.class);
				String tenantId = request.getProperty().getTenantId();

				// Adding in MDC so that tracer can add it in header
				MDC.put(TENANTID_MDC_STRING, tenantId);

				if (PTConstants.MUTATION_PROCESS_CONSTANT.contains(request.getProperty().getCreationReason().toString())) {

						notifService.sendNotificationForMutation(request);
					} else {

						notifService.sendNotificationForUpdate(request);
					}
				}


        } catch (final Exception e) {

            log.error("Error while listening to value: " + record + " on topic: " + topic + ": ", e);
        }
    }



}
