package org.egov.infra.microservice.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BusinessDetailsResponse {
    @JsonProperty("ResponseInfo")
    private ResponseInfo responseInfo;

    @JsonProperty("BusinessDetails")
    private List<BusinessDetails> businessDetails;

    public ResponseInfo getResponseInfo() {
        return responseInfo;
    }

    public void setResponseInfo(ResponseInfo responseInfo) {
        this.responseInfo = responseInfo;
    }

    public List<BusinessDetails> getBusinessDetails() {
        return businessDetails;
    }

    public void setBusinessDetails(List<BusinessDetails> businessDetails) {
        this.businessDetails = businessDetails;
    }

}
