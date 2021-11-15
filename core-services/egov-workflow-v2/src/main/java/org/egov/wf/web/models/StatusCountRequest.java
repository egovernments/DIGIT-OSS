package org.egov.wf.web.models;

import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class StatusCountRequest {

    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;

    @JsonProperty("ProcessInstanceSearchCriteria")
    private ProcessInstanceSearchCriteria processInstanceSearchCriteria;
}
