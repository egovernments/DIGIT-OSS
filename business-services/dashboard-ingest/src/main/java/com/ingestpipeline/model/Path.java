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
@JsonPropertyOrder({ "route", "paths" })
public class Path {

	@JsonProperty("route")
	private String route;
	
	@JsonProperty("paths")
	private List<Path> paths; 
	
	@JsonProperty("removeReplace")
	private String removeReplace; 
	
	public String getRemoveReplace() {
		return removeReplace;
	}

	public void setRemoveReplace(String removeReplace) {
		this.removeReplace = removeReplace;
	}

	public List<Path> getPaths() {
		return paths;
	}

	public void setPaths(List<Path> paths) {
		this.paths = paths;
	}

	@JsonIgnore
	private Map<String, Object> additionalProperties = new HashMap<String, Object>();

	@JsonProperty("route")
	public String getRoute() {
		return route;
	}

	@JsonProperty("route")
	public void setRoute(String route) {
		this.route = route;
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