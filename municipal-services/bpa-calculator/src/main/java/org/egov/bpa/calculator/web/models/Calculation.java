package org.egov.bpa.calculator.web.models;

import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.egov.bpa.calculator.web.models.bpa.BPA;
import org.egov.bpa.calculator.web.models.demand.TaxHeadEstimate;

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
public class Calculation {


	@JsonProperty("applicationNumber")
	private String applicationNumber = null;

	@JsonProperty("BPA")
	private BPA bpa = null;

	@NotNull
	@JsonProperty("tenantId")
	@Size(min = 2, max = 256)
	private String tenantId = null;

	@JsonProperty("taxHeadEstimates")
	List<TaxHeadEstimate> taxHeadEstimates;
	
	@JsonProperty("feeType")
	String feeType = null;
}
