package org.egov.egf.master.domain.service;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.TestConfiguration;
import org.egov.egf.master.domain.model.AccountCodePurpose;
import org.egov.egf.master.domain.model.AccountCodePurposeSearch;
import org.egov.egf.master.domain.repository.AccountCodePurposeRepository;
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
public class AccountCodePurposeServiceTest {

	@InjectMocks
	private AccountCodePurposeService accountCodePurposeService;

	@Mock
	private SmartValidator validator;

	@Mock
	private AccountCodePurposeRepository accountCodePurposeRepository;

	private BindingResult errors = new BeanPropertyBindingResult(null, null);
	private RequestInfo requestInfo = new RequestInfo();
	private List<AccountCodePurpose> accountCodePurposes = new ArrayList<>();

	@Before
	public void setup() {
	}

	@Test
	public final void testCreate() {
		accountCodePurposes.add(getAccountCodePurpose());
		when(accountCodePurposeRepository.uniqueCheck(any(String.class), any(AccountCodePurpose.class)))
				.thenReturn(true);
		accountCodePurposeService.create(accountCodePurposes, errors, requestInfo);
	}

	@Test
	public final void testUpdate() {
		accountCodePurposes.add(getAccountCodePurpose());
		when(accountCodePurposeRepository.uniqueCheck(any(String.class), any(AccountCodePurpose.class)))
				.thenReturn(true);
		accountCodePurposeService.update(accountCodePurposes, errors, requestInfo);
	}

	@Test
	public final void testCreateInvalid() {
		AccountCodePurpose accountCodePurpose = AccountCodePurpose.builder().id("a").name("name").build();
		when(accountCodePurposeRepository.uniqueCheck(any(String.class), any(AccountCodePurpose.class)))
				.thenReturn(true);
		accountCodePurposes.add(accountCodePurpose);
		accountCodePurposeService.create(accountCodePurposes, errors, requestInfo);
	}

	@Test
	public final void test_save() {
		AccountCodePurpose expextedResult = getAccountCodePurposes().get(0);
		when(accountCodePurposeRepository.save(any(AccountCodePurpose.class))).thenReturn(expextedResult);
		AccountCodePurpose actualResult = accountCodePurposeService.save(getAccountCodePurposes().get(0));
		assertEquals(expextedResult, actualResult);
	}

	@Test
	public final void testSearch() {
		List<AccountCodePurpose> search = new ArrayList<>();
		search.add(getAccountCodePurposeSearch());
		Pagination<AccountCodePurpose> expectedResult = new Pagination<>();
		expectedResult.setPagedData(search);
		when(accountCodePurposeRepository.search(any(AccountCodePurposeSearch.class))).thenReturn(expectedResult);
		Pagination<AccountCodePurpose> actualResult = accountCodePurposeService.search(getAccountCodePurposeSearch(),
				errors);
		assertEquals(expectedResult, actualResult);

	}

	@Test
	public final void test_update() {
		AccountCodePurpose expextedResult = getAccountCodePurposes().get(0);
		when(accountCodePurposeRepository.update(any(AccountCodePurpose.class))).thenReturn(expextedResult);
		AccountCodePurpose actualResult = accountCodePurposeService.update(getAccountCodePurposes().get(0));
		assertEquals(expextedResult, actualResult);
	}

	private List<AccountCodePurpose> getAccountCodePurposes() {
		List<AccountCodePurpose> accountCodePurposes = new ArrayList<AccountCodePurpose>();
		AccountCodePurpose accountCodePurpose = AccountCodePurpose.builder().id("1").name("name").build();
		accountCodePurpose.setTenantId("default");
		accountCodePurposes.add(accountCodePurpose);
		return accountCodePurposes;
	}

	private AccountCodePurposeSearch getAccountCodePurposeSearch() {
		AccountCodePurposeSearch accountCodePurposeSearch = new AccountCodePurposeSearch();
		accountCodePurposeSearch.setPageSize(0);
		accountCodePurposeSearch.setOffset(0);
		accountCodePurposeSearch.setSortBy("Sort");
		accountCodePurposeSearch.setTenantId("default");
		return accountCodePurposeSearch;
	}

	private AccountCodePurpose getAccountCodePurpose() {
		AccountCodePurpose accountCodePurpose = AccountCodePurpose.builder().id("1").name("name").build();
		accountCodePurpose.setTenantId("default");
		return accountCodePurpose;
	}

}