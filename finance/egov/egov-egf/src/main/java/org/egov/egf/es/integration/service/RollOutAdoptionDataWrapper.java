package org.egov.egf.es.integration.service;

import org.egov.infra.microservice.models.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RollOutAdoptionDataWrapper {
    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;
    @JsonProperty("rollOutAdoptionData")
    private RollOutAdoptionData rollOutAdoptionData;
    public RequestInfo getRequestInfo() {
        return requestInfo;
    }
    public void setRequestInfo(RequestInfo requestInfo) {
        this.requestInfo = requestInfo;
    }
    public RollOutAdoptionData getRollOutAdoptionData() {
        return rollOutAdoptionData;
    }
    public void setRollOutAdoptionData(RollOutAdoptionData rollOutAdoptionData) {
        this.rollOutAdoptionData = rollOutAdoptionData;
    }
    
}
