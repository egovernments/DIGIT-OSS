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
@JsonPropertyOrder({ "dataContext", "paths" })
public class DigressionPoint {

	@JsonProperty("dataContext")
	private String dataContext;
	@JsonProperty("paths")
	private List<String> paths = null;

	public String getDataContext() {
		return dataContext;
	}

	public void setDataContext(String dataContext) {
		this.dataContext = dataContext;
	}

	public List<String> getPaths() {
		return paths;
	}

	public void setPaths(List<String> paths) {
		this.paths = paths;
	}

}
