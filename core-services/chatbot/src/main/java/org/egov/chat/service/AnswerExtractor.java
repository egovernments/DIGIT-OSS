package org.egov.chat.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.egov.chat.models.EgovChat;
import org.egov.chat.service.valuefetch.ValueFetcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class AnswerExtractor {

    @Autowired
    private ValueFetcher valueFetcher;
    @Autowired
    private FixedSetValues fixedSetValues;

    public EgovChat extractAnswer(JsonNode config, EgovChat chatNode) throws IOException {
        if (config.get("typeOfValues") != null && config.get("typeOfValues").asText().equalsIgnoreCase("FixedSetValues")) {
            chatNode = fixedSetValues.extractAnswer(config, chatNode);
        }
        return chatNode;
    }

}
