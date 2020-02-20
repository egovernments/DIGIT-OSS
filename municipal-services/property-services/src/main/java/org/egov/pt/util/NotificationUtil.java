package org.egov.pt.util;


import static org.egov.pt.util.PTConstants.NOTIFICATION_LOCALE;
import static org.egov.pt.util.PTConstants.NOTIFICATION_MODULENAME;
import static org.egov.pt.util.PTConstants.NOTIFICATION_OWNERNAME;

import java.util.*;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.event.EventRequest;
import org.egov.pt.producer.Producer;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.web.contracts.SMSRequest;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class NotificationUtil {



    private ServiceRequestRepository serviceRequestRepository;

    private PropertyConfiguration config;

    private Producer producer;


    @Autowired
    public NotificationUtil(ServiceRequestRepository serviceRequestRepository, PropertyConfiguration config, Producer producer) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.config = config;
        this.producer = producer;
    }



    /**
     * Extracts message for the specific code
     *
     * @param notificationCode
     *            The code for which message is required
     * @param localizationMessage
     *            The localization messages
     * @return message for the specific code
     */
    public String getMessageTemplate(String notificationCode, String localizationMessage) {

        String path = "$..messages[?(@.code==\"{}\")].message";
        path = path.replace("{}", notificationCode);
        String message = null;
        try {
            Object messageObj = JsonPath.parse(localizationMessage).read(path);
            message = ((ArrayList<String>) messageObj).get(0);
        } catch (Exception e) {
            log.warn("Fetching from localization failed", e);
        }
        return message;
    }



    /**
     * Fetches messages from localization service
     *
     * @param tenantId
     *            tenantId of the PT
     * @param requestInfo
     *            The requestInfo of the request
     * @return Localization messages for the module
     */
    public String getLocalizationMessages(String tenantId, RequestInfo requestInfo) {
    	
        LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(getUri(tenantId, requestInfo),
                requestInfo).get();
        String jsonString = new JSONObject(responseMap).toString();
        return jsonString;
    }




    /**
     * Returns the uri for the localization call
     *
     * @param tenantId
     *            TenantId of the propertyRequest
     * @return The uri for localization search call
     */
    public StringBuilder getUri(String tenantId, RequestInfo requestInfo) {

        if (config.getIsLocalizationStateLevel())
            tenantId = tenantId.split("\\.")[0];

        String locale = NOTIFICATION_LOCALE;

        if (!StringUtils.isEmpty(requestInfo.getMsgId()) && requestInfo.getMsgId().split("\\|").length >= 2)
            locale = requestInfo.getMsgId().split("\\|")[1];

        StringBuilder uri = new StringBuilder();
        uri.append(config.getLocalizationHost()).append(config.getLocalizationContextPath())
                .append(config.getLocalizationSearchEndpoint()).append("?").append("locale=").append(locale)
                .append("&tenantId=").append(tenantId).append("&module=").append(NOTIFICATION_MODULENAME);

        return uri;
    }


    /**
     * Creates sms request for the each owners
     *
     * @param message
     *            The message for the specific tradeLicense
     * @param mobileNumberToOwnerName
     *            Map of mobileNumber to OwnerName
     * @return List of SMSRequest
     */
    public List<SMSRequest> createSMSRequest(String message, Map<String, String> mobileNumberToOwnerName) {
    	
        List<SMSRequest> smsRequest = new LinkedList<>();
        for (Map.Entry<String, String> entryset : mobileNumberToOwnerName.entrySet()) {
            String customizedMsg = message.replace(NOTIFICATION_OWNERNAME, entryset.getValue());
            smsRequest.add(new SMSRequest(entryset.getKey(), customizedMsg));
        }
        return smsRequest;
    }


    /**
     * Send the SMSRequest on the SMSNotification kafka topic
     *
     * @param smsRequestList
     *            The list of SMSRequest to be sent
     */
    public void sendSMS(List<SMSRequest> smsRequestList) {
        if (config.getIsSMSNotificationEnabled()) {
            if (CollectionUtils.isEmpty(smsRequestList))
                log.info("Messages from localization couldn't be fetched!");
            for (SMSRequest smsRequest : smsRequestList) {
                producer.push(config.getSmsNotifTopic(), smsRequest);
                log.info("MobileNumber: " + smsRequest.getMobileNumber() + " Messages: " + smsRequest.getMessage());
            }
        }
    }


    /**
     * Fetches UUIDs of CITIZENs based on the phone number.
     *
     * @param mobileNumbers
     * @param requestInfo
     * @param tenantId
     * @return
     */
    public Map<String, String> fetchUserUUIDs(Set<String> mobileNumbers, RequestInfo requestInfo, String tenantId) {
        Map<String, String> mapOfPhnoAndUUIDs = new HashMap<>();
        StringBuilder uri = new StringBuilder();
        uri.append(config.getUserHost()).append(config.getUserSearchEndpoint());
        Map<String, Object> userSearchRequest = new HashMap<>();
        userSearchRequest.put("RequestInfo", requestInfo);
        userSearchRequest.put("tenantId", tenantId);
        userSearchRequest.put("userType", "CITIZEN");
        for(String mobileNo: mobileNumbers) {
            userSearchRequest.put("userName", mobileNo);
            try {
                Object user = serviceRequestRepository.fetchResult(uri, userSearchRequest);
                if(null != user) {
                    String uuid = JsonPath.read(user, "$.user[0].uuid");
                    mapOfPhnoAndUUIDs.put(mobileNo, uuid);
                }else {
                    log.error("Service returned null while fetching user for username - "+mobileNo);
                }
            }catch(Exception e) {
                log.error("Exception while fetching user for username - "+mobileNo);
                log.error("Exception trace: ",e);
                continue;
            }
        }
        return mapOfPhnoAndUUIDs;
    }

    /**
     * Pushes the event request to Kafka Queue.
     *
     * @param request
     */
    public void sendEventNotification(EventRequest request) {
        producer.push(config.getSaveUserEventsTopic(), request);
    }



}
