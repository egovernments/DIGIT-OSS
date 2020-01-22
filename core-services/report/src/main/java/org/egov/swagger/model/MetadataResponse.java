package org.egov.swagger.model;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;

import javax.validation.constraints.*;

import org.egov.common.contract.response.ResponseInfo;

/**
 * Response to the metadata request
 */


public class MetadataResponse {
    @JsonProperty("requestInfo")
    private ResponseInfo requestInfo = null;

    @JsonProperty("tenantId")
    private String tenantId = null;

    @JsonProperty("reportDetails")
    private ReportMetadata reportDetails = null;

    public MetadataResponse requestInfo(ResponseInfo requestInfo) {
        this.requestInfo = requestInfo;
        return this;
    }

    /**
     * Get requestInfo
     *
     * @return requestInfo
     **/

    public ResponseInfo getRequestInfo() {
        return requestInfo;
    }


    public void setRequestInfo(ResponseInfo requestInfo) {
        this.requestInfo = requestInfo;
    }

    public MetadataResponse tenantId(String tenantId) {
        this.tenantId = tenantId;
        return this;
    }

    /**
     * tenantId for which the report is needed
     *
     * @return tenantId
     **/

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public MetadataResponse reportDetails(ReportMetadata reportDetails) {
        this.reportDetails = reportDetails;
        return this;
    }

    /**
     * Get reportDetails
     *
     * @return reportDetails
     **/

    public ReportMetadata getReportDetails() {
        return reportDetails;
    }

    public void setReportDetails(ReportMetadata reportDetails) {
        this.reportDetails = reportDetails;
    }


    @Override
    public boolean equals(java.lang.Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        MetadataResponse metadataResponse = (MetadataResponse) o;
        return Objects.equals(this.requestInfo, metadataResponse.requestInfo) &&
                Objects.equals(this.tenantId, metadataResponse.tenantId) &&
                Objects.equals(this.reportDetails, metadataResponse.reportDetails);
    }

    @Override
    public int hashCode() {
        return Objects.hash(requestInfo, tenantId, reportDetails);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class MetadataResponse {\n");

        sb.append("    requestInfo: ").append(toIndentedString(requestInfo)).append("\n");
        sb.append("    tenantId: ").append(toIndentedString(tenantId)).append("\n");
        sb.append("    reportDetails: ").append(toIndentedString(reportDetails)).append("\n");
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

