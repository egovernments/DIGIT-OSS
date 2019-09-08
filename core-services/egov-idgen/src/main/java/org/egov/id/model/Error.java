package org.egov.id.model;

import java.util.HashMap;
import java.util.Map;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Error object will be returned as a part of reponse body in conjunction with
 * ResponseInfo as part of ErrorResponse whenever the request processing status
 * in the ResponseInfo is FAILED. HTTP return in this scenario will usually be
 * HTTP 400.
 */

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Error {
	@JsonProperty("code")
	@NotNull
	private String code = null;

	@JsonProperty("message")
	@NotNull
	private String message = null;

	@JsonProperty("description")
	private String description = null;

	@JsonProperty("params")
	private Map<String, String> fileds = new HashMap<String, String>();
}
