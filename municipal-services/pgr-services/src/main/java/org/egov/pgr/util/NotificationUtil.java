package org.egov.pgr.util;

import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pgr.config.PGRConfiguration;
import org.egov.pgr.producer.Producer;
import org.egov.pgr.repository.ServiceRequestRepository;
import org.egov.pgr.web.models.Notification.EventRequest;
import org.egov.pgr.web.models.Notification.SMSRequest;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import static org.egov.pgr.util.PGRConstants.*;

@Component
@Slf4j
public class NotificationUtil {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private PGRConfiguration config;

    @Autowired
    private Producer producer;

    @Autowired
    private RestTemplate restTemplate;

    /**
     *
     * @param tenantId Tenant ID
     * @param requestInfo Request Info object
     * @param module Module name
     * @return Return Localisation Message
     */
    public String getLocalizationMessages(String tenantId, RequestInfo requestInfo,String module) {
        @SuppressWarnings("rawtypes")
        LinkedHashMap responseMap = (LinkedHashMap) serviceRequestRepository.fetchResult(getUri(tenantId, requestInfo, module),
                requestInfo);
        return new JSONObject(responseMap).toString();
    }

    /**
     *
     * @param tenantId Tenant ID
     * @param requestInfo Request Info object
     * @param module Module name
     * @return Return uri
     */
    public StringBuilder getUri(String tenantId, RequestInfo requestInfo, String module) {

        if (config.getIsLocalizationStateLevel())
            tenantId = tenantId.split("\\.")[0];

        String locale = NOTIFICATION_LOCALE;
        if (!StringUtils.isEmpty(requestInfo.getMsgId()) && requestInfo.getMsgId().split("|").length >= 2)
            locale = requestInfo.getMsgId().split("\\|")[1];
        StringBuilder uri = new StringBuilder();
        uri.append(config.getLocalizationHost()).append(config.getLocalizationContextPath())
                .append(config.getLocalizationSearchEndpoint()).append("?").append("locale=").append(locale)
                .append("&tenantId=").append(tenantId).append("&module=").append(module);

        return uri;
    }

    /**
     *
     * @param action Action
     * @param applicationStatus Application Status
     * @param roles CITIZEN or EMPLOYEE
     * @param localizationMessage Localisation Message
     * @return Return Customized Message based on localisation code
     */
    public String getCustomizedMsg(String action, String applicationStatus, String roles, String localizationMessage) {
        StringBuilder notificationCode = new StringBuilder();

        notificationCode.append("PGR_").append(roles.toUpperCase()).append("_").append(action.toUpperCase()).append("_").append(applicationStatus.toUpperCase()).append("_SMS_MESSAGE");

        String path = "$..messages[?(@.code==\"{}\")].message";
        path = path.replace("{}", notificationCode);
        String message = null;
        try {
            ArrayList<String> messageObj = JsonPath.parse(localizationMessage).read(path);
            if(messageObj != null && messageObj.size() > 0) {
                message = messageObj.get(0);
            }
        } catch (Exception e) {
            log.warn("Fetching from localization failed", e);
        }

        return message;
    }

    /**
     *
     * @param roles EMPLOYEE or CITIZEN
     * @param localizationMessage Localisation Message
     * @return Return localisation message based on default code
     */
    public String getDefaultMsg(String roles, String localizationMessage) {
        StringBuilder notificationCode = new StringBuilder();

        notificationCode.append("PGR_").append("DEFAULT_").append(roles.toUpperCase()).append("_SMS_MESSAGE");

        String path = "$..messages[?(@.code==\"{}\")].message";
        path = path.replace("{}", notificationCode);
        String message = null;
        try {
            ArrayList<String> messageObj = JsonPath.parse(localizationMessage).read(path);
            if(messageObj != null && messageObj.size() > 0) {
                message = messageObj.get(0);
            }
        } catch (Exception e) {
            log.warn("Fetching from localization failed", e);
        }

        return message;
    }

    /**
     * Send the SMSRequest on the SMSNotification kafka topic
     * @param smsRequestList The list of SMSRequest to be sent
     */
    public void sendSMS(List<SMSRequest> smsRequestList) {
        if (config.getIsSMSEnabled()) {
            if (CollectionUtils.isEmpty(smsRequestList)) {
                log.info("Messages from localization couldn't be fetched!");
                return;
            }
            for (SMSRequest smsRequest : smsRequestList) {
                producer.push(config.getSmsNotifTopic(), smsRequest);
                log.info("Messages: " + smsRequest.getMessage());
            }
        }
    }

    /**
     * Pushes the event request to Kafka Queue.
     *
     * @param request EventRequest Object
     */
    public void sendEventNotification(EventRequest request) {
        producer.push(config.getSaveUserEventsTopic(), request);
    }

    /**
     *
     * @param actualURL Actual URL
     * @return Shortened URL
     */
    public String getShortnerURL(String actualURL) {
        HashMap<String,String> body = new HashMap<>();
        body.put("url",actualURL);
        StringBuilder builder = new StringBuilder(config.getUrlShortnerHost());
        builder.append(config.getUrlShortnerEndpoint());
        String res = restTemplate.postForObject(builder.toString(), body, String.class);

        if(StringUtils.isEmpty(res)){
            log.error("URL_SHORTENING_ERROR","Unable to shorten url: "+actualURL); ;
            return actualURL;
        }
        else return res;
    }

    /**
     *
     * @param localizationMessage Localisation Code
     * @param notificationCode Notification Code
     * @return Return Customized Message
     */
    public String getCustomizedMsgForPlaceholder(String localizationMessage,String notificationCode) {
        String path = "$..messages[?(@.code==\"{}\")].message";
        path = path.replace("{}", notificationCode);
        String message = null;
        try {
            ArrayList<String> messageObj = (ArrayList<String>) JsonPath.parse(localizationMessage).read(path);
            if(messageObj != null && messageObj.size() > 0) {
                message = messageObj.get(0);
            }
        } catch (Exception e) {
            log.warn("Fetching from localization for placeholder failed", e);
        }
        return message;
    }

}
