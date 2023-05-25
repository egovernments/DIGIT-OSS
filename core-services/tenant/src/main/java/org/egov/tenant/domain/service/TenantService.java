package org.egov.tenant.domain.service;

import java.util.ArrayList;
import java.util.List;

import org.egov.tenant.domain.exception.DuplicateTenantCodeException;
import org.egov.tenant.domain.exception.TenantInvalidCodeException;
import org.egov.tenant.domain.model.Tenant;
import org.egov.tenant.persistence.repository.MdmsRepository;
import org.egov.tenant.persistence.repository.TenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.egov.common.contract.request.RequestInfo;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import net.minidev.json.JSONArray;

@Service
public class TenantService {

	private TenantRepository tenantRepository;

	@Autowired
	private MdmsRepository mdmsRepository;
	
	@Value("${egov.services.tenantId}")
	private String tenantId;
	
	@Value("${egov.services.moduleName}")
	private String moduleName;
	
	@Value("${egov.services.masterDetailsName}")
	private String masterDetailsName;
	
	@Value("${egov.services.filterFieldName}")
	private String filterFieldName;

	public TenantService(TenantRepository tenantRepository) {
		this.tenantRepository = tenantRepository;
	}

	public List<Tenant> getTenants(List<String> code, RequestInfo requestInfo) {

		JSONArray responseJSONArray;
		ObjectMapper mapper = new ObjectMapper();
		List<Tenant> tenantList = new ArrayList<Tenant>();

		responseJSONArray = mdmsRepository.getByCriteria(tenantId, moduleName, masterDetailsName, filterFieldName, code, requestInfo);

		if (responseJSONArray != null && responseJSONArray.size() > 0)
			return mapper.convertValue(responseJSONArray, new TypeReference<List<Tenant>>() {
			});
		else
			return tenantList;
	}

	public Tenant createTenant(Tenant tenant) {
		tenant.validate();
		validateDuplicateTenant(tenant);
		return tenantRepository.save(tenant);
	}

	public Tenant updateTenant(Tenant tenant) {
		tenant.validate();
		checkTenantExist(tenant);
		return tenantRepository.update(tenant);
	}

	private void validateDuplicateTenant(Tenant tenant) {
		if (tenantRepository.isTenantPresent(tenant.getCode()) > 0) {
			throw new DuplicateTenantCodeException(tenant);
		}
	}

	private void checkTenantExist(Tenant tenant) {

		if (!(tenantRepository.isTenantPresent(tenant.getCode()) > 0)) {
			throw new TenantInvalidCodeException(tenant);
		}
	}
}
