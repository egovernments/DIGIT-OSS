package org.egov.pt.consumer;


import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.workflow.ProcessInstance;
import org.egov.pt.service.AssessmentNotificationService;
import org.egov.pt.service.NotificationService;
import org.egov.pt.web.contracts.AssessmentRequest;
import org.egov.pt.web.contracts.PropertyRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import java.util.HashMap;

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
	
    @KafkaListener(topics = {"${egov.pt.assessment.create.topic}",
    						 "${egov.pt.assessment.update.topic}",
    						 "${persister.update.property.topic}",
    						 "${persister.save.property.topic}"})
    public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {

		try {

			if (topic.equalsIgnoreCase(configs.getCreateAssessmentTopic())
					|| topic.equalsIgnoreCase(configs.getUpdateAssessmentTopic())) {
				
				AssessmentRequest request = mapper.convertValue(record, AssessmentRequest.class);
				assessmentNotificationService.process(topic, request);
			} else if (topic.equalsIgnoreCase(configs.getSavePropertyTopic())) {

				PropertyRequest request = mapper.convertValue(record, PropertyRequest.class);
				notifService.sendNotificationForUpdate(request);
				
			} else if (topic.equalsIgnoreCase(configs.getUpdatePropertyTopic())) {

				PropertyRequest request = mapper.convertValue(record, PropertyRequest.class);
				ProcessInstance wf  = request.getProperty().getWorkflow();

				if (wf == null
						|| (wf != null && wf.getBusinessService().equalsIgnoreCase(configs.getUpdatePTWfName()))) {

					notifService.sendNotificationForUpdate(request);
				} else {

					notifService.sendNotificationForMutation(request);
				}
			}

        } catch (final Exception e) {

            log.error("Error while listening to value: " + record + " on topic: " + topic + ": ", e);
        }
    }



}
