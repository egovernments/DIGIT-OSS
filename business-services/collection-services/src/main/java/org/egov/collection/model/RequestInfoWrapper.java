package org.egov.collection.model;

import lombok.Builder;
import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
public class RequestInfoWrapper {
	
	@JsonProperty("RequestInfo")
	private RequestInfo requestInfo;

}
