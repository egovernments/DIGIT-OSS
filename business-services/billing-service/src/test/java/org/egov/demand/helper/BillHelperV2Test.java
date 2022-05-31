package org.egov.demand.helper;

import org.egov.demand.model.BillAccountDetailV2;
import org.egov.demand.model.BillDetailV2;
import org.egov.demand.model.BillV2;
import org.egov.demand.web.contract.BillRequestV2;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class BillHelperV2Test {

    @Mock
    private BillHelperV2 billHelperV2;

    @Test
    @DisplayName("Should set the ids for all the bills, billDetails and accountDetails")
    public void testGetBillRequestWithIdsShouldSetTheIdsForAllTheBillsBillDetailsAndAccountDetails() {

        BillRequestV2 billRequest = BillRequestV2.builder()
                .bills(Arrays.asList(
                        BillV2.builder()
                                .billDetails(Arrays.asList(
                                        BillDetailV2.builder()
                                                .billAccountDetails(Arrays.asList(
                                                        BillAccountDetailV2.builder().build(),
                                                        BillAccountDetailV2.builder().build()))
                                                .build(),
                                        BillDetailV2.builder()
                                                .billAccountDetails(Arrays.asList(
                                                        BillAccountDetailV2.builder().build(),
                                                        BillAccountDetailV2.builder().build()))
                                                .build()))
                                .build(),
                        BillV2.builder()
                                .billDetails(Arrays.asList(
                                        BillDetailV2.builder()
                                                .billAccountDetails(Arrays.asList(
                                                        BillAccountDetailV2.builder().build(),
                                                        BillAccountDetailV2.builder().build()))
                                                .build(),
                                        BillDetailV2.builder()
                                                .billAccountDetails(Arrays.asList(
                                                        BillAccountDetailV2.builder().build(),
                                                        BillAccountDetailV2.builder().build()))
                                                .build()))
                                .build()))
                .build();

        billHelperV2.getBillRequestWithIds(billRequest);

        assertNotNull(billRequest);

        List<BillV2> bills = billRequest.getBills();

        assertNotNull(bills);

        for (BillV2 bill : bills) {

            assertNotNull(bill);

            assertNotNull("1",bill.getId());

            assertNotNull("12",bill.getBillNumber());

            List<BillDetailV2> billDetails = bill.getBillDetails();

            assertNotNull(billDetails);

            for (BillDetailV2 billDetail : billDetails) {

                assertNotNull(billDetail);

                assertNotNull("43",billDetail.getId());

                assertNotNull("43",billDetail.getBillId());

                assertNotNull("43",billDetail.getTenantId());

                List<BillAccountDetailV2> accountDetails = billDetail.getBillAccountDetails();

                assertNotNull(accountDetails);

                for (BillAccountDetailV2 accountDetail : accountDetails) {

                    assertNotNull(accountDetail);

                    assertNotNull("43",accountDetail.getId());

                    assertNotNull("43",accountDetail.getBillDetailId());

                    assertNotNull("43",accountDetail.getTenantId());
                }
            }
        }
    }

}

