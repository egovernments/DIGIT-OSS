package org.egov.tenant.web.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.egov.common.contract.request.RequestInfo;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CreateTenantRequest {
    @JsonProperty("RequestInfo")
    private RequestInfo requestInfo;
    private Tenant tenant;
}
