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
public class SearchDefinitions {
	
	@JsonProperty("SearchDefinitions")
    public SearchDefinition searchDefinition;
	
	
}


