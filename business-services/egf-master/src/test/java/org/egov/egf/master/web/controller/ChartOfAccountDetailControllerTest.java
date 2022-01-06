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
import org.egov.egf.master.domain.model.AccountDetailType;
import org.egov.egf.master.domain.model.ChartOfAccount;
import org.egov.egf.master.domain.model.ChartOfAccountDetail;
import org.egov.egf.master.domain.model.ChartOfAccountDetailSearch;
import org.egov.egf.master.domain.service.ChartOfAccountDetailService;
import org.egov.egf.master.web.requests.ChartOfAccountDetailRequest;
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
@WebMvcTest(ChartOfAccountDetailController.class)
@Import(TestConfiguration.class)
public class ChartOfAccountDetailControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private ChartOfAccountDetailService chartOfAccountDetailService;

	private RequestJsonReader resources = new RequestJsonReader();

	@Captor
	private ArgumentCaptor<ChartOfAccountDetailRequest> captor;

	private static final String DEFAULT="default";

	private static final String FINAL="final";

	private static final String CODE_83="830bf3dc60504244babfe228bdf80bac";

	private static final String CODE_E6="e647d2406902400cbf3cee71a4befb35";

	private static final String CODE_4F="4ff38860184f4f348fa9b9a9ebb25c53";

	@Before
	public void setUp() throws Exception {
	}

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void testCreate() throws IOException, Exception {
		when(chartOfAccountDetailService.add(any(List.class),any(BindingResult.class)))
		.thenReturn((getChartOfAccountDetails()));
		
		mockMvc.perform(post("/chartofaccountdetails/_create?tenantId=default").content(resources.readRequest("chartofaccountdetail/chartofaccountdetail_create_valid_request.json"))
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(201))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(resources.readResponse("chartofaccountdetail/chartofaccountdetail_create_valid_response.json")));
		
		verify(chartOfAccountDetailService).addToQue(captor.capture());
		
		final ChartOfAccountDetailRequest actualRequest = captor.getValue();
		assertEquals(CODE_83, actualRequest.getChartOfAccountDetails().get(0).getChartOfAccount().getId());
		assertEquals(CODE_E6 , actualRequest.getChartOfAccountDetails().get(0).getAccountDetailType().getId());
	}

	@Test
	public void testUpdate() throws IOException, Exception {
		when(chartOfAccountDetailService.update(any(List.class),any(BindingResult.class)))
		.thenReturn((getUpdatedChartOfAccountDetails()));

		mockMvc.perform(post("/chartofaccountdetails/_update?tenantId=default").content(resources.readRequest("chartofaccountdetail/chartofaccountdetail_update_valid_request.json"))
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(201))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(resources.readResponse("chartofaccountdetail/chartofaccountdetail_update_valid_response.json")));

		verify(chartOfAccountDetailService).addToQue(captor.capture());
		
		final ChartOfAccountDetailRequest actualRequest = captor.getValue();
		assertEquals(CODE_4F , actualRequest.getChartOfAccountDetails().get(0).getId());
		assertEquals(CODE_83 , actualRequest.getChartOfAccountDetails().get(0).getChartOfAccount().getId());
		assertEquals("9ed569220386455fb3b1f1a81535396d", actualRequest.getChartOfAccountDetails().get(0).getAccountDetailType().getId());
}

	@Test
	public void testSearch() throws IOException, Exception {
		when(chartOfAccountDetailService.search(any(ChartOfAccountDetailSearch.class), any(BindingResult.class)))
		.thenReturn((getPagination()));
		
		mockMvc.perform(
				post("/chartofaccountdetails/_search?tenantId=default").content(resources.getRequestInfo()).contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(status().is(200)).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(resources.readResponse("chartofaccountdetail/chartofaccountdetail_search_valid_response.json")));
	}
	
	private List<ChartOfAccountDetail> getChartOfAccountDetails(){

		List<ChartOfAccountDetail> chartOfAccountDetails = new ArrayList<ChartOfAccountDetail>();
		ChartOfAccountDetail chartOfAccountDetail = ChartOfAccountDetail.builder().build();
		ChartOfAccount chartOfAccount = ChartOfAccount.builder().id(CODE_83).glcode("1201").name("finalfdf").description("accountNumber").build();
		chartOfAccount.setTenantId(DEFAULT);
		AccountDetailType accountDetailType = AccountDetailType.builder().id().name(FINAL).description(FINAL).tableName(FINAL).active(true).fullyQualifiedName(FINAL).build();
		accountDetailType.setTenantId(DEFAULT);
		chartOfAccountDetail.setTenantId(DEFAULT);
		chartOfAccountDetail.setChartOfAccount(chartOfAccount);
		chartOfAccountDetail.setAccountDetailType(accountDetailType);
		chartOfAccountDetails.add(chartOfAccountDetail);
		return chartOfAccountDetails;
	}
	
	private List<ChartOfAccountDetail> getChartOfAccountDetailsSearch(){

		List<ChartOfAccountDetail> chartOfAccountDetails = new ArrayList<ChartOfAccountDetail>();
		ChartOfAccountDetail chartOfAccountDetail1 = ChartOfAccountDetail.builder().id(CODE_4F).build();
		ChartOfAccountDetail chartOfAccountDetail2 = ChartOfAccountDetail.builder().id("9bea76ae70e04164a1f98df7b996ba0f").build();
		ChartOfAccountDetail chartOfAccountDetail3 = ChartOfAccountDetail.builder().id("cabf5df544af4253a1cc26aa80e57270").build();
		ChartOfAccount chartOfAccount1 = ChartOfAccount.builder().id(CODE_83).build();
		ChartOfAccount chartOfAccount2 = ChartOfAccount.builder().id(CODE_83).build();
		ChartOfAccount chartOfAccount3 = ChartOfAccount.builder().id(CODE_83).build();
		chartOfAccount1.setTenantId(DEFAULT);
		chartOfAccount2.setTenantId(DEFAULT);
		chartOfAccount3.setTenantId(DEFAULT);
		AccountDetailType accountDetailType1 = AccountDetailType.builder().id(CODE_E6).build();
		AccountDetailType accountDetailType2 = AccountDetailType.builder().id(CODE_E6).build();
		AccountDetailType accountDetailType3 = AccountDetailType.builder().id(CODE_E6).build();
		chartOfAccountDetail1.setTenantId(DEFAULT);
		chartOfAccountDetail2.setTenantId(DEFAULT);
		chartOfAccountDetail3.setTenantId(DEFAULT);
		chartOfAccountDetail1.setChartOfAccount(chartOfAccount1);
		chartOfAccountDetail1.setAccountDetailType(accountDetailType1);
		chartOfAccountDetail2.setChartOfAccount(chartOfAccount2);
		chartOfAccountDetail2.setAccountDetailType(accountDetailType2);
		chartOfAccountDetail3.setChartOfAccount(chartOfAccount3);
		chartOfAccountDetail3.setAccountDetailType(accountDetailType3);
		chartOfAccountDetails.add(chartOfAccountDetail1);
		chartOfAccountDetails.add(chartOfAccountDetail2);
		chartOfAccountDetails.add(chartOfAccountDetail3);
		return chartOfAccountDetails;
	}
	
	private List<ChartOfAccountDetail> getUpdatedChartOfAccountDetails(){
		List<ChartOfAccountDetail> chartOfAccountDetails = new ArrayList<ChartOfAccountDetail>();
		ChartOfAccountDetail chartOfAccountDetail = ChartOfAccountDetail.builder().id(CODE_4F).build();
		ChartOfAccount chartOfAccount = ChartOfAccount.builder().id(CODE_83)
				.glcode("updatedglcode").name("name")
				.description("description").isActiveForPosting(true)
				.type('B').classification((long) 123456)
				.functionRequired(true).budgetCheckRequired(true).build();
		chartOfAccount.setTenantId(DEFAULT);
		chartOfAccountDetail.setTenantId(DEFAULT);
		AccountDetailType accountDetailType = AccountDetailType.builder().id("9ed569220386455fb3b1f1a81535396d").build();
		chartOfAccountDetail.setChartOfAccount(chartOfAccount);
		chartOfAccountDetail.setAccountDetailType(accountDetailType);
		chartOfAccountDetails.add(chartOfAccountDetail);
		return chartOfAccountDetails;
	}
	
	private Pagination<ChartOfAccountDetail> getPagination(){
		Pagination<ChartOfAccountDetail> pgn = new Pagination<>();
		pgn.setCurrentPage(0);
		pgn.setOffset(0);
		pgn.setPageSize(500);
		pgn.setTotalPages(1);
		pgn.setTotalResults(3);
		pgn.setPagedData(getChartOfAccountDetailsSearch());
		return pgn;
	}
}