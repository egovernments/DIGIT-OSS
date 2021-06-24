package org.egov.chat.service.streams;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.Produced;
import org.egov.chat.config.KafkaStreamsConfig;
import org.egov.chat.models.ConversationState;
import org.egov.chat.models.EgovChat;
import org.egov.chat.models.LocalizationCode;
import org.egov.chat.models.Response;
import org.egov.chat.models.egovchatserdes.EgovChatSerdes;
import org.egov.chat.repository.MessageRepository;
import org.egov.chat.service.restendpoint.RestAPI;
import org.egov.chat.util.CommonAPIErrorMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Properties;

@Slf4j
@Component
public class CreateEndpointStream extends CreateStream {

    @Autowired
    private KafkaStreamsConfig kafkaStreamsConfig;
    @Autowired
    private CommonAPIErrorMessage commonAPIErrorMessage;
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private RestAPI restAPI;

    @Autowired
    private MessageRepository messageRepository;

    @Value("${contact.card.whatsapp.name}")
    private String nameInContactCard;

    @Value("${contact.card.whatsapp.number}")
    private String numberInContactCard;

    private String contactMessageLocalizationCode = "chatbot.messages.contactMessage";

    private String contactAdditionalInfoLocalizationCode = "chatbot.messages.contactAdditionalInfo";

    public void createEndpointStream(JsonNode config, String inputTopic, String sendMessageTopic) {

        String streamName = config.get("name").asText() + "-answer";

        Properties streamConfiguration = kafkaStreamsConfig.getDefaultStreamConfiguration();
        streamConfiguration.put(StreamsConfig.APPLICATION_ID_CONFIG, streamName);

        StreamsBuilder builder = new StreamsBuilder();
        KStream<String, EgovChat> answerKStream = builder.stream(inputTopic, Consumed.with(Serdes.String(),
                EgovChatSerdes.getSerde()));

        answerKStream.flatMapValues(chatNode -> {
            try {
                Response responseMessage = restAPI.makeRestEndpointCall(config, chatNode);
                String nodeId = config.get("name").asText();
                responseMessage.setNodeId(nodeId);
                chatNode.setResponse(responseMessage);

                String conversationId = chatNode.getConversationState().getConversationId();
                chatNode.getConversationState().setActiveNodeId(config.get("name").asText());

                ConversationState nextConversationState = chatNode.getConversationState().toBuilder().build();
                nextConversationState.setLastModifiedTime(System.currentTimeMillis());
                nextConversationState.setActiveNodeId(config.get("name").asText());
                nextConversationState.setQuestionDetails(null);
                chatNode.setNextConversationState(nextConversationState);
                conversationStateRepository.updateConversationStateForId(nextConversationState);
                conversationStateRepository.markConversationInactive(conversationId);

                List<EgovChat> nodes = new ArrayList<>();
                nodes.add(chatNode);

                EgovChat contactMessageNode = createContactMessageNode(chatNode);
                if (contactMessageNode != null)
                    nodes.add(contactMessageNode);

                return nodes;
            } catch (Exception e) {
                log.error("error in create endpoint stream", e);
                commonAPIErrorMessage.resetFlowDuetoError(chatNode);
                return Collections.emptyList();
            }
        }).to(sendMessageTopic, Produced.with(Serdes.String(), EgovChatSerdes.getSerde()));

        kafkaStreamsConfig.startStream(builder, streamConfiguration);

        log.info("Endpoint Stream started : " + streamName + ", from : " + inputTopic + ", to : " + sendMessageTopic);
    }

    private EgovChat createContactMessageNode(EgovChat chatNode) {

        int recordcount = conversationStateRepository.getConversationStateCountForUserId(chatNode.getUser().getUserId());
        if (recordcount > 1)
            return null;

        EgovChat contactMessageNode = chatNode.toBuilder().build();
        ObjectNode contactcard = objectMapper.createObjectNode();
        contactcard.put("number", numberInContactCard);
        contactcard.put("name", nameInContactCard);
        LocalizationCode contactCardMessageCode = LocalizationCode.builder().code(contactMessageLocalizationCode).build();
        LocalizationCode contactCardContactName = LocalizationCode.builder().value(nameInContactCard).build();
        LocalizationCode mobNameSeparator = LocalizationCode.builder().value(" - ").build();
        LocalizationCode contactCardMobNo = LocalizationCode.builder().value(numberInContactCard).build();
        LocalizationCode contactAdditionalInfo = LocalizationCode.builder().code(contactAdditionalInfoLocalizationCode).build();
        List<LocalizationCode> localizationCodeList = new ArrayList<>();
        localizationCodeList.add(contactCardMessageCode);
        localizationCodeList.add(contactCardContactName);
        localizationCodeList.add(mobNameSeparator);
        localizationCodeList.add(contactCardMobNo);
        localizationCodeList.add(contactAdditionalInfo);
        Response response = Response.builder().timestamp(System.currentTimeMillis()).nodeId("contactcard").type("contactcard").contactCard(contactcard).localizationCodes(localizationCodeList).build();
        contactMessageNode.setResponse(response);
        return contactMessageNode;
    }
}
