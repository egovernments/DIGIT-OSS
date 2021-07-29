package org.egov.bpa.calculator.web.models;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.egov.bpa.calculator.web.models.bpa.BPA;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonProperty;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CalulationCriteria {

	@JsonProperty("BPA")
	@Valid
	private BPA bpa = null;

	@JsonProperty("applicationNo")
	@Size(min = 2, max = 64)
	private String applicationNo = null;

	@JsonProperty("tenantId")
	@NotNull
	@Size(min = 2, max = 256)
	private String tenantId = null;
	
	@JsonProperty("feeType")
	@NotNull
	@Size(min = 2, max = 64)
	private String feeType = null;

}
