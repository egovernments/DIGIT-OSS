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
public class Output {
	
	@JsonProperty("jsonFormat")
	private Object jsonFormat;
	
	@JsonProperty("outJsonPath")
	private String outJsonPath;
	
	@JsonProperty("responseInfoPath")
	private String responseInfoPath;

}
