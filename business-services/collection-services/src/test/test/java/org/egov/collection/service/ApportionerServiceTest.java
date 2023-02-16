package org.egov.collection.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.egov.collection.config.ApplicationProperties;
import org.egov.collection.model.PaymentRequest;
import org.egov.collection.web.contract.Bill;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.client.RestTemplate;

class ApportionerServiceTest {
    @MockBean
    private boolean aBoolean;

    @Autowired
    private ApportionerService apportionerService;

    @MockBean
    private RestTemplate restTemplate;

    @Test
    void testSeggregateBillOnTenantId() {

        ApportionerService apportionerService = new ApportionerService();
        assertTrue(apportionerService.seggregateBillOnTenantId(new ArrayList<>()).isEmpty());
    }

    @Test
    void testSeggregateBillOnTenantId2() {

        ApportionerService apportionerService = new ApportionerService();

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(new Bill());
        Map<String, List<Bill>> actualSeggregateBillOnTenantIdResult = apportionerService
                .seggregateBillOnTenantId(billList);
        assertEquals(1, actualSeggregateBillOnTenantIdResult.size());
        assertEquals(1, actualSeggregateBillOnTenantIdResult.get(null).size());
    }

    @Test
    void testSeggregateBillOnTenantId3() {

        ApportionerService apportionerService = new ApportionerService();

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(new Bill());
        billList.add(new Bill());
        Map<String, List<Bill>> actualSeggregateBillOnTenantIdResult = apportionerService
                .seggregateBillOnTenantId(billList);
        assertEquals(1, actualSeggregateBillOnTenantIdResult.size());
        assertEquals(2, actualSeggregateBillOnTenantIdResult.get(null).size());
    }

    @Test
    void testSeggregateBillOnTenantId5() {

        ApportionerService apportionerService = new ApportionerService();
        Bill bill = mock(Bill.class);
        when(bill.getTenantId()).thenReturn("42");

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(bill);
        Map<String, List<Bill>> actualSeggregateBillOnTenantIdResult = apportionerService
                .seggregateBillOnTenantId(billList);
        assertEquals(1, actualSeggregateBillOnTenantIdResult.size());
        assertEquals(1, actualSeggregateBillOnTenantIdResult.get("42").size());
        verify(bill, atLeast(1)).getTenantId();
    }
}

