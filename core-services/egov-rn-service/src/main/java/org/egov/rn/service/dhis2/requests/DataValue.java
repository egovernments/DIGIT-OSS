
package org.egov.rn.service.dhis2.requests;

import com.fasterxml.jackson.annotation.*;

import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class DataValue {

    @JsonProperty("dataElement")
    private String dataElement;
    @JsonProperty("period")
    private String dataSet;

    public String getDataSet() {
        return dataSet;
    }

    public void setDataSet(String dataSet) {
        this.dataSet = dataSet;
    }

    @JsonProperty("dataSet")
    private String period;
    @JsonProperty("orgUnit")
    private String orgUnit;
    @JsonProperty("value")
    private String value;
    @JsonProperty("comment")
    private String comment;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    /**
     * No args constructor for use in serialization
     * 
     */
    public DataValue() {
    }

    /**
     * 
     * @param period
     * @param orgUnit
     * @param comment
     * @param dataElement
     * @param value
     */
    public DataValue(String dataElement, String period, String orgUnit, String value, String comment) {
        super();
        this.dataElement = dataElement;
        this.period = period;
        this.orgUnit = orgUnit;
        this.value = value;
        this.comment = comment;
    }

    @JsonProperty("dataElement")
    public String getDataElement() {
        return dataElement;
    }

    @JsonProperty("dataElement")
    public void setDataElement(String dataElement) {
        this.dataElement = dataElement;
    }

    public DataValue withDataElement(String dataElement) {
        this.dataElement = dataElement;
        return this;
    }

    @JsonProperty("period")
    public String getPeriod() {
        return period;
    }

    @JsonProperty("period")
    public void setPeriod(String period) {
        this.period = period;
    }

    public DataValue withPeriod(String period) {
        this.period = period;
        return this;
    }

    @JsonProperty("orgUnit")
    public String getOrgUnit() {
        return orgUnit;
    }

    @JsonProperty("orgUnit")
    public void setOrgUnit(String orgUnit) {
        this.orgUnit = orgUnit;
    }

    public DataValue withOrgUnit(String orgUnit) {
        this.orgUnit = orgUnit;
        return this;
    }

    @JsonProperty("value")
    public String getValue() {
        return value;
    }

    @JsonProperty("value")
    public void setValue(String value) {
        this.value = value;
    }

    public DataValue withValue(String value) {
        this.value = value;
        return this;
    }

    @JsonProperty("comment")
    public String getComment() {
        return comment;
    }

    @JsonProperty("comment")
    public void setComment(String comment) {
        this.comment = comment;
    }

    public DataValue withComment(String comment) {
        this.comment = comment;
        return this;
    }

    @JsonAnyGetter
    public Map<String, Object> getAdditionalProperties() {
        return this.additionalProperties;
    }

    @JsonAnySetter
    public void setAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
    }

    public DataValue withAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
        return this;
    }

}
