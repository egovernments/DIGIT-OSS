package org.egov.rb.contract;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Labels {
	private double confidence;
	@JsonProperty("metadata")
	private Metadata metadata;
	/*
	 * @JsonProperty("nlu") private nlu nlu;
	 */
	private String uuid;
	private String value;
	

}
