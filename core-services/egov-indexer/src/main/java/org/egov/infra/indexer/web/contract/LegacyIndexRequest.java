package org.egov.infra.indexer.web.contract;

import javax.validation.constraints.NotNull;

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
public class LegacyIndexRequest {
	
	@NotNull
	@JsonProperty("RequestInfo")
	public RequestInfo requestInfo;
	
	@NotNull
	@JsonProperty("apiDetails")
	public APIDetails apiDetails;
	
	@NotNull
	@JsonProperty("legacyIndexTopic")
	public String legacyIndexTopic;
	
	@NotNull
	@JsonProperty("tenantId")
	public String tenantId;
	
	public String jobId;
	
	public Long startTime;
	
	public Integer totalRecords;

}
