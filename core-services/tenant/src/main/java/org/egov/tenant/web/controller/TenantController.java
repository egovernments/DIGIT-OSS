package org.egov.tenant.web.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.tenant.domain.service.TenantService;
import org.egov.tenant.web.contract.City;
import org.egov.tenant.web.contract.CreateTenantRequest;
import org.egov.tenant.web.contract.CreateTenantResponse;
import org.egov.tenant.web.contract.SearchTenantRequest;
import org.egov.tenant.web.contract.SearchTenantResponse;
import org.egov.tenant.web.contract.Tenant;
import org.egov.tenant.web.contract.TenantRequest;
import org.egov.tenant.web.contract.TenantResponse;
import org.egov.tenant.web.contract.factory.ResponseInfoFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/tenant")
public class TenantController {

	private TenantService tenantService;

	@Autowired
	private ResponseInfoFactory responseInfoFactory;

	@Autowired
	public TenantController(TenantService tenantService) {
		this.tenantService = tenantService;
	}

	@PostMapping(value = "_search")
	public SearchTenantResponse search(@RequestParam(value = "code", required = false) List<String> code,
			@RequestBody SearchTenantRequest searchTenantRequest) {
		List<org.egov.tenant.domain.model.Tenant> tenantModel = tenantService.getTenants(code,searchTenantRequest.getRequestInfo());
		List<Tenant> tenants = new ArrayList<Tenant>();
		if(tenantModel.size()>0){
			tenants = tenantModel.stream().map(tenant -> new Tenant(tenant, new City(tenant.getCity()))).collect(Collectors.toList());
		}
		return new SearchTenantResponse(getResponseInfo(searchTenantRequest.getRequestInfo()), tenants);
	}

	@PostMapping(value = "_create")
	public CreateTenantResponse createTenant(@RequestBody CreateTenantRequest createTenantRequest) {
		org.egov.tenant.domain.model.Tenant tenant = tenantService
				.createTenant(createTenantRequest.getTenant().toDomain());

		return new CreateTenantResponse(getResponseInfo(createTenantRequest.getRequestInfo()),
				new Tenant(tenant, new City(tenant.getCity())));
	}

	@PostMapping(value = "_update")
	public TenantResponse updateTenant(@RequestBody TenantRequest updateTenantRequest) {

		org.egov.tenant.domain.model.Tenant tenant = tenantService
				.updateTenant(updateTenantRequest.getTenant().toDomain());

		return new TenantResponse(getResponseInfo(updateTenantRequest.getRequestInfo()),
				new Tenant(tenant, new City(tenant.getCity())));
	}

	public ResponseInfo getResponseInfo(RequestInfo requestInfo) {

		ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true);

		responseInfo.setStatus(HttpStatus.OK.toString());

		return responseInfo;
	}

}
