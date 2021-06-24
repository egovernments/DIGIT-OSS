package org.egov.chat.pre.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.egov.chat.pre.formatter.RequestFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
public class MessageWebhook {

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private RequestFormatter requestFormatter;
    @Autowired
    private KafkaTemplate<String, JsonNode> kafkaTemplate;

    private String outputTopicName = "transformed-input-messages";

    public Object receiveMessage(Map<String, String> params) throws Exception {
        JsonNode message = prepareMessage(params);
        if(requestFormatter.isValid(message)) {
            message = requestFormatter.getTransformedRequest(message);
            String key = message.at("/user/mobileNumber").asText();
            kafkaTemplate.send(outputTopicName, key, message);
        } else {

        }

        return null;
    }

    private JsonNode prepareMessage(Map<String, String> bodyParams) {
        ObjectNode message = (ObjectNode) objectMapper.convertValue(bodyParams, JsonNode.class);
        message.put("timestamp", System.currentTimeMillis());
        return message;
    }

    public void recordEvent() {

    }

}
