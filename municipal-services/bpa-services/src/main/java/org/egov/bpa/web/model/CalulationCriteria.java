package org.egov.bpa.web.model;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CalulationCriteria {

	@JsonProperty("BPA")
	@Valid
	private BPA bpa;

	@JsonProperty("applicationNo")
	@Size(min = 2, max = 64)
	private String applicationNo;

	@JsonProperty("tenantId")
	@NotNull
	@Size(min = 2, max = 256)
	private String tenantId;
	
	@JsonProperty("feeType")
	@NotNull
	@Size(min = 2, max = 64)
	private String feeType;

}
