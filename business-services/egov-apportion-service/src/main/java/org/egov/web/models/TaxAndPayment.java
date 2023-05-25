package org.egov.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class TaxAndPayment {

    @JsonProperty("businessService")
    private String businessService = null;

    @JsonProperty("taxAmount")
    private BigDecimal taxAmount = null;

    @JsonProperty("amountPaid")
    private BigDecimal amountPaid = null;


}
