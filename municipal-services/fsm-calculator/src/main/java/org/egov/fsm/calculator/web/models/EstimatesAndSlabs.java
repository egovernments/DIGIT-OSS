package org.egov.fsm.calculator.web.models;

import java.util.List;

import org.egov.fsm.calculator.web.models.demand.TaxHeadEstimate;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class EstimatesAndSlabs {

	 @JsonProperty("estimates")
	    private List<TaxHeadEstimate> estimates;
}
