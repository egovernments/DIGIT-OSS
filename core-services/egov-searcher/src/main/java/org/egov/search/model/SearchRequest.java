package org.egov.search.model;

import javax.validation.constraints.NotNull;

import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;



@Getter
@Setter
@ToString
public class SearchRequest {
	
	@NotNull
	@JsonProperty("RequestInfo")
	private RequestInfo requestInfo;
	
	@NotNull
	@JsonProperty("searchCriteria")
	private Object searchCriteria;
  
}