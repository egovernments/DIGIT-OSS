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
import org.egov.demand.model.TaxHeadMasterCriteria;
import org.egov.demand.repository.TaxHeadMasterRepository;
import org.egov.demand.web.contract.TaxHeadMasterResponse;
import org.egov.demand.web.contract.factory.ResponseFactory;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {TaxHeadMasterService.class, ResponseFactory.class})
@ExtendWith(SpringExtension.class)
class TaxHeadMasterServiceTest {
    @MockBean
    private TaxHeadMasterRepository taxHeadMasterRepository;

    @Autowired
    private TaxHeadMasterService taxHeadMasterService;

    /**
     * Method under test: {@link TaxHeadMasterService#getTaxHeads(TaxHeadMasterCriteria, RequestInfo)}
     */
    @Test
    void testGetTaxHeads() {
        when(this.taxHeadMasterRepository.getTaxHeadMaster((RequestInfo) any(), (TaxHeadMasterCriteria) any()))
                .thenReturn(new ArrayList<>());
        TaxHeadMasterCriteria searchTaxHead = new TaxHeadMasterCriteria();
        TaxHeadMasterResponse actualTaxHeads = this.taxHeadMasterService.getTaxHeads(searchTaxHead, new RequestInfo());
        assertTrue(actualTaxHeads.getTaxHeadMasters().isEmpty());
        ResponseInfo responseInfo = actualTaxHeads.getResponseInfo();
        assertNull(responseInfo.getVer());
        assertNull(responseInfo.getTs());
        assertEquals("200 OK", responseInfo.getStatus());
        assertNull(responseInfo.getMsgId());
        assertNull(responseInfo.getApiId());
        verify(this.taxHeadMasterRepository).getTaxHeadMaster((RequestInfo) any(), (TaxHeadMasterCriteria) any());
    }

    /**
     * Method under test: {@link TaxHeadMasterService#getTaxHeads(TaxHeadMasterCriteria, RequestInfo)}
     */
    @Test
    void testGetTaxHeads2() {
        when(this.taxHeadMasterRepository.getTaxHeadMaster((RequestInfo) any(), (TaxHeadMasterCriteria) any()))
                .thenReturn(new ArrayList<>());
        assertTrue(this.taxHeadMasterService.getTaxHeads(new TaxHeadMasterCriteria(), null).getTaxHeadMasters().isEmpty());
        verify(this.taxHeadMasterRepository).getTaxHeadMaster((RequestInfo) any(), (TaxHeadMasterCriteria) any());
    }
}

