package org.egov.access.persistence.repository;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.egov.access.domain.criteria.ActionSearchCriteria;
import org.egov.access.domain.criteria.RoleSearchCriteria;
import org.egov.access.domain.criteria.ValidateActionCriteria;
import org.egov.access.domain.model.Action;
import org.egov.access.domain.model.ActionValidation;
import org.egov.access.domain.model.Role;
import org.egov.access.persistence.repository.querybuilder.ActionFinderQueryBuilder;
import org.egov.access.persistence.repository.querybuilder.RoleFinderQueryBuilder;
import org.egov.access.persistence.repository.querybuilder.ValidateActionQueryBuilder;
import org.egov.access.persistence.repository.rowmapper.ActionRowMapper;
import org.egov.access.persistence.repository.rowmapper.ActionValidationRowMapper;
import org.egov.access.persistence.repository.rowmapper.RoleRowMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
public class BaseRepositoryTest {

	@Autowired
	private BaseRepository baseRepository;

	@Test
	@Sql(scripts = { "/sql/clearAction.sql", "/sql/clearRole.sql", "/sql/insertActionData.sql",
			"/sql/insertRoleData.sql" })
	public void testActionValidationWhenAllowed() {
		ValidateActionCriteria criteria = ValidateActionCriteria.builder()
				.roleNames(Arrays.asList("Citizen", "Super User")).tenantId("ap.public").actionUrl("/pgr/receivingmode")
				.build();

		ValidateActionQueryBuilder queryBuilder = new ValidateActionQueryBuilder(criteria);

		List<Object> validations = baseRepository.run(queryBuilder, new ActionValidationRowMapper());

		ActionValidation validation = (ActionValidation) validations.get(0);
		assert (validation.isAllowed());
	}

	public void testActionValidationWhenNotAllowed() {
		ValidateActionCriteria criteria = ValidateActionCriteria.builder().roleNames(Arrays.asList("Employee"))
				.tenantId("ap.public").actionUrl("/pgr/receivingmode").build();

		ValidateActionQueryBuilder queryBuilder = new ValidateActionQueryBuilder(criteria);

		List<Object> validations = baseRepository.run(queryBuilder, new ActionValidationRowMapper());

		ActionValidation validation = (ActionValidation) validations.get(0);
		assertFalse(validation.isAllowed());
	}

	@Test
	@Sql(scripts = { "/sql/clearRole.sql", "/sql/insertRoleData.sql" })
	public void testRoleFinderForGivenCodes() throws Exception {
		RoleSearchCriteria roleSearchCriteria = RoleSearchCriteria.builder().codes(Arrays.asList("CITIZEN", "EMPLOYEE"))
				.build();
		RoleFinderQueryBuilder queryBuilder = new RoleFinderQueryBuilder(roleSearchCriteria);
		List<Role> roles = (List<Role>) (List<?>) baseRepository.run(queryBuilder, new RoleRowMapper());
		assertEquals(2, roles.size());
		assertEquals("Citizen", roles.get(0).getName());
		assertEquals("Citizen who can raise complaint", roles.get(0).getDescription());
	}

	@Test
	@Sql(scripts = { "/sql/clearRole.sql", "/sql/insertRoleData.sql" })
	public void testRoleFinderWhenNoCodesAreGiven() throws Exception {
		RoleSearchCriteria roleSearchCriteria = RoleSearchCriteria.builder().build();
		RoleFinderQueryBuilder queryBuilder = new RoleFinderQueryBuilder(roleSearchCriteria);
		List<Role> roles = (List<Role>) (List<?>) baseRepository.run(queryBuilder, new RoleRowMapper());
		assertEquals(3, roles.size());
		assertEquals("Citizen", roles.get(0).getName());
		assertEquals("Employee", roles.get(1).getName());
		assertEquals("Super User", roles.get(2).getName());
	}

	@Test
	@Sql(scripts = { "/sql/clearAction.sql", "/sql/insertActionData.sql" })
	public void testShouldReturnActionForUserRole() throws Exception {
		ActionSearchCriteria actionSearchCriteria = ActionSearchCriteria.builder().tenantId("ap.public")
				.roleCodes(Arrays.asList("CITIZEN", "SUPERUSER")).build();
		ActionFinderQueryBuilder queryBuilder = new ActionFinderQueryBuilder(actionSearchCriteria);
		List<Action> actions = (List<Action>) (List<?>) baseRepository.run(queryBuilder, new ActionRowMapper());
		assertEquals(8, actions.size());
		assertEquals(Long.valueOf(3), actions.get(0).getId());
		assertEquals("Get ComplaintType by type,count and tenantId", actions.get(0).getName());
		assertEquals("/pgr/services", actions.get(0).getUrl());
		assertEquals("Get ComplaintType by type,count and tenantId", actions.get(0).getDisplayName());
		assertEquals("ap.public", actions.get(0).getTenantId());
		assertEquals(Integer.valueOf(5), actions.get(0).getOrderNumber());
		assertEquals(false, actions.get(0).isEnabled());
		assertEquals(Long.valueOf(1), actions.get(0).getCreatedBy());
		assertEquals(Long.valueOf(1), actions.get(0).getLastModifiedBy());
		String currDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
		assertEquals(currDate, actions.get(0).getCreatedDate().toString());
		assertEquals(currDate, actions.get(0).getLastModifiedDate().toString());
		assertEquals("PgrComp", actions.get(0).getParentModule());
		assertEquals("PGR", actions.get(0).getServiceCode());

	}
}