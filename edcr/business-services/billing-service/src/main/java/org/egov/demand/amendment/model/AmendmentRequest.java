package org.egov.demand.amendment.model;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * AmendmentRequest
 */

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class AmendmentRequest {

	@NotNull
	@JsonProperty("RequestInfo")
	private RequestInfo requestInfo;

	@NotNull
	@JsonProperty("Amendment")
	@Valid
	private Amendment amendment;
}
