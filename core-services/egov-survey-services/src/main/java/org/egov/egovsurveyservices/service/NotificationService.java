package org.egov.egovsurveyservices.service;

import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import net.logstash.logback.encoder.org.apache.commons.lang.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.egovsurveyservices.config.ApplicationProperties;
import org.egov.egovsurveyservices.producer.Producer;
import org.egov.egovsurveyservices.web.models.*;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;
import org.egov.egovsurveyservices.utils.SurveyServiceConstants.*;
import java.util.*;

import static org.egov.egovsurveyservices.utils.SurveyServiceConstants.*;


@Slf4j
@Service
public class NotificationService {

    @Autowired
    private Producer producer;

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    private RestTemplate restTemplate;

    /**
     * Prepares event notifications and pushes to event-notification topic
     * @param request Request object containing details of survey
     */
    public void prepareEventAndSend(SurveyRequest request){
        // Prepare link to view document
        String tenantId = request.getSurveyEntity().getTenantId();
        StringBuilder link = new StringBuilder(applicationProperties.getNotificationUiHost());
        link.append(applicationProperties.getNotificationEndpoint());
        String customizedLink = getCustomSurveyViewLink(link.toString(), request.getSurveyEntity());
        String messageTemplate = fetchContentFromLocalization(request.getRequestInfo(), tenantId,LOCALIZATION_MODULE , LOCALIZATION_CODE);
        messageTemplate = messageTemplate.replace(SURVEY_TITLE, request.getSurveyEntity().getTitle());

        Action action = null;

        List<ActionItem> items = new ArrayList<>();
        ActionItem documentItem = ActionItem.builder().actionUrl(customizedLink).code(applicationProperties.getSurveyActionCode()).build();
        items.add(documentItem);

        action = Action.builder().actionUrls(items).build();

        List<Event> events = Collections.singletonList(Event.builder()
                .tenantId(request.getSurveyEntity().getTenantId())
                .name(NEW_SURVEY)
                .source(WEBAPP)
                .eventType(SYSTEMGENERATED)
                .description(messageTemplate)
                .actions(action)
                .build());
        log.info(events.toString());
        producer.push(applicationProperties.getUserEventTopic(), new EventRequest(request.getRequestInfo(), events));
    }

    /**
     * Forms survey view link for notifications
     * @param link link with placeholders
     * @param surveyEntity object containing details of survey to be validated
     * @return link with replaced information
     */
    private String getCustomSurveyViewLink(String link, SurveyEntity surveyEntity) {
        link = link.replace(APPLICATION_NUMBER_PLACEHOLDER, surveyEntity.getUuid());
        link = link.replace(TENANTID_PLACEHOLDER, surveyEntity.getTenantId());
        return link;
    }

    /**
     * Fetches messages from localization service
     *
     * @param tenantId tenantId of the BPA
     * @param requestInfo The requestInfo of the request
     * @return Localization messages for the module
     */
    private String fetchContentFromLocalization(RequestInfo requestInfo, String tenantId, String module, String code){
        String message = null;
        List<String> codes = new ArrayList<>();
        List<String> messages = new ArrayList<>();
        Object result = null;
        String locale = "";
        if(requestInfo.getMsgId().contains("|"))
            locale = requestInfo.getMsgId().split("[\\|]")[1];
        if(StringUtils.isEmpty(locale))
            locale = applicationProperties.getFallBackLocale();
        StringBuilder uri = new StringBuilder();
        uri.append(applicationProperties.getLocalizationHost()).append(applicationProperties.getLocalizationEndpoint());
        uri.append("?tenantId=").append(tenantId.split("\\.")[0]).append("&locale=").append(locale).append("&module=").append(module);

        Map<String, Object> request = new HashMap<>();
        request.put("RequestInfo", requestInfo);
        try {
            result = restTemplate.postForObject(uri.toString(), request, Map.class);
            codes = JsonPath.read(result, LOCALIZATION_CODES_JSONPATH);
            messages = JsonPath.read(result, LOCALIZATION_MSGS_JSONPATH);
        } catch (Exception e) {
            log.error("Exception while fetching from localization: " + e);
        }
        if(CollectionUtils.isEmpty(messages)){
            throw new CustomException("LOCALIZATION_NOT_FOUND", "Localization not found for the code: " + code);
        }
        for(int index = 0; index < codes.size(); index++){
            if(codes.get(index).equals(code)){
                message = messages.get(index);
            }
        }
        return message;
    }

}
