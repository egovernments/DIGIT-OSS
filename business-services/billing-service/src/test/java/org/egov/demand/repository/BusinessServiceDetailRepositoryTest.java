package org.egov.demand.repository;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;

import java.util.ArrayList;

import java.util.HashSet;

import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.BusinessServiceDetail;
import org.egov.demand.util.Util;
import org.egov.demand.web.contract.BusinessServiceDetailCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {BusinessServiceDetailRepository.class})
@ExtendWith(SpringExtension.class)
class BusinessServiceDetailRepositoryTest {
    @Autowired
    private BusinessServiceDetailRepository businessServiceDetailRepository;

    @MockBean
    private ObjectMapper objectMapper;

    @MockBean
    private Util util;


    @Test
    void testGetBussinessServiceDetail() throws IllegalArgumentException {
        DocumentContext documentContext = mock(DocumentContext.class);
        when(documentContext.read((String) any(), (com.jayway.jsonpath.Predicate[]) any())).thenReturn("Read");
        when(this.util.getStringVal((java.util.Set<String>) any())).thenReturn("String Val");
        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(documentContext);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        ArrayList<BusinessServiceDetail> businessServiceDetailList = new ArrayList<>();
        when(this.objectMapper.convertValue((Object) any(),
                (com.fasterxml.jackson.core.type.TypeReference<List<BusinessServiceDetail>>) any()))
                .thenReturn(businessServiceDetailList);
        RequestInfo requestInfo = new RequestInfo();

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("BillingService");
        List<BusinessServiceDetail> actualBussinessServiceDetail = this.businessServiceDetailRepository
                .getBussinessServiceDetail(requestInfo, new BusinessServiceDetailCriteria("42", stringSet, new HashSet<>()));
        assertSame(businessServiceDetailList, actualBussinessServiceDetail);
        assertTrue(actualBussinessServiceDetail.isEmpty());
        verify(this.util).getAttributeValues((MdmsCriteriaReq) any());
        verify(this.util).getStringVal((java.util.Set<String>) any());
        verify(this.util).prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any());
        verify(documentContext).read((String) any(), (com.jayway.jsonpath.Predicate[]) any());
        verify(this.objectMapper).convertValue((Object) any(),
                (com.fasterxml.jackson.core.type.TypeReference<List<BusinessServiceDetail>>) any());
    }


   /* @Test

    void testGetBussinessServiceDetail() {

        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        RequestInfo requestInfo = new RequestInfo();
        this.businessServiceDetailRepository.getBussinessServiceDetail(requestInfo, new BusinessServiceDetailCriteria());
    }

    @Test

    void testGetBussinessServiceDetail2() {

        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        this.businessServiceDetailRepository.getBussinessServiceDetail(new RequestInfo(), null);
    }

    @Test

    void testGetBussinessServiceDetail3() {

        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        RequestInfo requestInfo = new RequestInfo();
        HashSet<String> businessService = new HashSet<>();
        this.businessServiceDetailRepository.getBussinessServiceDetail(requestInfo,
                new BusinessServiceDetailCriteria("42", businessService, new HashSet<>()));
    }

    @Test

    void testGetBussinessServiceDetail4() {

        when(this.util.getStringVal((java.util.Set<String>) any())).thenReturn("String Val");
        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        RequestInfo requestInfo = new RequestInfo();

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("BillingService");
        this.businessServiceDetailRepository.getBussinessServiceDetail(requestInfo,
                new BusinessServiceDetailCriteria("42", stringSet, new HashSet<>()));
    }


    @Test

    void testGetBussinessServiceDetail5() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.repository.BusinessServiceDetailRepository.getBussinessServiceDetail(BusinessServiceDetailRepository.java:110)
        //   In order to prevent getBussinessServiceDetail(RequestInfo, BusinessServiceDetailCriteria)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   getBussinessServiceDetail(RequestInfo, BusinessServiceDetailCriteria).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.util.getStringVal((java.util.Set<String>) any())).thenReturn("String Val");
        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        RequestInfo requestInfo = new RequestInfo();

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("BillingService");

        HashSet<String> stringSet1 = new HashSet<>();
        stringSet1.add("BillingService");
        this.businessServiceDetailRepository.getBussinessServiceDetail(requestInfo,
                new BusinessServiceDetailCriteria("42", stringSet, stringSet1));
    }


    @Test
    @Disabled("TODO: Complete this test")
    void testGetBussinessServiceDetail6() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at java.lang.String.replace(String.java:2143)
        //       at org.egov.demand.repository.BusinessServiceDetailRepository.getBussinessServiceDetail(BusinessServiceDetailRepository.java:101)
        //   In order to prevent getBussinessServiceDetail(RequestInfo, BusinessServiceDetailCriteria)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   getBussinessServiceDetail(RequestInfo, BusinessServiceDetailCriteria).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.util.getStringVal((java.util.Set<String>) any())).thenReturn(null);
        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        RequestInfo requestInfo = new RequestInfo();

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("BillingService");
        this.businessServiceDetailRepository.getBussinessServiceDetail(requestInfo,
                new BusinessServiceDetailCriteria("42", stringSet, new HashSet<>()));
    }

    *//**
     * Method under test: {@link BusinessServiceDetailRepository#getBussinessServiceDetail(RequestInfo, BusinessServiceDetailCriteria)}
     *//*
    @Test
    @Disabled("TODO: Complete this test")
    void testGetBussinessServiceDetail7() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at java.lang.String.replace(String.java:2143)
        //       at org.egov.demand.repository.BusinessServiceDetailRepository.getBussinessServiceDetail(BusinessServiceDetailRepository.java:95)
        //   In order to prevent getBussinessServiceDetail(RequestInfo, BusinessServiceDetailCriteria)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   getBussinessServiceDetail(RequestInfo, BusinessServiceDetailCriteria).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.util.getStringVal((java.util.Set<String>) any())).thenReturn(null);
        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        RequestInfo requestInfo = new RequestInfo();

        HashSet<String> stringSet = new HashSet<>();
        stringSet.add("BillingService");

        HashSet<String> stringSet1 = new HashSet<>();
        stringSet1.add("BillingService");
        this.businessServiceDetailRepository.getBussinessServiceDetail(requestInfo,
                new BusinessServiceDetailCriteria("42", stringSet, stringSet1));
    }
*/


}

