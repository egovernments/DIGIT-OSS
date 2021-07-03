package org.egov.pgr.contract;

import java.util.List;

import javax.validation.constraints.NotNull;

import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class ReportRequest {

	@NotNull
	@JsonProperty("RequestInfo")
	private RequestInfo requestInfo;
	
	@NotNull
	@JsonProperty("tenantId")
	private String tenantId;
	
	@NotNull
	@JsonProperty("reportName")
	private String reportName;
	
	@JsonProperty("searchParams")
	private List<ParamValue> searchParams;
	
	
}
