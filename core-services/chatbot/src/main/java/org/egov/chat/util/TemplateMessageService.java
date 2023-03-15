package org.egov.chat.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.egov.chat.models.LocalizationCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
public class TemplateMessageService {

    @Autowired
    private LocalizationService localizationService;

    @Autowired
    private ObjectMapper objectMapper;

    public String getMessageForTemplate(LocalizationCode localizationCode, String locale) throws IOException {

        String templateId = localizationCode.getTemplateId();
        LocalizationCode templateLocalizationNode = LocalizationCode.builder().code(templateId).build();
        String templateString = localizationService.getMessageForCode(templateLocalizationNode, locale);

        ObjectNode params = (ObjectNode) localizationCode.getParams();

        Iterator<Map.Entry<String, JsonNode>> paramIterator = params.fields();
        while (paramIterator.hasNext()) {
            Map.Entry<String, JsonNode> param = paramIterator.next();
            String key = param.getKey();

            String localizedValue;
            if (param.getValue().isArray()) {
                localizedValue = "";
                List<LocalizationCode> localizationCodeList = Arrays.asList(objectMapper.convertValue(param.getValue(), LocalizationCode[].class));
                List<String> localizedValues = localizationService.getMessagesForCodes(localizationCodeList, locale);
                for (String string : localizedValues) {
                    localizedValue += string;
                }
            } else {
                localizedValue = localizationService.getMessageForCode(objectMapper.convertValue(param.getValue(), LocalizationCode.class), locale);
            }
            templateString = templateString.replace("{{" + key + "}}", localizedValue);
        }

        log.debug("Contructed Template Message : " + templateString);

        return templateString;
    }

}
