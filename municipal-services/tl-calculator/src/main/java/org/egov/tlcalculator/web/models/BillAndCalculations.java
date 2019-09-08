package org.egov.tlcalculator.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.egov.tlcalculator.web.models.demand.BillResponse;

@Data
public class BillAndCalculations {

    @JsonProperty("billResponse")
    private BillResponse billResponse;

    @JsonProperty("billingSlabIds")
    private BillingSlabIds billingSlabIds;
}
