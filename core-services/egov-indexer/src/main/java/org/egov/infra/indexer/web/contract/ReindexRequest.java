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
public class ReindexRequest {

	@NotNull
	@JsonProperty("RequestInfo")
	public RequestInfo requestInfo;
	
	@NotNull
	@JsonProperty("index")
	public String index;
	
	@NotNull
	@JsonProperty("type")
	public String type;
	
	@NotNull
	@JsonProperty("reindexTopic")
	public String reindexTopic;
	
	@NotNull
	@JsonProperty("tenantId")
	public String tenantId;
	
	@JsonProperty("batchSize")
	public Integer batchSize;
	
	public String jobId;
	
	public Long startTime;
	
	public Integer totalRecords;
	
}


