package org.egov.land.abm.newservices.entity;


import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class NewService {

	@JsonProperty("RequestInfo")
	private RequestInfo requestInfo = null;
	
	@JsonProperty("NewServiceInfo")
	private NewServiceInfo newServiceInfo = null;
}
