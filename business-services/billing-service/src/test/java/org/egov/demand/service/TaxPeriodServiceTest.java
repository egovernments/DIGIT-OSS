package org.egov.demand.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.demand.repository.TaxPeriodRepository;
import org.egov.demand.web.contract.TaxPeriodCriteria;
import org.egov.demand.web.contract.TaxPeriodResponse;
import org.egov.demand.web.contract.factory.ResponseFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {TaxPeriodService.class, ResponseFactory.class})
@ExtendWith(SpringExtension.class)
class TaxPeriodServiceTest {
    @MockBean
    private TaxPeriodRepository taxPeriodRepository;

    @Autowired
    private TaxPeriodService taxPeriodService;

    /**
     * Method under test: {@link TaxPeriodService#searchTaxPeriods(TaxPeriodCriteria, RequestInfo)}
     */
    @Test
    void testSearchTaxPeriods() {
        when(this.taxPeriodRepository.getTaxPeriod((RequestInfo) any(), (TaxPeriodCriteria) any()))
                .thenReturn(new ArrayList<>());
        TaxPeriodCriteria taxPeriodCriteria = new TaxPeriodCriteria();
        TaxPeriodResponse actualSearchTaxPeriodsResult = this.taxPeriodService.searchTaxPeriods(taxPeriodCriteria,
                new RequestInfo());
        assertTrue(actualSearchTaxPeriodsResult.getTaxPeriods().isEmpty());
        ResponseInfo responseInfo = actualSearchTaxPeriodsResult.getResponseInfo();
        assertNull(responseInfo.getVer());
        assertNull(responseInfo.getTs());
        assertEquals("200 OK", responseInfo.getStatus());
        assertNull(responseInfo.getMsgId());
        assertNull(responseInfo.getApiId());
        verify(this.taxPeriodRepository).getTaxPeriod((RequestInfo) any(), (TaxPeriodCriteria) any());
    }

    /**
     * Method under test: {@link TaxPeriodService#searchTaxPeriods(TaxPeriodCriteria, RequestInfo)}
     */
    @Test
    void testSearchTaxPeriods2() {
        when(this.taxPeriodRepository.getTaxPeriod((RequestInfo) any(), (TaxPeriodCriteria) any()))
                .thenReturn(new ArrayList<>());
        assertTrue(this.taxPeriodService.searchTaxPeriods(new TaxPeriodCriteria(), null).getTaxPeriods().isEmpty());
        verify(this.taxPeriodRepository).getTaxPeriod((RequestInfo) any(), (TaxPeriodCriteria) any());
    }
}

