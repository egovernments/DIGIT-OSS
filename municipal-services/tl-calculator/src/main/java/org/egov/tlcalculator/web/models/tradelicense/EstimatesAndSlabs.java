package org.egov.tlcalculator.web.models.tradelicense;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.egov.tlcalculator.web.models.FeeAndBillingSlabIds;
import org.egov.tlcalculator.web.models.demand.TaxHeadEstimate;

import java.util.List;

@Data
public class EstimatesAndSlabs {

    @JsonProperty("estimates")
    private List<TaxHeadEstimate> estimates;

    @JsonProperty("tradeTypeFeeAndBillingSlabIds")
    private FeeAndBillingSlabIds tradeTypeFeeAndBillingSlabIds;

    @JsonProperty("accessoryFeeAndBillingSlabIds")
    private FeeAndBillingSlabIds accessoryFeeAndBillingSlabIds;



}
