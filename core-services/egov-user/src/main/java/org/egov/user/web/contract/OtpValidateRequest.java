package org.egov.user.web.contract;

import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@Builder
@ToString
public class OtpValidateRequest {
	@JsonProperty("RequestInfo")
    private RequestInfo requestInfo;
    private Otp otp;
}

