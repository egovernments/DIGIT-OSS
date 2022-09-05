
package org.egov.rn.service.dhis2.requests;

import com.fasterxml.jackson.annotation.*;

import javax.annotation.Generated;
import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class Form {

    @JsonProperty("dataElement")
    private String dataElement;

    @Override
    public String toString() {
        return "Form{" +
                "dataElement='" + dataElement + '\'' +
                ", value='" + value + '\'' +
                ", comment='" + comment + '\'' +
                ", additionalProperties=" + additionalProperties +
                '}';
    }

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
    public Form() {
    }

    /**
     * 
     * @param comment
     * @param dataElement
     * @param value
     */
    public Form(String dataElement, String value, String comment) {
        super();
        this.dataElement = dataElement;
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

    public Form withDataElement(String dataElement) {
        this.dataElement = dataElement;
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

    public Form withValue(String value) {
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

    public Form withComment(String comment) {
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

    public Form withAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
        return this;
    }

}
