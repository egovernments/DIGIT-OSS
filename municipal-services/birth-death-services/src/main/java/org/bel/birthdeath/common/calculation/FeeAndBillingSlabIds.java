package org.bel.birthdeath.common.calculation;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.util.List;

@Data
public class FeeAndBillingSlabIds {

    @JsonProperty("id")
    @Valid
    private String id;

    @JsonProperty("fee")
    @Valid
    private BigDecimal fee;

    @JsonProperty("billingSlabIds")
    @Valid
    private List<String> billingSlabIds;

}
