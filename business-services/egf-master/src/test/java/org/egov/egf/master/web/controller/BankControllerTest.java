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
import org.egov.egf.master.domain.model.Bank;
import org.egov.egf.master.domain.model.BankSearch;
import org.egov.egf.master.domain.service.BankService;
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
@WebMvcTest(BankController.class)
@Import(TestConfiguration.class)
public class BankControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private BankService bankService;

	private RequestJsonReader resources = new RequestJsonReader();

	@Captor
	private ArgumentCaptor<List<Bank>> captor;

	@Before
	public void setUp() throws Exception {
	}

	@After
	public void tearDown() throws Exception {
	}

	/*@Test
	public void testCreate() throws IOException, Exception {
		when(bankService.create(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
				.thenReturn(getBanks());

		mockMvc.perform(post("/banks/_create").content(resources.readRequest("bank/bank_create_valid_request.json"))
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(201))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(resources.readResponse("bank/bank_create_valid_response.json")));

		verify(bankService).create(captor.capture(), any(BindingResult.class), any(RequestInfo.class));

		final List<Bank> actualRequest = captor.getValue();
		assertEquals("name", actualRequest.get(0).getName());
		assertEquals("default", actualRequest.get(0).getTenantId());
		assertEquals(true, actualRequest.get(0).getActive());
	}*/

	@Test
	public void testUpdate() throws IOException, Exception {
		when(bankService.update(captor.capture(), any(BindingResult.class), any(RequestInfo.class))).thenReturn((getUpdateBanks()));

		mockMvc.perform(post("/banks/_update?tenantId=default").content(resources.readRequest("bank/bank_update_valid_request.json"))
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(201))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(resources.readResponse("bank/bank_update_valid_response.json")));

		verify(bankService).update(captor.capture(), any(BindingResult.class), any(RequestInfo.class));

		final List<Bank> actualRequest = captor.getValue();
		assertEquals("nameupdate", actualRequest.get(0).getName());
		assertEquals("codeupdate", actualRequest.get(0).getCode());
		assertEquals(true, actualRequest.get(0).getActive());
		assertEquals("default", actualRequest.get(0).getTenantId());
	}

	@Test
	public void testSearch() throws IOException, Exception {
		Pagination<Bank> page = new Pagination<>();
		page.setTotalPages(1);
		page.setTotalResults(1);
		page.setCurrentPage(0);
		page.setPagedData(getBanks());
		page.getPagedData().get(0).setId("1");

		when(bankService.search(any(BankSearch.class), any(BindingResult.class))).thenReturn(page);

		mockMvc.perform(
				post("/banks/_search?tenantId=default").content(resources.getRequestInfo()).contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(status().is(200)).andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(content().json(resources.readResponse("bank/bank_search_valid_response.json")));
	}

	/*@Test
	public void testCreate_Error() throws IOException, Exception {

		when(bankService.create(any(List.class), any(BindingResult.class), any(RequestInfo.class))).thenReturn(getBanks());

		mockMvc.perform(
				post("/banks/_create").content(resources.readRequest("bank/bank_create_invalid_field_value.json"))
						.contentType(MediaType.APPLICATION_JSON_UTF8))
				.andExpect(status().is5xxServerError());

	}
*/
	private List<Bank> getBanks() {
		List<Bank> banks = new ArrayList<Bank>();
		Bank bank = Bank.builder().code("code").name("name").description("description").active(true).type("type")
				.build();
		bank.setTenantId("default");
		banks.add(bank);
		return banks;
	}

	private List<Bank> getUpdateBanks() {
		List<Bank> banks = new ArrayList<Bank>();
		Bank bank = Bank.builder().code("codeupdate").name("nameupdate").description("descriptionupdate").active(true)
				.type("typeupdate").build();
		bank.setTenantId("default");
		banks.add(bank);
		return banks;
	}
}