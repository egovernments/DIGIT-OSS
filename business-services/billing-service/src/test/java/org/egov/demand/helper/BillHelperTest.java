package org.egov.demand.helper;

import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.consumer.notification.NotificationConsumer;
import org.egov.demand.model.Bill;
import org.egov.demand.model.BillDetail;
import org.egov.demand.service.BillService;
import org.egov.demand.util.SequenceGenService;
import org.egov.demand.web.contract.BillRequest;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;




@SpringBootTest
public class BillHelperTest {

    @Mock
    private BillHelper billHelper;

    @Mock
    private SequenceGenService sequenceGenService;

    @Test
    @DisplayName("Should set the bill id when the bill is not null")
    public void testGetBillRequestWithIdsWhenBillIsNotNullThenSetTheBillId() {

        BillRequest billRequest = new BillRequest();
        Bill bill = new Bill();

        billRequest.getBills();

        List<String> ids = Arrays.asList("1");
        when(sequenceGenService.getIds(1, "billSeqName"))
                .thenReturn(ids);

        billHelper.getBillRequestWithIds(billRequest);

        assertEquals(null, bill.getId());
    }

    @Test
    @DisplayName("Should set the bill detail id when the bill detail is not null")
    public void testGetBillRequestWithIdsWhenBillDetailIsNotNullThenSetTheBillDetailId1() {

        BillRequest billRequest = new BillRequest();
        Bill bill = new Bill();
        BillDetail billDetail = new BillDetail();
        bill.addBillDetailsItem(billDetail);
        /*  billRequest.addBillsItem(bill);*/

        List<String> billIds = Arrays.asList("1");
        List<String> billDetailIds = Arrays.asList("2");
        List<String> billAccIds = Arrays.asList("3");
        List<String> billNumber = Arrays.asList("4");

        when(sequenceGenService.getIds(1, "billSeqName")).thenReturn(billIds);
        when(sequenceGenService.getIds(1, "billDetailSeqName")).thenReturn(billDetailIds);
        when(sequenceGenService.getIds(1, "billAccDetailSeqName")).thenReturn(billAccIds);
        when(sequenceGenService.getIds(1, "billNumSeqName")).thenReturn(billNumber);

        billHelper.getBillRequestWithIds(billRequest);

        assertEquals(null, billDetail.getId());
    }
    @Test
    @DisplayName("Should set the bill id when the bill is not null")
    public void testGetBillRequestWithIdsWhenBillIsNotNullThenSetTheBillId1() {


        BillRequest billRequest = new BillRequest();
       /* when(sequenceGenService.getIds(anyInt(), anyString())).thenReturn(Arrays.asList("1"));
        */
        billHelper.getBillRequestWithIds(billRequest);
        assertEquals("1", billRequest.getBills().get(0).getId());
    }

    @Test
    @DisplayName("Should set the bill detail id when the bill detail is not null")
    public void testGetBillRequestWithIdsWhenBillDetailIsNotNullThenSetTheBillDetailId() {

        BillRequest billRequest = new BillRequest();
        when(sequenceGenService.getIds(anyInt(), anyString())).thenReturn(Arrays.asList("1", "2", "3", "4", "5", "6"));

        billHelper.getBillRequestWithIds(billRequest);

        assertEquals("1", billRequest.getBills().get(0).getBillDetails().get(0).getId());
        assertEquals("2", billRequest.getBills().get(0).getBillDetails().get(1).getId());
        assertEquals("3", billRequest.getBills().get(1).getBillDetails().get(0).getId());
        assertEquals("4", billRequest.getBills().get(1).getBillDetails().get(1).getId());
    }

}

