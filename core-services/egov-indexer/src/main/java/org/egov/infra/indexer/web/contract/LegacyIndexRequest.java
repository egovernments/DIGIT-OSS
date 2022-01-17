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
	private RequestInfo requestInfo;
	
	@NotNull
	@JsonProperty("apiDetails")
	private APIDetails apiDetails;
	
	@NotNull
	@JsonProperty("legacyIndexTopic")
	private String legacyIndexTopic;
	
	@NotNull
	@JsonProperty("tenantId")
	private String tenantId;

	private String jobId;

	private Long startTime;

	private Integer totalRecords;

}
