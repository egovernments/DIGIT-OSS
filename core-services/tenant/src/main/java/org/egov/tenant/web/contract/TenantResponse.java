package org.egov.tenant.web.contract;

import org.egov.common.contract.response.ResponseInfo;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TenantResponse {
    private ResponseInfo responseInfo;
    private Tenant tenant;
}