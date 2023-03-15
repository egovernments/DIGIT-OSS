package com.ingestpipeline.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonAnyGetter;
import com.fasterxml.jackson.annotation.JsonAnySetter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
"digressionPoints"
})
public class DigressionPointConfig {

@JsonProperty("digressionPoints")
private List<DigressionPoint> digressionPoints = null;
@JsonIgnore
private Map<String, Object> additionalProperties = new HashMap<String, Object>();

@JsonProperty("digressionPoints")
public List<DigressionPoint> getDigressionPoints() {
return digressionPoints;
}

@JsonProperty("digressionPoints")
public void setDigressionPoints(List<DigressionPoint> digressionPoints) {
this.digressionPoints = digressionPoints;
}

@JsonAnyGetter
public Map<String, Object> getAdditionalProperties() {
return this.additionalProperties;
}

@JsonAnySetter
public void setAdditionalProperty(String name, Object value) {
this.additionalProperties.put(name, value);
}

}