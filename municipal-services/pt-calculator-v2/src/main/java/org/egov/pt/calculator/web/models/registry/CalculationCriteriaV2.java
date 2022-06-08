package org.egov.pt.calculator.web.models.registry;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class CalculationCriteriaV2 {
	
	@JsonProperty("property")
	@NotNull
	private Property property;
	
	@JsonProperty("assessment")
	@NotNull
	private Assessment assessment;
	
	@NotNull
	private String tenantId;

}
