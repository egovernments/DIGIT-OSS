package org.egov.chat.service.validation;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.egov.chat.models.EgovChat;
import org.egov.chat.service.FixedSetValues;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class Validator {

    @Autowired
    private TypeValidator typeValidator;
    @Autowired
    private FixedSetValues fixedSetValues;

    public boolean isValid(JsonNode config, EgovChat chatNode) {
        try {
            if (!(config.get("validationRequired") != null && config.get("validationRequired").asText()
                    .equalsIgnoreCase("true"))) {
                chatNode.getMessage().setValid(true);
                return true;
            }

            if (!typeValidator.isValid(config, chatNode)) {
                chatNode.getMessage().setValid(false);
                return false;
            }

            if (config.get("validationRequired") != null && config.get("validationRequired").asText().equalsIgnoreCase("true")) {
                if (config.get("typeOfValues") != null) {
                    String validatorType = config.get("typeOfValues").asText();
                    if (validatorType.equalsIgnoreCase("FixedSetValues")) {
                        boolean valid = fixedSetValues.isValid(config, chatNode);
                        chatNode.getMessage().setValid(valid);
                        return valid;
                    }
                }
            }
            chatNode.getMessage().setValid(true);
            return true;
        } catch (Exception e) {
            log.error("error in validator", e);
            chatNode.getMessage().setValid(false);
            return false;
        }
    }

}
