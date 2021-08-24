package org.egov.pt.consumer;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;

import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.Property;
import org.egov.pt.service.AssessmentNotificationService;
import org.egov.pt.service.NotificationService;
import org.egov.pt.util.PTConstants;
import org.egov.pt.web.contracts.AssessmentRequest;
import org.egov.pt.web.contracts.PropertyRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

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

			if (topic.equalsIgnoreCase(configs.getCreateAssessmentTopic()) || topic.equalsIgnoreCase(configs.getUpdateAssessmentTopic())) {

				AssessmentRequest request = mapper.convertValue(record, AssessmentRequest.class);
				int month;
				int year;
				Calendar cal = Calendar.getInstance ();
				cal.setTime (new Date() );  //current date
				
				//calendar will start from 0-11 [0=jan, 11=dec]
				month = cal.get ( Calendar.MONTH );
				int advance = ( month < 3 ) ? -1 : 1;
				year = cal.get ( Calendar.YEAR ) + advance;  //current date to or from financial year
				  
				String astYear[]=request.getAssessment().getFinancialYear().split("-"); //assessment year splitting from and to year eg., 2019-20 to astYear[0]= 2019 and astYear[1]=20 
				if(Integer.parseInt(astYear[0])<= year && year <= Integer.parseInt(astYear[0])+1){   //comparing assessment financial year with current financial year
				 assessmentNotificationService.process(topic, request);
				}
				
			} else if (topic.equalsIgnoreCase(configs.getSavePropertyTopic()) || topic.equalsIgnoreCase(configs.getUpdatePropertyTopic())) {

				PropertyRequest request = mapper.convertValue(record, PropertyRequest.class);
				
				if (PTConstants.MUTATION_PROCESS_CONSTANT.equalsIgnoreCase(request.getProperty().getCreationReason().toString())) {

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
