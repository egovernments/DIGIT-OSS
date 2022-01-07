package org.egov.chat.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import me.xdrop.fuzzywuzzy.FuzzySearch;
import org.apache.commons.lang.StringUtils;
import org.egov.chat.models.ConversationState;
import org.egov.chat.models.EgovChat;
import org.egov.chat.models.LocalizationCode;
import org.egov.chat.repository.ConversationStateRepository;
import org.egov.chat.service.valuefetch.ValueFetcher;
import org.egov.chat.util.LocalizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Component
public class FixedSetValues {

    private String nextKeywordSymbol = "0";
    private String nextKeyword = "Next";

    @Autowired
    private ValueFetcher valueFetcher;
    @Autowired
    private ConversationStateRepository conversationStateRepository;
    @Autowired
    private LocalizationService localizationService;

    @Autowired
    private ObjectMapper objectMapper;


    public JsonNode getAllValidValues(JsonNode config, EgovChat chatNode) {
        ObjectNode questionDetails = objectMapper.createObjectNode();
        if (config.get("values").get("batchSize") != null)
            questionDetails.put("batchSize", config.get("values").get("batchSize").asInt());
        else
            questionDetails.put("batchSize", Integer.MAX_VALUE);

        ArrayNode validValues = valueFetcher.getAllValidValues(config, objectMapper.valueToTree(chatNode));
        ArrayNode values = objectMapper.valueToTree(validValues);
        questionDetails.putArray("allValues").addAll(values);

        return questionDetails;
    }

    public JsonNode getNextSet(JsonNode questionDetails) {
        Integer batchSize = questionDetails.get("batchSize").asInt();
        ArrayNode allValues = (ArrayNode) questionDetails.get("allValues");

        Integer newOffset;
        if (questionDetails.has("offset")) {
            Integer previousOffset = questionDetails.get("offset").asInt();
            if (previousOffset + batchSize > allValues.size())
                return null;
            newOffset = previousOffset + batchSize;
        } else {
            newOffset = 0;
        }

        ArrayNode nextSet = objectMapper.createArrayNode();

        Integer upperLimit = newOffset + batchSize < allValues.size() ? newOffset + batchSize : allValues.size();

        for (int i = newOffset; i < upperLimit; i++) {
            ObjectNode value = objectMapper.createObjectNode();
            value.put("index", i + 1);
            value.set("value", allValues.get(i));
            nextSet.add(value);
        }

        if (upperLimit < allValues.size()) {
            ObjectNode value = objectMapper.createObjectNode();
            value.put("index", nextKeywordSymbol);
            ObjectNode nextKeywordLocaliztionJson = objectMapper.createObjectNode();
            nextKeywordLocaliztionJson.put("value", nextKeyword);
            value.set("value", nextKeywordLocaliztionJson);
            nextSet.add(value);
        }

        ((ObjectNode) questionDetails).put("offset", newOffset);
        ((ObjectNode) questionDetails).set("askedValues", nextSet);

        return questionDetails;
    }

    public EgovChat extractAnswer(JsonNode config, EgovChat chatNode) throws IOException {
        boolean displayValuesAsOptions = config.get("displayValuesAsOptions") != null && config.get("displayValuesAsOptions").asBoolean();
        boolean multipleAnswersAllowed = config.get("multipleAnswers") != null && config.get("multipleAnswers").asBoolean();

        String answer = chatNode.getMessage().getRawInput();
        ConversationState conversationState = getConversationStateForChat(chatNode);
        JsonNode questionDetails = conversationState.getQuestionDetails();

        ArrayNode allValues = (ArrayNode) questionDetails.get("allValues");
        ArrayNode validValues = allValues.deepCopy();

        if (displayValuesAsOptions) {
            Integer offset = questionDetails.get("offset").asInt();
            Integer batchSize = questionDetails.get("batchSize").asInt();
            Integer upperLimit = Math.min(offset + batchSize, allValues.size());
            validValues = objectMapper.createArrayNode();
            for (int i = 0; i < upperLimit; i++) {
                validValues.add(allValues.get(i));
            }
        }

        Integer answerIndex = null;
        Boolean reQuestion = false;
        String finalAnswer = null;
        if(multipleAnswersAllowed && checkIfInputContainsMultipleChoices(answer)) {
            List<String> answers = new ArrayList<>();
            List<Integer> indices = getMultipleAnswerIndices(answer);
            for(Integer index : indices) {
                String value = "";
                JsonNode answerLocalizationCode = validValues.get(index);
                log.debug("answerLocalizationCode  : " + answerLocalizationCode);
                if (answerLocalizationCode.has("code"))
                    value = answerLocalizationCode.get("code").asText();
                else if (answerLocalizationCode.has("value"))
                    value = answerLocalizationCode.get("value").asText();
                answers.add(valueFetcher.getCodeForValue(config, chatNode, value));
            }
            finalAnswer = "";
            for(String string : answers) {
                finalAnswer += string + ", ";
            }
            finalAnswer = finalAnswer.substring(0, finalAnswer.length() - 2); //To remove ", "
        } else if (displayValuesAsOptions && (answer.equalsIgnoreCase(nextKeyword) || answer.equalsIgnoreCase(nextKeywordSymbol))) {
            reQuestion = true;
        } else if (displayValuesAsOptions && checkIfAnswerIsIndex(answer)) {
            answerIndex = Integer.parseInt(answer) - 1;
        } else {
            Integer highestFuzzyScoreMatch = 0;
            answerIndex = 0;
            String locale = chatNode.getConversationState().getLocale();
            List<LocalizationCode> localizationCodes = Arrays.asList(objectMapper.convertValue(allValues, LocalizationCode[].class));
            List<String> localizedValidValues = localizationService.getMessagesForCodes(localizationCodes, locale);
            for (int i = 0; i < localizedValidValues.size(); i++) {
                if (localizedValidValues.get(i) == null)
                    continue;
                Integer score = FuzzySearch.ratio(localizedValidValues.get(i), answer);
                if (score > highestFuzzyScoreMatch) {
                    highestFuzzyScoreMatch = score;
                    answerIndex = i;
                }
            }
        }

        if (reQuestion) {
            chatNode.setAskForNextBatch(true);
            finalAnswer = nextKeyword;
        } else if(!(multipleAnswersAllowed && checkIfInputContainsMultipleChoices(answer))) {
            JsonNode answerLocalizationCode = validValues.get(answerIndex);
            log.debug("answerLocalizationCode  : " + answerLocalizationCode);
            if (answerLocalizationCode.has("code"))
                finalAnswer = answerLocalizationCode.get("code").asText();
            else if (answerLocalizationCode.has("value"))
                finalAnswer = answerLocalizationCode.get("value").asText();
            log.debug("Final Answer : " + finalAnswer);
            finalAnswer = valueFetcher.getCodeForValue(config, chatNode, finalAnswer);
        }

        chatNode.getMessage().setMessageContent(finalAnswer);

        return chatNode;
    }

    private List<Integer> getMultipleAnswerIndices(String answer) {
        String[] answers = answer.split(",");
        List<Integer> indices = new ArrayList<>();
        for(String string: answers) {
            indices.add(Integer.parseInt(string));
        }
        return indices;
    }

    boolean checkIfInputContainsMultipleChoices(String answer) {
        return answer.indexOf(',') != -1;
    }

    private boolean checkIfAnswerIsIndex(String answer) {
        return StringUtils.isNumeric(answer.trim());
    }

    // TODO : Get Question Details from ChatNode
    private ConversationState getConversationStateForChat(EgovChat chatNode) {
        String conversationId = chatNode.getConversationState().getConversationId();
        return conversationStateRepository.getConversationStateForId(conversationId);
    }

    public boolean isValid(JsonNode config, EgovChat chatNode) throws IOException {
        try {
            boolean displayValuesAsOptions = config.get("displayValuesAsOptions") != null && config.get("displayValuesAsOptions").asBoolean();
            boolean multipleAnswersAllowed = config.get("multipleAnswers") != null && config.get("multipleAnswers").asBoolean();

            String answer = chatNode.getMessage().getRawInput();

            ConversationState conversationState = getConversationStateForChat(chatNode);
            JsonNode questionDetails = conversationState.getQuestionDetails();

            ArrayNode allValues = (ArrayNode) questionDetails.get("allValues");

            if (multipleAnswersAllowed && checkIfInputContainsMultipleChoices(answer)) {
                ArrayNode validValues = getValidValuesForQuestionDetails(questionDetails);
                List<Integer> indices = getMultipleAnswerIndices(answer);
                boolean isValid = true;
                for (Integer index : indices) {
                    if (index < 0 || index >= validValues.size()) {
                        isValid = false;
                    }
                }
                return isValid;
            }

            if (displayValuesAsOptions && (answer.equalsIgnoreCase(nextKeyword) || answer.equalsIgnoreCase(nextKeywordSymbol))) {
                return true;
            } else if (displayValuesAsOptions && checkIfAnswerIsIndex(answer)) {
                ArrayNode validValues = getValidValuesForQuestionDetails(questionDetails);
                Integer answerInteger = Integer.parseInt(answer);
                return answerInteger > 0 && answerInteger <= validValues.size();
            } else {
                String locale = chatNode.getConversationState().getLocale();
                List<LocalizationCode> localizationCodes = Arrays.asList(objectMapper.convertValue(allValues, LocalizationCode[].class));
                List<String> localizedValidValues = localizationService.getMessagesForCodes(localizationCodes, locale);
                return fuzzyMatchAnswerWithValidValues(answer, localizedValidValues, config);
            }
        } catch (Exception e) {
            log.error("Error when checking validity : ", e);
            return false;
        }
    }

    ArrayNode getValidValuesForQuestionDetails(JsonNode questionDetails) {
        ArrayNode allValues = (ArrayNode) questionDetails.get("allValues");
        Integer offset = questionDetails.get("offset").asInt();
        Integer batchSize = questionDetails.get("batchSize").asInt();
        Integer upperLimit = Math.min(offset + batchSize, allValues.size());
        ArrayNode validValues = objectMapper.createArrayNode();
        for (int i = 0; i < upperLimit; i++) {
            validValues.add(allValues.get(i));
        }
        return validValues;
    }

    boolean fuzzyMatchAnswerWithValidValues(String answer, List<String> validValues, JsonNode config) {

        Integer matchScoreThreshold = config.get("matchAnswerThreshold").asInt();

        Integer fuzzyMatchScore;
        for (String validValue : validValues) {
            fuzzyMatchScore = FuzzySearch.ratio(answer, validValue);
            if (fuzzyMatchScore >= matchScoreThreshold)
                return true;
        }
        return false;
    }

}
