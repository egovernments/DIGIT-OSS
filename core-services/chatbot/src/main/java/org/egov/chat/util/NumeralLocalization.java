package org.egov.chat.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.chat.models.LocalizationCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
public class NumeralLocalization {

    @Autowired
    private ObjectMapper objectMapper;

    private String localizationPrefix = "chatbot.numbers.numeric";

    public List<LocalizationCode> getLocalizationCodesForStringContainingNumbers(String stringWithNumbers) {
        List<LocalizationCode> localizationCodes = new ArrayList<>();
        String tempString = "";
        for (char c : stringWithNumbers.toCharArray()) {
            if (Character.isDigit(c)) {
                if (!tempString.isEmpty()) {
                    localizationCodes.add(getLocalizationNodeForValue(tempString));
                    tempString = "";
                }
                localizationCodes.add(getLocalizationNodeForNumber(c));
            } else {
                tempString += c;
            }
        }
        if (!tempString.isEmpty()) {
            localizationCodes.add(getLocalizationNodeForValue(tempString));
        }
        return localizationCodes;
    }

    private LocalizationCode getLocalizationNodeForNumber(Character number) {
        return LocalizationCode.builder().code(localizationPrefix + number).build();
    }

    private LocalizationCode getLocalizationNodeForValue(String value) {
        return LocalizationCode.builder().value(value).build();
    }

}
