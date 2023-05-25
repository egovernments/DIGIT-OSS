package org.egov.search.model;

import java.util.List;

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
public class SearchParams {

	@JsonProperty("condition")
	private String condition;
	
	@JsonProperty("params")
	private List<Params> params;
	
	@JsonProperty("pagination")
	private Pagination pagination;
	
}
