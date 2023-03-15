package org.egov.infra.microservice.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BusinessCategoryResponse {
    @JsonProperty("ResponseInfo")
    private ResponseInfo responseInfo;

    @JsonProperty("BusinessCategory")
    private List<BusinessCategory> businessCategoryInfo;

    public ResponseInfo getResponseInfo() {
        return responseInfo;
    }

    public void setResponseInfo(ResponseInfo responseInfo) {
        this.responseInfo = responseInfo;
    }

    public List<BusinessCategory> getBusinessCategoryInfo() {
        return businessCategoryInfo;
    }

    public void setBusinessCategoryInfo(List<BusinessCategory> businessCategoryInfo) {
        this.businessCategoryInfo = businessCategoryInfo;
    }

}
