package org.egov.egf.master.domain.repository;

import org.egov.common.constants.Constants;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.AccountDetailType;
import org.egov.egf.master.domain.model.AccountEntity;
import org.egov.egf.master.domain.model.AccountEntitySearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.AccountEntityEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.AccountEntityJdbcRepository;
import org.egov.egf.master.web.contract.AccountDetailTypeContract;
import org.egov.egf.master.web.contract.AccountEntityContract;
import org.egov.egf.master.web.contract.AccountEntitySearchContract;
import org.egov.egf.master.web.requests.AccountEntityRequest;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.runners.MockitoJUnitRunner;

import java.util.*;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class AccountEntityRepositoryTest {

    private AccountEntityRepository accountEntityRepositoryWithKafka;
    private AccountEntityRepository accountEntityRepositoryWithOutKafka;

    @InjectMocks
    private AccountEntityRepository accountEntityRepository;

    @Mock
    private AccountEntityJdbcRepository accountEntityJdbcRepository;

    @Mock
    private MastersQueueRepository accountEntityQueueRepository;

    @Mock
    private FinancialConfigurationService financialConfigurationService;

    @Mock
    private AccountEntityESRepository accountEntityESRepository;

    @Captor
    private ArgumentCaptor<Map<String, Object>> captor;

    private RequestInfo requestInfo = new RequestInfo();

    @Before
    public void setup() {
        accountEntityRepositoryWithKafka = new AccountEntityRepository(accountEntityJdbcRepository, accountEntityQueueRepository,
                financialConfigurationService, accountEntityESRepository, "yes");
        accountEntityRepositoryWithOutKafka = new AccountEntityRepository(accountEntityJdbcRepository, accountEntityQueueRepository,
                financialConfigurationService, accountEntityESRepository, "no");

    }

    @Test
    public void testFindById() {
        AccountEntityEntity accountEntityEntity = getAccountEntityEntity();
        AccountEntity expectedResult = accountEntityEntity.toDomain();
        when(accountEntityJdbcRepository.findById(any(AccountEntityEntity.class))).thenReturn(accountEntityEntity);
        AccountEntity actualResult = accountEntityRepository.findById(getAccountEntityDomain());
        assertEquals(expectedResult, actualResult);
    }

    @Test
    public void testSaveWithKafka() {
        List<AccountEntity> expectedResult = getAccountEntitys();
        requestInfo.setAction(Constants.ACTION_CREATE);
        accountEntityRepositoryWithKafka.save(expectedResult, requestInfo);
        verify(accountEntityQueueRepository).add(captor.capture());
    }

    @Test
    public void testSaveWithOutKafka() {
        List<AccountEntity> expectedResult = getAccountEntitys();
        AccountEntityEntity entity = new AccountEntityEntity().toEntity(expectedResult.get(0));
        when(accountEntityJdbcRepository.create(any(AccountEntityEntity.class))).thenReturn(entity);
        accountEntityRepositoryWithOutKafka.save(expectedResult, requestInfo);
        verify(accountEntityQueueRepository).addToSearch(any(Map.class));
    }

    @Test
    public void testSave() {
        AccountEntityEntity accountEntityEntity = getAccountEntityEntity();
        AccountEntity expectedResult = accountEntityEntity.toDomain();
        when(accountEntityJdbcRepository.create(any(AccountEntityEntity.class))).thenReturn(accountEntityEntity);
        AccountEntity actualResult = accountEntityRepository.save(getAccountEntityDomain());
        assertEquals(expectedResult, actualResult);
    }

    @Test
    public void testUpdateWithKafka() {
        List<AccountEntity> expectedResult = getAccountEntitys();
        requestInfo.setAction(Constants.ACTION_CREATE);
        accountEntityRepositoryWithKafka.update(expectedResult, requestInfo);
        verify(accountEntityQueueRepository).add(captor.capture());
    }

    @Test
    public void testUpdateWithOutKafka() {
        List<AccountEntity> expectedResult = getAccountEntitys();
        AccountEntityEntity entity = new AccountEntityEntity().toEntity(expectedResult.get(0));
        when(accountEntityJdbcRepository.update(any(AccountEntityEntity.class))).thenReturn(entity);
        accountEntityRepositoryWithOutKafka.update(expectedResult, requestInfo);
        verify(accountEntityQueueRepository).addToSearch(any(Map.class));
    }

    @Test
    public void testUpdate() {
        AccountEntityEntity accountEntityEntity = getAccountEntityEntity();
        AccountEntity expectedResult = accountEntityEntity.toDomain();
        when(accountEntityJdbcRepository.update(any(AccountEntityEntity.class))).thenReturn(accountEntityEntity);
        AccountEntity actualResult = accountEntityRepository.update(getAccountEntityDomain());
        assertEquals(expectedResult, actualResult);
    }

    @Test
    public void testAddToQue() {
        Mockito.doNothing().when(accountEntityQueueRepository).add(Mockito.any());
        AccountEntityRequest request = new AccountEntityRequest();
        request.setRequestInfo(getRequestInfo());
        request.setAccountEntities(new ArrayList<AccountEntityContract>());
        request.getAccountEntities().add(getAccountEntityContract());
        accountEntityRepository.addToQue(request);
        Map<String, Object> message = new HashMap<>();
        message.put("accountentity_create", request);
        Mockito.verify(accountEntityQueueRepository).add(message);
    }

    @Test
    public void testAddToQue1() {
        Mockito.doNothing().when(accountEntityQueueRepository).add(Mockito.any());
        AccountEntityRequest request = new AccountEntityRequest();
        request.setRequestInfo(getRequestInfo());
        request.getRequestInfo().setAction(Constants.ACTION_UPDATE);
        request.setAccountEntities(new ArrayList<AccountEntityContract>());
        request.getAccountEntities().add(getAccountEntityContract());
        accountEntityRepository.addToQue(request);
        Map<String, Object> message = new HashMap<>();
        message.put("accountentity_update", request);
        Mockito.verify(accountEntityQueueRepository).add(message);
    }

    @Test
    public void testAddToSearchQueue() {
        Mockito.lenient().doNothing().when(accountEntityQueueRepository).add(Mockito.any());
        AccountEntityRequest request = new AccountEntityRequest();
        request.setRequestInfo(getRequestInfo());
        request.setAccountEntities(new ArrayList<AccountEntityContract>());
        request.getAccountEntities().add(getAccountEntityContract());
        accountEntityRepository.addToSearchQueue(request);
        Map<String, Object> message = new HashMap<>();
        message.put("accountentity_persisted", request);
        Mockito.verify(accountEntityQueueRepository).addToSearch(message);
    }

    @Test
    public void testSearch() {
        Pagination<AccountEntity> expectedResult = new Pagination<>();
        expectedResult.setPageSize(500);
        expectedResult.setOffset(0);
        when(financialConfigurationService.fetchDataFrom()).thenReturn("db");
        when(accountEntityJdbcRepository.search(any(AccountEntitySearch.class))).thenReturn(expectedResult);
        Pagination<AccountEntity> actualResult = accountEntityRepository.search(getAccountEntitySearch());
        assertEquals(expectedResult, actualResult);
    }

    @Test
    public void testSearch1() {
        Pagination<AccountEntity> expectedResult = new Pagination<>();
        expectedResult.setPageSize(500);
        expectedResult.setOffset(0);
        when(financialConfigurationService.fetchDataFrom()).thenReturn("es");
        when(accountEntityESRepository.search(any(AccountEntitySearchContract.class))).thenReturn(expectedResult);
        Pagination<AccountEntity> actualResult = accountEntityRepository.search(getAccountEntitySearch());
        assertEquals(expectedResult, actualResult);
    }

    private AccountEntityContract getAccountEntityContract() {
        AccountDetailTypeContract accountDetailTypeContract = AccountDetailTypeContract.builder().id("1").
                name("name").tableName("table")
                .fullyQualifiedName("abc/table").build();
        return AccountEntityContract.builder().code("code").name("name").active(true).accountDetailType(accountDetailTypeContract).build();
    }

    private AccountEntityEntity getAccountEntityEntity() {
        AccountEntityEntity entity = new AccountEntityEntity();
        AccountEntity accountEntity = getAccountEntityDomain();
        entity.setCode(accountEntity.getCode());
        entity.setName(accountEntity.getName());
        entity.setActive(accountEntity.getActive());
        entity.setAccountDetailTypeId(accountEntity.getAccountDetailType().getId());
        entity.setTenantId(accountEntity.getTenantId());
        return entity;
    }

    private AccountEntity getAccountEntityDomain() {
        AccountEntity accountEntity = new AccountEntity();
        accountEntity.setId("1");
        accountEntity.setCode("code");
        accountEntity.setName("name");
        accountEntity.setActive(true);
        accountEntity.setAccountDetailType(getAccountDetaialType());
        accountEntity.setTenantId("default");
        return accountEntity;
    }

    public List<AccountEntity> getAccountEntityDomains() {
        List<AccountEntity> accountEntities = new ArrayList<>();
        accountEntities.add(getAccountEntityDomain());
        return accountEntities;
    }

    private RequestInfo getRequestInfo() {
        RequestInfo info = new RequestInfo();
        User user = new User();
        user.setId(1l);
        info.setAction(Constants.ACTION_CREATE);
        info.setDid("did");
        info.setApiId("apiId");
        info.setKey("key");
        info.setMsgId("msgId");
        info.setTs(new Date());
        info.setUserInfo(user);
        info.setAuthToken("null");
        return info;
    }

    private AccountEntitySearch getAccountEntitySearch() {
        AccountEntitySearch accountEntitySearch = new AccountEntitySearch();
        accountEntitySearch.setPageSize(500);
        accountEntitySearch.setOffset(0);
        accountEntitySearch.setSortBy("name desc");
        return accountEntitySearch;
    }

    private List<AccountEntity> getAccountEntitys() {
        List<AccountEntity> accountEntities = new ArrayList<>();
        AccountEntity accountEntity = AccountEntity.builder().id("1").name("name").code("code").accountDetailType(getAccountDetaialType()).active(true).build();
        accountEntity.setTenantId("default");
        accountEntities.add(accountEntity);
        return accountEntities;
    }

    private AccountEntitySearchContract getAccountEntitySearchContract() {
        AccountEntitySearchContract accountEntitySearchContract = new AccountEntitySearchContract();
        accountEntitySearchContract.setPageSize(0);
        accountEntitySearchContract.setOffset(0);
        accountEntitySearchContract.setSortBy("name desc");
        return accountEntitySearchContract;
    }

    private AccountDetailType getAccountDetaialType() {

        AccountDetailType accountDetailType = AccountDetailType.builder().id("1").name("name").tableName("table")
                .fullyQualifiedName("abc/table").build();
        accountDetailType.setTenantId("default");
        return accountDetailType;
    }
}
