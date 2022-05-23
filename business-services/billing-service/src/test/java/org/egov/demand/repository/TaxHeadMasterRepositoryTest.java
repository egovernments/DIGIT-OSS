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
import org.egov.demand.model.TaxHeadMaster;
import org.egov.demand.model.TaxHeadMasterCriteria;
import org.egov.demand.util.Util;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {TaxHeadMasterRepository.class})
@ExtendWith(SpringExtension.class)
class TaxHeadMasterRepositoryTest {
    @MockBean
    private ObjectMapper objectMapper;

    @Autowired
    private TaxHeadMasterRepository taxHeadMasterRepository;

    @MockBean
    private Util util;

    /**
     * Method under test: {@link TaxHeadMasterRepository#getTaxHeadMaster(RequestInfo, TaxHeadMasterCriteria)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testGetTaxHeadMaster() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.TaxHeadMasterRepository.getTaxHeadMaster(TaxHeadMasterRepository.java:104)
        //   In order to prevent getTaxHeadMaster(RequestInfo, TaxHeadMasterCriteria)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   getTaxHeadMaster(RequestInfo, TaxHeadMasterCriteria).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        RequestInfo requestInfo = new RequestInfo();
        this.taxHeadMasterRepository.getTaxHeadMaster(requestInfo, new TaxHeadMasterCriteria());
    }

    /**
     * Method under test: {@link TaxHeadMasterRepository#getTaxHeadMaster(RequestInfo, TaxHeadMasterCriteria)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testGetTaxHeadMaster2() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.TaxHeadMasterRepository.getTaxHeadMaster(TaxHeadMasterRepository.java:51)
        //   In order to prevent getTaxHeadMaster(RequestInfo, TaxHeadMasterCriteria)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   getTaxHeadMaster(RequestInfo, TaxHeadMasterCriteria).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        this.taxHeadMasterRepository.getTaxHeadMaster(new RequestInfo(), null);
    }

    /**
     * Method under test: {@link TaxHeadMasterRepository#getTaxHeadMaster(RequestInfo, TaxHeadMasterCriteria)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testGetTaxHeadMaster3() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.TaxHeadMasterRepository.getTaxHeadMaster(TaxHeadMasterRepository.java:104)
        //   In order to prevent getTaxHeadMaster(RequestInfo, TaxHeadMasterCriteria)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   getTaxHeadMaster(RequestInfo, TaxHeadMasterCriteria).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        RequestInfo requestInfo = new RequestInfo();
        HashSet<String> code = new HashSet<>();
        this.taxHeadMasterRepository.getTaxHeadMaster(requestInfo, new TaxHeadMasterCriteria("42", "BillingService",
                "BillingService", "BillingService", code, true, true, new HashSet<>()));
    }

    /**
     * Method under test: {@link TaxHeadMasterRepository#getTaxHeadMaster(RequestInfo, TaxHeadMasterCriteria)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testGetTaxHeadMaster4() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.TaxHeadMasterRepository.getTaxHeadMaster(TaxHeadMasterRepository.java:104)
        //   In order to prevent getTaxHeadMaster(RequestInfo, TaxHeadMasterCriteria)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   getTaxHeadMaster(RequestInfo, TaxHeadMasterCriteria).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.util.getStringVal((java.util.Set<String>) any())).thenReturn("String Val");
        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        RequestInfo requestInfo = new RequestInfo();

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("foo");
        TaxHeadMasterCriteria taxHeadMasterCriteria = mock(TaxHeadMasterCriteria.class);
        when(taxHeadMasterCriteria.getIsActualDemand()).thenReturn(true);
        when(taxHeadMasterCriteria.getIsDebit()).thenReturn(true);
        when(taxHeadMasterCriteria.getCategory()).thenReturn("Category");
        when(taxHeadMasterCriteria.getName()).thenReturn("Name");
        when(taxHeadMasterCriteria.getService()).thenReturn("Service");
        when(taxHeadMasterCriteria.getTenantId()).thenReturn("42");
        when(taxHeadMasterCriteria.getCode()).thenReturn(stringSet);
        when(taxHeadMasterCriteria.getId()).thenReturn(new HashSet<>());
        this.taxHeadMasterRepository.getTaxHeadMaster(requestInfo, taxHeadMasterCriteria);
    }

    /**
     * Method under test: {@link TaxHeadMasterRepository#getTaxHeadMaster(RequestInfo, TaxHeadMasterCriteria)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testGetTaxHeadMaster5() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.TaxHeadMasterRepository.getTaxHeadMaster(TaxHeadMasterRepository.java:104)
        //   In order to prevent getTaxHeadMaster(RequestInfo, TaxHeadMasterCriteria)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   getTaxHeadMaster(RequestInfo, TaxHeadMasterCriteria).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.util.getStringVal((java.util.Set<String>) any())).thenReturn("String Val");
        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        RequestInfo requestInfo = new RequestInfo();

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("foo");

        HashSet<String> stringSet1 = new HashSet<>();
        stringSet1.add("$.[?(@.service== \"{}\")]");
        TaxHeadMasterCriteria taxHeadMasterCriteria = mock(TaxHeadMasterCriteria.class);
        when(taxHeadMasterCriteria.getIsActualDemand()).thenReturn(true);
        when(taxHeadMasterCriteria.getIsDebit()).thenReturn(true);
        when(taxHeadMasterCriteria.getCategory()).thenReturn("Category");
        when(taxHeadMasterCriteria.getName()).thenReturn("Name");
        when(taxHeadMasterCriteria.getService()).thenReturn("Service");
        when(taxHeadMasterCriteria.getTenantId()).thenReturn("42");
        when(taxHeadMasterCriteria.getCode()).thenReturn(stringSet);
        when(taxHeadMasterCriteria.getId()).thenReturn(stringSet1);
        this.taxHeadMasterRepository.getTaxHeadMaster(requestInfo, taxHeadMasterCriteria);
    }

    /**
     * Method under test: {@link TaxHeadMasterRepository#getTaxHeadMaster(RequestInfo, TaxHeadMasterCriteria)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testGetTaxHeadMaster6() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at java.lang.String.replace(String.java:2143)
        //       at org.egov.demand.repository.TaxHeadMasterRepository.getTaxHeadMaster(TaxHeadMasterRepository.java:75)
        //   In order to prevent getTaxHeadMaster(RequestInfo, TaxHeadMasterCriteria)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   getTaxHeadMaster(RequestInfo, TaxHeadMasterCriteria).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.util.getStringVal((java.util.Set<String>) any())).thenReturn(null);
        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        RequestInfo requestInfo = new RequestInfo();

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("foo");
        TaxHeadMasterCriteria taxHeadMasterCriteria = mock(TaxHeadMasterCriteria.class);
        when(taxHeadMasterCriteria.getIsActualDemand()).thenReturn(true);
        when(taxHeadMasterCriteria.getIsDebit()).thenReturn(true);
        when(taxHeadMasterCriteria.getCategory()).thenReturn("Category");
        when(taxHeadMasterCriteria.getName()).thenReturn("Name");
        when(taxHeadMasterCriteria.getService()).thenReturn("Service");
        when(taxHeadMasterCriteria.getTenantId()).thenReturn("42");
        when(taxHeadMasterCriteria.getCode()).thenReturn(stringSet);
        when(taxHeadMasterCriteria.getId()).thenReturn(new HashSet<>());
        this.taxHeadMasterRepository.getTaxHeadMaster(requestInfo, taxHeadMasterCriteria);
    }

    /**
     * Method under test: {@link TaxHeadMasterRepository#getTaxHeadMaster(RequestInfo, TaxHeadMasterCriteria)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testGetTaxHeadMaster7() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //   In order to prevent getTaxHeadMaster(RequestInfo, TaxHeadMasterCriteria)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   getTaxHeadMaster(RequestInfo, TaxHeadMasterCriteria).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.util.getStringVal((java.util.Set<String>) any())).thenReturn(null);
        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        RequestInfo requestInfo = new RequestInfo();

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("foo");

        HashSet<String> stringSet1 = new HashSet<>();
        stringSet1.add("$.[?(@.service== \"{}\")]");
        TaxHeadMasterCriteria taxHeadMasterCriteria = mock(TaxHeadMasterCriteria.class);
        when(taxHeadMasterCriteria.getIsActualDemand()).thenReturn(true);
        when(taxHeadMasterCriteria.getIsDebit()).thenReturn(true);
        when(taxHeadMasterCriteria.getCategory()).thenReturn("Category");
        when(taxHeadMasterCriteria.getName()).thenReturn("Name");
        when(taxHeadMasterCriteria.getService()).thenReturn("Service");
        when(taxHeadMasterCriteria.getTenantId()).thenReturn("42");
        when(taxHeadMasterCriteria.getCode()).thenReturn(stringSet);
        when(taxHeadMasterCriteria.getId()).thenReturn(stringSet1);
        this.taxHeadMasterRepository.getTaxHeadMaster(requestInfo, taxHeadMasterCriteria);
    }

    /**
     * Method under test: {@link TaxHeadMasterRepository#getTaxHeadMaster(RequestInfo, TaxHeadMasterCriteria)}
     */
    @Test
    void testGetTaxHeadMaster8() throws IllegalArgumentException {
        DocumentContext documentContext = mock(DocumentContext.class);
        when(documentContext.read((String) any(), (com.jayway.jsonpath.Predicate[]) any())).thenReturn("Read");
        when(this.util.getStringVal((Set<String>) any())).thenReturn("String Val");
        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(documentContext);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        ArrayList<TaxHeadMaster> taxHeadMasterList = new ArrayList<>();
        when(this.objectMapper.convertValue((Object) any(),
                (com.fasterxml.jackson.core.type.TypeReference<List<TaxHeadMaster>>) any())).thenReturn(taxHeadMasterList);
        RequestInfo requestInfo = new RequestInfo();

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("foo");
        TaxHeadMasterCriteria taxHeadMasterCriteria = mock(TaxHeadMasterCriteria.class);
        when(taxHeadMasterCriteria.getIsActualDemand()).thenReturn(true);
        when(taxHeadMasterCriteria.getIsDebit()).thenReturn(true);
        when(taxHeadMasterCriteria.getCategory()).thenReturn("Category");
        when(taxHeadMasterCriteria.getName()).thenReturn("Name");
        when(taxHeadMasterCriteria.getService()).thenReturn("Service");
        when(taxHeadMasterCriteria.getTenantId()).thenReturn("42");
        when(taxHeadMasterCriteria.getCode()).thenReturn(stringSet);
        when(taxHeadMasterCriteria.getId()).thenReturn(new HashSet<>());
        List<TaxHeadMaster> actualTaxHeadMaster = this.taxHeadMasterRepository.getTaxHeadMaster(requestInfo,
                taxHeadMasterCriteria);
        assertSame(taxHeadMasterList, actualTaxHeadMaster);
        assertTrue(actualTaxHeadMaster.isEmpty());
        verify(this.util).getAttributeValues((MdmsCriteriaReq) any());
        verify(this.util).getStringVal((Set<String>) any());
        verify(this.util).prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any());
        verify(documentContext).read((String) any(), (com.jayway.jsonpath.Predicate[]) any());
        verify(this.objectMapper).convertValue((Object) any(),
                (com.fasterxml.jackson.core.type.TypeReference<List<TaxHeadMaster>>) any());
        verify(taxHeadMasterCriteria, atLeast(1)).getIsActualDemand();
        verify(taxHeadMasterCriteria, atLeast(1)).getIsDebit();
        verify(taxHeadMasterCriteria, atLeast(1)).getCategory();
        verify(taxHeadMasterCriteria, atLeast(1)).getName();
        verify(taxHeadMasterCriteria, atLeast(1)).getService();
        verify(taxHeadMasterCriteria).getTenantId();
        verify(taxHeadMasterCriteria, atLeast(1)).getCode();
        verify(taxHeadMasterCriteria, atLeast(1)).getId();
    }
}

