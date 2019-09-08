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

/**
 * BillingSlabReq
 */

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BillingSlabReq   {
        @JsonProperty("RequestInfo")
        private RequestInfo requestInfo;

        @JsonProperty("BillingSlab")
        @Valid
        private List<BillingSlab> billingSlab;


        public BillingSlabReq addBillingSlabItem(BillingSlab billingSlabItem) {
        this.billingSlab.add(billingSlabItem);
        return this;
        }

}

