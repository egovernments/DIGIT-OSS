
package org.egov.rn.service.dhis2.requests;

import com.fasterxml.jackson.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)

public class Dhis2DataEntryRequest {

    @JsonProperty("dataValues")
    private List<DataValue> dataValues = new ArrayList<DataValue>();
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    /**
     * No args constructor for use in serialization
     * 
     */
    public Dhis2DataEntryRequest() {
    }

    /**
     * 
     * @param dataValues
     */
    public Dhis2DataEntryRequest(List<DataValue> dataValues) {
        super();
        this.dataValues = dataValues;
    }

    @JsonProperty("dataValues")
    public List<DataValue> getDataValues() {
        return dataValues;
    }

    @JsonProperty("dataValues")
    public void setDataValues(List<DataValue> dataValues) {
        this.dataValues = dataValues;
    }

    public Dhis2DataEntryRequest withDataValues(List<DataValue> dataValues) {
        this.dataValues = dataValues;
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

    public Dhis2DataEntryRequest withAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
        return this;
    }

}
