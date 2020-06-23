package org.egov.chat.xternal.requestformatter.ValueFirst;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.Produced;
import org.egov.chat.config.KafkaStreamsConfig;
import org.egov.chat.pre.formatter.RequestFormatter;
import org.egov.chat.util.FileStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collections;
import java.util.Properties;

@Slf4j
@Component
public class ValueFirstRequestFormatter implements RequestFormatter {

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private KafkaStreamsConfig kafkaStreamsConfig;

    @Value("${valuefirst.whatsapp.number}")
    private String valueFirstWAMobNo;

    @Autowired
    private FileStore fileStore;

    @Override
    public String getStreamName() {
        return "valuefirst-request-transform";
    }

    @Override
    public boolean isValid(JsonNode inputRequest) {
        try {
            if (checkForMissedCallNotification(inputRequest))
                return true;

            String mediaType = inputRequest.at(ValueFirstPointerConstants.mediaType).asText();
            if (mediaType.equalsIgnoreCase("text") || mediaType.equalsIgnoreCase("image")) {
                return true;
            }
            else if(!StringUtils.isEmpty(mediaType)){
                return  true;
            }
        } catch (Exception e) {
            log.error("Invalid request", e);
        }
        return false;
    }

    @Override
    public JsonNode getTransformedRequest(JsonNode inputRequest) throws Exception {
        boolean missedCall = checkForMissedCallNotification(inputRequest);
        JsonNode chatNode = null;
        if (missedCall) {
            chatNode = getMissedCallChatNode(inputRequest);
        } else {
            chatNode = getUserMessageChatNode(inputRequest);
        }
        return chatNode;
    }

    public JsonNode getMissedCallChatNode(JsonNode inputRequest) {
        String inputMobile = getValueFromNode(inputRequest.at(ValueFirstPointerConstants.missedCallFromMobileNumber));
        String mobileNumber = inputMobile.substring(2, 2 + 10);
        ObjectNode user = objectMapper.createObjectNode();
        user.set("mobileNumber", TextNode.valueOf(mobileNumber));

        ObjectNode message = objectMapper.createObjectNode();
        message.put("contentType", "text");
        message.put("rawInput", "missedCall");

        ObjectNode extraInfo = objectMapper.createObjectNode();
        extraInfo.put("recipient", valueFirstWAMobNo);
        extraInfo.put("missedCall", true);

        ObjectNode chatNode = objectMapper.createObjectNode();

        chatNode.set("user", user);
        chatNode.set("message", message);
        chatNode.set("extraInfo", extraInfo);
        chatNode.set("timestamp", inputRequest.at(ValueFirstPointerConstants.timestampPath));
        return chatNode;
    }

    public JsonNode getUserMessageChatNode(JsonNode inputRequest) throws IOException {
        String inputMobile = inputRequest.at(ValueFirstPointerConstants.userMobileNumber).asText();
        String mobileNumber = inputMobile.substring(2, 2 + 10);
        String mediaType = inputRequest.at(ValueFirstPointerConstants.mediaType).asText();
        ObjectNode user = objectMapper.createObjectNode();
        user.set("mobileNumber", TextNode.valueOf(mobileNumber));

        ObjectNode message = objectMapper.createObjectNode();

        if (mediaType.equalsIgnoreCase("text")) {
            message.put("contentType", "text");
            message.set("rawInput", inputRequest.at(ValueFirstPointerConstants.textContent));
        } else if (mediaType.equalsIgnoreCase("image")) {
            message.put("contentType", "image");
            String imageInBase64String = inputRequest.at(ValueFirstPointerConstants.mediaData).asText();
            message.put("rawInput", fileStore.convertFromBase64AndStore(imageInBase64String));
        } else if (!StringUtils.isEmpty(mediaType)) {
            message.put("contentType", "not_supported");
            message.put("rawInput", "");
        }

        ObjectNode extraInfo = objectMapper.createObjectNode();
        extraInfo.set("recipient", inputRequest.at(ValueFirstPointerConstants.recipientMobileNumber));

        ObjectNode chatNode = objectMapper.createObjectNode();

        chatNode.set("user", user);
        chatNode.set("message", message);
        chatNode.set("extraInfo", extraInfo);
        chatNode.set("timestamp", inputRequest.at(ValueFirstPointerConstants.timestampPath));
        return chatNode;
    }

    private boolean checkForMissedCallNotification(JsonNode inputRequest) {
        if (!StringUtils.isEmpty(inputRequest.at(ValueFirstPointerConstants.missedCallToNumber).asText())) {
            return true;
        }
        return false;
    }

    private String getValueFromNode(JsonNode jsonNode) {
        if (jsonNode.isArray()) {
            ArrayNode arrayNode = (ArrayNode) jsonNode;
            return arrayNode.get(0).asText();
        } else {
            return jsonNode.asText();
        }
    }

//    @Override
//    public void startRequestFormatterStream(String inputTopic, String outputTopic, String errorTopic) {
//        Properties streamConfiguration = kafkaStreamsConfig.getDefaultStreamConfiguration();
//        streamConfiguration.put(StreamsConfig.APPLICATION_ID_CONFIG, getStreamName());
//        StreamsBuilder builder = new StreamsBuilder();
//        KStream<String, JsonNode> messagesKStream = builder.stream(inputTopic, Consumed.with(Serdes.String(),
//                kafkaStreamsConfig.getJsonSerde()));
//
//        KStream<String, JsonNode>[] branches = messagesKStream.branch(
//                (key, inputRequest) -> isValid(inputRequest),
//                (key, value) -> true
//        );
//
//        branches[0].flatMapValues(request -> {
//            try {
//                return Collections.singletonList(getTransformedRequest(request));
//            } catch (Exception e) {
//                log.error("error in valuefirst pre request Requestformatter",e);
//                return Collections.emptyList();
//            }
//        }).to(outputTopic, Produced.with(Serdes.String(), kafkaStreamsConfig.getJsonSerde()));
//
//        branches[1].mapValues(request -> request).to(errorTopic, Produced.with(Serdes.String(), kafkaStreamsConfig.getJsonSerde()));
//
//        kafkaStreamsConfig.startStream(builder, streamConfiguration);
//    }
}
