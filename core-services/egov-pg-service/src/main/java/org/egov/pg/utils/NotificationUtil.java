package org.egov.pg.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pg.config.AppProperties;
import org.egov.pg.producer.Producer;
import org.egov.pg.repository.ServiceCallRepository;
import org.egov.pg.web.models.SMSRequest;
import org.egov.pg.web.models.TransactionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.util.*;

import static org.egov.pg.constants.PgConstants.NOTIFICATION_LOCALE;
import static org.egov.pg.constants.PgConstants.PG_NOTIFICATION;

@Component
@Slf4j
public class NotificationUtil {

    @Autowired
    private ServiceCallRepository serviceCallRepository;

    @Autowired
    private AppProperties appProperties;

    @Autowired
    private Producer producer;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private RestTemplate restTemplate;

    public String getLocalizationMessages(String tenantId, RequestInfo requestInfo, String module) {
        @SuppressWarnings("rawtypes")
        Optional<Object> responseMap = serviceCallRepository.fetchResult(getUri(tenantId, requestInfo, module),
                requestInfo);
        LinkedHashMap response = mapper.convertValue(responseMap.get(), LinkedHashMap.class);
        return new JSONObject(response).toString();
    }

    public String getUri(String tenantId, RequestInfo requestInfo, String module) {

        if (appProperties.getIsLocalizationStateLevel())
            tenantId = tenantId.split("\\.")[0];

        String locale = NOTIFICATION_LOCALE;
        if (!StringUtils.isEmpty(requestInfo.getMsgId()) && requestInfo.getMsgId().split("|").length >= 2)
            locale = requestInfo.getMsgId().split("\\|")[1];
        StringBuilder uri = new StringBuilder();
        uri.append(appProperties.getLocalizationHost()).append(appProperties.getLocalizationContextPath())
                .append(appProperties.getLocalizationSearchEndpoint()).append("?").append("locale=").append(locale)
                .append("&tenantId=").append(tenantId).append("&module=").append(module);

        return uri.toString();
    }

    public String getCustomizedMsg(String txnStatus, String localizationMessage) {
        StringBuilder notificationCode = new StringBuilder();
        notificationCode.append(PG_NOTIFICATION).append("_").append(txnStatus);
        String path = "$..messages[?(@.code==\"{}\")].message";
        path = path.replace("{}", notificationCode);
        String message = null;
        try {
            ArrayList<String> messageObj = (ArrayList<String>) JsonPath.parse(localizationMessage).read(path);
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
        if (appProperties.getIsSMSEnable()) {
            if (CollectionUtils.isEmpty(smsRequestList)) {
                log.info("Messages from localization couldn't be fetched!");
                return;
            }
            for (SMSRequest smsRequest : smsRequestList) {
                producer.push(appProperties.getSmsNotifTopic(), smsRequest);
                log.info("Messages: " + smsRequest.getMessage());
            }
        }
    }

    public String getShortnerURL(String actualURL) {
        HashMap<String,String> body = new HashMap<>();
        body.put("url",actualURL);
        StringBuilder builder = new StringBuilder(appProperties.getUrlShortnerHost());
        builder.append(appProperties.getUrlShortnerEndpoint());
        String res = restTemplate.postForObject(builder.toString(), body, String.class);

        if(StringUtils.isEmpty(res)){
            log.error("URL_SHORTENING_ERROR","Unable to shorten url: "+actualURL); ;
            return actualURL;
        }
        else return res;
    }

    public String getBusinessService(TransactionRequest transactionRequest){
        StringBuilder uri = new StringBuilder();
        uri.append(appProperties.getBillingServiceHost()).append(appProperties.getBillingServiceSearchEndpoint())
                .append("?").append("tenantId=").append(transactionRequest.getTransaction().getTenantId())
                .append("&billId=").append(transactionRequest.getTransaction().getBillId());

        Optional<Object> response =  serviceCallRepository.fetchResult(uri.toString(), transactionRequest.getRequestInfo());

        LinkedHashMap responseMap = mapper.convertValue(response.get(), LinkedHashMap.class);

        String billResponse = new JSONObject(responseMap).toString();

        String path = "$..Bill[0].businessService";
        String service = null;
        try {
            ArrayList<String> serviceObj = (ArrayList<String>) JsonPath.parse(billResponse).read(path);
            if(serviceObj != null && serviceObj.size() > 0) {
                service = serviceObj.get(0);
            }
        } catch (Exception e) {
            log.warn("Fetching from localization failed", e);
        }
        return service;
    }
}
