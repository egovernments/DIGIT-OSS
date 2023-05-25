package org.egov.infra.microservice.models;

import java.util.List;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.SafeHtml;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Bill {
    @JsonProperty("id")
    @SafeHtml
    private String id = null;
    @SafeHtml
    @JsonProperty("mobileNumber")
    private String mobileNumber = null;
    @SafeHtml
    @JsonProperty("paidBy")
    private String paidBy = null;
    @SafeHtml
    @JsonProperty("payerName")
    private String payerName = null;
    @SafeHtml
    @JsonProperty("payerAddress")
    private String payerAddress = null;
    @SafeHtml
    @JsonProperty("payerEmail")
    private String payerEmail = null;
    @SafeHtml
    @JsonProperty("payerId")
    private String payerId = null;

    @JsonProperty("isActive")
    private Boolean isActive = null;

    @JsonProperty("isCancelled")
    private Boolean isCancelled = null;

    @JsonProperty("additionalDetails")
    private Object additionalDetails = null;

    @JsonProperty("taxAndPayments")
    @Valid
    @NotNull
    private List<TaxAndPayment> taxAndPayments = null;

    @JsonProperty("billDetails")
    @Valid
    private List<BillDetail> billDetails = null;
    @SafeHtml
    @JsonProperty("tenantId")
    private String tenantId = null;

    @JsonProperty("auditDetails")
    private AuditDetails auditDetails = null;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getPaidBy() {
        return paidBy;
    }

    public void setPaidBy(String paidBy) {
        this.paidBy = paidBy;
    }

    public String getPayerName() {
        return payerName;
    }

    public void setPayerName(String payerName) {
        this.payerName = payerName;
    }

    public String getPayerAddress() {
        return payerAddress;
    }

    public void setPayerAddress(String payerAddress) {
        this.payerAddress = payerAddress;
    }

    public String getPayerEmail() {
        return payerEmail;
    }

    public void setPayerEmail(String payerEmail) {
        this.payerEmail = payerEmail;
    }

    public String getPayerId() {
        return payerId;
    }

    public void setPayerId(String payerId) {
        this.payerId = payerId;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getIsCancelled() {
        return isCancelled;
    }

    public void setIsCancelled(Boolean isCancelled) {
        this.isCancelled = isCancelled;
    }

    public Object getAdditionalDetails() {
        return additionalDetails;
    }

    public void setAdditionalDetails(Object additionalDetails) {
        this.additionalDetails = additionalDetails;
    }

    public List<TaxAndPayment> getTaxAndPayments() {
        return taxAndPayments;
    }

    public void setTaxAndPayments(List<TaxAndPayment> taxAndPayments) {
        this.taxAndPayments = taxAndPayments;
    }

    public List<BillDetail> getBillDetails() {
        return billDetails;
    }

    public void setBillDetails(List<BillDetail> billDetails) {
        this.billDetails = billDetails;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public AuditDetails getAuditDetails() {
        return auditDetails;
    }

    public void setAuditDetails(AuditDetails auditDetails) {
        this.auditDetails = auditDetails;
    }
    
    
}