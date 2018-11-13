package org.egov.infra.microservice.models;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Receipt {

    private String tenantId;

    private String transactionId;

    @JsonProperty("Bill")
    private List<Bill> bill = new ArrayList<>();

    private AuditDetails auditDetails;

    private Instrument instrument;

    private String remittanceReferenceNumber;

    private String serviceName;

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

    public List<Bill> getBill() {
        return bill;
    }

    public void setBill(List<Bill> bill) {
        this.bill = bill;
    }

    public Instrument getInstrument() {
        return instrument;
    }

    public void setInstrument(Instrument instrument) {
        this.instrument = instrument;
    }

    public String getRemittanceReferenceNumber() {
        return remittanceReferenceNumber;
    }

    public void setRemittanceReferenceNumber(String remittanceReferenceNumber) {
        this.remittanceReferenceNumber = remittanceReferenceNumber;
    }

    public AuditDetails getAuditDetails() {
        return auditDetails;
    }

    public void setAuditDetails(AuditDetails auditDetails) {
        this.auditDetails = auditDetails;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

}
