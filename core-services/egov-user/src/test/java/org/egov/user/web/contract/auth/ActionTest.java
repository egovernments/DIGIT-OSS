package org.egov.user.web.contract.auth;

import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

public class ActionTest {

	@Test
	public void test_should_map_from_domain_to_contract() {
		final org.egov.user.domain.model.Action domainAction = org.egov.user.domain.model.Action.builder()
				.serviceCode("serviceCode")
				.parentModule("parentModule")
				.queryParams("queryParams")
				.orderNumber(0)
				.displayName("displayName")
				.url("url")
				.name("name")
				.build();

		final Action contractAction = new Action(domainAction);

		assertNotNull(contractAction);
		assertEquals("serviceCode", contractAction.getServiceCode());
		assertEquals("parentModule", contractAction.getParentModule());
		assertEquals("queryParams", contractAction.getQueryParams());
		assertEquals(Integer.valueOf(0), contractAction.getOrderNumber());
		assertEquals("displayName", contractAction.getDisplayName());
		assertEquals("url", contractAction.getUrl());
		assertEquals("name", contractAction.getName());
	}
}