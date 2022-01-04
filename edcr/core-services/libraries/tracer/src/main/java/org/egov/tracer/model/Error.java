package org.egov.tracer.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * Error object will be returned as a part of reponse body in conjunction with
 * ResponseInfo as part of ErrorResponse whenever the request processing status
 * in the ResponseInfo is FAILED. 
 */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Error {
	@JsonProperty("code")
	private String code = null;

	@JsonProperty("message")
	private String message = null;

	@JsonProperty("description")
	private String description = null;

	@JsonProperty("params")
	private List<String> params = null;

}
