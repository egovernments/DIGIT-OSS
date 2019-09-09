package org.egov.persistence.contract;

import lombok.AllArgsConstructor;
import lombok.Getter;

import static org.springframework.util.StringUtils.isEmpty;

@Getter
@AllArgsConstructor
public class OtpResponse {
    private Otp otp;

    public String getOtpNumber() {
        return otp != null ? otp.getOtp() : null;
    }

    public boolean isOtpNumberAbsent() {
        return isEmpty(getOtpNumber());
    }
}


