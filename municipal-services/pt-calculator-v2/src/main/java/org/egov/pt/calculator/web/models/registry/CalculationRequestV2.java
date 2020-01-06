package org.egov.pt.calculator.web.models.registry;

import javax.validation.constraints.NotNull;

import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class CalculationRequestV2 {
	
	@JsonProperty("RequestInfo")
	@NotNull
    private RequestInfo requestInfo;
	
	@JsonProperty("calculationCriteria")
	@NotNull
    private CalculationCriteriaV2 calculationCriteria;

}
