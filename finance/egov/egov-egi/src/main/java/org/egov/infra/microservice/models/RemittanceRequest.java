package org.egov.infra.microservice.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RemittanceRequest {

    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;

    @JsonProperty("Remittance")
    private List<Remittance> remittances = null;

    public RequestInfo getRequestInfo() {
        return requestInfo;
    }

    public void setRequestInfo(RequestInfo requestInfo) {
        this.requestInfo = requestInfo;
    }

    public List<Remittance> getRemittances() {
        return remittances;
    }

    public void setRemittances(List<Remittance> remittances) {
        this.remittances = remittances;
    }

}
