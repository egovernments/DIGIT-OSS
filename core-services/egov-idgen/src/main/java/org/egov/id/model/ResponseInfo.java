package org.egov.id.model;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * ResponseInfo should be used to carry metadata information about the response
 * from the server. apiId, ver and msgId in ResponseInfo should always
 * correspond to the same values in respective request&#39;s RequestInfo. Author
 * : Narendra
 */

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ResponseInfo {
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

	@JsonProperty("resMsgId")
	private String resMsgId = null;

	@JsonProperty("msgId")
	@Size(max = 256)
	private String msgId = null;

	@JsonProperty("status")
	@NotNull
	private ResponseStatusEnum status = null;
}
