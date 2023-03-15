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
import org.egov.egf.master.domain.model.AccountCodePurpose;
import org.egov.egf.master.domain.model.AccountCodePurposeSearch;
import org.egov.egf.master.domain.service.AccountCodePurposeService;
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
@WebMvcTest(AccountCodePurposeController.class)
@Import(TestConfiguration.class)
public class AccountCodePurposeControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	AccountCodePurposeService accountCodePurposeService;

	@Captor
	private ArgumentCaptor<List<AccountCodePurpose>> captor;

	private RequestJsonReader resources = new RequestJsonReader();

	@Test
	public void testCreate() throws IOException, Exception {
		when(accountCodePurposeService.create(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
				.thenReturn(getAccountCodePurposes());
		mockMvc.perform(post("/accountcodepurposes/_create?tenantId=default")
				.content(resources.readRequest("accountcodepurpose/accountcodepurpose_create_request.json"))
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(201))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(content().json(
						resources.readResponse("accountcodepurpose/accountcodepurpose_create_response.json")));

		verify(accountCodePurposeService).create(captor.capture(), any(BindingResult.class), any(RequestInfo.class));

		final List<AccountCodePurpose> actualRequest = captor.getValue();
		assertEquals("name", actualRequest.get(0).getName());
		assertEquals("default", actualRequest.get(0).getTenantId());
	}

	@Test
	public void testCreate_Error() throws IOException, Exception {
		when(accountCodePurposeService.create(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
				.thenReturn(getAccountCodePurposes());
		mockMvc.perform(post("/accountcodepurposes/_create")
				.content(resources.readRequest("accountcodepurpose/accountcodepurpose_create_invalid_field_value.json"))
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is5xxServerError());

	}

	@Test
	public void testUpdate() throws IOException, Exception {
		when(accountCodePurposeService.update(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
				.thenReturn(getUpdateAccountCodePurposes());

		mockMvc.perform(post("/accountcodepurposes/_update?tenantId=default")
				.content(resources.readRequest("accountcodepurpose/accountcodepurpose_update_request.json"))
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(201))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(content().json(
						resources.readResponse("accountcodepurpose/accountcodepurpose_update_response.json")));

		verify(accountCodePurposeService).update(captor.capture(), any(BindingResult.class), any(RequestInfo.class));

		final List<AccountCodePurpose> actualRequest = captor.getValue();
		assertEquals("nameU", actualRequest.get(0).getName());
		assertEquals("default", actualRequest.get(0).getTenantId());
	}

	@Test
	public void test_search() throws IOException, Exception {

		Pagination<AccountCodePurpose> page = new Pagination<>();
		page.setTotalPages(1);
		page.setTotalResults(1);
		page.setCurrentPage(0);
		page.setPagedData(getAccountCodePurposes());
		page.getPagedData().get(0).setId("1");

		when(accountCodePurposeService.search(any(AccountCodePurposeSearch.class), any(BindingResult.class)))
				.thenReturn(page);

		mockMvc.perform(post("/accountcodepurposes/_search?tenantId=default").content(resources.getRequestInfo())
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(200))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(content().json(
						resources.readResponse("accountcodepurpose/accountcodepurpose_search_response.json")));

	}

	private List<AccountCodePurpose> getAccountCodePurposes() {
		List<AccountCodePurpose> accountCodePurposes = new ArrayList<AccountCodePurpose>();
		AccountCodePurpose accountCodePurpose = AccountCodePurpose.builder().id("1").name("name").build();
		accountCodePurpose.setTenantId("default");
		accountCodePurposes.add(accountCodePurpose);
		return accountCodePurposes;
	}

	private List<AccountCodePurpose> getUpdateAccountCodePurposes() {
		List<AccountCodePurpose> accountCodePurposes = new ArrayList<AccountCodePurpose>();
		AccountCodePurpose accountCodePurpose = AccountCodePurpose.builder().id("1").name("nameU").build();
		accountCodePurpose.setTenantId("default");
		accountCodePurposes.add(accountCodePurpose);
		return accountCodePurposes;
	}
}
