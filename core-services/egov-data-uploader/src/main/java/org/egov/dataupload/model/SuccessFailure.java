package org.egov.dataupload.model;

import java.util.List;


import com.fasterxml.jackson.annotation.JsonProperty;

import groovy.transform.ToString;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SuccessFailure {
		
	@JsonProperty("Success")
	private List<ResponseMetaData> success;
	
	@JsonProperty("Failure")
	private List<ResponseMetaData> failure;


}