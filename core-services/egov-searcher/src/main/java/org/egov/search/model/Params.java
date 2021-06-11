package org.egov.search.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.ToString;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EqualsAndHashCode(of= {"name"})
public class Params {

	@JsonProperty("name")
	private String name;
	
	@JsonProperty("isMandatory")
	private Boolean isMandatory;
	
	@JsonProperty("jsonPath")
	private String jsonPath;
	
	@JsonProperty("operator")
	private String operator;
	
	@JsonProperty("isConstant")
	private Boolean isConstant;
	
	@JsonProperty("value")
	private String value;
	
}
