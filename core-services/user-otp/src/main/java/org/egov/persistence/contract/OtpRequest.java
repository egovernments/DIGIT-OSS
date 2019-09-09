package org.egov.persistence.contract;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class OtpRequest {
    private Otp otp;

    public OtpRequest(org.egov.domain.model.OtpRequest otpRequest) {
        this.otp = Otp.builder()
                .tenantId(otpRequest.getTenantId())
                .identity(otpRequest.getMobileNumber())
                .build();
    }
}


