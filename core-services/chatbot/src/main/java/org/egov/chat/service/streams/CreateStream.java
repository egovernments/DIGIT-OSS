package org.egov.chat.service.streams;

import com.fasterxml.jackson.databind.JsonNode;
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
import org.egov.chat.models.egovchatserdes.EgovChatSerdes;
import org.egov.chat.repository.ConversationStateRepository;
import org.egov.chat.service.ErrorMessageGenerator;
import org.egov.chat.service.QuestionGenerator;
import org.egov.chat.util.CommonAPIErrorMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Properties;

@Component
@Slf4j
public class CreateStream {

    @Autowired
    private KafkaStreamsConfig kafkaStreamsConfig;

    @Autowired
    protected ConversationStateRepository conversationStateRepository;

    @Autowired
    protected QuestionGenerator questionGenerator;
    @Autowired
    private ErrorMessageGenerator errorMessageGenerator;
    @Autowired
    private CommonAPIErrorMessage commonAPIErrorMessage;

    public void createQuestionStreamForConfig(JsonNode config, String questionTopic, String sendMessageTopic) {

        String streamName = config.get("name").asText() + "-question";

        Properties streamConfiguration = kafkaStreamsConfig.getDefaultStreamConfiguration();
        streamConfiguration.put(StreamsConfig.APPLICATION_ID_CONFIG, streamName);

        StreamsBuilder builder = new StreamsBuilder();
        KStream<String, EgovChat> questionKStream = builder.stream(questionTopic, Consumed.with(Serdes.String(),
                EgovChatSerdes.getSerde()));

        questionKStream.flatMapValues(chatNode -> {
            try {
                List<EgovChat> responseNodes = new ArrayList<>();

                if (chatNode.isAddErrorMessage()) {
                    errorMessageGenerator.fillErrorMessageInChatNode(config, chatNode);
                }

                ConversationState nextConversationState = chatNode.getConversationState().toBuilder().build();
                nextConversationState.setLastModifiedTime(System.currentTimeMillis());
                nextConversationState.setActiveNodeId(config.get("name").asText());
                nextConversationState.setQuestionDetails(null);

                chatNode.setNextConversationState(nextConversationState);

                questionGenerator.fillQuestion(config, chatNode);
                responseNodes.add(chatNode);

                conversationStateRepository.updateConversationStateForId(chatNode.getNextConversationState());

                return responseNodes;
            } catch (Exception e) {
                log.error("error in create stream", e);
                commonAPIErrorMessage.resetFlowDuetoError(chatNode);
                return Collections.emptyList();
            }
        }).to(sendMessageTopic, Produced.with(Serdes.String(), EgovChatSerdes.getSerde()));

        kafkaStreamsConfig.startStream(builder, streamConfiguration);

        log.info("Stream started : " + streamName + ", from : " + questionTopic + ", to : " + sendMessageTopic);
    }

}
