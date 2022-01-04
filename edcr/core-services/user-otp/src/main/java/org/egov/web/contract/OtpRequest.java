package org.egov.web.contract;

import lombok.*;
import org.egov.domain.model.OtpRequestType;

@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class OtpRequest {
    private RequestInfo requestInfo;
    private Otp otp;

    public org.egov.domain.model.OtpRequest toDomain() {
        return org.egov.domain.model.OtpRequest.builder()
                .mobileNumber(getMobileNumber())
                .tenantId(getTenantId())
                .type(getType())
                .userType(getUserType())
                .build();
    }

    private OtpRequestType getType() {
        return otp != null ? otp.getTypeOrDefault() : null;
    }

    private String getMobileNumber() {
        return otp != null ? otp.getMobileNumber() : null;
    }

    private String getUserType() {
        return otp != null ? otp.getUserType() : null;
    }

    private String getTenantId() {
        return otp != null ? otp.getTenantId() : null;
    }
}


