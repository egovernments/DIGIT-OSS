package org.egov.swagger.model;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;

import javax.validation.constraints.*;

/**
 * next drill down report. In case the report is on the values in the report
 */


public class LinkedReport {
    @JsonProperty("reportName")
    private String reportName = null;

    @JsonProperty("linkedColumn")
    private String linkedColumn = null;

    public LinkedReport reportName(String reportName) {
        this.reportName = reportName;
        return this;
    }

    /**
     * name of the next report
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

    public LinkedReport linkedColumn(String linkedColumn) {
        this.linkedColumn = linkedColumn;
        return this;
    }

    /**
     * The drill downs are defined for each column (or if defined on the report level they have same drill down report for all the columns). In case the drill down report is on the actual value in the table this column indicates the additional column whose value should be provided as search parameter value. This should be teh name of one o the source columns within its report. Also, the calculated link for the linked report will go as part of defaultValue in the SourceColumn value to help client to create the necessary linking
     *
     * @return linkedColumn
     **/

    public String getLinkedColumn() {
        return linkedColumn;
    }

    public void setLinkedColumn(String linkedColumn) {
        this.linkedColumn = linkedColumn;
    }


    @Override
    public boolean equals(java.lang.Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        LinkedReport sourceColumnLinkedReport = (LinkedReport) o;
        return Objects.equals(this.reportName, sourceColumnLinkedReport.reportName) &&
                Objects.equals(this.linkedColumn, sourceColumnLinkedReport.linkedColumn);
    }

    @Override
    public int hashCode() {
        return Objects.hash(reportName, linkedColumn);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class SourceColumnLinkedReport {\n");

        sb.append("    reportName: ").append(toIndentedString(reportName)).append("\n");
        sb.append("    linkedColumn: ").append(toIndentedString(linkedColumn)).append("\n");
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



