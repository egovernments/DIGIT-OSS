package org.egov.pt.calculator.web.models;

import java.util.List;

import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MutationBillingSlabReq {
    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;

    @JsonProperty("MutationBillingSlab")
    @Valid
    private List<MutationBillingSlab> billingSlab;


    public MutationBillingSlabReq addMutationBillingSlabItem(MutationBillingSlab billingSlabItem) {
        this.billingSlab.add(billingSlabItem);
        return this;
    }
}
