package org.egov.commons.mdms.model;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.egov.infra.microservice.models.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MdmsCriteriaReq {

    @JsonProperty("RequestInfo")
    @Valid
    @NotNull
    private RequestInfo requestInfo;

    @JsonProperty("MdmsCriteria")
    @Valid
    @NotNull
    private MdmsCriteria mdmsCriteria;

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
