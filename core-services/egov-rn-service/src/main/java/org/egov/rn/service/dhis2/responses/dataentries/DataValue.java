
package org.egov.rn.service.dhis2.responses.dataentries;

import com.fasterxml.jackson.annotation.*;

import javax.annotation.Generated;
import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "dataElement",
    "period",
    "orgUnit",
    "categoryOptionCombo",
    "attributeOptionCombo",
    "value",
    "storedBy",
    "created",
    "lastUpdated",
    "comment",
    "followup"
})
@Generated("jsonschema2pojo")
public class DataValue {

    @JsonProperty("dataElement")
    private String dataElement;
    @JsonProperty("period")
    private String period;
    @JsonProperty("orgUnit")
    private String orgUnit;
    @JsonProperty("categoryOptionCombo")
    private String categoryOptionCombo;
    @JsonProperty("attributeOptionCombo")
    private String attributeOptionCombo;
    @JsonProperty("value")
    private String value;
    @JsonProperty("storedBy")
    private String storedBy;
    @JsonProperty("created")
    private String created;
    @JsonProperty("lastUpdated")
    private String lastUpdated;
    @JsonProperty("comment")
    private String comment;
    @JsonProperty("followup")
    private boolean followup;
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
     * @param lastUpdated
     * @param followup
     * @param period
     * @param storedBy
     * @param created
     * @param orgUnit
     * @param attributeOptionCombo
     * @param categoryOptionCombo
     * @param comment
     * @param dataElement
     * @param value
     */
    public DataValue(String dataElement, String period, String orgUnit, String categoryOptionCombo, String attributeOptionCombo, String value, String storedBy, String created, String lastUpdated, String comment, boolean followup) {
        super();
        this.dataElement = dataElement;
        this.period = period;
        this.orgUnit = orgUnit;
        this.categoryOptionCombo = categoryOptionCombo;
        this.attributeOptionCombo = attributeOptionCombo;
        this.value = value;
        this.storedBy = storedBy;
        this.created = created;
        this.lastUpdated = lastUpdated;
        this.comment = comment;
        this.followup = followup;
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

    @JsonProperty("categoryOptionCombo")
    public String getCategoryOptionCombo() {
        return categoryOptionCombo;
    }

    @JsonProperty("categoryOptionCombo")
    public void setCategoryOptionCombo(String categoryOptionCombo) {
        this.categoryOptionCombo = categoryOptionCombo;
    }

    public DataValue withCategoryOptionCombo(String categoryOptionCombo) {
        this.categoryOptionCombo = categoryOptionCombo;
        return this;
    }

    @JsonProperty("attributeOptionCombo")
    public String getAttributeOptionCombo() {
        return attributeOptionCombo;
    }

    @JsonProperty("attributeOptionCombo")
    public void setAttributeOptionCombo(String attributeOptionCombo) {
        this.attributeOptionCombo = attributeOptionCombo;
    }

    public DataValue withAttributeOptionCombo(String attributeOptionCombo) {
        this.attributeOptionCombo = attributeOptionCombo;
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

    @JsonProperty("storedBy")
    public String getStoredBy() {
        return storedBy;
    }

    @JsonProperty("storedBy")
    public void setStoredBy(String storedBy) {
        this.storedBy = storedBy;
    }

    public DataValue withStoredBy(String storedBy) {
        this.storedBy = storedBy;
        return this;
    }

    @JsonProperty("created")
    public String getCreated() {
        return created;
    }

    @JsonProperty("created")
    public void setCreated(String created) {
        this.created = created;
    }

    public DataValue withCreated(String created) {
        this.created = created;
        return this;
    }

    @JsonProperty("lastUpdated")
    public String getLastUpdated() {
        return lastUpdated;
    }

    @JsonProperty("lastUpdated")
    public void setLastUpdated(String lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public DataValue withLastUpdated(String lastUpdated) {
        this.lastUpdated = lastUpdated;
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

    @JsonProperty("followup")
    public boolean isFollowup() {
        return followup;
    }

    @JsonProperty("followup")
    public void setFollowup(boolean followup) {
        this.followup = followup;
    }

    public DataValue withFollowup(boolean followup) {
        this.followup = followup;
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
