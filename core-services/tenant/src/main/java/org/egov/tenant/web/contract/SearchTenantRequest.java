package org.egov.tenant.web.contract;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.egov.common.contract.request.RequestInfo;
import com.fasterxml.jackson.annotation.JsonProperty;

@Getter
@AllArgsConstructor
public class SearchTenantRequest {
	
	@JsonProperty("RequestInfo")
    private RequestInfo requestInfo;
}
