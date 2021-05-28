package org.egov.infra.microservice.models;

public class BusinessAccountSubLedger {

    private Long id;

    private Long detailType;

    private Long detailKey;

    private Double amount;

    private Long businessAccountDetails;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDetailType() {
        return detailType;
    }

    public void setDetailType(Long detailType) {
        this.detailType = detailType;
    }

    public Long getDetailKey() {
        return detailKey;
    }

    public void setDetailKey(Long detailKey) {
        this.detailKey = detailKey;
    }

    public Double getAmount() {
        return amount == null ? Double.valueOf(0) : amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Long getBusinessAccountDetails() {
        return businessAccountDetails;
    }

    public void setBusinessAccountDetails(Long businessAccountDetails) {
        this.businessAccountDetails = businessAccountDetails;
    }

}
