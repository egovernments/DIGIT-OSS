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





}

