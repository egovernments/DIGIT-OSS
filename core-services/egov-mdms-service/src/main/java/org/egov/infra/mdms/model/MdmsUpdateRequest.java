package org.egov.infra.mdms.model;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.validation.constraints.NotNull;

import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@ToString
public class MdmsUpdateRequest {
	
	@JsonProperty("RequestInfo")
	@NotNull
	private RequestInfo requestInfo;
	
	@JsonProperty("MdmsReq")
	@NotNull
	private Map<String, Object> mdmsReq;

}
