package org.egov.search.model;


import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.ToString;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ToString
public class SearchResponse {
		
	@JsonProperty("Result")
	private Object result;

}
