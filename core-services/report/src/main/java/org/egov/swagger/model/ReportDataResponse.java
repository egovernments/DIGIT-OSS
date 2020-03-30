package org.egov.swagger.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.egov.common.contract.response.ResponseInfo;

public class ReportDataResponse {

    @JsonProperty("tenantId")
    private String tenantId = null;

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public ReportDataResponse requestInfo(ResponseInfo requestInfo) {
        this.requestInfo = requestInfo;
        return this;
    }

    @JsonProperty("requestInfo")
    private ResponseInfo requestInfo = null;

    public ResponseInfo getRequestInfo() {
        return requestInfo;
    }

    public void setResponseInfo(ResponseInfo requestInfo) {
        this.requestInfo = requestInfo;
    }

    @JsonProperty("reportData")
    public List<ReportResponse> reportResponses = new ArrayList<ReportResponse>();

    public List<ReportResponse> getReportResponses() {
        return reportResponses;
    }

    public void setReportResponses(List<ReportResponse> reportResponses) {
        this.reportResponses = reportResponses;
    }


}
