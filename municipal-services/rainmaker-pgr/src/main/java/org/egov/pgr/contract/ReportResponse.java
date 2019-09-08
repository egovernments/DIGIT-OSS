package org.egov.pgr.contract;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.response.ResponseInfo;

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
public class ReportResponse {

	@JsonProperty("ResponseInfo")
	private ResponseInfo responseInfo;

	@JsonProperty("reportHeader")
	private List<ColumnDetail> reportHeader = new ArrayList<ColumnDetail>();

	@JsonProperty("reportData")
	private List<List<Object>> reportData = new ArrayList<List<Object>>();

}
