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
import org.egov.egf.master.domain.model.Fund;
import org.egov.egf.master.domain.model.FundSearch;
import org.egov.egf.master.domain.service.FinancialConfigurationService;
import org.egov.egf.master.persistence.entity.FundEntity;
import org.egov.egf.master.persistence.queue.MastersQueueRepository;
import org.egov.egf.master.persistence.repository.FundJdbcRepository;
import org.egov.egf.master.web.contract.FundContract;
import org.egov.egf.master.web.contract.FundSearchContract;
import org.egov.egf.master.web.requests.FundRequest;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class FundRepositoryTest {

    private FundRepository fundRepositoryWithKafka;
    private FundRepository fundRepositoryWithOutKafka;

    @InjectMocks
    private FundRepository fundRepository;

    @Mock
    private FundJdbcRepository fundJdbcRepository;

    @Mock
    private MastersQueueRepository fundQueueRepository;

    @Mock
    private FinancialConfigurationService financialConfigurationService;

    @Mock
    private FundESRepository fundESRepository;

    @Captor
    private ArgumentCaptor<Map<String, Object>> captor;

    private RequestInfo requestInfo = new RequestInfo();

    @Before
    public void setup() {
        fundRepositoryWithKafka = new FundRepository(fundJdbcRepository, fundQueueRepository, financialConfigurationService,
                fundESRepository, "yes");
        fundRepositoryWithOutKafka = new FundRepository(fundJdbcRepository, fundQueueRepository, financialConfigurationService,
                fundESRepository, "no");

    }

    @Test
    public void testFindById() {
        FundEntity fundEntity = getFundEntity();
        Fund expectedResult = fundEntity.toDomain();
        when(fundJdbcRepository.findById(any(FundEntity.class))).thenReturn(fundEntity);
        Fund actualResult = fundRepository.findById(getFundDomain());
        assertEquals(expectedResult, actualResult);
    }

    @Test
    public void testSave() {
        List<Fund> expectedResult = getFunds();
        requestInfo.setAction(Constants.ACTION_CREATE);
        fundRepositoryWithKafka.save(expectedResult, requestInfo);
        verify(fundQueueRepository).add(captor.capture());
    }

    @Test
    public void testSave1() {
        List<Fund> expectedResult = getFunds();
        FundEntity entity = new FundEntity().toEntity(expectedResult.get(0));
        when(fundJdbcRepository.create(any(FundEntity.class))).thenReturn(entity);
        fundRepositoryWithOutKafka.save(expectedResult, requestInfo);
        verify(fundQueueRepository).addToSearch(any(Map.class));
    }

    @Test
    public void testSavee() {
        FundEntity fundEntity = getFundEntity();
        Fund expectedResult = fundEntity.toDomain();
        when(fundJdbcRepository.create(any(FundEntity.class))).thenReturn(fundEntity);
        Fund actualResult = fundRepository.save(getFundDomain());
        assertEquals(expectedResult, actualResult);
    }

    @Test
    public void testUpdate() {
        List<Fund> expectedResult = getFunds();
        requestInfo.setAction(Constants.ACTION_CREATE);
        fundRepositoryWithKafka.update(expectedResult, requestInfo);
        verify(fundQueueRepository).add(captor.capture());
    }
    
    @Test
    public void testUpdate1() {
        List<Fund> expectedResult = getFunds();
        FundEntity entity = new FundEntity().toEntity(expectedResult.get(0));
        when(fundJdbcRepository.update(any(FundEntity.class))).thenReturn(entity);
        fundRepositoryWithOutKafka.update(expectedResult, requestInfo);
        verify(fundQueueRepository).addToSearch(any(Map.class));
    }

    @Test
    public void testUpdatee() {
        FundEntity fundEntity = getFundEntity();
        Fund expectedResult = fundEntity.toDomain();
        when(fundJdbcRepository.update(any(FundEntity.class))).thenReturn(fundEntity);
        Fund actualResult = fundRepository.update(getFundDomain());
        assertEquals(expectedResult, actualResult);
    }

   /* @Test
    public void testAddToQue() {
        Mockito.doNothing().when(fundQueueRepository).add(Mockito.any());
        FundRequest request = new FundRequest();
        request.setRequestInfo(getRequestInfo());
        request.setFunds(new ArrayList<FundContract>());
        request.getFunds().add(getFundContract());
      //  fundRepository.addToQue(request);
        Map<String, Object> message = new HashMap<>();
        message.put("fund_create", request);
        Mockito.verify(fundQueueRepository).add(message);
    }*/

/*    @Test
    public void testAddToQue1() {
        Mockito.doNothing().when(fundQueueRepository).add(Mockito.any());
        FundRequest request = new FundRequest();
        request.setRequestInfo(getRequestInfo());
        request.getRequestInfo().setAction(Constants.ACTION_UPDATE);
        request.setFunds(new ArrayList<FundContract>());
        request.getFunds().add(getFundContract());
        fundRepository.addToQue(request);
        Map<String, Object> message = new HashMap<>();
        message.put("fund_update", request);
        Mockito.verify(fundQueueRepository).add(message);
    }
*/
  /*  @Test
    public void testAddToSearchQueue() {
        Mockito.doNothing().when(fundQueueRepository).add(Mockito.any());
        FundRequest request = new FundRequest();
        request.setRequestInfo(getRequestInfo());
        request.setFunds(new ArrayList<FundContract>());
        request.getFunds().add(getFundContract());
        fundRepository.addToSearchQueue(request);
        Map<String, Object> message = new HashMap<>();
        message.put("fund_persisted", request);
        Mockito.verify(fundQueueRepository).addToSearch(message);
    }*/

    @Test
    public void testSearch() {
        Pagination<Fund> expectedResult = new Pagination<>();
        expectedResult.setPageSize(500);
        expectedResult.setOffset(0);
        when(financialConfigurationService.fetchDataFrom()).thenReturn("db");
        when(fundJdbcRepository.search(any(FundSearch.class))).thenReturn(expectedResult);
        Pagination<Fund> actualResult = fundRepository.search(getFundSearch());
        assertEquals(expectedResult, actualResult);
    }

    @Test
    public void testSearch1() {
        Pagination<Fund> expectedResult = new Pagination<>();
        expectedResult.setPageSize(500);
        expectedResult.setOffset(0);
        when(financialConfigurationService.fetchDataFrom()).thenReturn("es");
        when(fundESRepository.search(any(FundSearchContract.class))).thenReturn(expectedResult);
        Pagination<Fund> actualResult = fundRepository.search(getFundSearch());
        assertEquals(expectedResult, actualResult);
    }

    private FundContract getFundContract() {
        return FundContract.builder().code("code").name("name").active(true).level(1234l).build();
    }

    private FundEntity getFundEntity() {
        FundEntity entity = new FundEntity();
        Fund fund = getFundDomain();
        entity.setCode(fund.getCode());
        entity.setName(fund.getName());
        entity.setActive(fund.getActive());
        entity.setLevel(fund.getLevel());
        entity.setTenantId(fund.getTenantId());
        return entity;
    }

    private Fund getFundDomain() {
        Fund fund = new Fund();
        fund.setId("1");
        fund.setCode("code");
        fund.setName("name");
        fund.setActive(true);
        fund.setLevel(1234l);
        fund.setTenantId("default");
        return fund;
    }

    public List<Fund> getFundDomains() {
        List<Fund> funds = new ArrayList<>();
        funds.add(getFundDomain());
        return funds;
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

    private FundSearch getFundSearch() {
        FundSearch fundSearch = new FundSearch();
        fundSearch.setPageSize(500);
        fundSearch.setOffset(0);
        fundSearch.setSortBy("name desc");
        return fundSearch;
    }

    private List<Fund> getFunds() {
        List<Fund> funds = new ArrayList<Fund>();
        Fund fund = Fund.builder().id("1").name("name").code("code").identifier('I').level(1234l).active(true).build();
        fund.setTenantId("default");
        funds.add(fund);
        return funds;
    }

    private FundSearchContract getFundSearchContract() {
        FundSearchContract fundSearchContract = new FundSearchContract();
        fundSearchContract.setPageSize(0);
        fundSearchContract.setOffset(0);
        fundSearchContract.setSortBy("name desc");
        return fundSearchContract;
    }
}
