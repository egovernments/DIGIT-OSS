package org.egov.collection.web.contract.factory;

import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestInfoWrapper {

	@JsonProperty(value="RequestInfo")
	private RequestInfo requestInfo;
	
}