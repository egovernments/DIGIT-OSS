package org.egov.infra.microservice.models;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.SafeHtml;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Receipt {
    @SafeHtml
    @NotNull
    private String tenantId;
    @SafeHtml
    private String transactionId;

    // Read only, populated during search
    @SafeHtml
    private String receiptNumber;

    // Read only, populated during search
    @SafeHtml
    private String consumerCode;

    // Read only, populated during search
    private Long receiptDate;

    @NotNull
    @Size(min = 1, max = 1)
    @Valid
    @JsonProperty("Bill")
    private List<Bill> bill = new ArrayList<>();

    private AuditDetails auditDetails;

    @Valid
    private Instrument instrument;
    
    @JsonIgnore
    @SafeHtml
    private String paymentId;
    
    @JsonIgnore
    private Date remittedOn;
    
    @JsonIgnore
    @SafeHtml
    private String remitterId;
    
    @JsonIgnore
    @SafeHtml
    private String bankName;
    
    @JsonIgnore
    @SafeHtml
    private String branchName;
    
    @JsonIgnore
    @SafeHtml
    private String accNumber;
    
    @JsonIgnore
    @SafeHtml
    private String payee;
    
    @JsonIgnore
    @SafeHtml
    private String drawer;
    
    @JsonIgnore
    @SafeHtml
    private String transactionNumber;
    
    private String service;

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getReceiptNumber() {
        return receiptNumber;
    }

    public void setReceiptNumber(String receiptNumber) {
        this.receiptNumber = receiptNumber;
    }

    public String getConsumerCode() {
        return consumerCode;
    }

    public void setConsumerCode(String consumerCode) {
        this.consumerCode = consumerCode;
    }

    public Long getReceiptDate() {
        return receiptDate;
    }

    public void setReceiptDate(Long receiptDate) {
        this.receiptDate = receiptDate;
    }

    public List<Bill> getBill() {
        return bill;
    }

    public void setBill(List<Bill> bill) {
        this.bill = bill;
    }

    public AuditDetails getAuditDetails() {
        return auditDetails;
    }

    public void setAuditDetails(AuditDetails auditDetails) {
        this.auditDetails = auditDetails;
    }

    public Instrument getInstrument() {
        return instrument;
    }

    public void setInstrument(Instrument instrument) {
        this.instrument = instrument;
    }
    
    public String getPaymentId() {
        return paymentId;
    }
    
    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }
    
    public String getRemitterId() {
        return remitterId;
    }
    
    public void setRemitterId(String remitterId) {
        this.remitterId = remitterId;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }

    public String getAccNumber() {
        return accNumber;
    }

    public void setAccNumber(String accNumber) {
        this.accNumber = accNumber;
    }

    public String getPayee() {
        return payee;
    }

    public void setPayee(String payee) {
        this.payee = payee;
    }

    public String getDrawer() {
        return drawer;
    }

    public void setDrawer(String drawer) {
        this.drawer = drawer;
    }

    public String getTransactionNumber() {
        return transactionNumber;
    }

    public void setTransactionNumber(String transactionNumber) {
        this.transactionNumber = transactionNumber;
    }

    public Date getRemittedOn() {
        return remittedOn;
    }

    public void setRemittedOn(Date remittedOn) {
        this.remittedOn = remittedOn;
    }
    
    
}
