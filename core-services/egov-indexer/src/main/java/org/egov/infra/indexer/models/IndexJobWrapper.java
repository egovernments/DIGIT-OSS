package org.egov.infra.indexer.models;


import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class IndexJobWrapper {
	
	@JsonProperty("RequestInfo")
	public RequestInfo requestInfo;
	
	@JsonProperty("job")
	public IndexJob job;

}
