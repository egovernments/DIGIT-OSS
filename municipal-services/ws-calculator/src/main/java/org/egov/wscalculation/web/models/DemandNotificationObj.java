package org.egov.wscalculation.web.models;

import java.util.Set;

import org.egov.common.contract.request.RequestInfo;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DemandNotificationObj {

	@JsonProperty("RequestInfo")
	private RequestInfo requestInfo = null;

	@JsonProperty("tenantId")
	private String tenantId;

	@JsonProperty("billingCycle")
	private String billingCycle;

	@JsonProperty("waterConnectionIds")
	private Set<String> waterConnectionIds;

	@JsonProperty("isSuccess")
	private boolean isSuccess;

}
