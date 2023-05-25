package org.egov.access.domain.model;

import org.egov.access.domain.criteria.ValidateActionCriteria;
import org.junit.Test;

import java.util.Arrays;

import static org.junit.Assert.assertEquals;

public class ValidateActionCriteriaTest {

	@Test
	public void testActionValidationCriteriaHasRolesToBeValidatedFor() {
		ValidateActionCriteria validateActionCriteria = ValidateActionCriteria.builder()
				.roleNames(Arrays.asList("role1, role2")).tenantId("tenant").actionUrl("url").build();

		assertEquals(Arrays.asList("role1, role2"), validateActionCriteria.getRoleNames());
		assertEquals("tenant", validateActionCriteria.getTenantId());
		assertEquals("url", validateActionCriteria.getActionUrl());
	}
}
