package org.egov.infra.microservice.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MdmsCriteriaReq {
    
    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;

    @JsonProperty("MdmsCriteria")
    private MdmsCriteria mdmsCriteria;

    public MdmsCriteriaReq(RequestInfo requestInfo, MdmsCriteria mdmsCriteria) {
        this.requestInfo = requestInfo;
        this.mdmsCriteria = mdmsCriteria;
    }

    public MdmsCriteriaReq() {
    }

    public RequestInfo getRequestInfo() {
        return requestInfo;
    }

    public void setRequestInfo(RequestInfo requestInfo) {
        this.requestInfo = requestInfo;
    }

    public MdmsCriteria getMdmsCriteria() {
        return mdmsCriteria;
    }

    public void setMdmsCriteria(MdmsCriteria mdmsCriteria) {
        this.mdmsCriteria = mdmsCriteria;
    }

}
