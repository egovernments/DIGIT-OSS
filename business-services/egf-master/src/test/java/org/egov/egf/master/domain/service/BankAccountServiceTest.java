package org.egov.egf.master.domain.service;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.exception.CustomBindException;
import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.TestConfiguration;
import org.egov.egf.master.domain.model.AccountCodePurpose;
import org.egov.egf.master.domain.model.Bank;
import org.egov.egf.master.domain.model.BankAccount;
import org.egov.egf.master.domain.model.BankAccountSearch;
import org.egov.egf.master.domain.model.BankBranch;
import org.egov.egf.master.domain.model.ChartOfAccount;
import org.egov.egf.master.domain.model.Fund;
import org.egov.egf.master.domain.repository.BankAccountRepository;
import org.egov.egf.master.domain.repository.BankBranchRepository;
import org.egov.egf.master.domain.repository.ChartOfAccountRepository;
import org.egov.egf.master.domain.repository.FundRepository;
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
public class BankAccountServiceTest {

	@InjectMocks
	private BankAccountService bankAccountService;

	@Mock
	private SmartValidator validator;

	@Mock
	private BankAccountRepository bankAccountRepository;

	@Mock
	private BankBranchRepository bankBranchRepository;

	@Mock
	private ChartOfAccountRepository chartOfAccountRepository;

	@Mock
	private FundRepository fundRepository;

	private BindingResult errors = new BeanPropertyBindingResult(null, null);

	private List<BankAccount> bankAccounts = new ArrayList<>();

	private RequestInfo requestInfo = new RequestInfo();

	@Before
	public void setup() {

	}

	@Test
	public final void testCreate() {
		bankAccounts.add(getBankAccount());
		when(bankBranchRepository.findById(any(BankBranch.class))).thenReturn(getBankBranch());
		when(chartOfAccountRepository.findById(any(ChartOfAccount.class))).thenReturn(getChartOfAccount());
		when(fundRepository.findById(any(Fund.class))).thenReturn(getFund());
		when(bankAccountRepository.uniqueCheck(anyString(), any(BankAccount.class))).thenReturn(true);
		bankAccountService.create(bankAccounts, errors, requestInfo);
	}

	@Test
	public final void testUpdate() {
		bankAccounts.add(getBankAccount());
		when(bankBranchRepository.findById(any(BankBranch.class))).thenReturn(getBankBranch());
		when(chartOfAccountRepository.findById(any(ChartOfAccount.class))).thenReturn(getChartOfAccount());
		when(fundRepository.findById(any(Fund.class))).thenReturn(getFund());
		when(bankAccountRepository.uniqueCheck(anyString(), any(BankAccount.class))).thenReturn(true);
		bankAccountService.update(bankAccounts, errors, requestInfo);
	}

	@Test
	public final void test_save() {
		BankAccount expextedResult = getBankAccount();
		when(bankAccountRepository.save(any(BankAccount.class))).thenReturn(getBankAccount());
		BankAccount actualResult = bankAccountService.save(getBankAccount());
		assertEquals(expextedResult, actualResult);
	}

	@Test
	public final void testSearch() {
		List<BankAccount> search = new ArrayList<>();
		search.add(getBankAccount());
		Pagination<BankAccount> expectedResult = new Pagination<>();
		expectedResult.setPagedData(search);
		when(bankAccountRepository.search(any(BankAccountSearch.class))).thenReturn(expectedResult);
		Pagination<BankAccount> actualResult = bankAccountService.search(getBankAccountSearch(), errors);
		assertEquals(expectedResult, actualResult);
	}

	@Test(expected = InvalidDataException.class)
	public final void testSearchInvalid() {
		List<BankAccount> search = new ArrayList<>();
		search.add(getBankAccount());
		Pagination<BankAccount> expectedResult = new Pagination<>();
		expectedResult.setPagedData(search);
		when(bankAccountRepository.search(any(BankAccountSearch.class))).thenReturn(expectedResult);
		BankAccountSearch b = getBankAccountSearch();
		b.setTenantId(null);
		Pagination<BankAccount> actualResult = bankAccountService.search(b, errors);
	}

	@Test
	public final void testSave() {
		BankAccount expectedResult = getBankAccount();
		when(bankAccountRepository.save(any(BankAccount.class))).thenReturn(expectedResult);
		final BankAccount actualResult = bankAccountService.save(getBankAccount());
		assertEquals(expectedResult, actualResult);
	}

	@Test
	public final void test_Update() {
		BankAccount expectedResult = getBankAccount();
		when(bankAccountRepository.update(any(BankAccount.class))).thenReturn(expectedResult);
		final BankAccount actualResult = bankAccountService.update(getBankAccount());
		assertEquals(expectedResult, actualResult);
	}

	@Test
	public final void test_fetch_related_data() {
		List<BankAccount> expextedResult = new ArrayList<>();
		List<BankAccount> bankAccounts = new ArrayList<>();
		expextedResult.add(getBankAccount());
		bankAccounts.add(getBankAccount());
		when(bankBranchRepository.findById(any(BankBranch.class))).thenReturn(getBankBranch());
		when(chartOfAccountRepository.findById(any(ChartOfAccount.class))).thenReturn(getChartOfAccount());
		when(fundRepository.findById(any(Fund.class))).thenReturn(getFund());
		List<BankAccount> actualResult = bankAccountService.fetchRelated(bankAccounts);
		assertEquals(expextedResult.get(0).getBankBranch().getId(), actualResult.get(0).getBankBranch().getId());
		assertEquals(expextedResult.get(0).getFund().getId(), actualResult.get(0).getFund().getId());
		assertEquals(expextedResult.get(0).getChartOfAccount().getId(),
				actualResult.get(0).getChartOfAccount().getId());
	}

	@Test(expected = CustomBindException.class)
	public final void testCreateInvalid() {
		bankAccounts.add(getBankAccount());
		when(bankBranchRepository.findById(any(BankBranch.class))).thenReturn(getBankBranch());
		when(chartOfAccountRepository.findById(any(ChartOfAccount.class))).thenReturn(getChartOfAccount());
		when(fundRepository.findById(any(Fund.class))).thenReturn(getFund());
		when(bankAccountRepository.uniqueCheck(anyString(), any(BankAccount.class))).thenReturn(false);
		bankAccountService.create(bankAccounts, errors, requestInfo);
	}

	private Bank getBank() {
		Bank bank = Bank.builder().id("1").code("code").description("description").build();
		bank.setTenantId("default");
		return bank;
	}

	private BankBranch getBankBranch() {
		BankBranch bankBranch = BankBranch.builder().code("code").build();
		bankBranch.setTenantId("default");
		bankBranch.setBank(getBank());
		return bankBranch;
	}

	private ChartOfAccount getChartOfAccount() {
		ChartOfAccount parent = ChartOfAccount.builder().id("parent").build();
		ChartOfAccount chartOfAccount = ChartOfAccount.builder().glcode("glcode").name("name")
				.description("description").isActiveForPosting(true).type('B').classification((long) 123456)
				.functionRequired(true).budgetCheckRequired(true).build();
		chartOfAccount.setAccountCodePurpose(getAccountCodePurpose());
		chartOfAccount.setParentId(parent);
		chartOfAccount.setTenantId("default");
		return chartOfAccount;
	}

	private AccountCodePurpose getAccountCodePurpose() {
		AccountCodePurpose acp = AccountCodePurpose.builder().id("id").name("name").build();
		acp.setTenantId("default");
		return acp;
	}

	private Fund getFund() {
		return Fund.builder().id("1").code("code").build();
	}

	private BankAccount getBankAccount() {
		return BankAccount.builder().id("1").chartOfAccount(getChartOfAccount()).fund(getFund())
				.bankBranch(getBankBranch()).build();
	}

	private BankAccountSearch getBankAccountSearch() {
		BankAccountSearch bankAccountSearch = new BankAccountSearch();
		bankAccountSearch.setTenantId("default");
		bankAccountSearch.setPageSize(0);
		bankAccountSearch.setOffset(0);
		bankAccountSearch.setSortBy("Sort");
		return bankAccountSearch;
	}
}