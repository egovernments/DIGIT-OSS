package org.egov.demand.service;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.HashSet;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.AuditDetail;
import org.egov.demand.model.Bill;
import org.egov.demand.model.BillAccountDetail;
import org.egov.demand.model.BillDetail;
import org.egov.demand.model.Demand;
import org.egov.demand.model.DemandDetail;

import org.egov.demand.web.contract.BillRequest;
import org.egov.demand.web.contract.DemandResponse;
import org.egov.demand.web.contract.Receipt;
import org.egov.demand.web.contract.ReceiptRequest;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {ReceiptService.class})
@ExtendWith(SpringExtension.class)
class ReceiptServiceTest {
    @MockBean
    private DemandService demandService;

    @Autowired
    private ReceiptService receiptService;

    /**
     * Method under test: {@link ReceiptService#updateDemandFromReceipt(ReceiptRequest, BillDetail.StatusEnum, Boolean)}
     */
    @Test
    void testUpdateDemandFromReceipt() {
        ReceiptRequest receiptRequest = mock(ReceiptRequest.class);
        when(receiptRequest.getReceipt()).thenReturn(new ArrayList<>());
        this.receiptService.updateDemandFromReceipt(receiptRequest, BillDetail.StatusEnum.CREATED, true);
        verify(receiptRequest).getReceipt();
    }

    /**
     * Method under test: {@link ReceiptService#updateDemandFromReceipt(ReceiptRequest, BillDetail.StatusEnum, Boolean)}
     */
    @Test
    void testUpdateDemandFromReceipt2() {
        ArrayList<Receipt> receiptList = new ArrayList<>();
        receiptList.add(new Receipt());
        ReceiptRequest receiptRequest = mock(ReceiptRequest.class);
        when(receiptRequest.getReceipt()).thenReturn(receiptList);
        this.receiptService.updateDemandFromReceipt(receiptRequest, BillDetail.StatusEnum.CREATED, true);
        verify(receiptRequest, atLeast(1)).getReceipt();
    }

    /**
     * Method under test: {@link ReceiptService#updateDemandFromReceipt(ReceiptRequest, BillDetail.StatusEnum, Boolean)}
     */
    @Test
    void testUpdateDemandFromReceipt3() {
        ReceiptRequest receiptRequest = mock(ReceiptRequest.class);
        when(receiptRequest.getReceipt()).thenReturn(new ArrayList<>());
        this.receiptService.updateDemandFromReceipt(receiptRequest, BillDetail.StatusEnum.CANCELLED, true);
        verify(receiptRequest).getReceipt();
    }

    /**
     * Method under test: {@link ReceiptService#updateDemandFromReceipt(ReceiptRequest, BillDetail.StatusEnum, Boolean)}
     */
    @Test
    void testUpdateDemandFromReceipt4() {
        ReceiptRequest receiptRequest = mock(ReceiptRequest.class);
        when(receiptRequest.getReceipt()).thenReturn(new ArrayList<>());
        this.receiptService.updateDemandFromReceipt(receiptRequest, BillDetail.StatusEnum.INSTRUMENT_BOUNCED, true);
        verify(receiptRequest).getReceipt();
    }

    /**
     * Method under test: {@link ReceiptService#updateDemandFromReceipt(ReceiptRequest, BillDetail.StatusEnum, Boolean)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateDemandFromReceipt5() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.service.ReceiptService.updateDemandFromReceipt(ReceiptService.java:43)
        //   In order to prevent updateDemandFromReceipt(ReceiptRequest, StatusEnum, Boolean)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromReceipt(ReceiptRequest, StatusEnum, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        ArrayList<Receipt> receiptList = new ArrayList<>();
        receiptList.add(null);
        ReceiptRequest receiptRequest = mock(ReceiptRequest.class);
        when(receiptRequest.getReceipt()).thenReturn(receiptList);
        this.receiptService.updateDemandFromReceipt(receiptRequest, BillDetail.StatusEnum.CREATED, true);
    }

    /**
     * Method under test: {@link ReceiptService#updateDemandFromReceipt(ReceiptRequest, BillDetail.StatusEnum, Boolean)}
     */
    @Test
    void testUpdateDemandFromReceipt6() {
        when(this.demandService.getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(new ArrayList<>());
        when(this.demandService.updateAsync((org.egov.demand.web.contract.DemandRequest) any(),
                (org.egov.demand.model.PaymentBackUpdateAudit) any())).thenReturn(new DemandResponse());

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(new Bill());
        Receipt e = new Receipt("42", "42", "42", billList, new AuditDetail(), 123L);

        ArrayList<Receipt> receiptList = new ArrayList<>();
        receiptList.add(e);
        ReceiptRequest receiptRequest = mock(ReceiptRequest.class);
        when(receiptRequest.getRequestInfo()).thenReturn(new RequestInfo());
        when(receiptRequest.getReceipt()).thenReturn(receiptList);
        this.receiptService.updateDemandFromReceipt(receiptRequest, BillDetail.StatusEnum.CREATED, true);
        verify(this.demandService).getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any());
        verify(this.demandService).updateAsync((org.egov.demand.web.contract.DemandRequest) any(),
                (org.egov.demand.model.PaymentBackUpdateAudit) any());
        verify(receiptRequest, atLeast(1)).getReceipt();
        verify(receiptRequest).getRequestInfo();
    }

    /**
     * Method under test: {@link ReceiptService#updateDemandFromReceipt(ReceiptRequest, BillDetail.StatusEnum, Boolean)}
     */
    @Test
    void testUpdateDemandFromReceipt7() {
        when(this.demandService.getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(new ArrayList<>());
        when(this.demandService.updateAsync((org.egov.demand.web.contract.DemandRequest) any(),
                (org.egov.demand.model.PaymentBackUpdateAudit) any())).thenReturn(new DemandResponse());

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(new Bill());
        billList.add(new Bill());
        Receipt e = new Receipt("42", "42", "42", billList, new AuditDetail(), 123L);

        ArrayList<Receipt> receiptList = new ArrayList<>();
        receiptList.add(e);
        ReceiptRequest receiptRequest = mock(ReceiptRequest.class);
        when(receiptRequest.getRequestInfo()).thenReturn(new RequestInfo());
        when(receiptRequest.getReceipt()).thenReturn(receiptList);
        this.receiptService.updateDemandFromReceipt(receiptRequest, BillDetail.StatusEnum.CREATED, true);
        verify(this.demandService).getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any());
        verify(this.demandService).updateAsync((org.egov.demand.web.contract.DemandRequest) any(),
                (org.egov.demand.model.PaymentBackUpdateAudit) any());
        verify(receiptRequest, atLeast(1)).getReceipt();
        verify(receiptRequest).getRequestInfo();
    }

    /**
     * Method under test: {@link ReceiptService#updateDemandFromReceipt(ReceiptRequest, BillDetail.StatusEnum, Boolean)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateDemandFromReceipt8() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.service.ReceiptService.lambda$updateDemandFromReceipt$1(ReceiptService.java:52)
        //       at java.util.ArrayList.forEach(ArrayList.java:1541)
        //       at org.egov.demand.service.ReceiptService.updateDemandFromReceipt(ReceiptService.java:52)
        //   In order to prevent updateDemandFromReceipt(ReceiptRequest, StatusEnum, Boolean)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromReceipt(ReceiptRequest, StatusEnum, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.demandService.getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(new ArrayList<>());
        when(this.demandService.updateAsync((org.egov.demand.web.contract.DemandRequest) any(),
                (org.egov.demand.model.PaymentBackUpdateAudit) any())).thenReturn(new DemandResponse());

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(null);
        Receipt e = new Receipt("42", "42", "42", billList, new AuditDetail(), 123L);

        ArrayList<Receipt> receiptList = new ArrayList<>();
        receiptList.add(e);
        ReceiptRequest receiptRequest = mock(ReceiptRequest.class);
        when(receiptRequest.getRequestInfo()).thenReturn(new RequestInfo());
        when(receiptRequest.getReceipt()).thenReturn(receiptList);
        this.receiptService.updateDemandFromReceipt(receiptRequest, BillDetail.StatusEnum.CREATED, true);
    }

    /**
     * Method under test: {@link ReceiptService#updateDemandFromReceipt(ReceiptRequest, BillDetail.StatusEnum, Boolean)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateDemandFromReceipt9() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.service.ReceiptService.updateDemandFromBillDetail(ReceiptService.java:99)
        //       at org.egov.demand.service.ReceiptService.updateDemandFromBill(ReceiptService.java:84)
        //       at org.egov.demand.service.ReceiptService.updateDemandFromReceipt(ReceiptService.java:59)
        //   In order to prevent updateDemandFromReceipt(ReceiptRequest, StatusEnum, Boolean)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromReceipt(ReceiptRequest, StatusEnum, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.demandService.getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(new ArrayList<>());
        when(this.demandService.updateAsync((org.egov.demand.web.contract.DemandRequest) any(),
                (org.egov.demand.model.PaymentBackUpdateAudit) any())).thenReturn(new DemandResponse());

        Bill bill = new Bill();
        bill.addBillDetailsItem(new BillDetail());

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(bill);
        Receipt e = new Receipt("42", "42", "42", billList, new AuditDetail(), 123L);

        ArrayList<Receipt> receiptList = new ArrayList<>();
        receiptList.add(e);
        ReceiptRequest receiptRequest = mock(ReceiptRequest.class);
        when(receiptRequest.getRequestInfo()).thenReturn(new RequestInfo());
        when(receiptRequest.getReceipt()).thenReturn(receiptList);
        this.receiptService.updateDemandFromReceipt(receiptRequest, BillDetail.StatusEnum.CREATED, true);
    }

    /**
     * Method under test: {@link ReceiptService#updateDemandFromReceipt(ReceiptRequest, BillDetail.StatusEnum, Boolean)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateDemandFromReceipt10() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.service.ReceiptService.updateDemandFromBillDetail(ReceiptService.java:99)
        //       at org.egov.demand.service.ReceiptService.updateDemandFromBill(ReceiptService.java:84)
        //       at org.egov.demand.service.ReceiptService.updateDemandFromReceipt(ReceiptService.java:59)
        //   In order to prevent updateDemandFromReceipt(ReceiptRequest, StatusEnum, Boolean)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromReceipt(ReceiptRequest, StatusEnum, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.demandService.getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(new ArrayList<>());
        when(this.demandService.updateAsync((org.egov.demand.web.contract.DemandRequest) any(),
                (org.egov.demand.model.PaymentBackUpdateAudit) any())).thenReturn(new DemandResponse());

        Bill bill = new Bill();
        bill.addBillDetailsItem(new BillDetail());
        bill.addBillDetailsItem(new BillDetail());

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(bill);
        Receipt e = new Receipt("42", "42", "42", billList, new AuditDetail(), 123L);

        ArrayList<Receipt> receiptList = new ArrayList<>();
        receiptList.add(e);
        ReceiptRequest receiptRequest = mock(ReceiptRequest.class);
        when(receiptRequest.getRequestInfo()).thenReturn(new RequestInfo());
        when(receiptRequest.getReceipt()).thenReturn(receiptList);
        this.receiptService.updateDemandFromReceipt(receiptRequest, BillDetail.StatusEnum.CREATED, true);
    }

    /**
     * Method under test: {@link ReceiptService#updateDemandFromBill(BillRequest, java.util.Set, Boolean)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateDemandFromBill() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.IndexOutOfBoundsException: Index 0 out of bounds for length 0
        //       at jdk.internal.util.Preconditions.outOfBounds(Preconditions.java:64)
        //       at jdk.internal.util.Preconditions.outOfBoundsCheckIndex(Preconditions.java:70)
        //       at jdk.internal.util.Preconditions.checkIndex(Preconditions.java:248)
        //       at java.util.Objects.checkIndex(Objects.java:372)
        //       at java.util.ArrayList.get(ArrayList.java:459)
        //       at org.egov.demand.service.ReceiptService.updateDemandFromBill(ReceiptService.java:73)
        //   In order to prevent updateDemandFromBill(BillRequest, Set, Boolean)
        //   from throwing IndexOutOfBoundsException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromBill(BillRequest, Set, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        BillRequest billRequest = new BillRequest();
        this.receiptService.updateDemandFromBill(billRequest, new HashSet<>(), true);
    }

    /**
     * Method under test: {@link ReceiptService#updateDemandFromBill(BillRequest, java.util.Set, Boolean)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateDemandFromBill2() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.service.ReceiptService.updateDemandFromBill(ReceiptService.java:72)
        //   In order to prevent updateDemandFromBill(BillRequest, Set, Boolean)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromBill(BillRequest, Set, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        this.receiptService.updateDemandFromBill(null, new HashSet<>(), true);
    }

    /**
     * Method under test: {@link ReceiptService#updateDemandFromBill(BillRequest, java.util.Set, Boolean)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateDemandFromBill3() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.IndexOutOfBoundsException: Index 0 out of bounds for length 0
        //       at jdk.internal.util.Preconditions.outOfBounds(Preconditions.java:64)
        //       at jdk.internal.util.Preconditions.outOfBoundsCheckIndex(Preconditions.java:70)
        //       at jdk.internal.util.Preconditions.checkIndex(Preconditions.java:248)
        //       at java.util.Objects.checkIndex(Objects.java:372)
        //       at java.util.ArrayList.get(ArrayList.java:459)
        //       at org.egov.demand.service.ReceiptService.updateDemandFromBill(ReceiptService.java:73)
        //   In order to prevent updateDemandFromBill(BillRequest, Set, Boolean)
        //   from throwing IndexOutOfBoundsException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromBill(BillRequest, Set, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getBills()).thenReturn(new ArrayList<>());
        this.receiptService.updateDemandFromBill(billRequest, new HashSet<>(), true);
    }

    /**
     * Method under test: {@link ReceiptService#updateDemandFromBill(BillRequest, java.util.Set, Boolean)}
     */
    @Test
    void testUpdateDemandFromBill4() {
        when(this.demandService.getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(new ArrayList<>());
        when(this.demandService.updateAsync((org.egov.demand.web.contract.DemandRequest) any(),
                (org.egov.demand.model.PaymentBackUpdateAudit) any())).thenReturn(new DemandResponse());

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(new Bill());
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequest.getBills()).thenReturn(billList);
        this.receiptService.updateDemandFromBill(billRequest, new HashSet<>(), true);
        verify(this.demandService).getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any());
        verify(this.demandService).updateAsync((org.egov.demand.web.contract.DemandRequest) any(),
                (org.egov.demand.model.PaymentBackUpdateAudit) any());
        verify(billRequest).getBills();
        verify(billRequest, atLeast(1)).getRequestInfo();
    }

    /**
     * Method under test: {@link ReceiptService#updateDemandFromBill(BillRequest, java.util.Set, Boolean)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateDemandFromBill5() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.service.ReceiptService.updateDemandFromBill(ReceiptService.java:73)
        //   In order to prevent updateDemandFromBill(BillRequest, Set, Boolean)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromBill(BillRequest, Set, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.demandService.getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(new ArrayList<>());
        when(this.demandService.updateAsync((org.egov.demand.web.contract.DemandRequest) any(),
                (org.egov.demand.model.PaymentBackUpdateAudit) any())).thenReturn(new DemandResponse());

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(null);
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequest.getBills()).thenReturn(billList);
        this.receiptService.updateDemandFromBill(billRequest, new HashSet<>(), true);
    }

    /**
     * Method under test: {@link ReceiptService#updateDemandFromBill(BillRequest, java.util.Set, Boolean)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateDemandFromBill6() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.service.ReceiptService.updateDemandFromBillDetail(ReceiptService.java:99)
        //       at org.egov.demand.service.ReceiptService.updateDemandFromBill(ReceiptService.java:84)
        //   In order to prevent updateDemandFromBill(BillRequest, Set, Boolean)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromBill(BillRequest, Set, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.demandService.getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(new ArrayList<>());
        when(this.demandService.updateAsync((org.egov.demand.web.contract.DemandRequest) any(),
                (org.egov.demand.model.PaymentBackUpdateAudit) any())).thenReturn(new DemandResponse());

        Bill bill = new Bill();
        bill.addBillDetailsItem(new BillDetail());

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(bill);
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequest.getBills()).thenReturn(billList);
        this.receiptService.updateDemandFromBill(billRequest, new HashSet<>(), true);
    }

    /**
     * Method under test: {@link ReceiptService#updateDemandFromBill(BillRequest, java.util.Set, Boolean)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateDemandFromBill7() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.service.ReceiptService.updateDemandFromBill(ReceiptService.java:83)
        //   In order to prevent updateDemandFromBill(BillRequest, Set, Boolean)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromBill(BillRequest, Set, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.demandService.getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(new ArrayList<>());
        when(this.demandService.updateAsync((org.egov.demand.web.contract.DemandRequest) any(),
                (org.egov.demand.model.PaymentBackUpdateAudit) any())).thenReturn(new DemandResponse());

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(new Bill());
        billList.add(null);
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequest.getBills()).thenReturn(billList);
        this.receiptService.updateDemandFromBill(billRequest, new HashSet<>(), true);
    }

    /**
     * Method under test: {@link ReceiptService#updateDemandFromBill(BillRequest, java.util.Set, Boolean)}
     */
    @Test
    void testUpdateDemandFromBill8() {
        ArrayList<Demand> demandList = new ArrayList<>();
        demandList.add(new Demand());
        when(this.demandService.getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(demandList);
        when(this.demandService.updateAsync((org.egov.demand.web.contract.DemandRequest) any(),
                (org.egov.demand.model.PaymentBackUpdateAudit) any())).thenReturn(new DemandResponse());

        Bill bill = new Bill();
        bill.addBillDetailsItem(new BillDetail());

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(bill);
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequest.getBills()).thenReturn(billList);
        this.receiptService.updateDemandFromBill(billRequest, new HashSet<>(), true);
        verify(this.demandService).getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any());
        verify(this.demandService).updateAsync((org.egov.demand.web.contract.DemandRequest) any(),
                (org.egov.demand.model.PaymentBackUpdateAudit) any());
        verify(billRequest).getBills();
        verify(billRequest, atLeast(1)).getRequestInfo();
    }

    /**
     * Method under test: {@link ReceiptService#updateDemandFromBill(BillRequest, java.util.Set, Boolean)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateDemandFromBill9() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.IllegalStateException: Duplicate key null (attempted merging values Demand(id=null, tenantId=null, consumerCode=null, consumerType=null, businessService=null, payer=null, taxPeriodFrom=null, taxPeriodTo=null, demandDetails=[], auditDetails=null, fixedBillExpiryDate=null, billExpiryTime=null, additionalDetails=null, minimumAmountPayable=0, isPaymentCompleted=false, status=null) and Demand(id=null, tenantId=null, consumerCode=null, consumerType=null, businessService=null, payer=null, taxPeriodFrom=null, taxPeriodTo=null, demandDetails=[], auditDetails=null, fixedBillExpiryDate=null, billExpiryTime=null, additionalDetails=null, minimumAmountPayable=0, isPaymentCompleted=false, status=null))
        //       at java.util.stream.Collectors.duplicateKeyException(Collectors.java:133)
        //       at java.util.stream.Collectors.lambda$uniqKeysMapAccumulator$1(Collectors.java:180)
        //       at java.util.stream.ReduceOps$3ReducingSink.accept(ReduceOps.java:169)
        //       at java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1655)
        //       at java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:484)
        //       at java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:474)
        //       at java.util.stream.ReduceOps$ReduceOp.evaluateSequential(ReduceOps.java:913)
        //       at java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
        //       at java.util.stream.ReferencePipeline.collect(ReferencePipeline.java:578)
        //       at org.egov.demand.service.ReceiptService.updateDemandFromBill(ReceiptService.java:79)
        //   In order to prevent updateDemandFromBill(BillRequest, Set, Boolean)
        //   from throwing IllegalStateException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromBill(BillRequest, Set, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        ArrayList<Demand> demandList = new ArrayList<>();
        demandList.add(new Demand());
        demandList.add(new Demand());
        when(this.demandService.getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(demandList);
        when(this.demandService.updateAsync((org.egov.demand.web.contract.DemandRequest) any(),
                (org.egov.demand.model.PaymentBackUpdateAudit) any())).thenReturn(new DemandResponse());

        Bill bill = new Bill();
        bill.addBillDetailsItem(new BillDetail());

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(bill);
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequest.getBills()).thenReturn(billList);
        this.receiptService.updateDemandFromBill(billRequest, new HashSet<>(), true);
    }

    /**
     * Method under test: {@link ReceiptService#updateDemandFromBill(BillRequest, java.util.Set, Boolean)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateDemandFromBill10() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.service.ReceiptService.updateDemandFromBill(ReceiptService.java:84)
        //   In order to prevent updateDemandFromBill(BillRequest, Set, Boolean)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromBill(BillRequest, Set, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.demandService.getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(new ArrayList<>());
        when(this.demandService.updateAsync((org.egov.demand.web.contract.DemandRequest) any(),
                (org.egov.demand.model.PaymentBackUpdateAudit) any())).thenReturn(new DemandResponse());

        Bill bill = new Bill();
        bill.addBillDetailsItem(null);

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(bill);
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequest.getBills()).thenReturn(billList);
        this.receiptService.updateDemandFromBill(billRequest, new HashSet<>(), true);
    }

    /**
     * Method under test: {@link ReceiptService#updateDemandFromBill(BillRequest, java.util.Set, Boolean)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateDemandFromBill11() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException: element cannot be mapped to a null key
        //       at java.util.Objects.requireNonNull(Objects.java:246)
        //       at java.util.stream.Collectors.lambda$groupingBy$53(Collectors.java:1134)
        //       at java.util.stream.ReduceOps$3ReducingSink.accept(ReduceOps.java:169)
        //       at java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1655)
        //       at java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:484)
        //       at java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:474)
        //       at java.util.stream.ReduceOps$ReduceOp.evaluateSequential(ReduceOps.java:913)
        //       at java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
        //       at java.util.stream.ReferencePipeline.collect(ReferencePipeline.java:578)
        //       at org.egov.demand.service.ReceiptService.updateDemandFromBillDetail(ReceiptService.java:100)
        //       at org.egov.demand.service.ReceiptService.updateDemandFromBill(ReceiptService.java:84)
        //   In order to prevent updateDemandFromBill(BillRequest, Set, Boolean)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromBill(BillRequest, Set, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        Demand demand = new Demand();
        demand.addDemandDetailsItem(new DemandDetail());

        ArrayList<Demand> demandList = new ArrayList<>();
        demandList.add(demand);
        when(this.demandService.getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(demandList);
        when(this.demandService.updateAsync((org.egov.demand.web.contract.DemandRequest) any(),
                (org.egov.demand.model.PaymentBackUpdateAudit) any())).thenReturn(new DemandResponse());

        Bill bill = new Bill();
        bill.addBillDetailsItem(new BillDetail());

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(bill);
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequest.getBills()).thenReturn(billList);
        this.receiptService.updateDemandFromBill(billRequest, new HashSet<>(), true);
    }

    /**
     * Method under test: {@link ReceiptService#updateDemandFromBill(BillRequest, java.util.Set, Boolean)}
     */
    @Test
    void testUpdateDemandFromBill12() {
        ArrayList<Demand> demandList = new ArrayList<>();
        demandList.add(new Demand());
        when(this.demandService.getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(demandList);
        when(this.demandService.updateAsync((org.egov.demand.web.contract.DemandRequest) any(),
                (org.egov.demand.model.PaymentBackUpdateAudit) any())).thenReturn(new DemandResponse());

        BillDetail billDetail = new BillDetail();
        billDetail.addBillAccountDetailsItem(new BillAccountDetail());

        Bill bill = new Bill();
        bill.addBillDetailsItem(billDetail);

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(bill);
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequest.getBills()).thenReturn(billList);
        this.receiptService.updateDemandFromBill(billRequest, new HashSet<>(), true);
        verify(this.demandService).getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any());
        verify(this.demandService).updateAsync((org.egov.demand.web.contract.DemandRequest) any(),
                (org.egov.demand.model.PaymentBackUpdateAudit) any());
        verify(billRequest).getBills();
        verify(billRequest, atLeast(1)).getRequestInfo();
    }

    /**
     * Method under test: {@link ReceiptService#updateDemandFromBill(BillRequest, java.util.Set, Boolean)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateDemandFromBill13() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.IllegalStateException: Duplicate key null (attempted merging values Demand(id=null, tenantId=null, consumerCode=null, consumerType=null, businessService=null, payer=null, taxPeriodFrom=null, taxPeriodTo=null, demandDetails=[DemandDetail(id=null, demandId=null, taxHeadMasterCode=null, taxAmount=null, collectionAmount=0, additionalDetails=null, auditDetails=null, tenantId=null)], auditDetails=null, fixedBillExpiryDate=null, billExpiryTime=null, additionalDetails=null, minimumAmountPayable=0, isPaymentCompleted=false, status=null) and Demand(id=null, tenantId=null, consumerCode=null, consumerType=null, businessService=null, payer=null, taxPeriodFrom=null, taxPeriodTo=null, demandDetails=[], auditDetails=null, fixedBillExpiryDate=null, billExpiryTime=null, additionalDetails=null, minimumAmountPayable=0, isPaymentCompleted=false, status=null))
        //       at java.util.stream.Collectors.duplicateKeyException(Collectors.java:133)
        //       at java.util.stream.Collectors.lambda$uniqKeysMapAccumulator$1(Collectors.java:180)
        //       at java.util.stream.ReduceOps$3ReducingSink.accept(ReduceOps.java:169)
        //       at java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1655)
        //       at java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:484)
        //       at java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:474)
        //       at java.util.stream.ReduceOps$ReduceOp.evaluateSequential(ReduceOps.java:913)
        //       at java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
        //       at java.util.stream.ReferencePipeline.collect(ReferencePipeline.java:578)
        //       at org.egov.demand.service.ReceiptService.updateDemandFromBill(ReceiptService.java:79)
        //   In order to prevent updateDemandFromBill(BillRequest, Set, Boolean)
        //   from throwing IllegalStateException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromBill(BillRequest, Set, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        Demand demand = new Demand();
        demand.addDemandDetailsItem(new DemandDetail());

        ArrayList<Demand> demandList = new ArrayList<>();
        demandList.add(demand);
        demandList.add(new Demand());
        when(this.demandService.getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(demandList);
        when(this.demandService.updateAsync((org.egov.demand.web.contract.DemandRequest) any(),
                (org.egov.demand.model.PaymentBackUpdateAudit) any())).thenReturn(new DemandResponse());

        Bill bill = new Bill();
        bill.addBillDetailsItem(new BillDetail());

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(bill);
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequest.getBills()).thenReturn(billList);
        this.receiptService.updateDemandFromBill(billRequest, new HashSet<>(), true);
    }
}

