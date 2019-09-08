package org.egov.pgr.contract;

import java.util.List;

import org.egov.common.contract.response.ResponseInfo;
import org.egov.pgr.contract.ReportResponse.ReportResponseBuilder;

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
public class ColumnDetail {

	@JsonProperty("name")
	private String name;
	
	@JsonProperty("label")
	private String label;

	@JsonProperty("type")
	private String type;

	@JsonProperty("defaultValue")
	private Object defaultValue;

	@JsonProperty("showColumn")
	private Boolean showColumn;

	@JsonProperty("total")
	private Boolean total;

}
