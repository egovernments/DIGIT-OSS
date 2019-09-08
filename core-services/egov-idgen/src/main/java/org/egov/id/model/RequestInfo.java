package org.egov.id.model;

import java.io.IOException;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * RequestInfo should be used to carry meta information about the requests to
 * the server as described in the fields below. All eGov APIs will use
 * requestinfo as a part of the request body to carry this meta information.
 * Some of this information will be returned back from the server as part of the
 * ResponseInfo in the response body to ensure correlation. Author : Narendra
 */

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class RequestInfo {
	@JsonProperty("apiId")
	@NotNull
	@Size(max = 128)
	private String apiId = null;

	@JsonProperty("ver")
	@NotNull
	@Size(max = 32)
	private String ver = null;

	@JsonProperty("ts")
	@NotNull
	private Long ts = null;

	@JsonProperty("action")
	@NotNull
	@Size(max = 32)
	private String action = null;

	@JsonProperty("did")
	@Size(max = 1024)
	private String did = null;

	@JsonProperty("key")
	@Size(max = 256)
	private String key = null;

	@JsonProperty("msgId")
	@NotNull
	@Size(max = 256)
	private String msgId = null;

	@JsonProperty("requesterId")
	@Size(max = 256)
	private String requesterId = null;

	@JsonProperty("authToken")
	private String authToken = null;

	@JsonProperty("userInfo")
	private UserInfo userInfo = null;

	@JsonProperty("correlationId")
	private String correlationId = null;
	
	public static org.egov.common.contract.request.RequestInfo toCommonRequestInfo(RequestInfo requestInfo) throws IOException {
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
		String jsonInString = objectMapper.writeValueAsString(requestInfo);
		org.egov.common.contract.request.RequestInfo requestInfo2 = objectMapper.readValue(jsonInString, org.egov.common.contract.request.RequestInfo.class);
		return requestInfo2;
	}
}
