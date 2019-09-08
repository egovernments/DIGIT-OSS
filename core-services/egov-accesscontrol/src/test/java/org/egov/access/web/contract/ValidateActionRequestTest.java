package org.egov.access.web.contract;

import org.egov.access.domain.criteria.ValidateActionCriteria;
import org.egov.access.web.contract.role.RoleContract;
import org.egov.access.web.contract.validateaction.TenantRoleContract;
import org.egov.access.web.contract.validateaction.ValidateActionContract;
import org.egov.access.web.contract.validateaction.ValidateActionRequest;
import org.egov.common.contract.request.RequestInfo;
import org.junit.Test;

import java.util.Arrays;

import static org.junit.Assert.assertEquals;

public class ValidateActionRequestTest {

	@Test
	public void testThatValidateActionRequestContractContainsInfoAboutRequestInfoAndValidateAction() {
		RequestInfo requestInfo = RequestInfo.builder().build();
		RoleContract role = RoleContract.builder().name("role name").build();
		TenantRoleContract tenantRole = TenantRoleContract.builder().roles(Arrays.asList(role)).tenantId("tenantId")
				.build();
		ValidateActionContract validateAction = ValidateActionContract.builder().tenantRole(tenantRole).actionUrl("url")
				.build();

		ValidateActionRequest validateActionRequest = ValidateActionRequest.builder().requestInfo(requestInfo)
				.validateAction(validateAction).build();

		assertEquals(requestInfo, validateActionRequest.getRequestInfo());
		assertEquals(validateAction, validateActionRequest.getValidateAction());
	}

	@Test
	public void testToDomainReturnsActionValidationCriteria() {
		RequestInfo requestInfo = RequestInfo.builder().build();
		RoleContract role = RoleContract.builder().name("role name").build();
		TenantRoleContract tenantRole = TenantRoleContract.builder().roles(Arrays.asList(role)).tenantId("tenantId")
				.build();
		ValidateActionContract validateAction = ValidateActionContract.builder().tenantRole(tenantRole).actionUrl("url")
				.build();

		ValidateActionRequest validateActionRequest = ValidateActionRequest.builder().requestInfo(requestInfo)
				.validateAction(validateAction).build();
		ValidateActionCriteria criteria = validateActionRequest.toDomain();

		assertEquals(Arrays.asList("role name"), criteria.getRoleNames());
		assertEquals("tenantId", criteria.getTenantId());
		assertEquals("url", criteria.getActionUrl());

	}
}
