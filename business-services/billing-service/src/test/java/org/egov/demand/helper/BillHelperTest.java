package org.egov.demand.helper;

import org.egov.demand.model.Bill;
import org.egov.demand.model.BillDetail;
import org.egov.demand.util.SequenceGenService;
import org.egov.demand.web.contract.BillRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;


@ExtendWith(SpringExtension.class)
@SpringBootTest
public class BillHelperTest {

    @MockBean
    private SequenceGenService sequenceGenService;

    @Autowired
    private BillHelper billHelper;

    @Test
    @DisplayName("Should set the bill id when the bill is not null")
    public void testGetBillRequestWithIdsWhenBillIsNotNullThenSetTheBillId() {
        BillRequest billRequest = new BillRequest();

        when(sequenceGenService.getIds(anyInt(), anyString())).thenReturn(Arrays.asList("1"));

        billHelper.getBillRequestWithIds(billRequest);


    }

    @Test
    @DisplayName("Should set the bill detail id when the bill detail is not null")
    public void testGetBillRequestWithIdsWhenBillDetailIsNotNullThenSetTheBillDetailId() {
        BillRequest billRequest = new BillRequest();
        when(sequenceGenService.getIds(anyInt(), anyString())).thenReturn(Arrays.asList("1", "2", "3"));

        billHelper.getBillRequestWithIds(billRequest);


    }

    @Test
    @DisplayName("Should set the bill detail id when the bill detail is not null")
    public void testGetBillRequestWithIdsWhenBillDetailIsNotNullThenSetTheBillDetailId1() {

        BillRequest billRequest = new BillRequest();
        Bill bill = new Bill();
        BillDetail billDetail = new BillDetail();
        bill.addBillDetailsItem(billDetail);

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
    public void testGetBillRequestWithIdsWhenBillIsNotNullThenSetTheBillIds() {

        BillRequest billRequest = new BillRequest();
        Bill bill = new Bill();

        billRequest.getBills();

        List<String> ids = Arrays.asList("1");
        when(sequenceGenService.getIds(1, "billSeqName"))
                .thenReturn(ids);

        billHelper.getBillRequestWithIds(billRequest);

        assertEquals(null, bill.getId());
    }
}

