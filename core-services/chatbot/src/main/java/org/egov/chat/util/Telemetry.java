package org.egov.chat.util;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.egov.chat.config.ApplicationProperties;
import org.egov.chat.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

@Slf4j
@Service
public class Telemetry {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private KafkaTemplate<String, JsonNode> kafkaTemplate;

    @Autowired
    private ApplicationProperties applicationProperties;


    private String telemetryTopicName = "chatbot-telemetry";

    public void recordEvent(EgovChat chatNode) {
        try {
            EgovChat chatNodeForTelemetry = maskFields(chatNode);
            ObjectNode objectNode = objectMapper.convertValue(chatNodeForTelemetry, ObjectNode.class);
            objectNode = changeToElasticSearchCompatibleTimestamp(objectNode);
            kafkaTemplate.send(telemetryTopicName, objectNode);
        } catch (Exception e) {
            log.error("Error occurred while recording event", e);
        }
    }

    public ObjectNode changeToElasticSearchCompatibleTimestamp(ObjectNode chatNode) {
        Date date = new Date(chatNode.get("timestamp").asLong());
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
        formatter.setTimeZone(TimeZone.getTimeZone(applicationProperties.getTimezone()));
        chatNode.put("@timestamp", formatter.format(date));
        return chatNode;
    }

    public EgovChat maskFields(EgovChat chatNode) {
        Response response = chatNode.getResponse();
        Response responseForTelemetry = Response.builder().nodeId(response.getNodeId()).timestamp(response.getTimestamp())
                .type(response.getType()).build();

        User user = chatNode.getUser();
        User userForTelemetry = User.builder().userId(user.getUserId()).build();

        ConversationState conversationState = chatNode.getConversationState();
        ConversationState conversationStateForTelemetry = ConversationState.builder()
                .activeNodeId(conversationState.getActiveNodeId()).lastModifiedTime(conversationState.getLastModifiedTime())
                .conversationId(conversationState.getConversationId()).active(conversationState.isActive())
                .locale(conversationState.getLocale()).build();

        ConversationState nextConversationState = chatNode.getNextConversationState();
        ConversationState nextConversationStateForTelemetry = null;
        if(nextConversationState != null) {
            nextConversationStateForTelemetry = ConversationState.builder()
                    .activeNodeId(nextConversationState.getActiveNodeId()).lastModifiedTime(nextConversationState.getLastModifiedTime())
                    .conversationId(nextConversationState.getConversationId()).active(nextConversationState.isActive())
                    .locale(nextConversationState.getLocale()).build();
        }

        Message message = chatNode.getMessage();
        Message messageForTelemetry = Message.builder().messageId(message.getMessageId()).nodeId(message.getNodeId())
                .contentType(message.getContentType()).conversationId(message.getConversationId())
                .valid(message.isValid()).build();

        JsonNode extraInfo = chatNode.getExtraInfo().deepCopy();

        EgovChat chatNodeForTelemetry = EgovChat.builder().tenantId(chatNode.getTenantId()).timestamp(chatNode.getTimestamp())
                .user(userForTelemetry).message(messageForTelemetry).response(responseForTelemetry)
                .conversationState(conversationStateForTelemetry).nextConversationState(nextConversationStateForTelemetry)
                .extraInfo(extraInfo).askForNextBatch(chatNode.isAskForNextBatch()).addErrorMessage(chatNode.isAddErrorMessage())
                .resetConversation(chatNode.isResetConversation()).build();

        return chatNodeForTelemetry;
    }

}
