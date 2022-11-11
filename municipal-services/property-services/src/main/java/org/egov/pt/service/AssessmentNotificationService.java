package org.egov.pt.service;


import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.Assessment;
import org.egov.pt.models.Property;
import org.egov.pt.models.PropertyCriteria;
import org.egov.pt.models.collection.BillResponse;
import org.egov.pt.models.event.Event;
import org.egov.pt.models.event.EventRequest;
import org.egov.pt.models.workflow.ProcessInstance;
import org.egov.pt.util.NotificationUtil;
import org.egov.pt.util.UnmaskingUtil;
import org.egov.pt.web.contracts.AssessmentRequest;
import org.egov.pt.web.contracts.EmailRequest;
import org.egov.pt.web.contracts.SMSRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.util.*;

import static org.egov.pt.util.PTConstants.*;

@Slf4j
@Component
public class AssessmentNotificationService {



    private NotificationUtil util;

    private PropertyService propertyService;

    private PropertyConfiguration config;
    
    private BillingService billingService;

    private UnmaskingUtil unmaskingUtil;

    @Autowired
    public AssessmentNotificationService(NotificationUtil util, PropertyService propertyService, PropertyConfiguration config,BillingService billingService,UnmaskingUtil unmaskingUtil ) {
        this.util = util;
        this.propertyService = propertyService;
        this.config = config;
        this.billingService = billingService;
        this.unmaskingUtil = unmaskingUtil;
    }

    public void process(String topicName, AssessmentRequest assessmentRequest){

        RequestInfo requestInfo = assessmentRequest.getRequestInfo();
        Assessment assessment = assessmentRequest.getAssessment();
        String tenantId = assessment.getTenantId();

        PropertyCriteria criteria = PropertyCriteria.builder().tenantId(tenantId)
                                    .propertyIds(Collections.singleton(assessment.getPropertyId()))
                                    .isSearchInternal(Boolean.TRUE)
                                    .build();


        List<Property> properties = propertyService.searchProperty(criteria, requestInfo);

        if(CollectionUtils.isEmpty(properties))
            log.error("NO_PROPERTY_FOUND","No property found for the assessment: "+assessment.getPropertyId());

        Property property = properties.get(0);
        unmaskingUtil.getOwnerDetailsUnmasked(property,requestInfo);

        BillResponse billResponse = billingService.fetchBill(property, requestInfo);
        BigDecimal dueAmount = billResponse.getBill().get(0).getTotalAmount();

        List<String> configuredChannelNamesForAssessment =  util.fetchChannelList(new RequestInfo(), tenantId, PT_BUSINESSSERVICE, ACTION_FOR_ASSESSMENT);

        List<SMSRequest> smsRequests = enrichSMSRequest(topicName, assessmentRequest, property);
        if(configuredChannelNamesForAssessment.contains(CHANNEL_NAME_SMS)) {
            util.sendSMS(smsRequests);
        }

        if(configuredChannelNamesForAssessment.contains(CHANNEL_NAME_EVENT)) {
            Boolean isActionReq = false;
            if (topicName.equalsIgnoreCase(config.getCreateAssessmentTopic()) && assessment.getWorkflow() == null)
                isActionReq = true;

            List<Event> events = util.enrichEvent(smsRequests, requestInfo, tenantId, property, isActionReq);
            util.sendEventNotification(new EventRequest(requestInfo, events));
        }

        if(configuredChannelNamesForAssessment.contains(CHANNEL_NAME_EMAIL) ){
            List<EmailRequest> emailRequests = util.createEmailRequestFromSMSRequests(requestInfo,smsRequests,tenantId);
            util.sendEmail(emailRequests);
        }

        if (dueAmount!=null && dueAmount.compareTo(BigDecimal.ZERO)>0) {

            List<String> configuredChannelNames =  util.fetchChannelList(new RequestInfo(), tenantId, PT_BUSINESSSERVICE, ACTION_FOR_DUES);
            List<SMSRequest> smsRequestsList = new ArrayList<>();
            enrichSMSRequestForDues(smsRequestsList, assessmentRequest, property);

            if(configuredChannelNames.contains(CHANNEL_NAME_SMS)) {
                util.sendSMS(smsRequestsList);
            }

            if(configuredChannelNames.contains(CHANNEL_NAME_EVENT)) {
                Boolean isActionRequired = true;
                List<Event> eventsList = util.enrichEvent(smsRequestsList, requestInfo, tenantId, property, isActionRequired);
                util.sendEventNotification(new EventRequest(requestInfo, eventsList));
            }

            if(configuredChannelNames.contains(CHANNEL_NAME_EMAIL) ){
                List<EmailRequest> emailRequests = util.createEmailRequestFromSMSRequests(requestInfo,smsRequests,tenantId);
                util.sendEmail(emailRequests);
            }
            }

    }



    private void enrichSMSRequestForDues(List<SMSRequest> smsRequests, AssessmentRequest assessmentRequest,
			Property property) {
		
    	String tenantId = assessmentRequest.getAssessment().getTenantId();
    	String localizationMessages = util.getLocalizationMessages(tenantId,assessmentRequest.getRequestInfo());
    	
    	String messageTemplate = util.getMessageTemplate(DUES_NOTIFICATION, localizationMessages);
    	
    	if(messageTemplate.contains(NOTIFICATION_PROPERTYID))
            messageTemplate = messageTemplate.replace(NOTIFICATION_PROPERTYID, property.getPropertyId());

        if(messageTemplate.contains(NOTIFICATION_FINANCIALYEAR))
            messageTemplate = messageTemplate.replace(NOTIFICATION_FINANCIALYEAR, assessmentRequest.getAssessment().getFinancialYear());
        
        if(messageTemplate.contains(NOTIFICATION_PAYMENT_LINK)){

            String UIHost = config.getUiAppHost();
            String paymentPath = config.getPayLinkSMS();
            paymentPath = paymentPath.replace("$consumercode",property.getPropertyId());
            paymentPath = paymentPath.replace("$tenantId",property.getTenantId());
            paymentPath = paymentPath.replace("$businessservice",PT_BUSINESSSERVICE);

            String finalPath = UIHost + paymentPath;

            messageTemplate = messageTemplate.replace(NOTIFICATION_PAYMENT_LINK,util.getShortenedUrl(finalPath));
        }
        
        Map<String,String > mobileNumberToOwner = new HashMap<>();
        property.getOwners().forEach(owner -> {
            if(owner.getMobileNumber()!=null)
                mobileNumberToOwner.put(owner.getMobileNumber(),owner.getName());
            if(owner.getAlternatemobilenumber() !=null && !owner.getAlternatemobilenumber().equalsIgnoreCase(owner.getMobileNumber()) ) {
            	mobileNumberToOwner.put(owner.getAlternatemobilenumber() ,owner.getName());
            }
        });
        
        List <SMSRequest> smsRequestsForDues = util.createSMSRequest(messageTemplate,mobileNumberToOwner);
        
        smsRequests.addAll(smsRequestsForDues);
    	
		
	}

	/**
     * Enriches the smsRequest with the customized messages
     * @param request The tradeLicenseRequest from kafka topic
     * @param smsRequests List of SMSRequets
     */
    private List<SMSRequest> enrichSMSRequest(String topicName, AssessmentRequest request, Property property){
    	
        String tenantId = request.getAssessment().getTenantId();
        String localizationMessages = util.getLocalizationMessages(tenantId,request.getRequestInfo());
        String message = getCustomizedMsg(topicName, request, property, localizationMessages);
        if(message==null)
            return Collections.emptyList();

        Map<String,String > mobileNumberToOwner = new HashMap<>();
        property.getOwners().forEach(owner -> {
            if(owner.getMobileNumber()!=null)
                mobileNumberToOwner.put(owner.getMobileNumber(),owner.getName());
            if(owner.getAlternatemobilenumber() !=null && !owner.getAlternatemobilenumber().equalsIgnoreCase(owner.getMobileNumber()) ) {
            	mobileNumberToOwner.put(owner.getAlternatemobilenumber() ,owner.getName());
            }
        });
        return util.createSMSRequest(message,mobileNumberToOwner);
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

        if(messageTemplate.contains(NOTIFICATION_PAYMENT_LINK)){

            String UIHost = config.getUiAppHost();
            String paymentPath = config.getPayLinkSMS();
            paymentPath = paymentPath.replace("$consumercode",property.getPropertyId());
            paymentPath = paymentPath.replace("$tenantId",property.getTenantId());
            paymentPath = paymentPath.replace("$businessservice",PT_BUSINESSSERVICE);

            String finalPath = UIHost + paymentPath;

            messageTemplate = messageTemplate.replace(NOTIFICATION_PAYMENT_LINK,util.getShortenedUrl(finalPath));
        }

        return messageTemplate;
    }

}
