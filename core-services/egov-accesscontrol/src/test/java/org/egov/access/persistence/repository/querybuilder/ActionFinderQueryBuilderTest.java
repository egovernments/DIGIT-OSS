package org.egov.access.persistence.repository.querybuilder;

import static org.junit.Assert.assertEquals;

import java.util.Arrays;
import java.util.Collections;

import org.egov.access.domain.criteria.ActionSearchCriteria;
import org.junit.Test;

public class ActionFinderQueryBuilderTest {

	private ActionQueryBuilder actionQueryBuilder;

	@Test
	public void testQueryToFindRoles() {
		ActionSearchCriteria criteria = ActionSearchCriteria.builder().tenantId("ap.public")
				.roleCodes(Arrays.asList("CITIZEN", "EMPLOYEE")).build();
		ActionFinderQueryBuilder builder = new ActionFinderQueryBuilder(criteria);

		String expectedQuery = "SELECT distinct a.id AS a_id, a.name AS a_name, a.url AS "
				+ "a_url, a.servicecode AS a_servicecode, a.queryparams AS a_queryparams, a.parentmodule AS a_parentmodule, a.displayname AS a_displayname, a.enabled AS a_enabled, "
				+ " a.createdby AS a_createdby, a.createddate AS a_createddate, a.lastmodifiedby"
				+ " AS a_lastmodifiedby, a.lastmodifieddate AS a_lastmodifieddate,a.ordernumber AS a_ordernumber, ra.tenantid AS ra_tenantid, "
				+ "ra.actionid AS ra_action, ra.rolecode AS ra_rolecode FROM eg_action AS a JOIN eg_roleaction AS ra ON a.id = ra.actionid"
				+ " WHERE ra.tenantid = 'ap.public' AND ra.rolecode in ('CITIZEN','EMPLOYEE') ORDER BY a.name";
		assertEquals(expectedQuery, builder.build());
	}

	@Test
	public void testQueryToFindRolesWhenNoTenantId() {
		ActionSearchCriteria criteria = ActionSearchCriteria.builder().roleCodes(Collections.singletonList("CITIZEN"))
				.build();
		ActionFinderQueryBuilder builder = new ActionFinderQueryBuilder(criteria);

		String expectedQuery = "SELECT distinct a.id AS a_id, a.name AS a_name, a.url AS "
				+ "a_url, a.servicecode AS a_servicecode, a.queryparams AS a_queryparams, a.parentmodule AS a_parentmodule, a.displayname AS a_displayname, a.enabled AS a_enabled, "
				+ " a.createdby AS a_createdby, a.createddate AS a_createddate, a.lastmodifiedby"
				+ " AS a_lastmodifiedby, a.lastmodifieddate AS a_lastmodifieddate,a.ordernumber AS a_ordernumber, ra.tenantid AS ra_tenantid, "
				+ "ra.actionid AS ra_action, ra.rolecode AS ra_rolecode FROM eg_action AS a JOIN eg_roleaction AS ra ON a.id = ra.actionid"
				+ " WHERE ra.rolecode in ('CITIZEN') ORDER BY a.name";
		assertEquals(expectedQuery, builder.build());
	}

	@Test
	public void testQueryToFindRolesWhenNoRoleCodes() {
		ActionSearchCriteria criteria = ActionSearchCriteria.builder().tenantId("ap.public").build();
		ActionFinderQueryBuilder builder = new ActionFinderQueryBuilder(criteria);

		String expectedQuery = "SELECT distinct a.id AS a_id, a.name AS a_name, a.url AS "
				+ "a_url, a.servicecode AS a_servicecode, a.queryparams AS a_queryparams, a.parentmodule AS a_parentmodule, a.displayname AS a_displayname, a.enabled AS a_enabled, "
				+ " a.createdby AS a_createdby, a.createddate AS a_createddate, a.lastmodifiedby"
				+ " AS a_lastmodifiedby, a.lastmodifieddate AS a_lastmodifieddate,a.ordernumber AS a_ordernumber, ra.tenantid AS ra_tenantid, "
				+ "ra.actionid AS ra_action, ra.rolecode AS ra_rolecode FROM eg_action AS a JOIN eg_roleaction AS ra ON a.id = ra.actionid"
				+ " WHERE ra.tenantid = 'ap.public' ORDER BY a.name";
		assertEquals(expectedQuery, builder.build());
	}

	@Test
	public void testQueryToFindRolesWhenNoRoleCodesAndNoTenantId() {
		ActionSearchCriteria criteria = ActionSearchCriteria.builder().build();
		ActionFinderQueryBuilder builder = new ActionFinderQueryBuilder(criteria);

		String expectedQuery = "SELECT distinct a.id AS a_id, a.name AS a_name, a.url AS "
				+ "a_url, a.servicecode AS a_servicecode, a.queryparams AS a_queryparams, a.parentmodule AS a_parentmodule, a.displayname AS a_displayname, a.enabled AS a_enabled, "
				+ " a.createdby AS a_createdby, a.createddate AS a_createddate, a.lastmodifiedby"
				+ " AS a_lastmodifiedby, a.lastmodifieddate AS a_lastmodifieddate,a.ordernumber AS a_ordernumber, ra.tenantid AS ra_tenantid, "
				+ "ra.actionid AS ra_action, ra.rolecode AS ra_rolecode FROM eg_action AS a JOIN eg_roleaction AS ra ON a.id = ra.actionid"
				+ " ORDER BY a.name";
		assertEquals(expectedQuery, builder.build());
	}

	@Test
	public void testQueryCreateAction() {

		actionQueryBuilder.insertActionQuery();

		String expectedQuery = "";

	}

}