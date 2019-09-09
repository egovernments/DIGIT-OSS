package org.egov.mdms.model;

import org.egov.common.contract.response.ResponseInfo;

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
public class MdmsCreateResponse {
	
	@JsonProperty("ResponseInfo")
	public ResponseInfo responseInfo;
	
	@JsonProperty("Data")
	public Object data;

}
