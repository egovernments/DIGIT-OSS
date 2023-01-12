package org.egov.tl.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tl.config.TLConfiguration;
import org.egov.tl.repository.ServiceRequestRepository;
import org.egov.tl.web.models.*;
import org.egov.tl.web.models.property.Property;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

import static org.egov.tl.util.TLConstants.*;
import static org.springframework.util.StringUtils.capitalize;

@Component
@Slf4j
public class PropertyUtil {

    private NotificationUtil util;

    private ServiceRequestRepository serviceRequestRepository;

    private ObjectMapper mapper;

    private TLConfiguration config;

    private TradeUtil tradeUtil;

    @Autowired
    public PropertyUtil(ServiceRequestRepository serviceRequestRepository, NotificationUtil util, ObjectMapper mapper, TLConfiguration config, TradeUtil tradeUtil) {
        this.util = util;
        this.serviceRequestRepository = serviceRequestRepository;
        this.mapper = mapper;
        this.config = config;
        this.tradeUtil = tradeUtil;
    }

    /**
     * Creates customized message based on tradelicense
     * @param license
     * @param localizationMessages
     * @param channel
     * @param propertyId
     * @param source
     * @return returns customized message based on tradelicense
     */
    public String getPropertySearchMsg(TradeLicense license, String localizationMessages, String channel, String propertyId, String source) {
        String messageTemplate = "";
        if(CHANNEL_NAME_EMAIL.equals(channel)) {
            if(TL_BUSINESSSERVICE.equals(source)){
                messageTemplate = util.getMessageTemplate(NOTIFICATION_PROPERTY_CREATED + ".email", localizationMessages);
                if(license.getTradeLicenseDetail().getOwners().get(0).getGender().equals(GENDER_MALE)) {
                    messageTemplate = messageTemplate.replace(NOTIF_OWNER_NAME_KEY, SALUTATION_MR + license.getTradeLicenseDetail().getOwners().get(0).getName());
                } else {
                    messageTemplate = messageTemplate.replace(NOTIF_OWNER_NAME_KEY, SALUTATION_MS + license.getTradeLicenseDetail().getOwners().get(0).getName());
                }
            } else {
                messageTemplate = util.getMessageTemplate(TLConstants.NOTIFICATION_PROPERTY_TAGGED + ".email", localizationMessages);
                messageTemplate = messageTemplate.replace(NOTIF_PROPERTY_OWNER_NAME_KEY, license.getTradeLicenseDetail().getOwners().get(0).getName());
            }
        } else {
            if(TL_BUSINESSSERVICE.equals(source)){
                messageTemplate = util.getMessageTemplate(TLConstants.NOTIFICATION_PROPERTY_CREATED, localizationMessages);
                if(license.getTradeLicenseDetail().getOwners().get(0).getGender().equals(GENDER_MALE)) {
                    messageTemplate = messageTemplate.replace(NOTIF_OWNER_NAME_KEY, SALUTATION_MR + license.getTradeLicenseDetail().getOwners().get(0).getName());
                } else {
                    messageTemplate = messageTemplate.replace(NOTIF_OWNER_NAME_KEY, SALUTATION_MS + license.getTradeLicenseDetail().getOwners().get(0).getName());
                }
            } else {
                messageTemplate = util.getMessageTemplate(TLConstants.NOTIFICATION_PROPERTY_TAGGED, localizationMessages);
                messageTemplate = messageTemplate.replace(NOTIF_PROPERTY_OWNER_NAME_KEY, license.getTradeLicenseDetail().getOwners().get(0).getName());
            }
        }
        messageTemplate = messageTemplate.replace(NOTIF_TRADE_NAME_KEY, license.getTradeName());
        messageTemplate = messageTemplate.replace(NOTIF_TRADE_PROPERTY_ID_KEY, propertyId.substring(2,18)+"****");
        messageTemplate = messageTemplate.replace(NOTIF_TRADE_LICENSENUMBER_KEY, license.getApplicationNumber());

        messageTemplate = messageTemplate.replace(NOTIF_TENANT_KEY, capitalize(license.getTenantId().split("\\.")[1]));
        return messageTemplate;
    }

    /**
     * Search the property
     * @param license
     * @param propertyId
     * @param requestInfo
     * @return returns the property
     */
    public Property getPropertyDetails(TradeLicense license, String propertyId, RequestInfo requestInfo) {
        Property property = new Property();
        String url = tradeUtil.getPropertySearchURL();
        url = url.replace("{1}", license.getTenantId()).replace("{2}", propertyId);
        log.info("url to fetch property owner name" + url);
        try {
            HashMap<String, Object> result = (HashMap<String, Object>) serviceRequestRepository.fetchResult(new StringBuilder(url),
                    RequestInfoWrapper.builder().requestInfo(requestInfo).build());
            if(null != result && null != JsonPath.read(result, PROPERTY_JSON_KEY)) {
                List<Property> properties = JsonPath.read(result, PROPERTY_JSON_KEY);
                property = mapper.convertValue(properties.get(0), Property.class);
            } else {
                throw new CustomException("INVALID PROPERTY", " The propertyId " + license.getPropertyId() + " does not exist");
            }
        } catch (Exception e) {
            throw new CustomException("INVALID PROPERTY", " Failed to parse the response from property search on id " + license.getPropertyId());
        }
        return property;
    }

    /**
     * Creates email request for property owners
     * @param requestInfo
     * @param message
     * @param mapOfPhnoAndEmail
     * @param property
     * @return returns the email request
     */
    public Collection<? extends EmailRequest> createPropertyEmailRequest(RequestInfo requestInfo, String message, Map<String, String> mapOfPhnoAndEmail, Property property) {

        List<EmailRequest> emailRequest = new LinkedList<>();
        property.getOwners().forEach(owner -> {
            if (owner.getMobileNumber() != null)
                mapOfPhnoAndEmail.put(owner.getMobileNumber(), owner.getEmailId());
        });
        for (Map.Entry<String, String> entryset : mapOfPhnoAndEmail.entrySet()) {
            String customizedMsg = message.replace("{PROPERTY_OWNER_NAME}", property.getOwners().get(0).getName());
            customizedMsg = customizedMsg.replace("{MOBILE_NUMBER}",entryset.getKey());

            String subject = customizedMsg.substring(customizedMsg.indexOf("<h2>")+4,customizedMsg.indexOf("</h2>"));
            String body = customizedMsg.substring(customizedMsg.indexOf("</h2>")+5);
            Email emailobj = Email.builder().emailTo(Collections.singleton(entryset.getValue())).isHTML(true).body(body).subject(subject).build();
            EmailRequest email = new EmailRequest(requestInfo,emailobj);
            emailRequest.add(email);
        }
        return emailRequest;
    }

    /**
     * Creates and registers an event at the egov-user-event service at defined trigger points as that of sms notifs.
     * @param property
     * @param message
     * @param request
     * @return returns event request with messages
     */
    public EventRequest getEventsForPropertyOwner(Property property, String message, TradeLicenseRequest request) {
        if (message == null)
            return null;
        List<Event> events = new ArrayList<>();
        Map<String, String> mobileNumberToOwner = new HashMap<>();
        property.getOwners().forEach(owner -> {
            if (owner.getMobileNumber() != null)
                mobileNumberToOwner.put(owner.getMobileNumber(), owner.getName());
        });

        List<SMSRequest> smsRequests = util.createSMSRequest(message, mobileNumberToOwner);
        Set<String> mobileNumbers = smsRequests.stream().map(SMSRequest::getMobileNumber).collect(Collectors.toSet());
        Map<String, String> mapOfPhnoAndUUIDs = util.fetchUserUUIDs(mobileNumbers, request.getRequestInfo(), request.getLicenses().get(0).getTenantId());
        if (CollectionUtils.isEmpty(mapOfPhnoAndUUIDs.keySet())) {
            log.info("UUID search failed!");
            return null;
        }
        Map<String, String> mobileNumberToMsg = smsRequests.stream().collect(Collectors.toMap(SMSRequest::getMobileNumber, SMSRequest::getMessage));
        for (String mobile : mobileNumbers) {
            if (null == mapOfPhnoAndUUIDs.get(mobile) || null == mobileNumberToMsg.get(mobile)) {
                log.error("No UUID/SMS for mobile {} skipping event", mobile);
                continue;
            }
            List<String> toUsers = new ArrayList<>();
            toUsers.add(mapOfPhnoAndUUIDs.get(mobile));
            Recepient recepient = Recepient.builder().toUsers(toUsers).toRoles(null).build();
            List<String> payTriggerList = Arrays.asList(config.getPayTriggers().split("[,]"));
            Action action = null;
            events.add(Event.builder().tenantId(request.getLicenses().get(0).getTenantId()).description(mobileNumberToMsg.get(mobile))
                    .eventType(TLConstants.USREVENTS_EVENT_TYPE).name(USREVENTS_EVENT_NAME)
                    .postedBy(TLConstants.USREVENTS_EVENT_POSTEDBY).source(Source.WEBAPP).recepient(recepient)
                    .eventDetails(null).actions(action).build());
        }
        if (!CollectionUtils.isEmpty(events))
            return EventRequest.builder().requestInfo(request.getRequestInfo()).events(events).build();
        return null;
    }

    /**
     * Creates SMS request for property owners
     * @param message
     * @param property
     * @return returns list of sms requests
     */
    public List<SMSRequest> createPropertySMSRequest(String message, Property property) {
        List<SMSRequest> smsRequest = new LinkedList<>();
        Map<String,String > mobileNumberToOwner = new HashMap<>();
        property.getOwners().forEach(owner -> {
            if(owner.getMobileNumber()!=null)
                mobileNumberToOwner.put(owner.getMobileNumber(),owner.getName());
        });
        for (Map.Entry<String, String> entryset : mobileNumberToOwner.entrySet()) {
            String customizedMsg = message.replace(NOTIF_PROPERTY_OWNER_NAME_KEY, entryset.getValue());
            smsRequest.add(new SMSRequest(entryset.getKey(), customizedMsg));
        }
        return smsRequest;
    }
}
