package org.egov.persistence.contract;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
public class Otp {
    private String otp;
    private String identity;
    private String tenantId;
    @JsonProperty("isValidationSuccessful")
    private boolean validationSuccessful;
}


