package org.egov.user.persistence.repository;

import org.egov.user.Resources;
import org.egov.user.domain.model.Action;
import org.junit.Before;
import org.junit.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.springframework.test.web.client.ExpectedCount.once;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;


public class ActionRestRepositoryTest {

	private static final String HOST = "http://host";
	private static final String ROLE_ACTION = "/access/v1/actions/_search";
	private final Resources resources = new Resources();

	private ActionRestRepository actionRestRepository;
	private MockRestServiceServer server;

	@Before
	public void before() {
		final RestTemplate restTemplate = new RestTemplate();
		actionRestRepository = new ActionRestRepository(restTemplate, HOST, ROLE_ACTION);
		server = MockRestServiceServer.bindTo(restTemplate).build();
	}

	/*@Test
	public void testShouldGetActionByRole() {
		server.expect(once(),
				requestTo("http://host/access/v1/actions/_search"))
				.andExpect(method(HttpMethod.POST))
				.andExpect(content().string(resources.getFileContents("actionRequest.json")))
				.andRespond(withSuccess(resources.getFileContents("actionsResponse.json"),
						MediaType.APPLICATION_JSON_UTF8));

		final List<Action> actions = actionRestRepository.getActionByRoleCodes(getRoles(), "default");

		server.verify();
		assertEquals(2, actions.size());
		assertEquals("GetallReceivingMode", actions.get(0).getName());
		assertEquals("/pgr/receivingmode", actions.get(0).getUrl());
		assertEquals("GetallReceivingMode", actions.get(0).getDisplayName());
		assertEquals(Integer.valueOf(0), actions.get(0).getOrderNumber());
		assertEquals("1", actions.get(0).getParentModule());
		assertEquals("tenantId=", actions.get(0).getQueryParams());
		assertEquals("PGR", actions.get(0).getServiceCode());
	}*/

	public List<String> getRoles() {
		List<String> roleCodes = new ArrayList<String>();
		roleCodes.add("EMPLOYEE");
		return roleCodes;
	}

}
