package org.egov.web.contract;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import org.egov.common.contract.request.RequestInfo;
import org.egov.domain.model.ValidateRequest;

import javax.validation.Valid;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class OtpValidateRequest {
    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;

    @JsonProperty("otp")
    @Valid
    private Otp otp;

    public ValidateRequest toDomainValidateRequest() {
        return ValidateRequest.builder()
                .tenantId(getTenantId())
                .identity(getIdentity())
                .otp(getOtp())
                .build();
    }

    @JsonIgnore
    private String getIdentity() {
        return otp != null ? otp.getIdentity() : null;
    }

    @JsonIgnore
    private String getOtp() {
        return otp != null ? otp.getOtp() : null;
    }

    @JsonIgnore
    private String getTenantId() {
        return otp != null ? otp.getTenantId() : null;
    }
}

