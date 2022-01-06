package org.egov.access.domain.model;

import org.egov.access.domain.criteria.RoleSearchCriteria;
import org.junit.Test;

import java.util.Arrays;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

public class RoleSearchCriteriaTest {

	@Test
	public void testForEqualsAndHashCode() {
		RoleSearchCriteria searchCriteria1 = RoleSearchCriteria.builder().codes(Arrays.asList("EMP")).build();
		RoleSearchCriteria searchCriteria2 = RoleSearchCriteria.builder().codes(Arrays.asList("EMP")).build();

		assertEquals(searchCriteria1, searchCriteria2);
		assertEquals(searchCriteria1.hashCode(), searchCriteria2.hashCode());
	}

	@Test
	public void testForNotEqualObjects() {
		RoleSearchCriteria searchCriteria1 = RoleSearchCriteria.builder().codes(Arrays.asList("CITIZEN,EMPLOYEE"))
				.build();
		RoleSearchCriteria searchCriteria2 = RoleSearchCriteria.builder().codes(Arrays.asList("CITIZEN")).build();

		assertNotEquals(searchCriteria1, searchCriteria2);
		assertNotEquals(searchCriteria1.hashCode(), searchCriteria2.hashCode());
	}

	@Test
	public void testGetCodes() {
		RoleSearchCriteria searchCriteria = RoleSearchCriteria.builder().codes(Arrays.asList("CITIZEN", "EMPLOYEE"))
				.build();
		assertEquals(Arrays.asList("CITIZEN", "EMPLOYEE"), searchCriteria.getCodes());
	}
}
