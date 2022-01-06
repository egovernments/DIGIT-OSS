package org.egov.egf.master.domain.service;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.TestConfiguration;
import org.egov.egf.master.domain.model.AccountDetailType;
import org.egov.egf.master.domain.model.AccountDetailTypeSearch;
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
public class AccountDetailTypeServiceTest {

	@InjectMocks
	private AccountDetailTypeService accountDetailTypeService;

	@Mock
	private SmartValidator validator;

	@Mock
	private AccountDetailTypeRepository accountDetailTypeRepository;

	private BindingResult errors = new BeanPropertyBindingResult(null, null);
	private RequestInfo requestInfo = new RequestInfo();
	private List<AccountDetailType> accountDetailTypes = new ArrayList<>();

	@Before
	public void setup() {
	}

	@Test
	public final void testCreate() {
		when(accountDetailTypeRepository.uniqueCheck(any(String.class), any(AccountDetailType.class))).thenReturn(true);
		accountDetailTypeService.create(getAccountDetailTypes(), errors, requestInfo);
	}

	@Test
	public final void testUpdate() {
		when(accountDetailTypeRepository.uniqueCheck(any(String.class), any(AccountDetailType.class))).thenReturn(true);
		accountDetailTypeService.update(getAccountDetailTypes(), errors, requestInfo);
	}

	@Test
	public final void testCreateInvalid() {
		AccountDetailType accountDetailType1 = AccountDetailType.builder().id("a").tableName("contractor")
				.fullyQualifiedName("abc/contractor").active(true).build();
		accountDetailTypes.add(accountDetailType1);
		when(accountDetailTypeRepository.uniqueCheck(any(String.class), any(AccountDetailType.class))).thenReturn(true);
		accountDetailTypeService.create(accountDetailTypes, errors, requestInfo);
	}

	@Test
	public final void test_save() {
		AccountDetailType expextedResult = getAccountDetailTypes().get(0);
		when(accountDetailTypeRepository.save(any(AccountDetailType.class))).thenReturn(expextedResult);
		AccountDetailType actualResult = accountDetailTypeService.save(getAccountDetailTypes().get(0));
		assertEquals(expextedResult, actualResult);
	}

	@Test
	public final void testSearch() {
		List<AccountDetailType> search = new ArrayList<>();
		search.add(getAccountDetailTypeSearch());
		Pagination<AccountDetailType> expectedResult = new Pagination<>();
		expectedResult.setPagedData(search);
		when(accountDetailTypeRepository.search(any(AccountDetailTypeSearch.class))).thenReturn(expectedResult);
		Pagination<AccountDetailType> actualResult = accountDetailTypeService.search(getAccountDetailTypeSearch(),
				errors);
		assertEquals(expectedResult, actualResult);

	}

	@Test
	public final void test_update() {
		AccountDetailType expextedResult = getAccountDetailTypes().get(0);
		when(accountDetailTypeRepository.update(any(AccountDetailType.class))).thenReturn(expextedResult);
		AccountDetailType actualResult = accountDetailTypeService.update(getAccountDetailTypes().get(0));
		assertEquals(expextedResult, actualResult);
	}

	private List<AccountDetailType> getAccountDetailTypes() {
		List<AccountDetailType> accountDetailTypes = new ArrayList<AccountDetailType>();
		AccountDetailType accountDetailType = AccountDetailType.builder().id("1").name("name").tableName("contractor")
				.fullyQualifiedName("abc/contractor").active(true).build();
		accountDetailType.setTenantId("default");
		accountDetailTypes.add(accountDetailType);
		return accountDetailTypes;
	}

	private AccountDetailTypeSearch getAccountDetailTypeSearch() {
		AccountDetailTypeSearch accountDetailTypeSearch = new AccountDetailTypeSearch();
		accountDetailTypeSearch.setPageSize(0);
		accountDetailTypeSearch.setOffset(0);
		accountDetailTypeSearch.setSortBy("Sort");
		accountDetailTypeSearch.setTenantId("default");
		return accountDetailTypeSearch;
	}

	private AccountDetailType getAccountDetailType() {
		AccountDetailType accountDetailType = AccountDetailType.builder().id("1").name("name").active(true)
				.tableName("contractor").fullyQualifiedName("abc/contractor").build();
		accountDetailType.setTenantId("default");
		return accountDetailType;
	}

}