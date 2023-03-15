package org.egov.demand.repository;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;

import java.util.ArrayList;

import java.util.HashSet;

import java.util.List;
import java.util.Set;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.TaxPeriod;
import org.egov.demand.model.enums.PeriodCycle;
import org.egov.demand.util.Util;
import org.egov.demand.web.contract.TaxPeriodCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {TaxPeriodRepository.class})
@ExtendWith(SpringExtension.class)
class TaxPeriodRepositoryTest {
    @MockBean
    private ObjectMapper objectMapper;

    @Autowired
    private TaxPeriodRepository taxPeriodRepository;

    @MockBean
    private Util util;


    @Test
    void testGetTaxPeriod7() throws IllegalArgumentException {
        DocumentContext documentContext = mock(DocumentContext.class);
        when(documentContext.read((String) any(), (com.jayway.jsonpath.Predicate[]) any())).thenReturn("Read");
        when(this.util.getStringVal((Set<String>) any())).thenReturn("String Val");
        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(documentContext);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        ArrayList<TaxPeriod> taxPeriodList = new ArrayList<>();
        when(this.objectMapper.convertValue((Object) any(),
                (com.fasterxml.jackson.core.type.TypeReference<List<TaxPeriod>>) any())).thenReturn(taxPeriodList);
        RequestInfo requestInfo = new RequestInfo();

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("foo");
        TaxPeriodCriteria taxPeriodCriteria = mock(TaxPeriodCriteria.class);
        when(taxPeriodCriteria.getDate()).thenReturn(1L);
        when(taxPeriodCriteria.getFromDate()).thenReturn(1L);
        when(taxPeriodCriteria.getToDate()).thenReturn(1L);
        when(taxPeriodCriteria.getCode()).thenReturn("Code");
        when(taxPeriodCriteria.getTenantId()).thenReturn("42");
        when(taxPeriodCriteria.getId()).thenReturn(stringSet);
        when(taxPeriodCriteria.getService()).thenReturn(new HashSet<>());
        when(taxPeriodCriteria.getPeriodCycle()).thenReturn(PeriodCycle.MONTH);
        List<TaxPeriod> actualTaxPeriod = this.taxPeriodRepository.getTaxPeriod(requestInfo, taxPeriodCriteria);
        assertSame(taxPeriodList, actualTaxPeriod);
        assertTrue(actualTaxPeriod.isEmpty());
        verify(this.util).getAttributeValues((MdmsCriteriaReq) any());
        verify(this.util).getStringVal((Set<String>) any());
        verify(this.util).prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any());
        verify(documentContext).read((String) any(), (com.jayway.jsonpath.Predicate[]) any());
        verify(this.objectMapper).convertValue((Object) any(),
                (com.fasterxml.jackson.core.type.TypeReference<List<TaxPeriod>>) any());
        verify(taxPeriodCriteria, atLeast(1)).getDate();
        verify(taxPeriodCriteria, atLeast(1)).getFromDate();
        verify(taxPeriodCriteria, atLeast(1)).getToDate();
        verify(taxPeriodCriteria, atLeast(1)).getCode();
        verify(taxPeriodCriteria).getTenantId();
        verify(taxPeriodCriteria, atLeast(1)).getId();
        verify(taxPeriodCriteria).getService();
        verify(taxPeriodCriteria, atLeast(1)).getPeriodCycle();
    }
}

