package org.egov.domain.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.util.CollectionUtils;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@Getter
public class Tokens {
    private List<Token> tokens;

    public boolean hasSingleNonExpiredToken(LocalDateTime now) {
        return !CollectionUtils.isEmpty(tokens)
                && tokens.stream().anyMatch(token -> !token.isExpired(now));
    }

    public Token getNonExpiredToken(LocalDateTime now) {
        return tokens.stream()
                .filter(token -> !token.isExpired(now))
                .findFirst()
                .orElse(null);
    }
}
