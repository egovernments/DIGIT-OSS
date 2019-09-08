package org.egov.commons.web.contract;

import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
@Getter
public class RequestInfoWrap {
	@JsonProperty("RequestInfo")
	private RequestInfo requestInfo;

}