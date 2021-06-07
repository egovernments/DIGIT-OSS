package org.egov.web.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
public class ApportionRequestV2 {

    @JsonProperty("businessService")
    private String businessService = null;

    @JsonProperty("amountPaid")
    private BigDecimal amountPaid = null;

    @JsonProperty("isAdvanceAllowed")
    private Boolean isAdvanceAllowed = null;

    @JsonProperty("buckets")
    private List<TaxDetail> taxDetails = null;


    public void addTaxDetail(TaxDetail taxDetail){
        if(this.taxDetails==null){
            this.taxDetails = new ArrayList<>();
            this.taxDetails.add(taxDetail);
        }
        else this.getTaxDetails().add(taxDetail);

    }



}
