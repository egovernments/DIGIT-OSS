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
import org.egov.egf.master.domain.model.Function;
import org.egov.egf.master.domain.model.FunctionSearch;
import org.egov.egf.master.domain.service.FunctionService;
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
@WebMvcTest(FunctionController.class)
@Import(TestConfiguration.class)
public class FunctionControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	FunctionService functionService;

	@Captor
	private ArgumentCaptor<List<Function>> captor;

	private RequestJsonReader resources = new RequestJsonReader();

	@Test
	public void testCreate() throws IOException, Exception {
		when(functionService.create(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
				.thenReturn(getFunctions());
		mockMvc.perform(
				post("/functions/_create?tenantId=default").content(resources.readRequest("function/function_create_valid_request.json"))
						.contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(status().is(201)).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(resources.readResponse("function/function_create_valid_response.json")));

		verify(functionService).create(captor.capture(), any(BindingResult.class), any(RequestInfo.class));

		final List<Function> actualRequest = captor.getValue();
		assertEquals("name", actualRequest.get(0).getName());
		assertEquals("code", actualRequest.get(0).getCode());
		assertEquals("default", actualRequest.get(0).getTenantId());
	}

	@Test
	public void testCreate_Error() throws IOException, Exception {
		when(functionService.create(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
				.thenReturn(getFunctions());
		mockMvc.perform(post("/functions/_create")
				.content(resources.readRequest("function/function_create_invalid_field_value.json"))
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is5xxServerError());

	}

	@Test
	public void testUpdate() throws IOException, Exception {
		when(functionService.update(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
				.thenReturn(getUpdateFunctions());

		mockMvc.perform(
				post("/functions/_update?tenantId=default").content(resources.readRequest("function/function_update_valid_request.json"))
						.contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(status().is(201)).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(resources.readResponse("function/function_update_valid_response.json")));

		verify(functionService).update(captor.capture(), any(BindingResult.class), any(RequestInfo.class));

		final List<Function> actualRequest = captor.getValue();
		assertEquals("nameU", actualRequest.get(0).getName());
		assertEquals("codeU", actualRequest.get(0).getCode());
		assertEquals("default", actualRequest.get(0).getTenantId());
	}

	@Test
	public void test_search() throws IOException, Exception {

		Pagination<Function> page = new Pagination<>();
		page.setTotalPages(1);
		page.setTotalResults(1);
		page.setCurrentPage(0);
		page.setPagedData(getFunctions());
		page.getPagedData().get(0).setId("1");

		when(functionService.search(any(FunctionSearch.class), any(BindingResult.class))).thenReturn(page);

		mockMvc.perform(post("/functions/_search?tenantId=default").content(resources.getRequestInfo())
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(200))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(resources.readResponse("function/function_search_valid_response.json")));

	}

	private List<Function> getFunctions() {
		List<Function> functions = new ArrayList<Function>();
		Function function = Function.builder().name("name").code("code").level(1).active(true).build();
		function.setTenantId("default");
		functions.add(function);
		return functions;
	}

	private List<Function> getUpdateFunctions() {
		List<Function> functions = new ArrayList<Function>();
		Function function = Function.builder().name("nameU").code("codeU").active(true).id("1").level(2).build();
		function.setTenantId("default");
		functions.add(function);
		return functions;
	}
}
