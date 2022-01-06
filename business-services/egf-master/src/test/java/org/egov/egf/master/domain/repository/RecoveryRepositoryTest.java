package org.egov.egf.master.domain.repository;

import org.egov.common.constants.Constants;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.ChartOfAccount;
import org.egov.egf.master.domain.model.Recovery;
import org.egov.egf.master.domain.model.RecoverySearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.RecoveryEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.RecoveryJdbcRepository;
import org.egov.egf.master.web.contract.RecoveryContract;
import org.egov.egf.master.web.contract.RecoverySearchContract;
import org.egov.egf.master.web.requests.RecoveryRequest;
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
public class RecoveryRepositoryTest {

    private RecoveryRepository recoveryRepositoryWithKafka;
    private RecoveryRepository recoveryRepositoryWithOutKafka;

    @InjectMocks
    private RecoveryRepository recoveryRepository;

    @Mock
    private RecoveryJdbcRepository recoveryJdbcRepository;

    @Mock
    private MastersQueueRepository recoveryQueueRepository;

    @Mock
    private FinancialConfigurationService financialConfigurationService;

    @Mock
    private RecoveryESRepository recoveryESRepository;

    @Captor
    private ArgumentCaptor<Map<String, Object>> captor;

    private RequestInfo requestInfo = new RequestInfo();

    @Before
    public void setup() {
        recoveryRepositoryWithKafka = new RecoveryRepository(recoveryQueueRepository, financialConfigurationService, "yes", recoveryJdbcRepository,
                recoveryESRepository);
        recoveryRepositoryWithOutKafka = new RecoveryRepository(recoveryQueueRepository, financialConfigurationService, "no", recoveryJdbcRepository,
                recoveryESRepository);

    }

    @Test
    public void test_findbyid() {
        RecoveryEntity recoveryEntity = getRecoveryEntity();
        Recovery expectedResult = recoveryEntity.toDomain();
        when(recoveryJdbcRepository.findById(any(RecoveryEntity.class))).thenReturn(recoveryEntity);
        Recovery actualResult = recoveryRepository.findById(getRecoveryDomain());
        assertEquals(expectedResult.getCode(), actualResult.getCode());
    }

    @Test
    public void test_save() {
        List<Recovery> expectedResult = getRecoverys();
        requestInfo.setAction(Constants.ACTION_CREATE);
        recoveryRepositoryWithKafka.save(expectedResult, requestInfo);
        verify(recoveryQueueRepository).add(captor.capture());
    }

    @Test
    public void test_save1() {
        List<Recovery> expectedResult = getRecoverys();
        RecoveryEntity entity = new RecoveryEntity().toEntity(expectedResult.get(0));
        when(recoveryJdbcRepository.create(any(RecoveryEntity.class))).thenReturn(entity);
        recoveryRepositoryWithOutKafka.save(expectedResult, requestInfo);
        verify(recoveryQueueRepository).addToSearch(any(Map.class));
    }

    @Test
    public void test_savee() {
        RecoveryEntity recoveryEntity = getRecoveryEntity();
        Recovery expectedResult = recoveryEntity.toDomain();
        when(recoveryJdbcRepository.create(any(RecoveryEntity.class))).thenReturn(recoveryEntity);
        Recovery actualResult = recoveryRepository.save(getRecoveryDomain());
        assertEquals(expectedResult.getCode(), actualResult.getCode());
    }

    @Test
    public void test_update() {
        List<Recovery> expectedResult = getRecoverys();
        requestInfo.setAction(Constants.ACTION_CREATE);
        recoveryRepositoryWithKafka.update(expectedResult, requestInfo);
        verify(recoveryQueueRepository).add(captor.capture());
    }

    @Test
    public void test_update1() {
        List<Recovery> expectedResult = getRecoverys();
        RecoveryEntity entity = new RecoveryEntity().toEntity(expectedResult.get(0));
        when(recoveryJdbcRepository.update(any(RecoveryEntity.class))).thenReturn(entity);
        recoveryRepositoryWithOutKafka.update(expectedResult, requestInfo);
        verify(recoveryQueueRepository).addToSearch(any(Map.class));
    }

    @Test
    public void test_updatee() {
        RecoveryEntity recoveryEntity = getRecoveryEntity();
        Recovery expectedResult = recoveryEntity.toDomain();
        when(recoveryJdbcRepository.update(any(RecoveryEntity.class))).thenReturn(recoveryEntity);
        Recovery actualResult = recoveryRepository.update(getRecoveryDomain());
        assertEquals(expectedResult.getCode(), actualResult.getCode());
    }

    @Test
    public void test_addtoque() {
        Mockito.doNothing().when(recoveryQueueRepository).add(Mockito.any());
        RecoveryRequest request = new RecoveryRequest();
        request.setRequestInfo(getRequestInfo());
        request.setRecoverys(new ArrayList<RecoveryContract>());
        request.getRecoverys().add(getRecoveryContract());
        recoveryRepository.addToQue(request);
        Map<String, Object> message = new HashMap<>();
        message.put("recovery_create", request);
        Mockito.verify(recoveryQueueRepository).add(message);
    }

    @Test
    public void test_addtoque1() {
        Mockito.doNothing().when(recoveryQueueRepository).add(Mockito.any());
        RecoveryRequest request = new RecoveryRequest();
        request.setRequestInfo(getRequestInfo());
        request.getRequestInfo().setAction(Constants.ACTION_UPDATE);
        request.setRecoverys(new ArrayList<RecoveryContract>());
        request.getRecoverys().add(getRecoveryContract());
        recoveryRepository.addToQue(request);
        Map<String, Object> message = new HashMap<>();
        message.put("recovery_update", request);
        Mockito.verify(recoveryQueueRepository).add(message);
    }

    @Test
    public void test_addtosearchqueue() {
        Mockito.lenient().doNothing().when(recoveryQueueRepository).add(Mockito.any());
        RecoveryRequest request = new RecoveryRequest();
        request.setRequestInfo(getRequestInfo());
        request.setRecoverys(new ArrayList<RecoveryContract>());
        request.getRecoverys().add(getRecoveryContract());
        recoveryRepository.addToSearchQueue(request);
        Map<String, Object> message = new HashMap<>();
        message.put("recovery_persisted", request);
        Mockito.verify(recoveryQueueRepository).addToSearch(message);
    }

    @Test
    public void test_search() {
        Pagination<Recovery> expectedResult = new Pagination<>();
        expectedResult.setPageSize(500);
        expectedResult.setOffset(0);
        when(financialConfigurationService.fetchDataFrom()).thenReturn("db");
        when(recoveryJdbcRepository.search(any(RecoverySearch.class))).thenReturn(expectedResult);
        Pagination<Recovery> actualResult = recoveryRepository.search(getRecoverySearch());
        assertEquals(expectedResult, actualResult);
    }

    @Test
    public void test_search1() {
        Pagination<Recovery> expectedResult = new Pagination<>();
        expectedResult.setPageSize(500);
        expectedResult.setOffset(0);
        when(financialConfigurationService.fetchDataFrom()).thenReturn("es");
        when(recoveryESRepository.search(any(RecoverySearchContract.class))).thenReturn(expectedResult);
        Pagination<Recovery> actualResult = recoveryRepository.search(getRecoverySearch());
        assertEquals(expectedResult, actualResult);
    }

    private RecoveryContract getRecoveryContract() {
        return RecoveryContract.builder().id("1").name("name").code("code").type("M").accountNumber("30492234547").active(true).
                remittanceMode('M').remitted("ritesh").build();
    }

    private RecoveryEntity getRecoveryEntity() {
        RecoveryEntity entity = new RecoveryEntity();
        Recovery recovery = getRecoveryDomain();
        entity.setId(recovery.getId());
        entity.setCode(recovery.getCode());
        entity.setName(recovery.getName());
        entity.setActive(recovery.getActive());
        entity.setType(recovery.getType());
        entity.setAccountNumber(recovery.getAccountNumber());
        entity.setRemittanceMode(recovery.getRemittanceMode());
        entity.setRemitted(recovery.getRemitted());
        entity.setTenantId(recovery.getTenantId());
        return entity;
    }

    private Recovery getRecoveryDomain() {
        Recovery recovery = new Recovery();
        recovery.setId("1");
        recovery.setCode("code");
        recovery.setName("name");
        recovery.setActive(true);
        recovery.setType("M");
        recovery.setAccountNumber("30492234547");
        recovery.setRemittanceMode('M');
        recovery.setRemitted("ritesh");
        recovery.setTenantId("default");
        return recovery;
    }

    public List<Recovery> getRecoveryDomains() {
        List<Recovery> recoverys = new ArrayList<>();
        recoverys.add(getRecoveryDomain());
        return recoverys;
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

    private RecoverySearch getRecoverySearch() {
        RecoverySearch recoverySearch = new RecoverySearch();
        recoverySearch.setPageSize(500);
        recoverySearch.setOffset(0);
        recoverySearch.setSortBy("name desc");
        return recoverySearch;
    }

    private List<Recovery> getRecoverys() {
        List<Recovery> recoverys = new ArrayList<Recovery>();
        Recovery recovery = Recovery.builder().id("1").name("name").code("code").type("M").accountNumber("30492234547").active(true).
                remittanceMode('M').remitted("ritesh").build();
        recovery.setTenantId("default");
        recovery.setChartOfAccount(getChartOfAccount());
        recoverys.add(recovery);
        return recoverys;
    }

    private RecoverySearchContract getRecoverySearchContract() {
        RecoverySearchContract recoverySearchContract = new RecoverySearchContract();
        recoverySearchContract.setPageSize(0);
        recoverySearchContract.setOffset(0);
        recoverySearchContract.setSortBy("name desc");
        return recoverySearchContract;
    }

    private ChartOfAccount getChartOfAccount() {
        ChartOfAccount chartOfAccount = ChartOfAccount.builder().id("1")
                .glcode("glcode").name("name")
                .description("description").isActiveForPosting(true)
                .type('A').classification((long) 123456)
                .functionRequired(true).budgetCheckRequired(true).build();
        chartOfAccount.setTenantId("default");
        return chartOfAccount;
    }
}
