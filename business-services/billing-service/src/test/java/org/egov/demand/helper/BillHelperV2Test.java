package org.egov.demand.helper;

import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.model.BillAccountDetailV2;
import org.egov.demand.model.BillDetailV2;
import org.egov.demand.model.BillV2;
import org.egov.demand.util.SequenceGenService;
import org.egov.demand.web.contract.BillRequestV2;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@SpringBootTest
public class BillHelperV2Test {

    @MockBean
    private SequenceGenService sequenceGenService;

    @MockBean
    private ApplicationProperties applicationProperties;

    @Autowired
    private BillHelperV2 billHelperV2;

    @Test
    @DisplayName("Should set the ids for all the bills, billDetails and accountDetails")
    public void testGetBillRequestWithIdsShouldSetTheIdsForAllTheBillsBillDetailsAndAccountDetails() {
        BillRequestV2 billRequest = new BillRequestV2();
        BillV2 bill = new BillV2();
        BillDetailV2 billDetail = new BillDetailV2();
        List<BillV2> bills = billRequest.getBills();
        BillAccountDetailV2 billAccountDetail = new BillAccountDetailV2();
        billDetail.addBillAccountDetailsItem(billAccountDetail);
        bill.addBillDetailsItem(billDetail);
        billRequest.setBills(bills);

        when(sequenceGenService.getIds(anyInt(), anyString()))
                .thenReturn(Collections.singletonList("billNumber"));

        when(applicationProperties.getBillNumSeqName()).thenReturn("billNumSeqName");

        billHelperV2.getBillRequestWithIds(billRequest);
    }

}

