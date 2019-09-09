package org.egov.web.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OtpResponse {
    private ResponseInfo responseInfo;
    @JsonProperty("isSuccessful")
    private boolean successful;
}



