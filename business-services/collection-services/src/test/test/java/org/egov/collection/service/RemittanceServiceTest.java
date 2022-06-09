package org.egov.collection.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.collection.repository.RemittanceRepository;
import org.egov.collection.util.RemittanceEnricher;
import org.egov.collection.web.contract.Remittance;
import org.egov.collection.web.contract.RemittanceRequest;
import org.egov.collection.web.contract.RemittanceSearchRequest;
import org.egov.common.contract.request.RequestInfo;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {RemittanceService.class})
@ExtendWith(SpringExtension.class)
class RemittanceServiceTest {
    @MockBean
    private RemittanceEnricher remittanceEnricher;

    @MockBean
    private RemittanceRepository remittanceRepository;

    @Autowired
    private RemittanceService remittanceService;

    @Test
    void testGetRemittances() {
        ArrayList<Remittance> remittanceList = new ArrayList<>();
        when(this.remittanceRepository.fetchRemittances((RemittanceSearchRequest) any())).thenReturn(remittanceList);
        RequestInfo requestInfo = new RequestInfo();

        RemittanceSearchRequest remittanceSearchRequest = new RemittanceSearchRequest();
        remittanceSearchRequest.setBankaccount("3");
        remittanceSearchRequest.setFromDate(1L);
        remittanceSearchRequest.setFunction("Function");
        remittanceSearchRequest.setFund("Fund");
        remittanceSearchRequest.setIds(new ArrayList<>());
        remittanceSearchRequest.setLimit(1);
        remittanceSearchRequest.setOffset(2);
        remittanceSearchRequest.setPageSize(3);
        remittanceSearchRequest.setReasonForDelay("Just cause");
        remittanceSearchRequest.setReferenceNumbers(new ArrayList<>());
        remittanceSearchRequest.setRemarks("Remarks");
        remittanceSearchRequest.setSortBy("Sort By");
        remittanceSearchRequest.setSortOrder("asc");
        remittanceSearchRequest.setStatus("Status");
        remittanceSearchRequest.setTenantId("42");
        remittanceSearchRequest.setToDate(1L);
        remittanceSearchRequest.setVoucherHeader("Voucher Header");
        List<Remittance> actualRemittances = this.remittanceService.getRemittances(requestInfo, remittanceSearchRequest);
        assertSame(remittanceList, actualRemittances);
        assertTrue(actualRemittances.isEmpty());
        verify(this.remittanceRepository).fetchRemittances((RemittanceSearchRequest) any());
        assertEquals(0, remittanceSearchRequest.getOffset().intValue());
        assertEquals(25, remittanceSearchRequest.getLimit().intValue());
    }

    @Test
    void testCreateRemittance4() {
        doNothing().when(this.remittanceRepository).saveRemittance((Remittance) any());
        doNothing().when(this.remittanceEnricher).enrichRemittancePreValidate((RemittanceRequest) any());

        ArrayList<Remittance> remittanceList = new ArrayList<>();
        Remittance remittance = new Remittance();
        remittanceList.add(remittance);
        RemittanceRequest remittanceRequest = mock(RemittanceRequest.class);
        when(remittanceRequest.getRemittances()).thenReturn(remittanceList);
        assertSame(remittance, this.remittanceService.createRemittance(remittanceRequest));
        verify(this.remittanceRepository).saveRemittance((Remittance) any());
        verify(this.remittanceEnricher).enrichRemittancePreValidate((RemittanceRequest) any());
        verify(remittanceRequest).getRemittances();
    }

    @Test
    void testUpdateRemittance4() {
        doNothing().when(this.remittanceRepository).updateRemittance((Remittance) any());

        ArrayList<Remittance> remittanceList = new ArrayList<>();
        Remittance remittance = new Remittance();
        remittanceList.add(remittance);
        RemittanceRequest remittanceRequest = mock(RemittanceRequest.class);
        when(remittanceRequest.getRemittances()).thenReturn(remittanceList);
        assertSame(remittance, this.remittanceService.updateRemittance(remittanceRequest));
        verify(this.remittanceRepository).updateRemittance((Remittance) any());
        verify(remittanceRequest).getRemittances();
    }
}

