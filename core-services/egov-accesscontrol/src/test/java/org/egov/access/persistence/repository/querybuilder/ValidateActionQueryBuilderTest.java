package org.egov.access.persistence.repository.querybuilder;

import org.egov.access.domain.criteria.ValidateActionCriteria;
import org.junit.Test;

import java.util.Arrays;

import static org.junit.Assert.assertEquals;

public class ValidateActionQueryBuilderTest {

	@Test
	public void testQueryToValidateAction() {
		ValidateActionCriteria criteria = ValidateActionCriteria.builder().roleNames(Arrays.asList("r1", "r2"))
				.actionUrl("url").tenantId("tenantid").build();
		ValidateActionQueryBuilder builder = new ValidateActionQueryBuilder(criteria);

		String expectedQuery = "SELECT exists(SELECT 1 from eg_roleaction AS ra"
				+ " JOIN eg_ms_role AS r ON ra.rolecode = r.code" + " JOIN eg_action AS a on ra.actionid = a.id"
				+ " WHERE r.name in ('r1','r2')" + " AND ra.tenantid = 'tenantid'"
				+ " AND a.url = 'url') AS \"exists\"";
		assertEquals(expectedQuery, builder.build());
	}

}