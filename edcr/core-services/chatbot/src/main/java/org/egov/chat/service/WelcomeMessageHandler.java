package org.egov.chat.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import lombok.extern.slf4j.Slf4j;
import me.xdrop.fuzzywuzzy.FuzzySearch;
import org.egov.chat.ChatBot;
import org.egov.chat.models.EgovChat;
import org.egov.chat.models.LocalizationCode;
import org.egov.chat.models.Response;
import org.egov.chat.repository.ConversationStateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
public class WelcomeMessageHandler {

    @Autowired
    private KafkaTemplate<String, EgovChat> kafkaTemplate;
    @Autowired
    private ConversationStateRepository conversationStateRepository;
    @Autowired
    private AnswerStore answerStore;

    private String rootFolder = "graph/";
    private String welcomeNodeFileName = "welcome.yaml";
    private JsonNode welcomeConfig;
    private List<String> welcomeTriggerKeywords;
    private int fuzzymatchScoreThreshold;

    private String sendMessageTopic = "send-message";

    @PostConstruct
    public void init() throws IOException {
        String pathToFile = rootFolder + welcomeNodeFileName;
        welcomeConfig = getConfigForFile(pathToFile);
        welcomeTriggerKeywords = new ArrayList<>();
        ArrayNode arrayNode = (ArrayNode) welcomeConfig.get("values");
        for (JsonNode jsonNode : arrayNode) {
            welcomeTriggerKeywords.add(jsonNode.asText());
        }
        fuzzymatchScoreThreshold = welcomeConfig.get("matchAnswerThreshold").asInt();
    }

    public EgovChat welcomeUser(String consumerRecordKey, EgovChat chatNode) {
        EgovChat welcomeChatNode = chatNode.toBuilder().build();

        welcomeChatNode.getMessage().setNodeId(welcomeConfig.get("name").asText());
        welcomeChatNode.getMessage().setValid(isWelcomeTriggerKeyword(welcomeChatNode));

        answerStore.saveAnswer(welcomeConfig, welcomeChatNode);

        if (welcomeChatNode.getMessage().isValid() || isNewUser(welcomeChatNode)) {

            LocalizationCode localizationCode =
                    LocalizationCode.builder().code(welcomeConfig.get("message").asText()).build();

            Response response = Response.builder().timestamp(System.currentTimeMillis()).nodeId("welcome")
                    .type("text").localizationCodes(Collections.singletonList(localizationCode)).build();

            welcomeChatNode.setResponse(response);

            kafkaTemplate.send(sendMessageTopic, consumerRecordKey, welcomeChatNode);

            return chatNode;

        } else {
            LocalizationCode localizationCode =
                    LocalizationCode.builder().code(welcomeConfig.get("errorMessage").asText()).build();

            Response response = Response.builder().timestamp(System.currentTimeMillis()).nodeId("welcome")
                    .type("text").localizationCodes(Collections.singletonList(localizationCode)).build();

            welcomeChatNode.setResponse(response);

            kafkaTemplate.send(sendMessageTopic, consumerRecordKey, welcomeChatNode);

            conversationStateRepository.updateConversationStateForId(welcomeChatNode.getConversationState());
            conversationStateRepository.markConversationInactive(welcomeChatNode.getConversationState().getConversationId());

            return null;
        }
    }

    private boolean isNewUser(EgovChat chatNode) {

        int numberOfConversations = conversationStateRepository.getConversationStateCountForUserId(
                chatNode.getUser().getUserId());
        if (numberOfConversations == 1)
            return true;
        return false;
    }

    private boolean isWelcomeTriggerKeyword(EgovChat chatNode) {
        try {
            String answer = chatNode.getMessage().getRawInput();

            for (String welcomeTriggerKeyword : welcomeTriggerKeywords) {
                int score = FuzzySearch.tokenSetRatio(welcomeTriggerKeyword, answer);
                if (score >= fuzzymatchScoreThreshold)
                    return true;
            }

            return false;
        } catch (Exception e) {
            log.error("error in welcome keyword check", e);
            return false;
        }
    }

    private JsonNode getConfigForFile(String pathToFile) throws IOException {
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
        JsonNode config = mapper.readTree(ChatBot.class.getClassLoader().getResource(pathToFile));
        return config;
    }

}
