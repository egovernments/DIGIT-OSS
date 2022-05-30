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

   /* @Test

    void testGetTaxPeriod() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.TaxPeriodRepository.getTaxPeriod(TaxPeriodRepository.java:142)
        //   In order to prevent getTaxPeriod(RequestInfo, TaxPeriodCriteria)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   getTaxPeriod(RequestInfo, TaxPeriodCriteria).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        RequestInfo requestInfo = new RequestInfo();
        this.taxPeriodRepository.getTaxPeriod(requestInfo, new TaxPeriodCriteria());
    }

    *//**
     * Method under test: {@link TaxPeriodRepository#getTaxPeriod(RequestInfo, TaxPeriodCriteria)}
     *//*
    @Test
    @Disabled("TODO: Complete this test")
    void testGetTaxPeriod2() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.TaxPeriodRepository.getTaxPeriod(TaxPeriodRepository.java:88)
        //   In order to prevent getTaxPeriod(RequestInfo, TaxPeriodCriteria)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   getTaxPeriod(RequestInfo, TaxPeriodCriteria).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        this.taxPeriodRepository.getTaxPeriod(new RequestInfo(), null);
    }

    *//**
     * Method under test: {@link TaxPeriodRepository#getTaxPeriod(RequestInfo, TaxPeriodCriteria)}
     *//*
    @Test
    @Disabled("TODO: Complete this test")
    void testGetTaxPeriod3() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.TaxPeriodRepository.getTaxPeriod(TaxPeriodRepository.java:142)
        //   In order to prevent getTaxPeriod(RequestInfo, TaxPeriodCriteria)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   getTaxPeriod(RequestInfo, TaxPeriodCriteria).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        RequestInfo requestInfo = new RequestInfo();
        HashSet<String> service = new HashSet<>();
        this.taxPeriodRepository.getTaxPeriod(requestInfo,
                new TaxPeriodCriteria("42", service, PeriodCycle.MONTH, new HashSet<>(), "BillingService", 5L, 5L, 5L));
    }

    *//**
     * Method under test: {@link TaxPeriodRepository#getTaxPeriod(RequestInfo, TaxPeriodCriteria)}
     *//*
    @Test
    @Disabled("TODO: Complete this test")
    void testGetTaxPeriod4() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.TaxPeriodRepository.getTaxPeriod(TaxPeriodRepository.java:142)
        //   In order to prevent getTaxPeriod(RequestInfo, TaxPeriodCriteria)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   getTaxPeriod(RequestInfo, TaxPeriodCriteria).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.util.getStringVal((java.util.Set<String>) any())).thenReturn("String Val");
        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
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
        this.taxPeriodRepository.getTaxPeriod(requestInfo, taxPeriodCriteria);
    }

    *//**
     * Method under test: {@link TaxPeriodRepository#getTaxPeriod(RequestInfo, TaxPeriodCriteria)}
     *//*
    @Test
    @Disabled("TODO: Complete this test")
    void testGetTaxPeriod5() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.TaxPeriodRepository.getTaxPeriod(TaxPeriodRepository.java:142)
        //   In order to prevent getTaxPeriod(RequestInfo, TaxPeriodCriteria)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   getTaxPeriod(RequestInfo, TaxPeriodCriteria).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.util.getStringVal((java.util.Set<String>) any())).thenReturn("String Val");
        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        RequestInfo requestInfo = new RequestInfo();

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("foo");

        HashSet<String> stringSet1 = new HashSet<>();
        stringSet1.add("BillingService");
        TaxPeriodCriteria taxPeriodCriteria = mock(TaxPeriodCriteria.class);
        when(taxPeriodCriteria.getDate()).thenReturn(1L);
        when(taxPeriodCriteria.getFromDate()).thenReturn(1L);
        when(taxPeriodCriteria.getToDate()).thenReturn(1L);
        when(taxPeriodCriteria.getCode()).thenReturn("Code");
        when(taxPeriodCriteria.getTenantId()).thenReturn("42");
        when(taxPeriodCriteria.getId()).thenReturn(stringSet);
        when(taxPeriodCriteria.getService()).thenReturn(stringSet1);
        when(taxPeriodCriteria.getPeriodCycle()).thenReturn(PeriodCycle.MONTH);
        this.taxPeriodRepository.getTaxPeriod(requestInfo, taxPeriodCriteria);
    }

    *//**
     * Method under test: {@link TaxPeriodRepository#getTaxPeriod(RequestInfo, TaxPeriodCriteria)}
     *//*
    @Test
    @Disabled("TODO: Complete this test")
    void testGetTaxPeriod6() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at java.lang.String.replace(String.java:2143)
        //       at org.egov.demand.repository.TaxPeriodRepository.getTaxPeriod(TaxPeriodRepository.java:101)
        //   In order to prevent getTaxPeriod(RequestInfo, TaxPeriodCriteria)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   getTaxPeriod(RequestInfo, TaxPeriodCriteria).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.util.getStringVal((java.util.Set<String>) any())).thenReturn(null);
        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
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
        this.taxPeriodRepository.getTaxPeriod(requestInfo, taxPeriodCriteria);
    }
*/
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

