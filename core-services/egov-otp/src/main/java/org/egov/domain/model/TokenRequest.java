package org.egov.domain.model;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;
import org.egov.domain.exception.InvalidTokenRequestException;

import static org.apache.commons.lang3.RandomStringUtils.randomNumeric;
import static org.springframework.util.StringUtils.isEmpty;

@Getter
@AllArgsConstructor
@EqualsAndHashCode
@ToString
public class TokenRequest {
    private static final int TTL_IN_SECONDS = 300;

    private String identity;
    private String tenantId;

    public long getTimeToLive() {
        return TTL_IN_SECONDS;
    }

    public void validate() {
        if (isIdentityAbsent() || isTenantIdAbsent()) {
            throw new InvalidTokenRequestException(this);
        }
    }

    public boolean isTenantIdAbsent() {
        return isEmpty(tenantId);
    }

    public boolean isIdentityAbsent() {
        return isEmpty(identity);
    }

    public String generateToken() {
        return randomNumeric(5);
    }
}

