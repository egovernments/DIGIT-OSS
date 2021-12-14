package org.egov.egovdocumentuploader.service;

import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import net.logstash.logback.encoder.org.apache.commons.lang.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.egovdocumentuploader.config.ApplicationProperties;
import org.egov.egovdocumentuploader.producer.Producer;
import org.egov.egovdocumentuploader.web.models.*;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import java.util.*;

import static org.egov.egovdocumentuploader.utils.DocumentUploaderConstants.*;

@Slf4j
@Service
public class NotificationService {

    @Autowired
    private Producer producer;

    @Autowired
    private ApplicationProperties applicationProperties;

    @Autowired
    private RestTemplate restTemplate;

    public void prepareEventAndSend(DocumentRequest request){
        // Prepare link to view document
        String tenantId = request.getDocumentEntity().getTenantId();
        StringBuilder link = new StringBuilder(applicationProperties.getNotificationUiHost());
        link.append(applicationProperties.getNotificationEndpoint());
        String customizedLink = getCustomDocumentViewLink(link.toString(), request.getDocumentEntity());
        String shortenedLinkForDescription = getShortenedUrl(customizedLink);
        String messageTemplate = fetchContentFromLocalization(request.getRequestInfo(), tenantId, "rainmaker-common", "DU_DOCUMENT_UPLOAD_NOTIFICATION_TEMPLATE");
        messageTemplate = messageTemplate.replace("{document_name}", request.getDocumentEntity().getName());
        messageTemplate = messageTemplate.replace("{link}", shortenedLinkForDescription);
        Action action = null;

        List<ActionItem> items = new ArrayList<>();
        ActionItem documentItem = ActionItem.builder().actionUrl(customizedLink).code(applicationProperties.getDocumentActionCode()).build();
        items.add(documentItem);

        action = Action.builder().actionUrls(items).build();

        List<Event> events = Collections.singletonList(Event.builder()
                                                            .tenantId(request.getDocumentEntity().getTenantId())
                                                            .name("New Document")
                                                            .source("WEBAPP")
                                                            .eventType("SYSTEMGENERATED")
                                                            .description(messageTemplate)
                                                            .actions(action)
                                                            .build());
        log.info(events.toString());
        producer.push("persist-user-events-async", new EventRequest(request.getRequestInfo(), events));
    }

    private String getCustomDocumentViewLink(String link, DocumentEntity documentEntity) {
        link = link.replace("{APPNUMBER}", documentEntity.getUuid());
        link = link.replace("{TENANTID}", documentEntity.getTenantId());
        return link;
    }

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

    private String getShortenedUrl(String url){

        HashMap<String,String> body = new HashMap<>();
        body.put("url",url);
        StringBuilder builder = new StringBuilder(applicationProperties.getUrlShortnerHost());
        builder.append(applicationProperties.getUrlShortnerEndpoint());
        String res = restTemplate.postForObject(builder.toString(), body, String.class);

        if(StringUtils.isEmpty(res)){
            log.error("URL_SHORTENING_ERROR", "Unable to shorten url: " + url); ;
            return url;
        }
        else return res;
    }

}
