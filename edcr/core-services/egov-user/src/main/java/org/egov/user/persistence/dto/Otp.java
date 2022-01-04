package org.egov.user.persistence.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class Otp {

    @JsonProperty("isValidationSuccessful")
    private boolean validationSuccessful;
    @JsonProperty("UUID")
    private String uuid;
    private String tenantId;
    private String identity;

    public boolean isValidationComplete(String mobileNumber) {
        return validationSuccessful && identity.equals(mobileNumber);
    }

}
