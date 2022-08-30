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


    @Test
    void testUpdateDemandFromReceipt() {
        ReceiptRequest receiptRequest = mock(ReceiptRequest.class);
        when(receiptRequest.getReceipt()).thenReturn(new ArrayList<>());
        this.receiptService.updateDemandFromReceipt(receiptRequest, BillDetail.StatusEnum.CREATED, true);
        verify(receiptRequest).getReceipt();
    }


    @Test
    void testUpdateDemandFromReceipt2() {
        ArrayList<Receipt> receiptList = new ArrayList<>();
        receiptList.add(new Receipt());
        ReceiptRequest receiptRequest = mock(ReceiptRequest.class);
        when(receiptRequest.getReceipt()).thenReturn(receiptList);
        this.receiptService.updateDemandFromReceipt(receiptRequest, BillDetail.StatusEnum.CREATED, true);
        verify(receiptRequest, atLeast(1)).getReceipt();
    }


    @Test
    void testUpdateDemandFromReceipt3() {
        ReceiptRequest receiptRequest = mock(ReceiptRequest.class);
        when(receiptRequest.getReceipt()).thenReturn(new ArrayList<>());
        this.receiptService.updateDemandFromReceipt(receiptRequest, BillDetail.StatusEnum.CANCELLED, true);
        verify(receiptRequest).getReceipt();
    }


    @Test
    void testUpdateDemandFromReceipt4() {
        ReceiptRequest receiptRequest = mock(ReceiptRequest.class);
        when(receiptRequest.getReceipt()).thenReturn(new ArrayList<>());
        this.receiptService.updateDemandFromReceipt(receiptRequest, BillDetail.StatusEnum.INSTRUMENT_BOUNCED, true);
        verify(receiptRequest).getReceipt();
    }


    @Test
    void testUpdateDemandFromReceipt5() {

        ArrayList<Receipt> receiptList = new ArrayList<>();
        receiptList.add(null);
        ReceiptRequest receiptRequest = mock(ReceiptRequest.class);
        when(receiptRequest.getReceipt()).thenReturn(receiptList);
  /*      receiptService.updateDemandFromReceipt(receiptRequest, BillDetail.StatusEnum.CREATED, true);
        verify(receiptRequest).getReceipt();*/
    }


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

    @Test

    void testUpdateDemandFromReceipt8() {

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
       /* this.receiptService.updateDemandFromReceipt(receiptRequest, BillDetail.StatusEnum.CREATED, true);
*/
    }


    @Test

    void testUpdateDemandFromReceipt9() {

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
      /*  this.receiptService.updateDemandFromReceipt(receiptRequest, BillDetail.StatusEnum.CREATED, true);
*/
    }


    @Test

    void testUpdateDemandFromReceipt10() {

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
        /*this.receiptService.updateDemandFromReceipt(receiptRequest, BillDetail.StatusEnum.CREATED, true);*/
    }



    @Test

    void testUpdateDemandFromBill3() {

        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getBills()).thenReturn(new ArrayList<>());
     /*   this.receiptService.updateDemandFromBill(billRequest, new HashSet<>(), true);
*/
    }


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


    @Test

    void testUpdateDemandFromBill5() {

        when(this.demandService.getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(new ArrayList<>());
        when(this.demandService.updateAsync((org.egov.demand.web.contract.DemandRequest) any(),
                (org.egov.demand.model.PaymentBackUpdateAudit) any())).thenReturn(new DemandResponse());

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(null);
        BillRequest billRequest = mock(BillRequest.class);
        when(billRequest.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequest.getBills()).thenReturn(billList);
     /*   this.receiptService.updateDemandFromBill(billRequest, new HashSet<>(), true);
*/
    }


    @Test

    void testUpdateDemandFromBill6() {


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
       /* this.receiptService.updateDemandFromBill(billRequest, new HashSet<>(), true);
*/
    }


    @Test

    void testUpdateDemandFromBill7() {

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
     /*   this.receiptService.updateDemandFromBill(billRequest, new HashSet<>(), true);
*/
    }


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


}

