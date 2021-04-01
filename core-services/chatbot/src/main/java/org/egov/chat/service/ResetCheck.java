package org.egov.chat.service;

import lombok.extern.slf4j.Slf4j;
import me.xdrop.fuzzywuzzy.FuzzySearch;
import org.egov.chat.models.EgovChat;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ResetCheck {

    private String streamName = "reset-check";

    @Value("${flow.reset.keywords}")
    private String resetKeywordsString;

    private int fuzzymatchScoreThreshold = 90;

    public boolean isResetKeyword(EgovChat chatNode) {
        try {
            String answer = chatNode.getMessage().getRawInput();
            for (String resetKeyword : resetKeywordsString.split(",")) {
                int score = FuzzySearch.tokenSetRatio(resetKeyword, answer);
                if (score >= fuzzymatchScoreThreshold)
                    return true;
            }

            return false;
        } catch (Exception e) {
            log.error("error in reset check", e);
            return false;
        }
    }

}
