package org.egov.swagger.model;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import javax.validation.constraints.*;

/**
 * This is the column definition for the purpose of defining the report. Please note that in case of external column (basicaly columns fetched from external service) dependsOn indicates the internal column which needs to be send as the paarmeter for teh external url to respond with result that will contain the value at the configured JSONpath.
 */


public class SourceColumn extends ColumnDetail {
    @JsonProperty("source")
    private String source = null;

    @JsonProperty("colName")
    private String colName = null;

    @JsonProperty("linkedReport")
    private LinkedReport linkedReport = null;

    @JsonProperty("isExternal")
    private Boolean isExternal = false;

    @JsonProperty("url")
    private String url = null;

    @JsonProperty("jsonPath")
    private String jsonPath = null;

    @JsonProperty("dependsOn")
    private SourceColumn dependsOn = null;

    public SourceColumn source(String source) {
        this.source = source;
        return this;
    }

    /**
     * Table/Index path to which the column belongs
     *
     * @return source
     **/

    @NotNull
    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public SourceColumn colName(String colName) {
        this.colName = colName;
        return this;
    }

    /**
     * column name in the table/index
     *
     * @return colName
     **/

    @NotNull
    public String getColName() {
        return colName;
    }

    public void setColName(String colName) {
        this.colName = colName;
    }

    public SourceColumn linkedReport(LinkedReport linkedReport) {
        this.linkedReport = linkedReport;
        return this;
    }

    public SourceColumn isExternal(Boolean isExternal) {
        this.isExternal = isExternal;
        return this;
    }

    /**
     * flag to indicate that this column value can be fetched from external service. This will be useful when we start segragating the services in their own physical data stores
     *
     * @return isExternal
     **/


    public Boolean getIsExternal() {
        return isExternal;
    }

    public LinkedReport getLinkedReport() {
        return linkedReport;
    }

    public void setLinkedReport(LinkedReport linkedReport) {
        this.linkedReport = linkedReport;
    }

    public void setIsExternal(Boolean isExternal) {
        this.isExternal = isExternal;
    }

    public SourceColumn url(String url) {
        this.url = url;
        return this;
    }

    /**
     * parameterized URL to external system if isExternal is true - Please note that all placeholders parameters in the URL (represented within {} e.g. {username}) should match one available within the report definition sourceColumn or searchParam as the case may be.
     *
     * @return url
     **/

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public SourceColumn jsonPath(String jsonPath) {
        this.jsonPath = jsonPath;
        return this;
    }

    /**
     * JSONPath of the field in the response JSON from the external service
     *
     * @return jsonPath
     **/

    public String getJsonPath() {
        return jsonPath;
    }

    public void setJsonPath(String jsonPath) {
        this.jsonPath = jsonPath;
    }

    public SourceColumn dependsOn(SourceColumn dependsOn) {
        this.dependsOn = dependsOn;
        return this;
    }

    /**
     * Get dependsOn
     *
     * @return dependsOn
     **/

    public SourceColumn getDependsOn() {
        return dependsOn;
    }

    public void setDependsOn(SourceColumn dependsOn) {
        this.dependsOn = dependsOn;
    }


    @Override
    public boolean equals(java.lang.Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        SourceColumn sourceColumn = (SourceColumn) o;
        return Objects.equals(this.source, sourceColumn.source) &&
                Objects.equals(this.colName, sourceColumn.colName) &&
                Objects.equals(this.linkedReport, sourceColumn.linkedReport) &&
                Objects.equals(this.isExternal, sourceColumn.isExternal) &&
                Objects.equals(this.url, sourceColumn.url) &&
                Objects.equals(this.jsonPath, sourceColumn.jsonPath) &&
                Objects.equals(this.dependsOn, sourceColumn.dependsOn) &&
                super.equals(o);
    }

    @Override
    public int hashCode() {
        return Objects.hash(source, colName, linkedReport, isExternal, url, jsonPath, dependsOn, super.hashCode());
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class SourceColumn {\n");
        sb.append("    ").append(toIndentedString(super.toString())).append("\n");
        sb.append("    source: ").append(toIndentedString(source)).append("\n");
        sb.append("    colName: ").append(toIndentedString(colName)).append("\n");
        sb.append("    linkedReport: ").append(toIndentedString(linkedReport)).append("\n");
        sb.append("    isExternal: ").append(toIndentedString(isExternal)).append("\n");
        sb.append("    url: ").append(toIndentedString(url)).append("\n");
        sb.append("    jsonPath: ").append(toIndentedString(jsonPath)).append("\n");
        sb.append("    dependsOn: ").append(toIndentedString(dependsOn)).append("\n");
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

