package org.egov.web.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import org.egov.domain.model.Token;

import javax.validation.constraints.Size;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Otp {
    @Size(max = 128)
    private String otp;
    @JsonProperty("UUID")
    @Size(max = 36)
    private String uuid;
    @Size(max = 100)
    private String identity;
    @Size(max = 256)
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
