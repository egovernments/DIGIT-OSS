package org.egov.egf.master.domain.repository;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.common.constants.Constants;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.domain.model.AccountDetailType;
import org.egov.egf.master.domain.model.ChartOfAccount;
import org.egov.egf.master.domain.model.ChartOfAccountDetail;
import org.egov.egf.master.domain.model.ChartOfAccountDetailSearch;
import org.egov.egf.master.domain.repository.ChartOfAccountDetailRepository;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.ChartOfAccountDetailEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.ChartOfAccountDetailJdbcRepository;
import org.egov.egf.master.web.contract.AccountDetailTypeContract;
import org.egov.egf.master.web.contract.ChartOfAccountContract;
import org.egov.egf.master.web.contract.ChartOfAccountDetailContract;
import org.egov.egf.master.web.requests.ChartOfAccountDetailRequest;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class ChartOfAccountDetailRepositoryTest {

    @Mock
    private ChartOfAccountDetailJdbcRepository chartofAccountDetailJdbcRepository;

    @Mock
    private MastersQueueRepository chartofAccountDetailQueueRepository;

    @InjectMocks
    private ChartOfAccountDetailRepository chartOfAccountDetailRepository;

    @Mock
    private FinancialConfigurationService financialConfigurationService;

    @Test
    public void testFindById() {
        ChartOfAccountDetailEntity chartOfAccountDetailEntity = getChartOfAccountDetailEntity();
        ChartOfAccountDetail expectedResult = chartOfAccountDetailEntity.toDomain();
        when(chartofAccountDetailJdbcRepository.findById(any(ChartOfAccountDetailEntity.class)))
                .thenReturn(chartOfAccountDetailEntity);
        ChartOfAccountDetail actualResult = chartOfAccountDetailRepository.findById(getChartOfAccountDetailDomain());
        assertEquals(expectedResult, actualResult);
    }

    @Test
    public void testSave() {
        ChartOfAccountDetailEntity chartOfAccountDetailEntity = getChartOfAccountDetailEntity();
        ChartOfAccountDetail expectedResult = chartOfAccountDetailEntity.toDomain();
        when(chartofAccountDetailJdbcRepository.create(any(ChartOfAccountDetailEntity.class)))
                .thenReturn(chartOfAccountDetailEntity);
        ChartOfAccountDetail actualResult = chartOfAccountDetailRepository.save(getChartOfAccountDetailDomain());
        assertEquals(expectedResult, actualResult);
    }

    @Test
    public void testUpdate() {
        ChartOfAccountDetailEntity chartOfAccountDetailEntity = getChartOfAccountDetailEntity();
        ChartOfAccountDetail expectedResult = chartOfAccountDetailEntity.toDomain();
        when(chartofAccountDetailJdbcRepository.update(any(ChartOfAccountDetailEntity.class)))
                .thenReturn(chartOfAccountDetailEntity);
        ChartOfAccountDetail actualResult = chartOfAccountDetailRepository.update(getChartOfAccountDetailDomain());
        assertEquals(expectedResult, actualResult);
    }

    @Test
    public void testAdd() {
        Mockito.doNothing().when(chartofAccountDetailQueueRepository).add(Mockito.any());
        ChartOfAccountDetailRequest request = new ChartOfAccountDetailRequest();
        List<ChartOfAccountDetailContract> coadcs = new ArrayList<>();
        coadcs.add(getChartOfAccountDetailContract());
        request.setRequestInfo(getRequestInfo());
        request.setChartOfAccountDetails(coadcs);
        chartOfAccountDetailRepository.add(request);
        Map<String, Object> message = new HashMap<>();
        message.put("chartofaccountdetail_create", request);
        verify(chartofAccountDetailQueueRepository).add(message);
    }

    @Test
    public void testSearch() {
        Pagination<ChartOfAccountDetail> expectedResult = new Pagination<>();
        expectedResult.setPageSize(500);
        expectedResult.setOffset(0);
        when(financialConfigurationService.fetchDataFrom()).thenReturn("db");
        when(chartofAccountDetailJdbcRepository.search(any(ChartOfAccountDetailSearch.class))).thenReturn(expectedResult);
        Pagination<ChartOfAccountDetail> actualResult = chartOfAccountDetailRepository.search(getChartOfAccountDetailSearch());
        assertEquals(expectedResult, actualResult);
    }

    private ChartOfAccountDetailEntity getChartOfAccountDetailEntity() {
        ChartOfAccountDetailEntity chartOfAccountDetailEntity = new ChartOfAccountDetailEntity();
        chartOfAccountDetailEntity.setId("1");
        chartOfAccountDetailEntity.setChartOfAccountId(getChartOfAccount().getId());
        chartOfAccountDetailEntity.setAccountDetailTypeId(getAccountDetailType().getId());
        return chartOfAccountDetailEntity;
    }

    private ChartOfAccountDetail getChartOfAccountDetailDomain() {
        ChartOfAccountDetail chartOfAccountDetail = ChartOfAccountDetail.builder().id("1").build();
        chartOfAccountDetail.setChartOfAccount(getChartOfAccount());
        chartOfAccountDetail.setAccountDetailType(getAccountDetailType());
        return chartOfAccountDetail;
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

    private ChartOfAccountContract getChartOfAccountContract() {
        ChartOfAccountContract chartOfAccountContract = ChartOfAccountContract.builder().id("1")
                .glcode("glcode").name("name")
                .description("description").isActiveForPosting(true)
                .type('A').classification((long) 123456)
                .functionRequired(true).budgetCheckRequired(true).build();
        chartOfAccountContract.setTenantId("default");
        return chartOfAccountContract;
    }

    private AccountDetailType getAccountDetailType() {
        AccountDetailType accountDetailType = AccountDetailType.builder().id("1")
                .name("name").description("description").active(true).build();
        accountDetailType.setTenantId("default");
        return accountDetailType;
    }

    private AccountDetailTypeContract getAccountDetailTypeContract() {
        AccountDetailTypeContract accountDetailTypeContract = AccountDetailTypeContract.builder().id("1")
                .name("name").description("description").active(true).build();
        accountDetailTypeContract.setTenantId("default");
        return accountDetailTypeContract;
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

    private ChartOfAccountDetailContract getChartOfAccountDetailContract() {
        ChartOfAccountDetailContract chartOfAccountDetailContract = ChartOfAccountDetailContract.builder().id("1").build();
        chartOfAccountDetailContract.setChartOfAccount(getChartOfAccountContract());
        chartOfAccountDetailContract.setAccountDetailType(getAccountDetailTypeContract());
        return chartOfAccountDetailContract;
    }

    private ChartOfAccountDetailSearch getChartOfAccountDetailSearch() {
        ChartOfAccountDetailSearch chartOfAccountDetailSearch = new ChartOfAccountDetailSearch();
        chartOfAccountDetailSearch.setPageSize(500);
        chartOfAccountDetailSearch.setOffset(0);
        chartOfAccountDetailSearch.setSortBy("name desc");
        return chartOfAccountDetailSearch;

    }
}