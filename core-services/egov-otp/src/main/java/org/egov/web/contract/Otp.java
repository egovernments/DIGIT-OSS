package org.egov.web.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import org.egov.domain.model.Token;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Otp {
    private String otp;
    @JsonProperty("UUID")
    private String uuid;
    private String identity;
    private String tenantId;
    @JsonProperty("isValidationSuccessful")
    private boolean validationSuccessful;

    public Otp(Token token) {
        otp = token.getNumber();
        uuid = token.getUuid();
        identity = token.getIdentity();
        tenantId = token.getTenantId();
        validationSuccessful = token.isValidated();
    }
}
