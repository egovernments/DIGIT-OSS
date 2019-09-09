package org.egov.egf.master.domain.service;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.exception.InvalidDataException;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.TestConfiguration;
import org.egov.egf.master.domain.model.AccountDetailType;
import org.egov.egf.master.domain.model.AccountEntity;
import org.egov.egf.master.domain.model.AccountEntitySearch;
import org.egov.egf.master.domain.repository.AccountDetailTypeRepository;
import org.egov.egf.master.domain.repository.AccountEntityRepository;
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

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

@Import(TestConfiguration.class)
@RunWith(SpringRunner.class)
public class AccountEntityServiceTest {

    @InjectMocks
    private AccountEntityService accountEntityService;

    @Mock
    private SmartValidator validator;

    @Mock
    private AccountDetailTypeRepository accountDetailTypeRepository;

    @Mock
    private AccountEntityRepository accountEntityRepository;

    private BindingResult errors = new BeanPropertyBindingResult(null, null);
    private RequestInfo requestInfo = new RequestInfo();
    private List<AccountEntity> accountEntities = new ArrayList<>();

    @Before
    public void setup() {
    }

    @Test
    public final void testCreate() {
        when(accountDetailTypeRepository.findById(any(AccountDetailType.class))).thenReturn(getAccountDetaialType());
        when(accountEntityRepository.uniqueCheck(any(String.class), any(AccountEntity.class))).thenReturn(true);
        accountEntityService.create(getAccountEntitys(), errors, requestInfo);
    }

    @Test
    public final void testUpdate() {
        when(accountDetailTypeRepository.findById(any(AccountDetailType.class))).thenReturn(getAccountDetaialType());
        when(accountEntityRepository.uniqueCheck(any(String.class), any(AccountEntity.class))).thenReturn(true);
        accountEntityService.update(getAccountEntitys(), errors, requestInfo);
    }

    @Test
    public final void testCreateInvalid() {
        AccountEntity accountEntity1 = AccountEntity.builder().id("a").code("code").active(true).accountDetailType(null).build();
        accountEntities.add(accountEntity1);
        when(accountEntityRepository.uniqueCheck(any(String.class), any(AccountEntity.class))).thenReturn(true);
        accountEntityService.create(accountEntities, errors, requestInfo);
    }

    @Test
    public final void test_save() {
        AccountEntity expextedResult = getAccountEntitys().get(0);
        when(accountEntityRepository.save(any(AccountEntity.class))).thenReturn(expextedResult);
        AccountEntity actualResult = accountEntityService.save(getAccountEntitys().get(0));
        assertEquals(expextedResult, actualResult);
    }

    @Test
    public final void testSearch() {
        List<AccountEntity> search = new ArrayList<>();
        search.add(getAccountEntitySearch());
        Pagination<AccountEntity> expectedResult = new Pagination<>();
        expectedResult.setPagedData(search);
        when(accountEntityRepository.search(any(AccountEntitySearch.class))).thenReturn(expectedResult);
        Pagination<AccountEntity> actualResult = accountEntityService.search(getAccountEntitySearch(), errors);
        assertEquals(expectedResult, actualResult);

    }

    @Test
    public final void test_update() {
        AccountEntity expextedResult = getAccountEntitys().get(0);
        when(accountEntityRepository.update(any(AccountEntity.class))).thenReturn(expextedResult);
        AccountEntity actualResult = accountEntityService.update(getAccountEntitys().get(0));
        assertEquals(expextedResult, actualResult);
    }

    @Test
    public final void test_fetch_related_data() {
        List<AccountDetailType> expextedResult = new ArrayList<>();
        expextedResult.add(getAccountDetaialType());
        List<AccountEntity> accountEntities = new ArrayList<>();
        accountEntities.add(getAccountEntity());
        when(accountDetailTypeRepository.findById(any(AccountDetailType.class))).thenReturn(getAccountDetaialType());
        List<AccountEntity> actualResult = accountEntityService.fetchRelated(accountEntities);
        assertEquals(expextedResult.get(0).getId(), actualResult.get(0).getAccountDetailType().getId());
        assertEquals(expextedResult.get(0).getName(), actualResult.get(0).getAccountDetailType().getName());
    }

    @Test(expected = InvalidDataException.class)
    public final void test_fetch_related_data_when_parentid_is_wrong() {
        List<AccountDetailType> expextedResult = new ArrayList<>();
        expextedResult.add(getAccountDetaialType());
        List<AccountEntity> accountEntities = new ArrayList<>();
        accountEntities.add(getAccountEntity());
        when(accountEntityRepository.findById(any(AccountEntity.class))).thenReturn(null);
        accountEntityService.fetchRelated(accountEntities);
    }

    private List<AccountEntity> getAccountEntitys() {
        List<AccountEntity> accountEntities = new ArrayList<AccountEntity>();
        AccountEntity accountEntity = AccountEntity.builder().id("1").name("name").code("code").accountDetailType(getAccountDetaialType()).active(true).build();
        accountEntity.setTenantId("default");
        accountEntities.add(accountEntity);
        return accountEntities;
    }

    private AccountEntitySearch getAccountEntitySearch() {
        AccountEntitySearch accountEntitySearch = new AccountEntitySearch();
        accountEntitySearch.setPageSize(0);
        accountEntitySearch.setOffset(0);
        accountEntitySearch.setSortBy("Sort");
        accountEntitySearch.setTenantId("default");
        return accountEntitySearch;
    }

    private AccountEntity getAccountEntity() {
        AccountEntity accountEntity = AccountEntity.builder().id("1").name("accountEntity").code("001").active(true)
                .accountDetailType(getAccountDetaialType()).build();
        accountEntity.setTenantId("default");
        return accountEntity;
    }

    private AccountDetailType getAccountDetaialType() {

        AccountDetailType accountDetailType = AccountDetailType.builder().id("1").name("name").tableName("table")
                .fullyQualifiedName("abc/table").build();
        accountDetailType.setTenantId("default");
        return accountDetailType;
    }
}