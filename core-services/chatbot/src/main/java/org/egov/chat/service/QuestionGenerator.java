package org.egov.chat.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import lombok.extern.slf4j.Slf4j;
import org.egov.chat.models.EgovChat;
import org.egov.chat.models.LocalizationCode;
import org.egov.chat.models.Response;
import org.egov.chat.repository.ConversationStateRepository;
import org.egov.chat.service.valuefetch.ValueFetcher;
import org.egov.chat.util.NumeralLocalization;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class QuestionGenerator {

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private ValueFetcher valueFetcher;
    @Autowired
    private FixedSetValues fixedSetValues;
    @Autowired
    private ConversationStateRepository conversationStateRepository;
    @Autowired
    private NumeralLocalization numeralLocalization;

    public EgovChat fillQuestion(JsonNode config, EgovChat chatNode) throws IOException {
        List<LocalizationCode> localizationCodeArray = new ArrayList<>();

        if (chatNode.getResponse() == null) {
            Response response = Response.builder().timestamp(System.currentTimeMillis()).type("text").nodeId(config.get("name").asText())
                    .localizationCodes(localizationCodeArray).build();
            chatNode.setResponse(response);
        } else {
            localizationCodeArray = chatNode.getResponse().getLocalizationCodes();
            LocalizationCode newLine = LocalizationCode.builder().value("\n").build();
            localizationCodeArray.add(newLine);
            localizationCodeArray.add(newLine);
        }

        LocalizationCode localizationCode = LocalizationCode.builder().code(getQuesitonForConfig(config)).build();
        localizationCodeArray.add(localizationCode);
        localizationCodeArray.addAll(getOptionsForConfig(config, chatNode));

        return chatNode;
    }

    private String getQuesitonForConfig(JsonNode config) {
        return config.get("message").asText();
    }

    // TODO : Re-factor
    private List<LocalizationCode> getOptionsForConfig(JsonNode config, EgovChat chatNode) throws IOException {
        List<LocalizationCode> localizationCodes = new ArrayList<>();

        if (config.get("typeOfValues") != null && config.get("typeOfValues").asText().equalsIgnoreCase("FixedSetValues")) {

            if (config.get("displayValuesAsOptions") != null && config.get("displayValuesAsOptions").asText().equalsIgnoreCase("true")) {

                boolean reQuestion = chatNode.isAskForNextBatch();
                JsonNode questionDetails;
                if (reQuestion) {
                    questionDetails = conversationStateRepository.getConversationStateForId(
                            chatNode.getConversationState().getConversationId()).getQuestionDetails();
                } else {
                    questionDetails = fixedSetValues.getAllValidValues(config, chatNode);
                }

                questionDetails = fixedSetValues.getNextSet(questionDetails);

                chatNode.getNextConversationState().setQuestionDetails(questionDetails);

                ArrayNode values = (ArrayNode) questionDetails.get("askedValues");
                String numberPrefixLocalizationCode = null;
                String numberNameSeparatorLocalizationCode = null;
                if (config.has("numberPrefixLocalizationCode"))
                    numberPrefixLocalizationCode = config.get("numberPrefixLocalizationCode").asText();
                if (config.has("numberPostfixLocalizationCode"))
                    numberNameSeparatorLocalizationCode = config.get("numberPostfixLocalizationCode").asText();
                // TODO : Currently using * for Bold
                for (int i = 0; i < values.size(); i++) {
                    LocalizationCode newLineCode = LocalizationCode.builder().value("\n").build();
                    localizationCodes.add(newLineCode);
                    if (numberPrefixLocalizationCode != null) {
                        LocalizationCode prefixCode = LocalizationCode.builder().code(numberPrefixLocalizationCode).build();
                        localizationCodes.add(prefixCode);
                    }
                    JsonNode value = values.get(i);
                    String tempString = value.get("index").asText();
                    localizationCodes.addAll(numeralLocalization.getLocalizationCodesForStringContainingNumbers(tempString));
                    if (numberNameSeparatorLocalizationCode != null) {
                        LocalizationCode separatorCode = LocalizationCode.builder().code(numberNameSeparatorLocalizationCode).build();
                        localizationCodes.add(separatorCode);
                    }
                    LocalizationCode localizationCode = objectMapper.convertValue(value.get("value"), LocalizationCode.class);
                    localizationCodes.add(localizationCode);
                }
            } else {

                JsonNode questionDetails = fixedSetValues.getAllValidValues(config, chatNode);
                chatNode.getNextConversationState().setQuestionDetails(questionDetails);

            }

            if (config.get("displayOptionsInExternalLink") != null && config.get("displayOptionsInExternalLink").asBoolean()) {
                localizationCodes.add(LocalizationCode.builder().value(valueFetcher.getExternalLinkForParams(config, chatNode)).build());
            }
        }

        return localizationCodes;
    }

}
