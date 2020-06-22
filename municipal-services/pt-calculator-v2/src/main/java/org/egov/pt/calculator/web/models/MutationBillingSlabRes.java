package org.egov.pt.calculator.web.models;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.egov.common.contract.response.ResponseInfo;
import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Validated
@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-05-31T14:59:52.408+05:30")

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MutationBillingSlabRes {
    @JsonProperty("ResponseInfo")
    private ResponseInfo responseInfo = null;

    @JsonProperty("MutationBillingSlab")
    @Valid
    private List<MutationBillingSlab> billingSlab = null;


    public MutationBillingSlabRes addBillingSlabItem(MutationBillingSlab billingSlabItem) {
        if (this.billingSlab == null) {
            this.billingSlab = new ArrayList<>();
        }
        this.billingSlab.add(billingSlabItem);
        return this;
    }
}
