package org.egov.fsm.web.model.idgen;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@ToString
@Builder
public class IdGenerationRequest {
	 @JsonProperty("RequestInfo")
	    private RequestInfo requestInfo;

	    private List<IdRequest> idRequests;


}
