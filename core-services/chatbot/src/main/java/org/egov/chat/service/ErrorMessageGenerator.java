package org.egov.chat.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.chat.models.EgovChat;
import org.egov.chat.models.LocalizationCode;
import org.egov.chat.models.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class ErrorMessageGenerator {

    @Autowired
    private ObjectMapper objectMapper;

    public void fillErrorMessageInChatNode(JsonNode config, EgovChat chatNode) {
        String errorMessage = getErrorMessageForConfig(config);
        if (errorMessage == null) {
            return;
        }

//        EgovChat errorMessageNode = chatNode.toBuilder().build();


        LocalizationCode localizationCode = LocalizationCode.builder().code(getErrorMessageForConfig(config)).build();
        List<LocalizationCode> localizationCodesArray = new ArrayList<>();
        localizationCodesArray.add(localizationCode);
        Response response = Response.builder().type("text").timestamp(System.currentTimeMillis()).nodeId(config.get("name").asText())
                .localizationCodes(localizationCodesArray).build();
        chatNode.setResponse(response);
    }

    private String getErrorMessageForConfig(JsonNode config) {
        if (config.has("errorMessage"))
            return config.get("errorMessage").asText();
        return null;
    }

}
