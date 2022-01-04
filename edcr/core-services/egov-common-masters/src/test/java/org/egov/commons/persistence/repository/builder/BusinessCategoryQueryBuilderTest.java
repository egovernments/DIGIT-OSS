package org.egov.commons.persistence.repository.builder;

import static org.junit.Assert.assertEquals;

import java.util.ArrayList;
import java.util.Arrays;

import org.egov.commons.model.BusinessCategoryCriteria;
import org.egov.commons.repository.builder.BusinessCategoryQueryBuilder;
import org.junit.Test;

public class BusinessCategoryQueryBuilderTest {

	@Test
	public void no_input_test() {
		BusinessCategoryCriteria categoryCriteria = new BusinessCategoryCriteria();

		BusinessCategoryQueryBuilder builder = new BusinessCategoryQueryBuilder();
		assertEquals(
				"select id,name,code,active,tenantId FROM eg_businesscategory" + " ORDER BY name ASC",
				builder.getQuery(categoryCriteria, new ArrayList<>()));
	}

	//@Test
	public void all_input_test() {
		BusinessCategoryCriteria categoryCriteria = new BusinessCategoryCriteria();
		BusinessCategoryQueryBuilder builder = new BusinessCategoryQueryBuilder();
		categoryCriteria.setBusinessCategoryName("Collection");
		categoryCriteria.setActive(true);
		categoryCriteria.setId(1L);
		categoryCriteria.setTenantId("default");
		categoryCriteria.setSortBy("code");
		categoryCriteria.setSortOrder("DESC");

		assertEquals(
				"select id,name,code,active,tenantId FROM eg_businesscategory"
						+ " WHERE tenantId = ? AND id IN (1) AND name = ? AND active = ? ORDER BY code DESC",
				builder.getQuery(categoryCriteria, new ArrayList<>()));
	}
}
