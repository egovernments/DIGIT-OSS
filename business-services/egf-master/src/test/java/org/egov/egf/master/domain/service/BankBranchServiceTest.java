package org.egov.egf.master.domain.service;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.TestConfiguration;
import org.egov.egf.master.domain.model.Bank;
import org.egov.egf.master.domain.model.BankBranch;
import org.egov.egf.master.domain.model.BankBranchSearch;
import org.egov.egf.master.domain.repository.BankBranchRepository;
import org.egov.egf.master.domain.repository.BankRepository;
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
public class BankBranchServiceTest {

	@InjectMocks
	private BankBranchService bankBranchService;

	@Mock
	private SmartValidator validator;

	@Mock
	private BankBranchRepository bankBranchRepository;

	@Mock
	private BankRepository bankRepository;

	private BindingResult errors = new BeanPropertyBindingResult(null, null);

	private RequestInfo requestInfo = new RequestInfo();

	private List<BankBranch> bankBranches = new ArrayList<>();

	@Before
	public void setup() {

	}

	@Test
	public final void testCreate() {
		bankBranches.add(getBankBranch());
		when(bankRepository.findById(any(Bank.class))).thenReturn(getBank());
		when(bankBranchRepository.uniqueCheck(any(String.class), any(BankBranch.class))).thenReturn(true);
		bankBranchService.create(bankBranches, errors, requestInfo);
	}

	@Test
	public final void testUpdate() {
		bankBranches.add(getBankBranch());
		when(bankRepository.findById(any(Bank.class))).thenReturn(getBank());
		when(bankBranchRepository.uniqueCheck(any(String.class), any(BankBranch.class))).thenReturn(true);
		bankBranchService.update(bankBranches, errors, requestInfo);
	}

	@Test
	public final void testCreateInvalid() {
		BankBranch bankBranch = BankBranch.builder().id("a").code("code").name("name").active(true).build();
		when(bankBranchRepository.uniqueCheck(any(String.class), any(BankBranch.class))).thenReturn(true);
		bankBranches.add(bankBranch);
		bankBranchService.create(bankBranches, errors, requestInfo);
	}

	@Test
	public final void test_save() {
		BankBranch expextedResult = getBankBranch();
		when(bankBranchRepository.save(any(BankBranch.class))).thenReturn(getBankBranch());
		BankBranch actualResult = bankBranchService.save(getBankBranch());
		assertEquals(expextedResult, actualResult);
	}

	@Test
	public final void testSearch() {
		List<BankBranch> search = new ArrayList<>();
		search.add(getBankBranch());
		Pagination<BankBranch> expectedResult = new Pagination<>();
		expectedResult.setPagedData(search);
		when(bankBranchRepository.search(any(BankBranchSearch.class))).thenReturn(expectedResult);
		Pagination<BankBranch> actualResult = bankBranchService.search(getBankBranchSearch(), errors);
		assertEquals(expectedResult, actualResult);
	}

	@Test
	public final void testSave() {
		BankBranch expectedResult = getBankBranch();
		when(bankBranchRepository.save(any(BankBranch.class))).thenReturn(expectedResult);
		final BankBranch actualResult = bankBranchService.save(getBankBranch());
		assertEquals(expectedResult, actualResult);
	}

	@Test
	public final void test_Update() {
		BankBranch expectedResult = getBankBranch();
		when(bankBranchRepository.update(any(BankBranch.class))).thenReturn(expectedResult);
		final BankBranch actualResult = bankBranchService.update(getBankBranch());
		assertEquals(expectedResult, actualResult);
	}

	@Test
	public final void test_fetch_related_data() {
		List<BankBranch> expextedResult = new ArrayList<>();
		List<BankBranch> bankBranches = new ArrayList<>();
		expextedResult.add(getBankBranch());
		bankBranches.add(getBankBranch());
		when(bankRepository.findById(any(Bank.class))).thenReturn(getBank());
		List<BankBranch> actualResult = bankBranchService.fetchRelated(bankBranches);
		assertEquals(expextedResult.get(0).getBank().getId(), actualResult.get(0).getBank().getId());
	}

	private BankBranch getBankBranch() {
		return BankBranch.builder().id("1").code("code").name("name").bank(getBank()).description("description")
				.build();
	}

	private Bank getBank() {
		return Bank.builder().id("1").code("code").description("description").build();
	}

	private BankBranchSearch getBankBranchSearch() {
		BankBranchSearch bankBranchSearch = new BankBranchSearch();
		bankBranchSearch.setPageSize(0);
		bankBranchSearch.setOffset(0);
		bankBranchSearch.setSortBy("Sort");
		bankBranchSearch.setTenantId("default");
		return bankBranchSearch;
	}
}