package org.egov.boundary.web.contract;

import javax.validation.constraints.NotNull;

import org.egov.boundary.domain.model.BoundaryType;
import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoundaryTypeSearchRequest {
	
	@NotNull
	@JsonProperty("RequestInfo")
	private RequestInfo requestInfo;
	
	@NotNull
	@JsonProperty("BoundaryType")
    private BoundaryType boundaryType;

}
