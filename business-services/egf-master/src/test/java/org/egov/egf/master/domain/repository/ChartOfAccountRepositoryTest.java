package org.egov.egf.master.domain.repository;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.egov.common.constants.Constants;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.ChartOfAccount;
import org.egov.egf.master.domain.model.ChartOfAccountSearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.ChartOfAccountEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.ChartOfAccountJdbcRepository;
import org.egov.egf.master.web.contract.ChartOfAccountContract;
import org.egov.egf.master.web.requests.ChartOfAccountRequest;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class ChartOfAccountRepositoryTest {

    @Mock
    private ChartOfAccountJdbcRepository chartofAccountJdbcRepository;

    @Mock
    private MastersQueueRepository chartofAccountQueueRepository;

    @InjectMocks
    private ChartOfAccountRepository chartOfAccountRepository;

    @Mock
    private FinancialConfigurationService financialConfigurationService;

    @Test
    public void testFindById() {
        ChartOfAccountEntity chartOfAccountEntity = getChartOfAccountEntity();
        ChartOfAccount expectedResult = chartOfAccountEntity.toDomain();
        when(chartofAccountJdbcRepository.findById(any(ChartOfAccountEntity.class))).thenReturn(chartOfAccountEntity);
        ChartOfAccount actualResult = chartOfAccountRepository.findById(getChartOfAccountDomain());
        assertEquals(expectedResult, actualResult);
    }

    @Test
    public void testSave() {
        ChartOfAccountEntity chartOfAccountEntity = getChartOfAccountEntity();
        ChartOfAccount expectedResult = chartOfAccountEntity.toDomain();
        when(chartofAccountJdbcRepository.create(any(ChartOfAccountEntity.class))).thenReturn(chartOfAccountEntity);
        ChartOfAccount actualResult = chartOfAccountRepository.save(getChartOfAccountDomain());
        assertEquals(expectedResult, actualResult);
    }

    @Test
    public void testUpdate() {
        ChartOfAccountEntity chartOfAccountEntity = getChartOfAccountEntity();
        ChartOfAccount expectedResult = chartOfAccountEntity.toDomain();
        when(chartofAccountJdbcRepository.update(any(ChartOfAccountEntity.class))).thenReturn(chartOfAccountEntity);
        ChartOfAccount actualResult = chartOfAccountRepository.update(getChartOfAccountDomain());
        assertEquals(expectedResult, actualResult);
    }

    @Test
    public void testAdd() {
        Mockito.doNothing().when(chartofAccountQueueRepository).add(Mockito.any());
        ChartOfAccountRequest request = new ChartOfAccountRequest();
        request.setRequestInfo(getRequestInfo());
        request.setChartOfAccounts(new ArrayList<ChartOfAccountContract>());
        request.getChartOfAccounts().add(getChartOfAccountContract());
        chartOfAccountRepository.add(request);
        Map<String, Object> message = new HashMap<>();
        message.put("chartofaccount_create", request);
        Mockito.verify(chartofAccountQueueRepository).add(message);
    }

    @Test
    public void testSearch() {
        Pagination<ChartOfAccount> expectedResult = new Pagination<>();
        expectedResult.setPageSize(500);
        expectedResult.setOffset(0);
        when(financialConfigurationService.fetchDataFrom()).thenReturn("db");
        when(chartofAccountJdbcRepository.search(any(ChartOfAccountSearch.class))).thenReturn(expectedResult);
        Pagination<ChartOfAccount> actualResult = chartOfAccountRepository.search(getChartOfAccountSearch());
        assertEquals(expectedResult, actualResult);
    }

    private ChartOfAccountEntity getChartOfAccountEntity() {
        ChartOfAccountEntity chartOfAccountEntity = new ChartOfAccountEntity();
        ChartOfAccount chartOfAccount = getChartOfAccountDomain();
        chartOfAccountEntity.setGlcode(chartOfAccount.getGlcode());
        chartOfAccountEntity.setName(chartOfAccount.getName());
        chartOfAccountEntity.setDescription(chartOfAccount.getDescription());
        chartOfAccountEntity.setIsActiveForPosting(chartOfAccount.getIsActiveForPosting());
        chartOfAccountEntity.setType(chartOfAccount.getType());
        chartOfAccountEntity.setClassification(chartOfAccount.getClassification());
        chartOfAccountEntity.setFunctionRequired(chartOfAccount.getFunctionRequired());
        chartOfAccountEntity.setBudgetCheckRequired(chartOfAccount.getBudgetCheckRequired());
        return chartOfAccountEntity;
    }

    private ChartOfAccount getChartOfAccountDomain() {
        ChartOfAccount chartOfAccount = ChartOfAccount.builder()
                .glcode("GLCode").name("AadharBank")
                .description("DefaultDescription").isActiveForPosting(true)
                .type('B').classification((long) 123456).functionRequired(true)
                .budgetCheckRequired(true).build();
        chartOfAccount.setTenantId("default");
        return chartOfAccount;
    }

    private ChartOfAccountContract getChartOfAccountContract() {

        return ChartOfAccountContract.builder()
                .glcode("GLCode").name("AadharBank")
                .description("DefaultDescription").isActiveForPosting(true)
                .type('B').classification((long) 123456).functionRequired(true)
                .budgetCheckRequired(true).build();
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

    private ChartOfAccountSearch getChartOfAccountSearch() {
        ChartOfAccountSearch chartOfAccountSearch = new ChartOfAccountSearch();
        chartOfAccountSearch.setPageSize(500);
        chartOfAccountSearch.setOffset(0);
        chartOfAccountSearch.setSortBy("name desc");
        return chartOfAccountSearch;

    }
}