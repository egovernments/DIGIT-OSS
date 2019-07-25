package org.egov.infra.microservice.models;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;

public class TaxAndPayment {
    @NotNull
    private String businessService;
    
    private BigDecimal taxAmount;
    
    @NotNull
    private BigDecimal amountPaid;

    public String getBusinessService() {
        return businessService;
    }

    public void setBusinessService(String businessService) {
        this.businessService = businessService;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }

    public BigDecimal getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(BigDecimal amountPaid) {
        this.amountPaid = amountPaid;
    }
    
    
}
