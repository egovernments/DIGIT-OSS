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

import org.egov.common.domain.model.Pagination;
import org.egov.common.utils.RequestJsonReader;
import org.egov.egf.master.TestConfiguration;
import org.egov.egf.master.domain.model.ChartOfAccount;
import org.egov.egf.master.domain.model.ChartOfAccountSearch;
import org.egov.egf.master.domain.service.ChartOfAccountService;
import org.egov.egf.master.web.requests.ChartOfAccountRequest;
import org.junit.After;
import org.junit.Before;
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
@WebMvcTest(ChartOfAccountController.class)
@Import(TestConfiguration.class)
public class ChartOfAccountControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private ChartOfAccountService chartOfAccountService;

	private RequestJsonReader resources = new RequestJsonReader();

	@Captor
	private ArgumentCaptor<ChartOfAccountRequest> captor;

	@Before
	public void setUp() throws Exception {
	}

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void testCreate() throws IOException, Exception {
		when(chartOfAccountService.add(any(List.class),any(BindingResult.class)))
				.thenReturn((getChartOfAccounts()));
		
		mockMvc.perform(post("/chartofaccounts/_create?tenantId=default").content(resources.readRequest("chartofaccount/chartofaccount_create_valid_request.json"))
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(201))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(resources.readResponse("chartofaccount/chartofaccount_create_valid_response.json")));
		
		verify(chartOfAccountService).addToQue(captor.capture());
		
		final ChartOfAccountRequest actualRequest = captor.getValue();
		assertEquals("AadharBank", actualRequest.getChartOfAccounts().get(0).getName());
		assertEquals("GLCode", actualRequest.getChartOfAccounts().get(0).getGlcode());
		assertEquals(true, actualRequest.getChartOfAccounts().get(0).getIsActiveForPosting());
		assertEquals("default", actualRequest.getChartOfAccounts().get(0).getTenantId());
		assertEquals(true, actualRequest.getChartOfAccounts().get(0).getBudgetCheckRequired());
	}

	@Test
	public void testUpdate() throws IOException, Exception {
		when(chartOfAccountService.update(any(List.class),any(BindingResult.class)))
				.thenReturn((getUpdatedChartOfAccounts()));

		mockMvc.perform(post("/chartofaccounts/_update?tenantId=default").content(resources.readRequest("chartofaccount/chartofaccount_update_valid_request.json"))
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(201))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(resources.readResponse("chartofaccount/chartofaccount_update_valid_response.json")));
		
		verify(chartOfAccountService).addToQue(captor.capture());
		
		final ChartOfAccountRequest actualRequest = captor.getValue();
		assertEquals("MunicipalBank", actualRequest.getChartOfAccounts().get(0).getName());
		assertEquals("GLCode", actualRequest.getChartOfAccounts().get(0).getGlcode());
		assertEquals("DefaultDescription", actualRequest.getChartOfAccounts().get(0).getDescription());
		assertEquals(true, actualRequest.getChartOfAccounts().get(0).getBudgetCheckRequired());
		assertEquals(true, actualRequest.getChartOfAccounts().get(0).getIsActiveForPosting());
		assertEquals("default", actualRequest.getChartOfAccounts().get(0).getTenantId());
		assertEquals(true, actualRequest.getChartOfAccounts().get(0).getFunctionRequired());
		assertEquals(true, actualRequest.getChartOfAccounts().get(0).getBudgetCheckRequired());
	}

	@Test
	public void testSearch() throws IOException, Exception {
		when(chartOfAccountService.search(any(ChartOfAccountSearch.class), any(BindingResult.class)))
		.thenReturn((getPagination()));
		
		mockMvc.perform(
				post("/chartofaccounts/_search?tenantId=default").content(resources.getRequestInfo()).contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(status().is(200)).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(resources.readResponse("chartofaccount/chartofaccount_search_valid_response.json")));
		

	}

	private List<ChartOfAccount> getChartOfAccounts() {
		List<ChartOfAccount> chartOfAccounts = new ArrayList<ChartOfAccount>();
		ChartOfAccount chartOfAccount = ChartOfAccount.builder()
				.glcode("GLCode").name("AadharBank")
				.description("DefaultDescription").isActiveForPosting(true)
				.type('B').classification((long) 123456)
				.functionRequired(true).budgetCheckRequired(true).majorCode("GLC").build();
		chartOfAccount.setTenantId("default");
		chartOfAccounts.add(chartOfAccount);
		return chartOfAccounts;
	}
	
	private List<ChartOfAccount> getUpdatedChartOfAccounts() {
		List<ChartOfAccount> chartOfAccounts = new ArrayList<ChartOfAccount>();
		ChartOfAccount chartOfAccount = ChartOfAccount.builder()
				.glcode("GLCode").name("MunicipalBank")
				.description("DefaultDescription").isActiveForPosting(true)
				.type('B').classification((long) 123456)
				.functionRequired(true).budgetCheckRequired(true).build();
		chartOfAccount.setTenantId("default");
		chartOfAccounts.add(chartOfAccount);
		return chartOfAccounts;
	}
	
	private Pagination<ChartOfAccount> getPagination(){
		Pagination<ChartOfAccount> pgn = new Pagination<>();
		pgn.setCurrentPage(0);
		pgn.setOffset(0);
		pgn.setPageSize(500);
		pgn.setTotalPages(1);
		pgn.setTotalResults(1);
		pgn.setPagedData(getChartOfAccounts());
		return pgn;
	}
}