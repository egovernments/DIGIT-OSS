package org.egov.rb.contract;

import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Vendor {
	/*
	 * @Autowired
	 * 
	 * @JsonProperty("v1") private V1 v1;
	 */
	@JsonProperty("v1")
	private V1 v1;
	private String from;
	private String id;
		

}
