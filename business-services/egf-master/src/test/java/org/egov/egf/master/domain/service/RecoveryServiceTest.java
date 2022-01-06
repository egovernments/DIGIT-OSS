package org.egov.egf.master.domain.service;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.domain.model.Pagination;
import org.egov.egf.master.TestConfiguration;
import org.egov.egf.master.domain.model.ChartOfAccount;
import org.egov.egf.master.domain.model.ChartOfAccountSearch;
import org.egov.egf.master.domain.model.Recovery;
import org.egov.egf.master.domain.model.RecoverySearch;
import org.egov.egf.master.domain.repository.ChartOfAccountRepository;
import org.egov.egf.master.domain.repository.RecoveryRepository;
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
public class RecoveryServiceTest {

    @InjectMocks
    private RecoveryService recoveryService;

    @Mock
    private SmartValidator validator;

    @Mock
    private RecoveryRepository recoveryRepository;

    @Mock
    private ChartOfAccountRepository chartOfAccountRepository;
    private BindingResult errors = new BeanPropertyBindingResult(null, null);
    private RequestInfo requestInfo = new RequestInfo();
    private List<Recovery> recoverys = new ArrayList<>();

    @Before
    public void setup() {
    }

    @Test
    public final void test_create() {
        when(chartOfAccountRepository.search(any(ChartOfAccountSearch.class))).thenReturn(getPagination());
        when(recoveryRepository.uniqueCheck(any(String.class), any(Recovery.class))).thenReturn(true);
        recoveryService.create(getRecoverys(), errors, requestInfo);
    }

    @Test
    public final void test_update() {
        when(chartOfAccountRepository.search(any(ChartOfAccountSearch.class))).thenReturn(getPagination());
        when(recoveryRepository.uniqueCheck(any(String.class), any(Recovery.class))).thenReturn(true);
        recoveryService.update(getRecoverys(), errors, requestInfo);
    }

    @Test
    public final void test_createinvalid() {
        Recovery recovery1 = Recovery.builder().name("name").code("code").type("M").mode('M').remittanceMode('M').active(true).build();
        recoverys.add(recovery1);
        when(recoveryRepository.uniqueCheck(any(String.class), any(Recovery.class))).thenReturn(true);
        recoveryService.create(recoverys, errors, requestInfo);
    }

    @Test
    public final void test_save() {
        Recovery expextedResult = getRecoverys().get(0);
        when(recoveryRepository.save(any(Recovery.class))).thenReturn(expextedResult);
        Recovery actualResult = recoveryService.save(getRecoverys().get(0));
        assertEquals(expextedResult, actualResult);
    }

    @Test
    public final void test_search() {
        List<Recovery> search = new ArrayList<>();
        search.add(getRecoverySearch());
        Pagination<Recovery> expectedResult = new Pagination<>();
        expectedResult.setPagedData(search);
        when(recoveryRepository.search(any(RecoverySearch.class))).thenReturn(expectedResult);
        Pagination<Recovery> actualResult = recoveryService.search(getRecoverySearch(), errors);
        assertEquals(expectedResult, actualResult);

    }

    @Test
    public final void test_updatee() {
        Recovery expextedResult = getRecoverys().get(0);
        when(recoveryRepository.update(any(Recovery.class))).thenReturn(expextedResult);
        Recovery actualResult = recoveryService.update(getRecoverys().get(0));
        assertEquals(expextedResult, actualResult);
    }

    private List<Recovery> getRecoverys() {
        List<Recovery> recoverys = new ArrayList<Recovery>();
        Recovery recovery = Recovery.builder().name("name").code("code").type("M").mode('M').remittanceMode('M').active(true).build();
        recovery.setTenantId("default");
        recovery.setChartOfAccount(getCOAccount());
        recovery.setRemitted("S");
        recovery.setIfscCode("SBIN0005532");
        recovery.setAccountNumber("3049223457");
        recovery.setId("1");
        recoverys.add(recovery);
        return recoverys;
    }

    private ChartOfAccount getCOAccount() {
        ChartOfAccount chartOfAccount = new ChartOfAccount();
        chartOfAccount.setGlcode("341");
        chartOfAccount.setTenantId("default");
        return chartOfAccount;
    }

    private RecoverySearch getRecoverySearch() {
        RecoverySearch recoverySearch = new RecoverySearch();
        recoverySearch.setPageSize(0);
        recoverySearch.setOffset(0);
        recoverySearch.setSortBy("Sort");
        recoverySearch.setTenantId("default");
        return recoverySearch;
    }

    private Pagination<ChartOfAccount> getPagination(){
        Pagination<ChartOfAccount> pgn = new Pagination<>();
        pgn.setCurrentPage(0);
        pgn.setOffset(0);
        pgn.setPageSize(500);
        pgn.setTotalPages(1);
        pgn.setTotalResults(1);
        pgn.setPagedData(getChartOfAccounts());
        return pgn;
    }

    private List<ChartOfAccount> getChartOfAccounts() {
        List<ChartOfAccount> chartOfAccounts = new ArrayList<ChartOfAccount>();
        ChartOfAccount chartOfAccount = ChartOfAccount.builder()
                .glcode("GLCode").name("AadharBank")
                .description("DefaultDescription").isActiveForPosting(true)
                .type('B').classification((long) 123456)
                .functionRequired(true).budgetCheckRequired(true).build();
        chartOfAccount.setTenantId("default");
        chartOfAccounts.add(chartOfAccount);
        return chartOfAccounts;
    }
}