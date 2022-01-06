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
import org.egov.egf.master.domain.model.BankAccount;
import org.egov.egf.master.domain.model.BankAccountSearch;
import org.egov.egf.master.domain.model.BankBranch;
import org.egov.egf.master.domain.model.ChartOfAccount;
import org.egov.egf.master.domain.model.Fund;
import org.egov.egf.master.domain.service.BankAccountService;
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
@WebMvcTest(BankAccountController.class)
@Import(TestConfiguration.class)
public class BankAccountControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private BankAccountService bankAccountService;

	private RequestJsonReader resources = new RequestJsonReader();

	@Captor
	private ArgumentCaptor<List<BankAccount>> captor;

	@Before
	public void setUp() throws Exception {
	}

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void testCreate() throws IOException, Exception {
		when(bankAccountService.create(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
				.thenReturn((getBankAccounts()));

		mockMvc.perform(post("/bankaccounts/_create?tenantId=default")
				.content(resources.readRequest("bankaccount/bankAccount_create_valid_request.json"))
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(201))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(
						content().json(resources.readResponse("bankaccount/bankAccount_create_valid_response.json")));

		verify(bankAccountService).create(captor.capture(), any(BindingResult.class), any(RequestInfo.class));

		final List<BankAccount> actualRequest = captor.getValue();
		assertEquals("1", actualRequest.get(0).getBankBranch().getId());
		assertEquals("1", actualRequest.get(0).getChartOfAccount().getId());
		assertEquals("2", actualRequest.get(0).getFund().getId());
		assertEquals("0004", actualRequest.get(0).getAccountNumber());
		assertEquals(true, actualRequest.get(0).getActive());
	}

	@Test
	public void testUpdate() throws IOException, Exception {
		when(bankAccountService.update(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
				.thenReturn((getUpdatedBankAccounts()));

		mockMvc.perform(post("/bankaccounts/_update?tenantId=default")
				.content(resources.readRequest("bankaccount/bankAccount_update_valid_request.json"))
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(201))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(
						content().json(resources.readResponse("bankaccount/bankAccount_update_valid_response.json")));

		verify(bankAccountService).update(captor.capture(), any(BindingResult.class), any(RequestInfo.class));

		final List<BankAccount> actualRequest = captor.getValue();
		assertEquals("1", actualRequest.get(0).getBankBranch().getId());
		assertEquals("1", actualRequest.get(0).getChartOfAccount().getId());
		assertEquals("2", actualRequest.get(0).getFund().getId());
		assertEquals("0004", actualRequest.get(0).getAccountNumber());
		assertEquals("testupdate", actualRequest.get(0).getAccountType());
		assertEquals(true, actualRequest.get(0).getActive());
	}

	@Test
	public void testCreate_Error() throws IOException, Exception {

		when(bankAccountService.create(any(List.class), any(BindingResult.class), any(RequestInfo.class)))
				.thenReturn((getBankAccounts()));

		mockMvc.perform(post("/bankaccounts/_create")
				.content(resources.readRequest("bankaccount/bankaccount_create_invalid_field_value.json"))
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is5xxServerError());

	}

	@Test
	public void testSearch() throws IOException, Exception {
		Pagination<BankAccount> page = new Pagination<>();
		page.setTotalPages(1);
		page.setTotalResults(1);
		page.setCurrentPage(0);
		page.setPagedData(getBankAccounts());
		page.getPagedData().get(0).setId("1");

		when(bankAccountService.search(any(BankAccountSearch.class), any(BindingResult.class))).thenReturn(page);

		mockMvc.perform(post("/bankaccounts/_search?tenantId=default").content(resources.getRequestInfo())
				.contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(status().is(200))
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8)).andExpect(
						content().json(resources.readResponse("bankaccount/bankAccount_search_valid_response.json")));
	}

	private List<BankAccount> getBankAccounts() {
		List<BankAccount> bankAccounts = new ArrayList<BankAccount>();
		BankAccount bankAccount = BankAccount.builder().accountNumber("0004").accountType("test")
				.description("accountNumber").active(true).payTo("tester").build();
		BankBranch bankBranch = BankBranch.builder().id("1").build();
		bankBranch.setTenantId("default");
		Bank bank = Bank.builder().id("1").active(true).type("Bank").build();
		bank.setTenantId("default");
		ChartOfAccount chartOfAccount = ChartOfAccount.builder().id("1").build();
		chartOfAccount.setTenantId("default");
		Fund fund = Fund.builder().id("2").build();
		fund.setTenantId("default");
		bankBranch.setBank(bank);
		bankAccount.setBankBranch(bankBranch);
		bankAccount.setChartOfAccount(chartOfAccount);
		bankAccount.setFund(fund);
		bankAccount.setTenantId("default");
		bankAccounts.add(bankAccount);
		return bankAccounts;
	}

	private List<BankAccount> getUpdatedBankAccounts() {
		List<BankAccount> bankAccounts = new ArrayList<BankAccount>();
		BankAccount bankAccount = BankAccount.builder().accountNumber("0004").accountType("testupdate")
				.description("accountNumber").active(true).payTo("tester").build();
		BankBranch bankBranch = BankBranch.builder().id("1").build();
		bankBranch.setTenantId("default");
		Bank bank = Bank.builder().id("1").active(true).type("Bank").build();
		bank.setTenantId("default");
		ChartOfAccount chartOfAccount = ChartOfAccount.builder().id("1").build();
		chartOfAccount.setTenantId("default");
		Fund fund = Fund.builder().id("2").build();
		fund.setTenantId("default");
		bankBranch.setBank(bank);
		bankAccount.setBankBranch(bankBranch);
		bankAccount.setChartOfAccount(chartOfAccount);
		bankAccount.setFund(fund);
		bankAccount.setTenantId("default");
		bankAccounts.add(bankAccount);
		return bankAccounts;
	}
}