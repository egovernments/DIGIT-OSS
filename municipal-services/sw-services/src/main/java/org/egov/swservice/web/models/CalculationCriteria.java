package org.egov.swservice.web.models;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * CalulationCriteria
 */
@Validated
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class CalculationCriteria {

	@Valid
	@JsonProperty("sewerageConnection")
	private SewerageConnection sewerageConnection;

	@JsonProperty("connectionNo")
	private String connectionNo;

	@JsonProperty("assessmentYear")
	private String assessmentYear;

	@NotNull
	@JsonProperty("tenantId")
	private String tenantId;
	

	// Demand Generation
	@JsonProperty("from")
	private Long from;

	@JsonProperty("to")
	private Long to;

	// Fee Estimation
	@JsonProperty("applicationNo")
	private String applicationNo;

}
