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
"dataContext",
"topics"
})
public class Consumable {

@JsonProperty("dataContext")
private String dataContext;
@JsonProperty("topics")
private List<KeyValuePair> topics = null;
@JsonIgnore
private Map<String, Object> additionalProperties = new HashMap<String, Object>();

@JsonProperty("dataContext")
public String getDataContext() {
return dataContext;
}

@JsonProperty("dataContext")
public void setDataContext(String dataContext) {
this.dataContext = dataContext;
}

@JsonProperty("topics")
public List<KeyValuePair> getTopics() {
return topics;
}

@JsonProperty("topics")
public void setTopics(List<KeyValuePair> topics) {
this.topics = topics;
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