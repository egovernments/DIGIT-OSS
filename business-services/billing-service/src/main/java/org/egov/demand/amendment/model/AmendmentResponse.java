package org.egov.demand.amendment.model;

import java.util.List;

import javax.validation.Valid;

import org.egov.common.contract.response.ResponseInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * AmendmentResponse
 */

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class AmendmentResponse {

	@JsonProperty("ResponseInfo")
	private ResponseInfo responseInfo;

	@JsonProperty("Amendments")
	@Valid
	private List<Amendment> amendments;

}
