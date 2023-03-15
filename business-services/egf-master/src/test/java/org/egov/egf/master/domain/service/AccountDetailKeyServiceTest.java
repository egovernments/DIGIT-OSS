package org.egov.egf.master.domain.service;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.TestConfiguration;
import org.egov.egf.master.domain.model.AccountDetailKey;
import org.egov.egf.master.domain.model.AccountDetailKeySearch;
import org.egov.egf.master.domain.model.AccountDetailType;
import org.egov.egf.master.domain.repository.AccountDetailKeyRepository;
import org.egov.egf.master.domain.repository.AccountDetailTypeRepository;
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
public class AccountDetailKeyServiceTest {

	@InjectMocks
	private AccountDetailKeyService accountDetailKeyService;

	@Mock
	private SmartValidator validator;

	@Mock
	private AccountDetailKeyRepository accountDetailKeyRepository;

	@Mock
	private AccountDetailTypeRepository accountDetailTypeRepository;

	private BindingResult errors = new BeanPropertyBindingResult(null, null);
	private RequestInfo requestInfo = new RequestInfo();
	private List<AccountDetailKey> accountDetailKies = new ArrayList<>();

	@Before
	public void setup() {
	}

	@Test
	public final void testCreate() {
		when(accountDetailTypeRepository.findById(any(AccountDetailType.class))).thenReturn(getAccountDetailType());
		when(accountDetailKeyRepository.uniqueCheck(any(String.class), any(AccountDetailKey.class))).thenReturn(true);
		accountDetailKeyService.create(getAccountDetailKeys(), errors, requestInfo);
	}

	@Test
	public final void testUpdate() {
		when(accountDetailTypeRepository.findById(any(AccountDetailType.class))).thenReturn(getAccountDetailType());
		when(accountDetailKeyRepository.uniqueCheck(any(String.class), any(AccountDetailKey.class))).thenReturn(true);
		accountDetailKeyService.update(getAccountDetailKeys(), errors, requestInfo);
	}

	@Test
	public final void testCreateInvalid() {
		AccountDetailKey accountDetailKey1 = AccountDetailKey.builder().id("a").key("1").accountDetailType(null)
				.build();
		accountDetailKies.add(accountDetailKey1);
		when(accountDetailKeyRepository.uniqueCheck(any(String.class), any(AccountDetailKey.class))).thenReturn(true);
		accountDetailKeyService.create(accountDetailKies, errors, requestInfo);
	}

	@Test
	public final void test_save() {
		AccountDetailKey expextedResult = getAccountDetailKeys().get(0);
		when(accountDetailKeyRepository.save(any(AccountDetailKey.class))).thenReturn(expextedResult);
		AccountDetailKey actualResult = accountDetailKeyService.save(getAccountDetailKeys().get(0));
		assertEquals(expextedResult, actualResult);
	}

	@Test
	public final void testSearch() {
		List<AccountDetailKey> search = new ArrayList<>();
		search.add(getAccountDetailKeySearch());
		Pagination<AccountDetailKey> expectedResult = new Pagination<>();
		expectedResult.setPagedData(search);
		when(accountDetailKeyRepository.search(any(AccountDetailKeySearch.class))).thenReturn(expectedResult);
		Pagination<AccountDetailKey> actualResult = accountDetailKeyService.search(getAccountDetailKeySearch(), errors);
		assertEquals(expectedResult, actualResult);

	}

	@Test
	public final void test_update() {
		AccountDetailKey expextedResult = getAccountDetailKeys().get(0);
		when(accountDetailKeyRepository.update(any(AccountDetailKey.class))).thenReturn(expextedResult);
		AccountDetailKey actualResult = accountDetailKeyService.update(getAccountDetailKeys().get(0));
		assertEquals(expextedResult, actualResult);
	}

	@Test
	public final void test_fetch_related_data() {
		List<AccountDetailType> expextedResult = new ArrayList<>();
		expextedResult.add(getAccountDetailType());
		List<AccountDetailKey> accountDetailKies = new ArrayList<>();
		accountDetailKies.add(getAccountDetailKey());
		when(accountDetailTypeRepository.findById(any(AccountDetailType.class))).thenReturn(getAccountDetailType());
		List<AccountDetailKey> actualResult = accountDetailKeyService.fetchRelated(accountDetailKies);
		assertEquals(expextedResult.get(0).getId(), actualResult.get(0).getAccountDetailType().getId());
		assertEquals(expextedResult.get(0).getName(), actualResult.get(0).getAccountDetailType().getName());
	}

	@Test(expected = InvalidDataException.class)
	public final void test_fetch_related_data_when_parentid_is_wrong() {
		List<AccountDetailType> expextedResult = new ArrayList<>();
		expextedResult.add(getAccountDetailType());
		List<AccountDetailKey> accountDetailKies = new ArrayList<>();
		accountDetailKies.add(getAccountDetailKey());
		when(accountDetailKeyRepository.findById(any(AccountDetailKey.class))).thenReturn(null);
		accountDetailKeyService.fetchRelated(accountDetailKies);
	}

	private List<AccountDetailKey> getAccountDetailKeys() {
		List<AccountDetailKey> accountDetailKies = new ArrayList<AccountDetailKey>();
		AccountDetailKey accountDetailKey = AccountDetailKey.builder().id("1").key("1")
				.accountDetailType(getAccountDetailType()).build();
		accountDetailKey.setTenantId("default");
		accountDetailKies.add(accountDetailKey);
		return accountDetailKies;
	}

	private AccountDetailKeySearch getAccountDetailKeySearch() {
		AccountDetailKeySearch accountDetailKeySearch = new AccountDetailKeySearch();
		accountDetailKeySearch.setPageSize(0);
		accountDetailKeySearch.setOffset(0);
		accountDetailKeySearch.setSortBy("Sort");
		accountDetailKeySearch.setTenantId("default");
		return accountDetailKeySearch;
	}

	private AccountDetailKey getAccountDetailKey() {
		AccountDetailKey accountDetailKey = AccountDetailKey.builder().id("1").key("1")
				.accountDetailType(getAccountDetailType()).build();
		accountDetailKey.setTenantId("default");
		return accountDetailKey;
	}

	private AccountDetailType getAccountDetailType() {
		AccountDetailType accountDetailType = AccountDetailType.builder().id("1").name("name").tableName("contractor")
				.fullyQualifiedName("abc/acb").active(true).build();
		accountDetailType.setTenantId("default");
		return accountDetailType;
	}
}