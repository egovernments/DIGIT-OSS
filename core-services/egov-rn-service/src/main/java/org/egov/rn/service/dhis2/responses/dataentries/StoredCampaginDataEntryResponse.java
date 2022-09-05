
package org.egov.rn.service.dhis2.responses.dataentries;

import com.fasterxml.jackson.annotation.*;

import javax.annotation.Generated;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
    "dataValues"
})
@Generated("jsonschema2pojo")
public class StoredCampaginDataEntryResponse {

    @JsonProperty("dataValues")
    private List<DataValue> dataValues = new ArrayList<DataValue>();
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    /**
     * No args constructor for use in serialization
     * 
     */
    public StoredCampaginDataEntryResponse() {
    }

    /**
     * 
     * @param dataValues
     */
    public StoredCampaginDataEntryResponse(List<DataValue> dataValues) {
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

    public StoredCampaginDataEntryResponse withDataValues(List<DataValue> dataValues) {
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

    public StoredCampaginDataEntryResponse withAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
        return this;
    }

}
