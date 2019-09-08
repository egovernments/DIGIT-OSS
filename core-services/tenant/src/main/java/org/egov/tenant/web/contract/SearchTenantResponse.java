package org.egov.tenant.web.contract;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.egov.common.contract.response.ResponseInfo;

import java.util.List;

@Getter
@AllArgsConstructor
public class SearchTenantResponse {

    private ResponseInfo responseInfo;
    private List<Tenant> tenant;
}
