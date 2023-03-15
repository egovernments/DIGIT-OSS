package org.egov.search.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.ToString;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Query {

	@JsonProperty("baseQuery")
	private String baseQuery;
	
	@JsonProperty("groupBy")
	private String groupBy;
	
	@JsonProperty("orderBy")
	private String orderBy;
	
	@JsonProperty("sort")
    private String sort;
	
	
}
