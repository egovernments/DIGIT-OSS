package org.egov.demand.helper;

import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.model.Bill;
import org.egov.demand.model.BillDetail;
import org.egov.demand.util.SequenceGenService;
import org.egov.demand.web.contract.BillRequest;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;


class BillHelperTest {
    @Mock
    private Boolean aBoolean;

    @Autowired
    private BillHelper billHelper;

    @Mock
    private SequenceGenService sequenceGenService;

    @Test
    @DisplayName("Should set the bill id when the bill is not null")
    public void testGetBillRequestWithIdsWhenBillIsNotNullThenSetTheBillId() {

        BillRequest billRequest = new BillRequest();
        Bill bill = new Bill();
        bill.setTenantId("default");

        billRequest.getBills();

        List<String> billIds = new ArrayList<>();
        billIds.add("1");

        when(sequenceGenService.getIds(1, "bill_seq"))
                .thenReturn(billIds);

        billHelper.getBillRequestWithIds(billRequest);

        assertEquals("1", billRequest.getBills().get(0).getId());
    }

    @Test
    @DisplayName("Should set the bill detail id when the bill detail is not null")
    public void testGetBillRequestWithIdsWhenBillDetailIsNotNullThenSetTheBillDetailId() {

        BillRequest billRequest = new BillRequest();
        Bill bill = new Bill();
        bill.setTenantId("default");
        BillDetail billDetail = new BillDetail();
        billDetail.setTenantId("default");
        bill.addBillDetailsItem(billDetail);
        billRequest.getBills();

        when(sequenceGenService.getIds(1, "bill_seq"))
                .thenReturn(Collections.singletonList("bill-id"));
        when(sequenceGenService.getIds(1, "billdetail_seq"))
                .thenReturn(Collections.singletonList("bill-detail-id"));
        when(sequenceGenService.getIds(1, "billnumber_seq"))
                .thenReturn(Collections.singletonList("bill-number"));

        billHelper.getBillRequestWithIds(billRequest);

        assertEquals("bill-id", billRequest.getBills().get(0).getId());
        assertEquals("bill-detail-id", billRequest.getBills().get(0).getBillDetails().get(0).getId());
        assertEquals("bill-number", billRequest.getBills().get(0).getBillDetails().get(0).getBillNumber());
    }


}

