
package org.egov.rn.service.dhis2.requests;

import com.fasterxml.jackson.annotation.*;

import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class DataSetElement {

    @JsonProperty("dataElement")
    private DataElement dataElement;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    /**
     * No args constructor for use in serialization
     * 
     */
    public DataSetElement() {
    }

    /**
     * 
     * @param dataElement
     */
    public DataSetElement(DataElement dataElement) {
        super();
        this.dataElement = dataElement;
    }

    @JsonProperty("dataElement")
    public DataElement getDataElement() {
        return dataElement;
    }

    @JsonProperty("dataElement")
    public void setDataElement(DataElement dataElement) {
        this.dataElement = dataElement;
    }

    public DataSetElement withDataElement(DataElement dataElement) {
        this.dataElement = dataElement;
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

    public DataSetElement withAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
        return this;
    }

}
