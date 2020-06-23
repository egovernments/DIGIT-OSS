package org.egov.chat.service.validation;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.egov.chat.models.EgovChat;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class TypeValidator {

    public boolean isValid(JsonNode config, EgovChat chatNode) {

        String type = config.get("type").asText();

        if (type.equalsIgnoreCase(chatNode.getMessage().getContentType())) {
            return true;
        }

        return false;
    }

}
