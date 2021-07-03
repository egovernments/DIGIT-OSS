package org.egov.tl.web.models.calculation;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class FeeAndBillingSlabIds {

    @JsonProperty("id")
    private String id;

    @JsonProperty("fee")
    private BigDecimal fee;

    @JsonProperty("billingSlabIds")
    private List<String> billingSlabIds;

}
