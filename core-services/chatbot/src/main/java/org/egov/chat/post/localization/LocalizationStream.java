package org.egov.chat.post.localization;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.StreamsConfig;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.Produced;
import org.egov.chat.config.KafkaStreamsConfig;
import org.egov.chat.models.EgovChat;
import org.egov.chat.models.LocalizationCode;
import org.egov.chat.models.egovchatserdes.EgovChatSerdes;
import org.egov.chat.util.CommonAPIErrorMessage;
import org.egov.chat.util.LocalizationService;
import org.egov.chat.util.Telemetry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Properties;

@Slf4j
@Component
public class LocalizationStream {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private KafkaStreamsConfig kafkaStreamsConfig;
    @Autowired
    private LocalizationService localizationService;
    @Autowired
    private CommonAPIErrorMessage commonAPIErrorMessage;
    @Autowired
    private Telemetry telemetry;

    public String getStreamName() {
        return "localization-stream";
    }

    public void startStream(String inputTopic, String outputTopic) {
        Properties streamConfiguration = kafkaStreamsConfig.getDefaultStreamConfiguration();
        streamConfiguration.put(StreamsConfig.APPLICATION_ID_CONFIG, getStreamName());
        StreamsBuilder builder = new StreamsBuilder();
        KStream<String, EgovChat> messagesKStream = builder.stream(inputTopic, Consumed.with(Serdes.String(),
                EgovChatSerdes.getSerde()));

        messagesKStream.flatMapValues(chatNode -> {
            telemetry.recordEvent(chatNode);
            try {
                return Collections.singletonList(localizeMessage(chatNode));
            } catch (Exception e) {
                log.error("error in localization stream", e);
                commonAPIErrorMessage.resetFlowDuetoError(chatNode);
                return Collections.emptyList();
            }
        }).to(outputTopic, Produced.with(Serdes.String(), EgovChatSerdes.getSerde()));

        kafkaStreamsConfig.startStream(builder, streamConfiguration);

    }

    public EgovChat localizeMessage(EgovChat chatNode) throws IOException {
        String locale = chatNode.getConversationState().getLocale();
        List<LocalizationCode> localizationCodes = chatNode.getResponse().getLocalizationCodes();
        if (localizationCodes != null && !localizationCodes.isEmpty()) {
            String message = "";
            message += formMessageForCodes(localizationCodes, locale);

            if (chatNode.getResponse().getText() != null) {
                message += chatNode.getResponse().getText();
                log.info("localisation stream text already present in response", chatNode.getResponse().getText());
            }
            chatNode.getResponse().setText(message);
        }

        return chatNode;
    }

    public String formMessageForCodes(List<LocalizationCode> localizationCodes, String locale) throws IOException {
        List<String> localizedMessages = localizationService.getMessagesForCodes(localizationCodes, locale);

        StringBuilder message = new StringBuilder();
        localizedMessages.stream().forEach(localizedMessage -> message.append(localizedMessage));

        return message.toString();
    }

}
