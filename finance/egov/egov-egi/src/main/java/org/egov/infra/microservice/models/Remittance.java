package org.egov.infra.microservice.models;

import java.util.HashSet;
import java.util.Set;

public class Remittance {

    private String tenantId;

    private String id;

    private String referenceNumber;

    private Long referenceDate;

    private String voucherHeader;

    private String function;

    private String fund;

    private String remarks;

    private String reasonForDelay;

    private String status;

    private String bankaccount;

    private Set<RemittanceDetail> remittanceDetails = new HashSet<>();

    private Set<RemittanceInstrument> remittanceInstruments = new HashSet<>();

    private Set<RemittanceReceipt> remittanceReceipts = new HashSet<>();

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }

    public Long getReferenceDate() {
        return referenceDate;
    }

    public void setReferenceDate(Long referenceDate) {
        this.referenceDate = referenceDate;
    }

    public String getVoucherHeader() {
        return voucherHeader;
    }

    public void setVoucherHeader(String voucherHeader) {
        this.voucherHeader = voucherHeader;
    }

    public String getFunction() {
        return function;
    }

    public void setFunction(String function) {
        this.function = function;
    }

    public String getFund() {
        return fund;
    }

    public void setFund(String fund) {
        this.fund = fund;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getReasonForDelay() {
        return reasonForDelay;
    }

    public void setReasonForDelay(String reasonForDelay) {
        this.reasonForDelay = reasonForDelay;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getBankaccount() {
        return bankaccount;
    }

    public void setBankaccount(String bankaccount) {
        this.bankaccount = bankaccount;
    }

    public Set<RemittanceDetail> getRemittanceDetails() {
        return remittanceDetails;
    }

    public void setRemittanceDetails(Set<RemittanceDetail> remittanceDetails) {
        this.remittanceDetails = remittanceDetails;
    }

    public Set<RemittanceInstrument> getRemittanceInstruments() {
        return remittanceInstruments;
    }

    public void setRemittanceInstruments(Set<RemittanceInstrument> remittanceInstruments) {
        this.remittanceInstruments = remittanceInstruments;
    }

    public Set<RemittanceReceipt> getRemittanceReceipts() {
        return remittanceReceipts;
    }

    public void setRemittanceReceipts(Set<RemittanceReceipt> remittanceReceipts) {
        this.remittanceReceipts = remittanceReceipts;
    }

}
