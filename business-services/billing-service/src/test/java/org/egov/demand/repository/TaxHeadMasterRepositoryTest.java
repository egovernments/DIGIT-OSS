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

