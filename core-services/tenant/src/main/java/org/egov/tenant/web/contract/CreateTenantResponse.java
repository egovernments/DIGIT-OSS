package org.egov.tenant.web.contract;


import lombok.AllArgsConstructor;
import lombok.Getter;
import org.egov.common.contract.response.ResponseInfo;

@Getter
@AllArgsConstructor
public class CreateTenantResponse {
    private ResponseInfo responseInfo;
    private Tenant tenant;
}
