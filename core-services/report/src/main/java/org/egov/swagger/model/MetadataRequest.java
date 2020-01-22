package org.egov.swagger.model;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;

import javax.validation.constraints.*;

/**
 * Request object to fetch the report data
 */


public class MetadataRequest {
    @JsonProperty("requestInfo")
    private org.egov.common.contract.request.RequestInfo requestInfo = null;

    @JsonProperty("tenantId")
    private String tenantId = null;

    @JsonProperty("reportName")
    private String reportName = null;

    public MetadataRequest requestInfo(org.egov.common.contract.request.RequestInfo requestInfo) {
        this.requestInfo = requestInfo;
        return this;
    }

    /**
     * Get requestInfo
     *
     * @return requestInfo
     **/

    @NotNull
    public org.egov.common.contract.request.RequestInfo getRequestInfo() {
        return requestInfo;
    }

    public void setRequestInfo(org.egov.common.contract.request.RequestInfo requestInfo) {
        this.requestInfo = requestInfo;
    }

    public MetadataRequest tenantId(String tenantId) {
        this.tenantId = tenantId;
        return this;
    }

    /**
     * tenantId for which the report is needed
     *
     * @return tenantId
     **/

    @NotNull
    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public MetadataRequest reportName(String reportName) {
        this.reportName = reportName;
        return this;
    }

    /**
     * name of the report. A tenant specific report can be defined with tenantId as the prefix of the report name. So if the system finds two reports - report1 and mytenant.report1 and the tenantId for this request is mytenant then report definition mytenant.report1 will be picked
     *
     * @return reportName
     **/

    @NotNull
    public String getReportName() {
        return reportName;
    }

    public void setReportName(String reportName) {
        this.reportName = reportName;
    }


    @Override
    public boolean equals(java.lang.Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        MetadataRequest metadataRequest = (MetadataRequest) o;
        return Objects.equals(this.requestInfo, metadataRequest.requestInfo) &&
                Objects.equals(this.tenantId, metadataRequest.tenantId) &&
                Objects.equals(this.reportName, metadataRequest.reportName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(requestInfo, tenantId, reportName);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class MetadataRequest {\n");

        sb.append("    requestInfo: ").append(toIndentedString(requestInfo)).append("\n");
        sb.append("    tenantId: ").append(toIndentedString(tenantId)).append("\n");
        sb.append("    reportName: ").append(toIndentedString(reportName)).append("\n");
        sb.append("}");
        return sb.toString();
    }

    /**
     * Convert the given object to string with each line indented by 4 spaces
     * (except the first line).
     */
    private String toIndentedString(java.lang.Object o) {
        if (o == null) {
            return "null";
        }
        return o.toString().replace("\n", "\n    ");
    }
}

