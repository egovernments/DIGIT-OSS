package org.egov.pt.calculator.web.models;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Validated

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class MutationCalculatorReq {
	
    @JsonProperty("RequestInfo")
	private RequestInfo requestInfo;
	
    @JsonProperty("mutationCalculationCriteria")
	private List<MutationCalculationCriteria> mutationCalculationCriteria;

}
