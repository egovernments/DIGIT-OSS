package org.egov.pt.web.contracts;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.models.Assessment;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AssessmentRequest {

	@JsonProperty("RequestInfo")
	@Valid
	@NotNull
	private RequestInfo requestInfo;
	
	@JsonProperty("Assessment")
	@Valid
	@NotNull
	private Assessment assessment;

}
