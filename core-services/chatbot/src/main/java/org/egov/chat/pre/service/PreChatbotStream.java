package org.egov.chat.pre.service;

import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.Produced;
import org.egov.chat.config.ApplicationProperties;
import org.egov.chat.config.KafkaStreamsConfig;
import org.egov.chat.models.EgovChat;
import org.egov.chat.models.egovchatserdes.EgovChatSerdes;
import org.egov.chat.pre.authorization.UserService;
import org.egov.chat.util.CommonAPIErrorMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Properties;

@Slf4j
@Service
public class PreChatbotStream {

    @Autowired
    private UserService userService;

    @Autowired
    private ApplicationProperties applicationProperties;
    @Autowired
    private KafkaStreamsConfig kafkaStreamsConfig;
    @Autowired
    private CommonAPIErrorMessage commonAPIErrorMessage;

    private String streamName = "pre-chatbot";


    public void startPreChatbotStream(String inputTopic, String outputTopic) {

        Properties streamConfiguration = kafkaStreamsConfig.getDefaultStreamConfiguration();
        streamConfiguration.put(StreamsConfig.APPLICATION_ID_CONFIG, streamName);
        StreamsBuilder builder = new StreamsBuilder();
        KStream<String, EgovChat> messagesKStream = builder.stream(inputTopic, Consumed.with(Serdes.String(),
                EgovChatSerdes.getSerde()));

        messagesKStream.flatMapValues(chatNode -> {
            try {
                chatNode.setTenantId(applicationProperties.getStateLevelTenantId());
                userService.addLoggedInUser(chatNode);
                return Collections.singletonList(chatNode);
            } catch (Exception e) {
                log.error("error in pre-chatbot stream", e);
                commonAPIErrorMessage.resetFlowDuetoError(chatNode);
                return Collections.emptyList();
            }
        }).to(outputTopic, Produced.with(Serdes.String(), EgovChatSerdes.getSerde()));

        kafkaStreamsConfig.startStream(builder, streamConfiguration);

    }

}
