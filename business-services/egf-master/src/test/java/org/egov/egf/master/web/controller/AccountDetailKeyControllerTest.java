package org.egov.egf.master.web.controller;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.common.utils.RequestJsonReader;
import org.egov.egf.master.TestConfiguration;
import org.egov.egf.master.domain.model.AccountDetailKey;
import org.egov.egf.master.domain.model.AccountDetailKeySearch;
import org.egov.egf.master.domain.model.AccountDetailType;
import org.egov.egf.master.domain.service.AccountDetailKeyService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.validation.BindingResult;

@RunWith(SpringRunner.class)
@WebMvcTest(AccountDetailKeyController.class)
@Import(TestConfiguration.class)
public class AccountDetailKeyControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	AccountDetailKeyService accountDetailKeyService;

	@Captor
	private ArgumentCaptor<List<AccountDetailKey>> captor;

	private RequestJsonReader resources = new RequestJsonReader();

	@Test
	public void testCreate() throws IOException, Exception {
		when(accountDetailKeyService.create(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
				.thenReturn(getAccountDetailKies());
		mockMvc.perform(post("/accountdetailkeys/_create?tenantId=default")
				.content(resources.readRequest("accountdetailkey/accountdetailkey_create_request.json"))
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(201))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(content()
						.json(resources.readResponse("accountdetailkey/accountdetailkey_create_response.json")));

		verify(accountDetailKeyService).create(captor.capture(), any(BindingResult.class), any(RequestInfo.class));

		final List<AccountDetailKey> actualRequest = captor.getValue();
		assertEquals("1", actualRequest.get(0).getKey());
		assertEquals("default", actualRequest.get(0).getTenantId());
	}

	@Test
	public void testCreate_Error() throws IOException, Exception {
		when(accountDetailKeyService.create(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
				.thenReturn(getAccountDetailKies());
		mockMvc.perform(post("/accountdetailkeys/_create")
				.content(resources.readRequest("accountdetailkey/accountdetailkey_create_invalid_fieldvalue.json"))
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is5xxServerError());

	}

	@Test
	public void testUpdate() throws IOException, Exception {
		when(accountDetailKeyService.update(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
				.thenReturn(getUpdateAccountDetailKies());

		mockMvc.perform(post("/accountdetailkeys/_update?tenantId=default")
				.content(resources.readRequest("accountdetailkey/accountdetailkey_update_request.json"))
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(201))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(content()
						.json(resources.readResponse("accountdetailkey/accountdetailkey_update_response.json")));

		verify(accountDetailKeyService).update(captor.capture(), any(BindingResult.class), any(RequestInfo.class));

		final List<AccountDetailKey> actualRequest = captor.getValue();
		assertEquals("2", actualRequest.get(0).getKey());
		assertEquals("1", actualRequest.get(0).getAccountDetailType().getId());
		assertEquals("default", actualRequest.get(0).getTenantId());
	}

	@Test
	public void test_search() throws IOException, Exception {

		Pagination<AccountDetailKey> page = new Pagination<>();
		page.setTotalPages(1);
		page.setTotalResults(1);
		page.setCurrentPage(0);
		page.setPagedData(getAccountDetailKies());
		page.getPagedData().get(0).setId("1");

		when(accountDetailKeyService.search(any(AccountDetailKeySearch.class), any(BindingResult.class)))
				.thenReturn(page);

		mockMvc.perform(post("/accountdetailkeys/_search?tenantId=default").content(resources.getRequestInfo())
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(200))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(content()
						.json(resources.readResponse("accountdetailkey/accountdetailkey_search_response.json")));

	}

	private List<AccountDetailKey> getAccountDetailKies() {
		List<AccountDetailKey> accountDetailKies = new ArrayList<AccountDetailKey>();
		AccountDetailKey accountDetailKey = AccountDetailKey.builder().id("1").key("1")
				.accountDetailType(getAccountDetailType()).build();
		accountDetailKey.setTenantId("default");
		accountDetailKies.add(accountDetailKey);
		return accountDetailKies;
	}

	private List<AccountDetailKey> getUpdateAccountDetailKies() {
		List<AccountDetailKey> accountDetailKies = new ArrayList<AccountDetailKey>();
		AccountDetailKey accountDetailKey = AccountDetailKey.builder().id("1").key("2")
				.accountDetailType(getAccountDetailType()).build();
		accountDetailKey.setTenantId("default");
		accountDetailKies.add(accountDetailKey);
		return accountDetailKies;
	}

	private AccountDetailType getAccountDetailType() {
		AccountDetailType accountDetailType = AccountDetailType.builder().id("1").name("name").tableName("contractor")
				.fullyQualifiedName("abc/acb").active(true).build();
		accountDetailType.setTenantId("default");
		return accountDetailType;
	}
}
