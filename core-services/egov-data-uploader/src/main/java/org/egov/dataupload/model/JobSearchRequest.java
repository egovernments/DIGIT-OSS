package org.egov.dataupload.model;


import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class JobSearchRequest   {
	 
	  @JsonProperty("tenantId")
	  private String tenantId;
	
	  @JsonProperty("codes")
	  private List<String> codes;
	
	  @JsonProperty("statuses")
	  private List<String> statuses;
	
	  @JsonProperty("requesterNames")
	  private List<String> requesterNames;
	
	  @JsonProperty("startDate")
	  private Long startDate;
	
	  @JsonProperty("endDate")
	  private Long endDate;
	  
	  @JsonProperty("requestFileNames")
	  private List<String> requestFileNames;
	
	  @JsonProperty("RequestInfo")
	  private RequestInfo requestInfo;
}

