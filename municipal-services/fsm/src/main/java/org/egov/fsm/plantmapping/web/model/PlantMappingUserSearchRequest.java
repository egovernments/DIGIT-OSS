package org.egov.fsm.plantmapping.web.model;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class PlantMappingUserSearchRequest {

	@JsonProperty("RequestInfo")
	private RequestInfo requestInfo;

	@JsonProperty("uuid")
	private List<String> uuid;	

	@JsonProperty("id")
	private List<String> id;

	@JsonProperty("active")
	@Setter
	private Boolean active;

	@JsonProperty("tenantId")
	private String tenantId;
}
