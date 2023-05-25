package org.egov.infra.microservice.models;

import java.util.List;

import org.hibernate.validator.constraints.SafeHtml;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BusinessService {
    @SafeHtml
    private String businessService;
    @SafeHtml
    private String code;
    private List<String> collectionModesNotAllowed;
    private boolean partPaymentAllowed;
    private boolean isAdvanceAllowed;
    @JsonProperty("isVoucherCreationEnabled")
    private boolean isVoucherCreationEnabled;
    private boolean isActive;
    @SafeHtml
    private String type;

    public BusinessService() {
        // TODO Auto-generated constructor stub
    }

    public String getBusinessService() {
        return businessService;
    }

    public void setBusinessService(String businessService) {
        this.businessService = businessService;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public List<String> getCollectionModesNotAllowed() {
        return collectionModesNotAllowed;
    }

    public void setCollectionModesNotAllowed(List<String> collectionModesNotAllowed) {
        this.collectionModesNotAllowed = collectionModesNotAllowed;
    }

    public boolean isPartPaymentAllowed() {
        return partPaymentAllowed;
    }

    public void setPartPaymentAllowed(boolean partPaymentAllowed) {
        this.partPaymentAllowed = partPaymentAllowed;
    }

    public boolean isAdvanceAllowed() {
        return isAdvanceAllowed;
    }

    public void setAdvanceAllowed(boolean isAdvanceAllowed) {
        this.isAdvanceAllowed = isAdvanceAllowed;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean isActive) {
        this.isActive = isActive;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isVoucherCreationEnabled() {
        return isVoucherCreationEnabled;
    }

    public void setVoucherCreationEnabled(boolean isVoucherCreationEnabled) {
        this.isVoucherCreationEnabled = isVoucherCreationEnabled;
    }

}
