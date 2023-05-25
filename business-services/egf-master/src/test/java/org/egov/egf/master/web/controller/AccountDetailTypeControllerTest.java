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
import org.egov.egf.master.domain.model.AccountDetailType;
import org.egov.egf.master.domain.model.AccountDetailTypeSearch;
import org.egov.egf.master.domain.service.AccountDetailTypeService;
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
@WebMvcTest(AccountDetailTypeController.class)
@Import(TestConfiguration.class)
public class AccountDetailTypeControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	AccountDetailTypeService accountDetailTypeService;

	@Captor
	private ArgumentCaptor<List<AccountDetailType>> captor;

	private RequestJsonReader resources = new RequestJsonReader();

	@Test
	public void testCreate() throws IOException, Exception {
		when(accountDetailTypeService.create(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
				.thenReturn(getAccountDetailTypes());
		mockMvc.perform(post("/accountdetailtypes/_create?tenantId=default")
				.content(resources.readRequest("accountdetailtype/accountdetailtype_create_request.json"))
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(201))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(content().json(
						resources.readResponse("accountdetailtype/accountdetailtype_create_response.json")));

		verify(accountDetailTypeService).create(captor.capture(), any(BindingResult.class), any(RequestInfo.class));

		final List<AccountDetailType> actualRequest = captor.getValue();
		assertEquals("name", actualRequest.get(0).getName());
		assertEquals("contractor", actualRequest.get(0).getTableName());
		assertEquals("default", actualRequest.get(0).getTenantId());
	}

	@Test
	public void testCreate_Error() throws IOException, Exception {
		when(accountDetailTypeService.create(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
				.thenReturn(getAccountDetailTypes());
		mockMvc.perform(post("/accountdetailtypes/_create")
				.content(resources.readRequest("accountdetailtype/accountdetailtype_create_invalid_fieldvalue.json"))
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is5xxServerError());

	}

	@Test
	public void testUpdate() throws IOException, Exception {
		when(accountDetailTypeService.update(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
				.thenReturn(getUpdateAccountDetailTypes());

		mockMvc.perform(post("/accountdetailtypes/_update?tenantId=default")
				.content(resources.readRequest("accountdetailtype/accountdetailtype_update_request.json"))
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(201))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(content().json(
						resources.readResponse("accountdetailtype/accountdetailtype_update_response.json")));

		verify(accountDetailTypeService).update(captor.capture(), any(BindingResult.class), any(RequestInfo.class));

		final List<AccountDetailType> actualRequest = captor.getValue();
		assertEquals("nameU", actualRequest.get(0).getName());
		assertEquals("abc/contractorU", actualRequest.get(0).getFullyQualifiedName());
		assertEquals("default", actualRequest.get(0).getTenantId());
	}

	@Test
	public void test_search() throws IOException, Exception {

		Pagination<AccountDetailType> page = new Pagination<>();
		page.setTotalPages(1);
		page.setTotalResults(1);
		page.setCurrentPage(0);
		page.setPagedData(getAccountDetailTypes());
		page.getPagedData().get(0).setId("1");

		when(accountDetailTypeService.search(any(AccountDetailTypeSearch.class), any(BindingResult.class)))
				.thenReturn(page);

		mockMvc.perform(post("/accountdetailtypes/_search?tenantId=default").content(resources.getRequestInfo())
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(200))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(content().json(
						resources.readResponse("accountdetailtype/accountdetailtype_search_response.json")));

	}

	private List<AccountDetailType> getAccountDetailTypes() {
		List<AccountDetailType> accountDetailTypes = new ArrayList<AccountDetailType>();
		AccountDetailType accountDetailType = AccountDetailType.builder().id("1").name("name").tableName("contractor")
				.fullyQualifiedName("abc/contractor").active(true).build();
		accountDetailType.setTenantId("default");
		accountDetailTypes.add(accountDetailType);
		return accountDetailTypes;
	}

	private List<AccountDetailType> getUpdateAccountDetailTypes() {
		List<AccountDetailType> accountDetailTypes = new ArrayList<AccountDetailType>();
		AccountDetailType accountDetailType = AccountDetailType.builder().id("1").name("nameU").tableName("contractorU")
				.fullyQualifiedName("abc/contractorU").active(true).build();
		accountDetailType.setTenantId("default");
		accountDetailTypes.add(accountDetailType);
		return accountDetailTypes;
	}
}
