package org.egov.swagger.model;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.ArrayList;
import java.util.List;
import javax.validation.constraints.*;

/**
 * Response object that has fetched report data
 */


public class ReportResponse {


    @JsonProperty("viewPath")
    private String viewPath = null;

    @JsonProperty("selectiveDownload")
    private boolean selectiveDownload = false;

    public boolean isSelectiveDownload() {
        return selectiveDownload;
    }

    public void setSelectiveDownload(boolean selectiveDownload) {
        this.selectiveDownload = selectiveDownload;
    }

    public String getViewPath() {
        return viewPath;
    }

    public void setViewPath(String viewPath) {
        this.viewPath = viewPath;
    }

    @JsonProperty("reportHeader")
    private List<ColumnDetail> reportHeader = new ArrayList<ColumnDetail>();

    @JsonProperty("ttl")
    private Long ttl = null;

    @JsonProperty("reportData")
    private List<List<Object>> reportData = new ArrayList<List<Object>>();


    public ReportResponse reportHeader(List<ColumnDetail> reportHeader) {
        this.reportHeader = reportHeader;
        return this;
    }


    public ReportResponse addReportHeaderItem(ColumnDetail reportHeaderItem) {
        this.reportHeader.add(reportHeaderItem);
        return this;
    }

    /**
     * Array of report columns
     *
     * @return reportHeader
     **/

    public List<ColumnDetail> getReportHeader() {
        return reportHeader;
    }

    public void setReportHeader(List<ColumnDetail> reportHeader) {
        this.reportHeader = reportHeader;
    }

    public ReportResponse ttl(Long ttl) {
        this.ttl = ttl;
        return this;
    }

    /**
     * UTC epoch upto which report data can be cached
     *
     * @return ttl
     **/

    public Long getTtl() {
        return ttl;
    }

    public void setTtl(Long ttl) {
        this.ttl = ttl;
    }

    public ReportResponse reportData(List<List<Object>> reportData) {
        this.reportData = reportData;
        return this;
    }

    public ReportResponse addReportDataItem(List<Object> reportDataItem) {
        this.reportData.add(reportDataItem);
        return this;
    }

    /**
     * two dimensional array containing the report data
     *
     * @return reportData
     **/

    public List<List<Object>> getReportData() {
        return reportData;
    }

    public void setReportData(List<List<Object>> reportData) {
        this.reportData = reportData;
    }


    @Override
    public boolean equals(java.lang.Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ReportResponse reportResponse = (ReportResponse) o;
        return
                Objects.equals(this.reportHeader, reportResponse.reportHeader) &&
                        Objects.equals(this.ttl, reportResponse.ttl) &&
                        Objects.equals(this.reportData, reportResponse.reportData);
    }

    @Override
    public int hashCode() {
        return Objects.hash(reportHeader, ttl, reportData);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class ReportResponse {\n");


        sb.append("    reportHeader: ").append(toIndentedString(reportHeader)).append("\n");
        sb.append("    ttl: ").append(toIndentedString(ttl)).append("\n");
        sb.append("    reportData: ").append(toIndentedString(reportData)).append("\n");
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

