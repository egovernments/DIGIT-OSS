package org.egov.egf.master.domain.service;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.TestConfiguration;
import org.egov.egf.master.domain.model.AccountCodePurpose;
import org.egov.egf.master.domain.model.ChartOfAccount;
import org.egov.egf.master.domain.model.ChartOfAccountSearch;
import org.egov.egf.master.domain.repository.AccountCodePurposeRepository;
import org.egov.egf.master.domain.repository.ChartOfAccountRepository;
import org.egov.egf.master.web.contract.ChartOfAccountContract;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.SmartValidator;

@Import(TestConfiguration.class)
@RunWith(SpringRunner.class)
public class ChartOfAccountServiceTest {

	@InjectMocks
	ChartOfAccountService chartOfAccountService;

	@Mock
	private SmartValidator validator;

	@Mock
	private ChartOfAccountRepository chartOfAccountRepository;

	@Mock
	private AccountCodePurposeRepository accountCodePurposeRepository;

	private BindingResult errors = new BeanPropertyBindingResult(null, null);

	private List<ChartOfAccount> chartOfAccounts = new ArrayList<>();

	@Before
	public void setup() {

	}

	@Test
	public final void testFetchRelated() {
		when(accountCodePurposeRepository.findById(any(AccountCodePurpose.class))).thenReturn(getAccountCodePurpose());
		when(chartOfAccountRepository.findById(any(ChartOfAccount.class))).thenReturn(getChartOfAccount());
		chartOfAccounts.add(getChartOfAccount());
		chartOfAccountService.fetchRelated(chartOfAccounts);

	}

	@Test
	public final void testAdd() {
		when(accountCodePurposeRepository.findById(any(AccountCodePurpose.class))).thenReturn(getAccountCodePurpose());
		when(chartOfAccountRepository.findById(any(ChartOfAccount.class))).thenReturn(getChartOfAccount());
		when(chartOfAccountRepository.uniqueCheck(any(String.class), any(ChartOfAccount.class))).thenReturn(true);
		chartOfAccounts.add(getChartOfAccount());
		chartOfAccountService.add(chartOfAccounts, errors);
	}

	@Test
	public final void testUpdate() {
		when(accountCodePurposeRepository.findById(any(AccountCodePurpose.class))).thenReturn(getAccountCodePurpose());
		when(chartOfAccountRepository.findById(any(ChartOfAccount.class))).thenReturn(getChartOfAccount());
		chartOfAccounts.add(getChartOfAccount());
		when(chartOfAccountRepository.uniqueCheck(any(String.class), any(ChartOfAccount.class))).thenReturn(true);
		chartOfAccountService.update(chartOfAccounts, errors);
	}

	@Test
	public final void testSave() {
		ChartOfAccount expectedResult = getChartOfAccount();
		when(chartOfAccountRepository.save(any(ChartOfAccount.class))).thenReturn(expectedResult);
		final ChartOfAccount actualResult = chartOfAccountService.save(getChartOfAccount());
		assertEquals(expectedResult, actualResult);
	}
	
	@Test
	public final void test_Update(){
		ChartOfAccount expectedResult = getChartOfAccount();
		when(chartOfAccountRepository.update(any(ChartOfAccount.class))).thenReturn(expectedResult);
		final ChartOfAccount actualResult = chartOfAccountService.update(getChartOfAccount());
		assertEquals(expectedResult, actualResult);
	}
	
/*	@Test
	public final void testAddToQue(){
		CommonRequest<ChartOfAccountContract> request = new CommonRequest<>();
		List<ChartOfAccountContract> coas = new ArrayList<>();
		ChartOfAccountContract coa = getChartOfAccountContract();
		coas.add(coa);
		request.setData(coas);
		chartOfAccountService.addToQue(request);
		verify(chartOfAccountRepository).add(request);
	}*/
	
	@Test
	public final void testSearch(){
		List<ChartOfAccount> search = new ArrayList<>();
		search.add(getChartOfAccountSearch());
		Pagination<ChartOfAccount> expectedResult = new Pagination<>();
		expectedResult.setPagedData(search);
		when(chartOfAccountRepository.search(any(ChartOfAccountSearch.class))).thenReturn(expectedResult);
		Pagination<ChartOfAccount> actualResult = chartOfAccountService.search(getChartOfAccountSearch(), errors);
		assertEquals(expectedResult, actualResult);
	}

	private ChartOfAccount getChartOfAccount() {
		ChartOfAccount parent = ChartOfAccount.builder().id("parent").build();
		ChartOfAccount chartOfAccount = ChartOfAccount.builder().id("1")
				.glcode("GLCode").name("AadharBank")
				.description("DefaultDescription").isActiveForPosting(true)
				.type('B').classification((long) 123456).functionRequired(true)
				.budgetCheckRequired(true).build();
		chartOfAccount.setAccountCodePurpose(getAccountCodePurpose());
		chartOfAccount.setParentId(parent);
		chartOfAccount.setTenantId("default");
		return chartOfAccount;
	}

	private AccountCodePurpose getAccountCodePurpose() {
		AccountCodePurpose acp = AccountCodePurpose.builder().id("id")
				.name("name").build();
		acp.setTenantId("default");
		return acp;
	}
	
	private ChartOfAccountContract getChartOfAccountContract(){
		ChartOfAccountContract coac = ChartOfAccountContract.builder().glcode("glcode").name("name").description("description").budgetCheckRequired(true).isActiveForPosting(true).build();
		//coac.setParentId(getChartOfAccountContract().getParentId());
		return coac;
	}
	
	private List<ChartOfAccount> getChartOfAccounts() {
		List<ChartOfAccount> chartOfAccounts = new ArrayList<ChartOfAccount>();
		ChartOfAccount chartOfAccount = ChartOfAccount.builder()
				.glcode("GLCode").name("AadharBank")
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
	
	private ChartOfAccountSearch getChartOfAccountSearch(){
		ChartOfAccountSearch chartOfAccountSearch = new ChartOfAccountSearch();
		chartOfAccountSearch.setPageSize(0);
		chartOfAccountSearch.setOffset(0);
		chartOfAccountSearch.setSortBy("Sort");
		chartOfAccountSearch.setTenantId("default");
		return chartOfAccountSearch;
	}

}