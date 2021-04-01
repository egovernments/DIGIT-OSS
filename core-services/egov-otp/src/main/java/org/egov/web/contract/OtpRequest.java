package org.egov.web.contract;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import org.egov.domain.model.TokenRequest;
import org.egov.domain.model.TokenSearchCriteria;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class OtpRequest {
    private Otp otp;

    public TokenRequest getTokenRequest() {
        return new TokenRequest(getIdentity(), getTenantId());
    }

    public TokenSearchCriteria toSearchCriteria() {
        return new TokenSearchCriteria(getUUID(), getTenantId());
    }

    @JsonIgnore
    private String getIdentity() {
        return otp != null ? otp.getIdentity() : null;
    }

    @JsonIgnore
    private String getUUID() {
        return otp != null ? otp.getUuid() : null;
    }

    @JsonIgnore
    private String getTenantId() {
        return otp != null ? otp.getTenantId() : null;
    }
}


