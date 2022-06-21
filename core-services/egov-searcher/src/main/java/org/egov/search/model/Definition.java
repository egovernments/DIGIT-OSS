package org.egov.search.model;


import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class Definition {

	@JsonProperty("name")
	private String name;
	
	@JsonProperty("query")
	private Query query;
	
	@JsonProperty("isCustomerRowMapEnabled")
	private Boolean isCustomerRowMapEnabled;
	
	@JsonProperty("rowMapperKey")
	private String rowMapperKey;

	@JsonProperty("decryptionPathId")
	private String decryptionPathId;
	
	@JsonProperty("searchParams")
	private SearchParams searchParams;
	
	@JsonProperty("output")
	private Output output;	
	
}
