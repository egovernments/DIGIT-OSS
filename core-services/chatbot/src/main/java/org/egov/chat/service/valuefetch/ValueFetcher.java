package org.egov.chat.service.valuefetch;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import org.egov.chat.config.JsonPointerNameConstants;
import org.egov.chat.models.EgovChat;
import org.egov.chat.models.Message;
import org.egov.chat.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Iterator;
import java.util.List;

@Component
public class ValueFetcher {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    List<ExternalValueFetcher> externalValueFetchers;

    @Autowired
    private MessageRepository messageRepository;

    public ArrayNode getAllValidValues(JsonNode config, JsonNode chatNode) {
        ArrayNode validValues = objectMapper.createArrayNode();

        if (config.get("values").isArray()) {
            validValues = getValuesFromArrayNode(config);
        } else if (config.get("values").isObject()) {
            validValues = getValuesFromExternalSource(config, chatNode);
        }

        return validValues;
    }

    public String getCodeForValue(JsonNode config, EgovChat chatNode, String answer) {
        if (config.get("values").isArray()) {
            return answer;
        } else {
            ExternalValueFetcher externalValueFetcher = getExternalValueFetcher(config);
            JsonNode jsonNode = objectMapper.valueToTree(chatNode);
            ObjectNode params = createParamsToFetchValues(config, jsonNode);

            return externalValueFetcher.getCodeForValue(params, answer);
        }
    }

    public String getExternalLinkForParams(JsonNode config, EgovChat chatNode) {
        ExternalValueFetcher externalValueFetcher = getExternalValueFetcher(config);
        JsonNode jsonNode = objectMapper.valueToTree(chatNode);
        return externalValueFetcher.createExternalLinkForParams(createParamsToFetchValues(config, jsonNode));
    }

    ArrayNode getValuesFromArrayNode(JsonNode config) {
        ArrayNode validValues = objectMapper.createArrayNode();
        for (JsonNode jsonNode : config.get("values")) {
            ObjectNode value = objectMapper.createObjectNode();
            value.put("value", jsonNode.asText());
            validValues.add(value);
        }
        return validValues;
    }

    ArrayNode getValuesFromExternalSource(JsonNode config, JsonNode chatNode) {
        ExternalValueFetcher externalValueFetcher = getExternalValueFetcher(config);

        ObjectNode params = createParamsToFetchValues(config, chatNode);

        return externalValueFetcher.getValues(params);
    }

    ObjectNode createParamsToFetchValues(JsonNode config, JsonNode chatNode) {
        ObjectMapper mapper = new ObjectMapper(new JsonFactory());
        ObjectNode params = mapper.createObjectNode();

        ObjectNode paramConfigurations = (ObjectNode) config.get("values").get("params");
        Iterator<String> paramKeys = paramConfigurations.fieldNames();

        while (paramKeys.hasNext()) {
            String key = paramKeys.next();
            JsonNode paramValue;

            String paramConfiguration = paramConfigurations.get(key).asText();

            if (paramConfiguration.substring(0, 1).equalsIgnoreCase("/")) {
                paramValue = chatNode.at(paramConfiguration);
            } else if (paramConfiguration.substring(0, 1).equalsIgnoreCase("~")) {
                String nodeId = paramConfiguration.substring(1);
                String conversationId = chatNode.at(JsonPointerNameConstants.conversationId).asText();
                List<Message> messages = messageRepository.getValidMessagesOfConversation(conversationId);
                paramValue = TextNode.valueOf(findMessageForNode(messages, nodeId, chatNode));
            } else {
                paramValue = TextNode.valueOf(paramConfiguration);
            }

            params.set(key, paramValue);
        }

        return params;
    }

    ExternalValueFetcher getExternalValueFetcher(JsonNode config) {
        String className = config.get("values").get("class").asText();
        for (ExternalValueFetcher externalValueFetcher : externalValueFetchers) {
            if (externalValueFetcher.getClass().getName().equalsIgnoreCase(className))
                return externalValueFetcher;
        }
        return null;
    }

    String findMessageForNode(List<Message> messages, String nodeId, JsonNode chatNode) {
        for (Message message : messages) {
            if (message.getNodeId().equalsIgnoreCase(nodeId)) {
                return message.getMessageContent();
            }
        }
        //If nodeId isn't found in previously saved messages in DB
        //Try to find in the last received message
        if (chatNode.at("/message/nodeId").asText().equalsIgnoreCase(nodeId)) {
            return chatNode.at("/message/messageContent").asText();
        }
        return null;
    }

}
