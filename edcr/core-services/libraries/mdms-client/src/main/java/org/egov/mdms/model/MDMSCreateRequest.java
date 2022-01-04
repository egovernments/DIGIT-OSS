package org.egov.mdms.model;

import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class MDMSCreateRequest {

	@JsonProperty("RequestInfo")
	public RequestInfo requestInfo;
	
	@JsonProperty("MasterMetaData")
	public MasterMetaData masterMetaData;
	
}
