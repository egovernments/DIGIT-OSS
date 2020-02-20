package org.egov.pt.service;


import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.Assessment;
import org.egov.pt.models.Property;
import org.egov.pt.models.PropertyCriteria;
import org.egov.pt.models.event.Event;
import org.egov.pt.models.event.EventRequest;
import org.egov.pt.models.event.Recepient;
import org.egov.pt.models.event.Source;
import org.egov.pt.models.workflow.ProcessInstance;
import org.egov.pt.util.NotificationUtil;
import org.egov.pt.web.contracts.AssessmentRequest;
import org.egov.pt.web.contracts.SMSRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

import static org.egov.pt.util.PTConstants.*;

@Slf4j
@Component
public class AssessmentNotificationService {



    private NotificationUtil util;

    private PropertyService propertyService;

    private PropertyConfiguration config;


    @Autowired
    public AssessmentNotificationService(NotificationUtil util, PropertyService propertyService, PropertyConfiguration config) {
        this.util = util;
        this.propertyService = propertyService;
        this.config = config;
    }

    public void process(String topicName, AssessmentRequest assessmentRequest){

        RequestInfo requestInfo = assessmentRequest.getRequestInfo();
        Assessment assessment = assessmentRequest.getAssessment();

        PropertyCriteria criteria = PropertyCriteria.builder().tenantId(assessment.getTenantId())
                                    .propertyIds(Collections.singleton(assessment.getPropertyId()))
                                    .build();
        List<Property> properties = propertyService.searchProperty(criteria, requestInfo);

        if(CollectionUtils.isEmpty(properties))
            log.error("NO_PROPERTY_FOUND","No property found for the assessment: "+assessment.getPropertyId());

        Property property = properties.get(0);

        List<SMSRequest> smsRequests = new LinkedList<>();

        List<Event> events = new ArrayList<>();

        enrichSMSRequest(topicName, assessmentRequest, property, smsRequests);

        util.sendSMS(smsRequests);

        enrichEvent(assessmentRequest, smsRequests, events);

        util.sendEventNotification(new EventRequest(requestInfo, events));
    }



    /**
     * Enriches the smsRequest with the customized messages
     * @param request The tradeLicenseRequest from kafka topic
     * @param smsRequests List of SMSRequets
     */
    private void enrichSMSRequest(String topicName, AssessmentRequest request, Property property, List<SMSRequest> smsRequests){
    	
        String tenantId = request.getAssessment().getTenantId();
        String localizationMessages = util.getLocalizationMessages(tenantId,request.getRequestInfo());
        String message = getCustomizedMsg(topicName, request, property, localizationMessages);
        if(message==null)
            return;

        Map<String,String > mobileNumberToOwner = new HashMap<>();

        property.getOwners().forEach(owner -> {
            if(owner.getMobileNumber()!=null)
                mobileNumberToOwner.put(owner.getMobileNumber(),owner.getName());
        });
        smsRequests.addAll(util.createSMSRequest(message,mobileNumberToOwner));

    }


    /**
     *
     * @param topicName
     * @param request
     * @param property
     * @param localizationMessages
     * @return
     */
    private String getCustomizedMsg(String topicName, AssessmentRequest request, Property property, String localizationMessages){

        Assessment assessment = request.getAssessment();

        ProcessInstance processInstance = assessment.getWorkflow();

        String msgCode = null,messageTemplate = null;

        if(processInstance==null){

            if(topicName.equalsIgnoreCase(config.getCreateAssessmentTopic()))
                msgCode = NOTIFICATION_ASSESSMENT_CREATE;

            else msgCode = NOTIFICATION_ASSESSMENT_UPDATE;

            messageTemplate = customize(assessment, property, msgCode, localizationMessages);

        }
        else{
            msgCode = NOTIFICATION_ASMT_PREFIX + assessment.getWorkflow().getState().getState();
            messageTemplate = customize(assessment, property, msgCode, localizationMessages);
        }

        return messageTemplate;

    }


    /**
     * Replaces all place holders with values from assessment and property
     * @param assessment
     * @param property
     * @return
     */
    private String customize(Assessment assessment, Property property, String msgCode, String localizationMessages){

        String messageTemplate = util.getMessageTemplate(msgCode, localizationMessages);

        if(messageTemplate.contains(NOTIFICATION_ASSESSMENTNUMBER))
            messageTemplate = messageTemplate.replace(NOTIFICATION_ASSESSMENTNUMBER, assessment.getAssessmentNumber());

        if(messageTemplate.contains(NOTIFICATION_STATUS)){
            String localizationCode = LOCALIZATION_ASMT_PREFIX + assessment.getWorkflow().getState().getState();
            String statusLocalization = util.getMessageTemplate(localizationCode, localizationMessages);
            messageTemplate = messageTemplate.replace(NOTIFICATION_STATUS, statusLocalization);
        }

        if(messageTemplate.contains(NOTIFICATION_PROPERTYID))
            messageTemplate = messageTemplate.replace(NOTIFICATION_PROPERTYID, property.getPropertyId());

        if(messageTemplate.contains(NOTIFICATION_FINANCIALYEAR))
            messageTemplate = messageTemplate.replace(NOTIFICATION_FINANCIALYEAR, assessment.getFinancialYear());

        return messageTemplate;
    }


    /**
     *
     * @param request
     * @param smsRequests
     * @param events
     */
    private void enrichEvent(AssessmentRequest request, List<SMSRequest> smsRequests, List<Event> events){

        String tenantId = request.getAssessment().getTenantId();
        Set<String> mobileNumbers = smsRequests.stream().map(SMSRequest :: getMobileNumber).collect(Collectors.toSet());
        Map<String, String> mapOfPhnoAndUUIDs = util.fetchUserUUIDs(mobileNumbers, request.getRequestInfo(), request.getAssessment().getTenantId());
        if (CollectionUtils.isEmpty(mapOfPhnoAndUUIDs.keySet())) {
            log.error("UUID search failed!");
        }
        Map<String,String > mobileNumberToMsg = smsRequests.stream().collect(Collectors.toMap(SMSRequest::getMobileNumber, SMSRequest::getMessage));

        mobileNumbers.forEach(mobileNumber -> {
            List<String> toUsers = new ArrayList<>();
            toUsers.add(mapOfPhnoAndUUIDs.get(mobileNumber));
            Recepient recepient = Recepient.builder().toUsers(toUsers).toRoles(null).build();
            events.add(Event.builder().tenantId(tenantId).description(mobileNumberToMsg.get(mobileNumber))
                    .eventType(USREVENTS_EVENT_TYPE).name(USREVENTS_EVENT_NAME)
                    .postedBy(USREVENTS_EVENT_POSTEDBY).source(Source.WEBAPP).recepient(recepient)
                    .eventDetails(null).build());
        });



    }

}
