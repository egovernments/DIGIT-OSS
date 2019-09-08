package org.egov.web.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.egov.common.contract.response.ResponseInfo;

@Getter
@AllArgsConstructor
public class CacheBustResponse {
	private ResponseInfo responseInfo;
	@JsonProperty("isSuccessful")
	private boolean isSuccessful;
}
