package org.egov.commons.web.contract;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Setter;
import org.egov.common.contract.response.ResponseInfo;

@Setter
public class BusinessDetailsResponse {
	@JsonProperty("ResponseInfo")
	private ResponseInfo responseInfo;

	@JsonProperty("BusinessDetails")
	private List<BusinessDetails> businessDetails;
}
