package org.egov.infra.microservice.models;

import java.util.List;

import org.hibernate.validator.constraints.SafeHtml;

public class BusinessAccountDetails {
    private Long id;

    private Long businessDetails;

    private Long chartOfAccounts;

    private Double amount;
    @SafeHtml
    private String tenantId;

    private List<BusinessAccountSubLedger> subledgerDetails;

    private ChartOfAccounts glCodeId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getBusinessDetails() {
        return businessDetails;
    }

    public void setBusinessDetails(Long businessDetails) {
        this.businessDetails = businessDetails;
    }

    public Long getChartOfAccounts() {
        return chartOfAccounts;
    }

    public void setChartOfAccounts(Long chartOfAccounts) {
        this.chartOfAccounts = chartOfAccounts;
    }

    public Double getAmount() {
        return amount == null ? Double.valueOf(0) : amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public List<BusinessAccountSubLedger> getSubledgerDetails() {
        return subledgerDetails;
    }

    public void setSubledgerDetails(List<BusinessAccountSubLedger> subledgerDetails) {
        this.subledgerDetails = subledgerDetails;
    }

    public ChartOfAccounts getGlCodeId() {
        return glCodeId;
    }

    public void setGlCodeId(ChartOfAccounts glCodeId) {
        this.glCodeId = glCodeId;
    }

}