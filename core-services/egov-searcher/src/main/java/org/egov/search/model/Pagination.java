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
public class Pagination {
	
	@JsonProperty("noOfRecords")
	private String noOfRecords;
	
	@JsonProperty("offset")
	private String offset;
	
}
