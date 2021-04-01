package org.egov.bpa.calculator.web.models.landinfo;

import java.util.List;

import org.egov.bpa.calculator.web.models.demand.TaxHeadEstimate;

import lombok.Data;

import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class EstimatesAndSlabs {

	 @JsonProperty("estimates")
	    private List<TaxHeadEstimate> estimates;
}
