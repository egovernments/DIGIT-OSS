package org.egov.tl.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tl.config.TLConfiguration;
import org.egov.tl.repository.ServiceRequestRepository;
import org.egov.tl.web.models.*;
import org.egov.tl.web.models.property.Property;
import org.egov.tracer.model.CustomException;
import org.json.JSONObject;
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

    @Autowired
    public PropertyUtil(ServiceRequestRepository serviceRequestRepository, NotificationUtil util, ObjectMapper mapper, TLConfiguration config) {
        this.util = util;
        this.serviceRequestRepository = serviceRequestRepository;
        this.mapper = mapper;
        this.config = config;
    }

    public String getPropertySearchMsg(TradeLicense license, String localizationMessages, String channel, String propertyId, String source) {
        String messageTemplate = "";
        if(channel.equals(CHANNEL_NAME_EMAIL)) {
            if(source == "TL"){
                messageTemplate = util.getMessageTemplate(NOTIFICATION_PROPERTY_CREATED + ".email", localizationMessages);
                if(license.getTradeLicenseDetail().getOwners().get(0).getGender().equals("Male")) {
                    messageTemplate = messageTemplate.replace(NOTIF_OWNER_NAME_KEY, "Mr. " + license.getTradeLicenseDetail().getOwners().get(0).getName());
                } else {
                    messageTemplate = messageTemplate.replace(NOTIF_OWNER_NAME_KEY, "Ms. " + license.getTradeLicenseDetail().getOwners().get(0).getName());
                }
            } else {
                messageTemplate = util.getMessageTemplate(TLConstants.NOTIFICATION_PROPERTY_TAGGED + ".email", localizationMessages);
                messageTemplate = messageTemplate.replace(NOTIF_OWNER_NAME_KEY, license.getTradeLicenseDetail().getOwners().get(0).getName());
            }
        } else {
            if(source == "TL"){
                messageTemplate = util.getMessageTemplate(TLConstants.NOTIFICATION_PROPERTY_CREATED, localizationMessages);
                if(license.getTradeLicenseDetail().getOwners().get(0).getGender().equals("Male")) {
                    messageTemplate = messageTemplate.replace(NOTIF_OWNER_NAME_KEY, "Mr. " + license.getTradeLicenseDetail().getOwners().get(0).getName());
                } else {
                    messageTemplate = messageTemplate.replace(NOTIF_OWNER_NAME_KEY, "Ms. " + license.getTradeLicenseDetail().getOwners().get(0).getName());
                }
            } else {
                messageTemplate = util.getMessageTemplate(TLConstants.NOTIFICATION_PROPERTY_TAGGED, localizationMessages);
                messageTemplate = messageTemplate.replace(NOTIF_OWNER_NAME_KEY, license.getTradeLicenseDetail().getOwners().get(0).getName());
            }
        }
        messageTemplate = messageTemplate.replace(NOTIF_TRADE_NAME_KEY, license.getTradeName());
        messageTemplate = messageTemplate.replace("{PROPERTY_ID}", propertyId.substring(2,18)+"****");
        messageTemplate = messageTemplate.replace(NOTIF_TRADE_LICENSENUMBER_KEY, license.getApplicationNumber());

        messageTemplate = messageTemplate.replace("XYZ", capitalize(license.getTenantId().split("\\.")[1]));
        return messageTemplate;
    }

    public Property getPropertyDetails(TradeLicense license, String propertyId, RequestInfo requestInfo) {
        String ownerName = "";
        Property property = new Property();
        OwnerInfo ownerInfo = new OwnerInfo();
        List<OwnerInfo> ownerList = new ArrayList<>();
        String url = getPropertySearchURL();
        url = url.replace("{1}", license.getTenantId());
        url = url.replace("{2}", propertyId);
        log.info("url to fetch property owner name" + url);
        try {
            Object obj = serviceRequestRepository.fetchResult(new StringBuilder(url),
                    RequestInfoWrapper.builder().requestInfo(requestInfo).build());
            HashMap<String, Object> result = (HashMap<String, Object>) obj;
            String jsonString = new JSONObject(result).toString();
            log.info("property result "+jsonString);
            DocumentContext documentContext = JsonPath.parse(jsonString);
            Map<String, Object> propertyMap = documentContext.read("$.Properties[0]");
            property = mapper.convertValue(propertyMap, Property.class);
        } catch (Exception e) {
            e.printStackTrace();
            throw new CustomException("INVALID PROPERTY", " Failed to parse the response from property search on id " + license.getPropertyId());
        }
        return property;
    }

    public String getPropertySearchURL(){
        StringBuilder url = new StringBuilder(config.getPropertyServiceHost());
        url.append(config.getPropertyServiceContextPath());
        url.append(config.getPropertyServiceSearchEndpoint());
        url.append("?");
        url.append("tenantId=");
        url.append("{1}");
        url.append("&");
        url.append("propertyIds=");
        url.append("{2}");
        return url.toString();
    }

    public Collection<? extends EmailRequest> createPropertyEmailRequest(RequestInfo requestInfo, String message, Map<String, String> mapOfPhnoAndEmail) {

        List<EmailRequest> emailRequest = new LinkedList<>();
        for (Map.Entry<String, String> entryset : mapOfPhnoAndEmail.entrySet()) {
            String customizedMsg = message.replace("{PROPERTY_OWNER_NAME}",entryset.getValue());
            customizedMsg = customizedMsg.replace("{MOBILE_NUMBER}",entryset.getKey());

            String subject = customizedMsg.substring(customizedMsg.indexOf("<h2>")+4,customizedMsg.indexOf("</h2>"));
            String body = customizedMsg.substring(customizedMsg.indexOf("</h2>")+4);
            Email emailobj = Email.builder().emailTo(Collections.singleton(entryset.getValue())).isHTML(true).body(body).subject(subject).build();
            EmailRequest email = new EmailRequest(requestInfo,emailobj);
            emailRequest.add(email);
        }
        return emailRequest;
    }

    public EventRequest getEventsForPropertyOwner(Property property, boolean b, String message, String receiptno, String usreventsEventName, TradeLicenseRequest request) {
        if(message == null)
            return null;
        List<Event> events = new ArrayList<>();
        Map<String,String > mobileNumberToOwner = new HashMap<>();
        property.getOwners().forEach(owner -> {
            if(owner.getMobileNumber()!=null)
                mobileNumberToOwner.put(owner.getMobileNumber(),owner.getName());
        });

        List<SMSRequest> smsRequests = util.createSMSRequest(message, mobileNumberToOwner);
        Set<String> mobileNumbers = smsRequests.stream().map(SMSRequest :: getMobileNumber).collect(Collectors.toSet());
        Map<String, String> mapOfPhnoAndUUIDs = util.fetchUserUUIDs(mobileNumbers, request.getRequestInfo(), request.getLicenses().get(0).getTenantId());
        if (CollectionUtils.isEmpty(mapOfPhnoAndUUIDs.keySet())) {
            log.info("UUID search failed!");
            return null;
        }
        Map<String,String > mobileNumberToMsg = smsRequests.stream().collect(Collectors.toMap(SMSRequest::getMobileNumber, SMSRequest::getMessage));
        for(String mobile: mobileNumbers) {
            if(null == mapOfPhnoAndUUIDs.get(mobile) || null == mobileNumberToMsg.get(mobile)) {
                log.error("No UUID/SMS for mobile {} skipping event", mobile);
                continue;
            }
            List<String> toUsers = new ArrayList<>();
            toUsers.add(mapOfPhnoAndUUIDs.get(mobile));
            Recepient recepient = Recepient.builder().toUsers(toUsers).toRoles(null).build();
            List<String> payTriggerList = Arrays.asList(config.getPayTriggers().split("[,]"));
            Action action = null;
            events.add(Event.builder().tenantId(request.getLicenses().get(0).getTenantId()).description(mobileNumberToMsg.get(mobile))
                    .eventType(BPAConstants.USREVENTS_EVENT_TYPE).name(USREVENTS_EVENT_NAME)
                    .postedBy(BPAConstants.USREVENTS_EVENT_POSTEDBY).source(Source.WEBAPP).recepient(recepient)
                    .eventDetails(null).actions(action).build());
        }
        if(!CollectionUtils.isEmpty(events)) {
            return EventRequest.builder().requestInfo(request.getRequestInfo()).events(events).build();
        }else {
            return null;
        }
    }

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
