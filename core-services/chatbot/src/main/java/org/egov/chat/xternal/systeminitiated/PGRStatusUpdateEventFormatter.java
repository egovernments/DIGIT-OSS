package org.egov.chat.xternal.systeminitiated;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.Produced;
import org.egov.chat.config.KafkaStreamsConfig;
import org.egov.chat.post.systeminitiated.SystemInitiatedEventFormatter;
import org.egov.chat.util.LocalizationService;
import org.egov.chat.util.URLShorteningSevice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Properties;

import static org.egov.chat.util.ChatBotConstants.*;

@Slf4j
@Component
public class PGRStatusUpdateEventFormatter implements SystemInitiatedEventFormatter {

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private KafkaStreamsConfig kafkaStreamsConfig;
    @Autowired
    private LocalizationService localizationService;
    @Autowired
    private URLShorteningSevice urlShorteningSevice;

    private String complaintCategoryLocalizationPrefix = "pgr.complaint.category.";

    private String citizenKeywordLocalization = "chatbot.template.citizen";

    @Value("${state.level.tenant.id}")
    private String stateLevelTenantId;
    @Value("${egov.external.host}")
    private String egovExternalHost;

    @Value("${user.service.host}")
    private String userServiceHost;
    @Value("${user.service.search.path}")
    private String userServiceSearchPath;

    @Value("${valuefirst.whatsapp.number}")
    private String sourceWhatsAppNumber;

    @Value("${pgr.service.host}")
    private String pgrServiceHost;
    @Value("${pgr.service.search.path}")
    private String pgrServiceSearchPath;

    private String userServiceSearchRequest = "{\"RequestInfo\":{},\"tenantId\":\"\",\"uuid\":[\"\"]}";

    @Value("${valuefirst.notification.rejected.templateid}")
    private String rejectTemplateId;

    @Value("${valuefirst.notification.reassigned.templateid}")
    private String reassignAssignedTemplateId;

    @Value("${valuefirst.notification.assigned.templateid}")
    private String assignedCitizenTemplateId;

    @Value("${valuefirst.notification.commented.templateid}")
    private String commentTemplateId;

    @Value("${valuefirst.notification.resolved.templateid}")
    private String resolvedTemplateId;

    @Override
    public String getStreamName() {
        return "pgr-update-requestformatter";
    }

    @Override
    public void startStream(String inputTopic, String outputTopic) {
        Properties streamConfiguration = kafkaStreamsConfig.getDefaultStreamConfiguration();
        streamConfiguration.put(StreamsConfig.APPLICATION_ID_CONFIG, getStreamName());
        StreamsBuilder builder = new StreamsBuilder();
        KStream<String, JsonNode> messagesKStream = builder.stream(inputTopic, Consumed.with(Serdes.String(),
                kafkaStreamsConfig.getJsonSerde()));

        messagesKStream.flatMapValues(event -> {
            try {
                return createChatNodes(event);
            } catch (Exception e) {
                log.error("error in PGR status update", e);
                return Collections.emptyList();
            }
        }).to(outputTopic, Produced.with(Serdes.String(), kafkaStreamsConfig.getJsonSerde()));

        kafkaStreamsConfig.startStream(builder, streamConfiguration);

    }

    @Override
    public List<JsonNode> createChatNodes(JsonNode event) throws Exception {
        List<JsonNode> chatNodes = new ArrayList<>();
            String source = event.at(SERVICESOURCE_PATH).asText();
            if ((source != null) && source.equals(SOURCE_WHATSAPP)) {
                String status = event.at(SERVICE_APPLICATIONSTATUS_PATH).asText();
                String action = event.at(WORKFLOW_ACTION_PATH).asText();
                String comments = event.at(WORKFLOW_COMMENTS_PATH).asText();
                String citizenName = event.at(SERVICE_CITIZENNAME_PATH).asText();
                String mobileNumber = event.at(SERVICE_CITIZEN_MOBILENO_PATH).asText();
                if (StringUtils.isEmpty(citizenName) || StringUtils.equalsIgnoreCase(citizenName,"null"))
                    citizenName = localizationService.getMessageForCode(citizenKeywordLocalization);
                ObjectNode userChatNodeForStatusUpdate = createChatNodeForUser(event);
                if(StringUtils.isEmpty(status) && StringUtils.isEmpty(action) && !StringUtils.isEmpty(comments)) {
                    ObjectNode userChatNodeForComment = userChatNodeForStatusUpdate.deepCopy();
                    userChatNodeForComment.set("extraInfo", createResponseForComment(event, comments, citizenName));
                    chatNodes.add(userChatNodeForComment);
                }
                JsonNode extraInfo = null;
                if (status != null) {
                    if (status.equalsIgnoreCase(STATUS_REJECTED)) {
                        extraInfo = responseForRejectedStatus(event, comments, citizenName);
                    } else if ((action + "-" + status).equalsIgnoreCase(REASSIGN_ASSIGNED)) {
                        extraInfo = responseForReassignedtatus(event, citizenName, mobileNumber);
                    } else if (status.equalsIgnoreCase(STATUS_PENDINGATLME)) {
                        if(action.equalsIgnoreCase(STATUS_REASSIGN)){
                            extraInfo = responseForReassignedtatus(event, citizenName, mobileNumber);
                        }
                        else{
                            extraInfo = responseForAssignedStatus(event, citizenName, mobileNumber);
                        }

                    } else if (status.equalsIgnoreCase(STATUS_RESOLVED)) {
                        extraInfo = responseForResolvedStatus(event, citizenName, mobileNumber);
                    }
                }
                if (extraInfo != null) {
                    userChatNodeForStatusUpdate.set("extraInfo", extraInfo);
                    chatNodes.add(userChatNodeForStatusUpdate);
                }
            }

        return chatNodes;
    }

    private ObjectNode createChatNodeForUser(JsonNode event) throws Exception {
        String mobileNumber = event.at(SERVICE_CITIZEN_MOBILENO_PATH).asText();
        String uuid = event.at(SERVICE_CITIZEN_UUID_PATH).asText();
        ObjectNode chatNode = objectMapper.createObjectNode();
        chatNode.put("tenantId", stateLevelTenantId);
        ObjectNode user = objectMapper.createObjectNode();
        user.put("mobileNumber", mobileNumber);
        user.put("userId", uuid);
        chatNode.set("user", user);
        ObjectNode extraInfo = objectMapper.createObjectNode();
        extraInfo.put("recipient", sourceWhatsAppNumber);
        chatNode.set("extraInfo", extraInfo);
        return chatNode;
    }

    // TODO : Here only single image is being added
//    private void addImageToChatNodeForAssignee(JsonNode complaintDetails, JsonNode chatNode) {
//        ArrayNode actionHistory = (ArrayNode) complaintDetails.at("/actionHistory/0/actions");
//        for(JsonNode action : actionHistory) {
//            if(action.get("action").asText().equalsIgnoreCase("open")) {
//                ArrayNode media = (ArrayNode) action.get("media");
//                if(media.size() > 0) {
//                    log.debug("Link to media file : " + media.get(0).asText());
//                    ObjectNode response = (ObjectNode) chatNode.get("response");
//                    response.put("type", "attachment");
//                    ObjectNode attachment = objectMapper.createObjectNode();
//                    attachment.put("fileStoreId", media.get(0).asText());
//                    response.set("attachment", attachment);
//                    return;
//                }
//            }
//        }
//        log.debug("No image found for assignee");
//    }
//
//    private void addImageWhenResolved(JsonNode event, JsonNode chatNode) {
//        ArrayNode actionHistory = (ArrayNode) event.at("/actionInfo");
//        for(JsonNode action : actionHistory) {
//            if(action.get("action").asText().equalsIgnoreCase("resolve")) {
//                ArrayNode media = (ArrayNode) action.get("media");
//                if(media.size() > 0) {
//                    log.debug("Link to media file : " + media.get(0).asText());
//                    ObjectNode response = (ObjectNode) chatNode.get("response");
//                    response.put("type", "attachment");
//                    ObjectNode attachment = objectMapper.createObjectNode();
//                    attachment.put("fileStoreId", media.get(0).asText());
//                    response.set("attachment", attachment);
//                    return;
//                }
//            }
//        }
//        log.debug("No image found when complaint is resolved");
//    }

//    private JsonNode getComplaintDetails(JsonNode event) throws IOException {
//        DocumentContext userInfo = JsonPath.parse(event.at("/RequestInfo/userInfo").toString());
//
//        log.debug("UserInfo : " + userInfo.jsonString());
//
//        DocumentContext documentContext = JsonPath.parse(complaintDetailsRequest);
//        documentContext.set("$.RequestInfo.userInfo", userInfo.json());
//        documentContext.set("$.RequestInfo.authToken", "3aa4ece6-cb71-4f61-8a87-9487783a30d2"); // TODO : remove
//
//        JsonNode request = objectMapper.readTree(documentContext.jsonString());
//
//        String serviceRequestId = event.at("/services/0/serviceRequestId").asText();
//        String tenantId = event.at("/services/0/tenantId").asText();
//
//        UriComponentsBuilder uriComponents = UriComponentsBuilder.fromUriString(pgrServiceHost + pgrServiceSearchPath);
//        uriComponents.queryParam("tenantId", tenantId);
//        uriComponents.queryParam("serviceRequestId", serviceRequestId);
//
//        ResponseEntity<ObjectNode> responseEntity = restTemplate.postForEntity(uriComponents.buildAndExpand().toUri(),
//                request, ObjectNode.class);
//
//        return responseEntity.getBody();
//    }


    private JsonNode createResponseForComment(JsonNode event, String comment, String citizenName) throws IOException {
        String serviceRequestId = event.at(SERVICEREQUESTID_PATH).asText();
        String serviceCode = event.at(SERVICECODE_PATH).asText();
        JsonNode assignee = getCommentor(event);
        String commentorName = assignee.at(NAME_PATH).asText();

        ObjectNode extraInfo = objectMapper.createObjectNode();
        ArrayNode params = objectMapper.createArrayNode();
        String complaintCategory = localizationService.getMessageForCode(complaintCategoryLocalizationPrefix + serviceCode);
        params.add(citizenName);
        params.add(commentorName);
        params.add(complaintCategory);
        params.add(serviceRequestId);
        params.add(comment);
        extraInfo.put("templateId", commentTemplateId);
        extraInfo.put("recipient", sourceWhatsAppNumber);
        extraInfo.set("params", params);
        return extraInfo;
    }

    private JsonNode responseForAssignedStatus(JsonNode event, String citizenName, String mobileNumber) throws IOException {
        String serviceRequestId = event.at(SERVICEREQUESTID_PATH).asText();
        String serviceCode = event.at(SERVICECODE_PATH).asText();
        JsonNode assignee = getAssignee(event);
        String assigneeName = assignee.at(NAME_PATH).asText();
        ObjectNode extraInfo = objectMapper.createObjectNode();
        ArrayNode params = objectMapper.createArrayNode();
        String complaintURL = makeCitizenURLForComplaint(serviceRequestId, mobileNumber);
        String complaintCategory = localizationService.getMessageForCode(complaintCategoryLocalizationPrefix + serviceCode);
        params.add(citizenName);
        params.add(complaintCategory);
        params.add(serviceRequestId);
        params.add(assigneeName);
        params.add(complaintURL);
        extraInfo.put("templateId", assignedCitizenTemplateId);
        extraInfo.put("recipient", sourceWhatsAppNumber);
        extraInfo.set("params", params);
        return extraInfo;
    }

    private JsonNode getAssignee(JsonNode event) throws IOException {
        String assigneeId = event.at(WORKFLOW_ASSIGNEE_PATH).asText();
        return searchUser(event, assigneeId);
    }

    private JsonNode getCommentor(JsonNode event) throws IOException {
        return getAssignee(event);
    }

    private JsonNode searchUser(JsonNode event, String userId) throws IOException {
        DocumentContext request = JsonPath.parse(userServiceSearchRequest);
        String tenantId = event.at(SERVICE_TENANTID_PATH).asText();
        request.set("$.tenantId", tenantId);
        request.set("$.uuid.[0]", userId);

        JsonNode requestObject = null;
        requestObject = objectMapper.readTree(request.jsonString());

        ResponseEntity<ObjectNode> response = restTemplate.postForEntity(userServiceHost + userServiceSearchPath,
                requestObject, ObjectNode.class);

        return response.getBody().at("/user/0");
    }

    private JsonNode responseForRejectedStatus(JsonNode event, String comments, String citizenName) {
        String rejectReason = comments.split(";")[0];
        String serviceRequestId = event.at(SERVICEREQUESTID_PATH).asText();
        String serviceCode = event.at(SERVICECODE_PATH).asText();
        ObjectNode extraInfo = objectMapper.createObjectNode();
        ArrayNode params = objectMapper.createArrayNode();
        String complaintCategory = localizationService.getMessageForCode(complaintCategoryLocalizationPrefix + serviceCode);
        params.add(citizenName);
        params.add(complaintCategory);
        params.add(serviceRequestId);
        params.add(rejectReason);
        extraInfo.put("templateId", rejectTemplateId);
        extraInfo.put("recipient", sourceWhatsAppNumber);
        extraInfo.set("params", params);
        return extraInfo;
    }

    private JsonNode responseForResolvedStatus(JsonNode event, String citizenName, String mobileNumber) throws UnsupportedEncodingException {
        String serviceRequestId = event.at(SERVICEREQUESTID_PATH).asText();
        String serviceCode = event.at(SERVICECODE_PATH).asText();
        ObjectNode extraInfo = objectMapper.createObjectNode();
        ArrayNode params = objectMapper.createArrayNode();
        String complaintCategory = localizationService.getMessageForCode(complaintCategoryLocalizationPrefix + serviceCode);
        String complaintURL = makeCitizenURLForComplaint(serviceRequestId, mobileNumber);
        params.add(citizenName);
        params.add(complaintCategory);
        params.add(serviceRequestId);
        params.add(complaintURL);
        extraInfo.put("templateId", resolvedTemplateId);
        extraInfo.put("recipient", sourceWhatsAppNumber);
        extraInfo.set("params", params);
        return extraInfo;
    }

    private JsonNode responseForReassignedtatus(JsonNode event, String citizenName, String mobileNumber) throws IOException {
        String serviceRequestId = event.at(SERVICEREQUESTID_PATH).asText();
        String serviceCode = event.at(SERVICECODE_PATH).asText();
        JsonNode assignee = getAssignee(event);
        String assigneeName = assignee.at(NAME_PATH).asText();
        ObjectNode extraInfo = objectMapper.createObjectNode();
        ArrayNode params = objectMapper.createArrayNode();
        String complaintCategory = localizationService.getMessageForCode(complaintCategoryLocalizationPrefix + serviceCode);
        String complaintURL = makeCitizenURLForComplaint(serviceRequestId, mobileNumber);
        params.add(citizenName);
        params.add(complaintCategory);
        params.add(serviceRequestId);
        params.add(assigneeName);
        params.add(complaintURL);
        extraInfo.put("templateId", reassignAssignedTemplateId);
        extraInfo.put("recipient", sourceWhatsAppNumber);
        extraInfo.set("params", params);
        return extraInfo;
    }

    private String makeCitizenURLForComplaint(String serviceRequestId, String mobileNumber) throws UnsupportedEncodingException {
        String encodedPath = URLEncoder.encode(serviceRequestId, "UTF-8");
        String url = egovExternalHost + "citizen/otpLogin?mobileNo=" + mobileNumber + "&redirectTo=complaint-details/" + encodedPath + "?source=whatsapp";
        String shortenedURL = urlShorteningSevice.shortenURL(url);
        return shortenedURL;
    }
}
