package org.egov.access.persistence.repository.querybuilder;

import org.egov.access.domain.criteria.RoleSearchCriteria;
import org.junit.Test;

import java.util.Arrays;

import static org.junit.Assert.assertEquals;

public class RoleFinderQueryBuilderTest {

	@Test
	public void testQueryToFindRoles() {
		RoleSearchCriteria criteria = RoleSearchCriteria.builder().codes(Arrays.asList("CITIZEN", "EMPLOYEE")).build();
		RoleFinderQueryBuilder builder = new RoleFinderQueryBuilder(criteria);

		String expectedQuery = "SELECT r.name as r_name,r.code as r_code, r.description as r_description from eg_ms_role r "
				+ "WHERE r.code in ('CITIZEN','EMPLOYEE') ORDER BY r_name";
		assertEquals(expectedQuery, builder.build());
	}

	@Test
	public void testQueryToFindRolesWhenNoRoleCodes() {
		RoleSearchCriteria criteria = RoleSearchCriteria.builder().build();
		RoleFinderQueryBuilder builder = new RoleFinderQueryBuilder(criteria);

		String expectedQuery = "SELECT r.name as r_name,r.code as r_code, r.description as r_description from eg_ms_role r "
				+ "ORDER BY r_name";
		assertEquals(expectedQuery, builder.build());
	}

}