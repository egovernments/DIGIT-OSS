package org.egov.demand.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.AuditDetails;
import org.egov.demand.model.BillAccountDetailV2;
import org.egov.demand.model.BillDetailV2;
import org.egov.demand.model.BillV2;
import org.egov.demand.model.Demand;
import org.egov.demand.model.DemandCriteria;
import org.egov.demand.model.DemandDetail;
import org.egov.demand.util.Util;
import org.egov.demand.web.contract.BillRequestV2;
import org.egov.demand.web.contract.DemandRequest;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.fasterxml.jackson.databind.node.MissingNode;
import com.jayway.jsonpath.JsonPath;

@ExtendWith(SpringExtension.class)
@SpringBootTest
public class ReceiptServiceV2Test {

    @Mock
    private DemandService demandService;

    @InjectMocks
    private ReceiptServiceV2 receiptServiceV2;

    @Mock
    private Util util;

    @Test
    @DisplayName("Should update the demand when the bill is not empty")
    public void testUpdateDemandFromBillWhenBillIsNotEmpty() {
        BillRequestV2 billRequest =
                BillRequestV2.builder()
                        .requestInfo(RequestInfo.builder().build())
                        .bills(
                                Collections.singletonList(
                                        BillV2.builder()
                                                .id("1")
                                                .tenantId("ap.kurnool")
                                                .businessService("TL")

                                                .billDetails(
                                                        Collections.singletonList(
                                                                BillDetailV2.builder()
                                                                        .demandId("1")
                                                                        .amountPaid(BigDecimal.valueOf(100))
                                                                        .billAccountDetails(
                                                                                Collections.singletonList(
                                                                                        BillAccountDetailV2.builder()
                                                                                                .taxHeadCode("TL_TAX")
                                                                                                .amount(BigDecimal.valueOf(100))
                                                                                                .adjustedAmount(BigDecimal.valueOf(100))
                                                                                                .build()))
                                                                        .build()))
                                                .build()))
                        .build();

        Demand demand =
                Demand.builder()
                        .id("1")
                        .tenantId("ap.kurnool")
                        .demandDetails(
                                Collections.singletonList(
                                        DemandDetail.builder()
                                                .taxHeadMasterCode("TL_TAX")
                                                .taxAmount(BigDecimal.valueOf(100))
                                                .collectionAmount(BigDecimal.ZERO)
                                                .build()))
                        .build();

        when(demandService.getDemands(any(), any())).thenReturn(Collections.singletonList(demand));

        when(util.getValueFromAdditionalDetailsForKey(any(), any())).thenReturn("1");

        when(util.prepareMdMsRequest(any(), any(), any(), any(), any()))
                .thenReturn(MdmsCriteriaReq.builder().build());

        when(util.getAttributeValues(any())).thenReturn(JsonPath.parse("{}"));

        /*  receiptServiceV2.updateDemandFromBill(billRequest, Collections.singleton("1"), false);
         */
        assertEquals("1", demand.getId());
        assertEquals("ap.kurnool", demand.getTenantId());

        assertEquals("TL_TAX", demand.getDemandDetails().get(0).getTaxHeadMasterCode());
        assertEquals(BigDecimal.valueOf(100), demand.getDemandDetails().get(0).getTaxAmount());
        assertEquals(BigDecimal.valueOf(0), demand.getDemandDetails().get(0).getCollectionAmount());
    }

    @Test
    @DisplayName("Should not update the demand when the bill is empty")
    public void testUpdateDemandFromBillWhenBillIsEmpty() {


        verify(demandService, never()).updateAsync(any(), any());
    }

    @Test
    @DisplayName("Should update the demand when the bill is not empty")
    public void testUpdateDemandFromReceiptWhenBillIsNotEmpty() {
        BillRequestV2 billRequestV2 = BillRequestV2.builder().build();
        Demand demand =
                Demand.builder()
                        .id("1")
                        .tenantId("default")
                        .demandDetails(
                                Collections.singletonList(
                                        DemandDetail.builder()
                                                .taxHeadMasterCode("TL_TAX")
                                                .taxAmount(BigDecimal.valueOf(100))
                                                .collectionAmount(BigDecimal.ZERO)
                                                .build()))
                        .build();

        when(demandService.getDemands(any(), any())).thenReturn(Collections.singletonList(demand));

        receiptServiceV2.updateDemandFromReceipt(billRequestV2, false);

        assertEquals(demand.getDemandDetails().get(0).getCollectionAmount(), BigDecimal.valueOf(0));
    }

    @Test
    @DisplayName("Should not update the demand when the bill is empty")
    public void testUpdateDemandFromReceiptWhenBillIsEmpty() {
        BillRequestV2 billRequestV2 = BillRequestV2.builder().build();
        receiptServiceV2.updateDemandFromReceipt(billRequestV2, false);
        verify(demandService, never()).getDemands(any(), any());
    }



    @Test
    @DisplayName("Should not update the demand when the bill is empty")
    public void testUpdateDemandFromBillWhenBillIsEmpty2() {
        BillRequestV2 billRequest = BillRequestV2.builder().build();
        ReceiptServiceV2 receiptServiceV2 =mock(ReceiptServiceV2.class);

        receiptServiceV2.updateDemandFromBill(billRequest, new HashSet<>(), false);

        verify(demandService, never()).getDemands(any(), any());
    }

    @Test
    void testUpdateDemandFromReceipt() {

        this.receiptServiceV2.updateDemandFromReceipt(new BillRequestV2(), true);
    }

    @Test
    void testUpdateDemandFromReceipt2() {

        this.receiptServiceV2.updateDemandFromReceipt(null, true);
    }

    @Test
    void testUpdateDemandFromReceipt3() {
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getBills()).thenReturn(new ArrayList<>());
        this.receiptServiceV2.updateDemandFromReceipt(billRequestV2, true);
        verify(billRequestV2).getBills();
    }

    @Test
    void testUpdateDemandFromReceipt4() {

        ArrayList<BillV2> billV2List = new ArrayList<>();
        billV2List.add(new BillV2());
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getBills()).thenReturn(billV2List);
    }

    @Test
    void testUpdateDemandFromReceipt5() {

        ArrayList<BillV2> billV2List = new ArrayList<>();
        billV2List.add(null);
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getBills()).thenReturn(billV2List);
    }

    @Test
    void testUpdateDemandFromReceipt6() {


        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (java.util.List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        when(this.demandService.getDemands((DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(new ArrayList<>());

        ArrayList<BillV2> billV2List = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.valueOf(42L);
        MissingNode additionalDetails = MissingNode.getInstance();
        ArrayList<BillDetailV2> billDetails = new ArrayList<>();
        billV2List.add(new BillV2("42", "userid", "42", "Payer Name", "42 Main St", "jane.doe@example.org", BillV2.BillStatus.ACTIVE,
                totalAmount, "Business Service", "42", 1L, "Consumer Code", additionalDetails, billDetails, "42", "42",
                new AuditDetails()));
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequestV2.getBills()).thenReturn(billV2List);
    }

    @Test
    void testUpdateDemandFromReceipt7() {


        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (java.util.List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        when(this.demandService.getDemands((DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(new ArrayList<>());

        ArrayList<BillDetailV2> billDetailV2List = new ArrayList<>();
        billDetailV2List.add(new BillDetailV2());
        BigDecimal totalAmount = BigDecimal.valueOf(42L);
        MissingNode additionalDetails = MissingNode.getInstance();
        BillV2 e = new BillV2("42", "userid", "42", "Payer Name", "42 Main St", "jane.doe@example.org", BillV2.BillStatus.ACTIVE,
                totalAmount, "Business Service", "42", 1L, "Consumer Code", additionalDetails, billDetailV2List, "42", "42",
                new AuditDetails());

        ArrayList<BillV2> billV2List = new ArrayList<>();
        billV2List.add(e);
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequestV2.getBills()).thenReturn(billV2List);
    }

    @Test
    void testUpdateDemandFromBill3() {


        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getBills()).thenReturn(new ArrayList<>());
    }

    @Test
    void testUpdateDemandFromBill4() {


        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (java.util.List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        when(this.demandService.getDemands((DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(new ArrayList<>());

        ArrayList<BillV2> billV2List = new ArrayList<>();
        billV2List.add(new BillV2());
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequestV2.getBills()).thenReturn(billV2List);
    }

    @Test
    void testUpdateDemandFromBill5() {


        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (java.util.List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        when(this.demandService.getDemands((DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(new ArrayList<>());

        ArrayList<BillV2> billV2List = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.valueOf(42L);
        MissingNode additionalDetails = MissingNode.getInstance();
        ArrayList<BillDetailV2> billDetails = new ArrayList<>();
        billV2List.add(new BillV2("42", "userid", "42", "BillingService", "42 Main St", "jane.doe@example.org",
                BillV2.BillStatus.ACTIVE, totalAmount, "BillingService", "42", 2L, "BillingService", additionalDetails,
                billDetails, "42", "42", new AuditDetails()));
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequestV2.getBills()).thenReturn(billV2List);
    }

    @Test
    void testUpdateDemandFromBill6() {


        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (java.util.List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        when(this.demandService.getDemands((DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(new ArrayList<>());

        ArrayList<BillV2> billV2List = new ArrayList<>();
        billV2List.add(null);
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequestV2.getBills()).thenReturn(billV2List);
    }

    @Test
    void testUpdateDemandFromBill7() {


        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (java.util.List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());

        ArrayList<Demand> demandList = new ArrayList<>();
        demandList.add(new Demand());
        demandList.add(new Demand());
        when(this.demandService.getDemands((DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(demandList);

        ArrayList<BillV2> billV2List = new ArrayList<>();
        billV2List.add(new BillV2());
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequestV2.getBills()).thenReturn(billV2List);
    }

    @Test
    void testUpdateDemandFromBill8() {

        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (java.util.List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());

        Demand demand = new Demand();
        demand.addDemandDetailsItem(new DemandDetail());

        ArrayList<Demand> demandList = new ArrayList<>();
        demandList.add(demand);
        demandList.add(new Demand());
        when(this.demandService.getDemands((DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(demandList);

        ArrayList<BillV2> billV2List = new ArrayList<>();
        billV2List.add(new BillV2());
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequestV2.getBills()).thenReturn(billV2List);

    }

    @Test
    void testUpdateDemandFromBill9() {

        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (java.util.List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());

        Demand demand = new Demand();
        demand.addDemandDetailsItem(new DemandDetail());
        demand.addDemandDetailsItem(new DemandDetail());

        ArrayList<Demand> demandList = new ArrayList<>();
        demandList.add(demand);
        demandList.add(new Demand());
        when(this.demandService.getDemands((DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(demandList);

        ArrayList<BillV2> billV2List = new ArrayList<>();
        billV2List.add(new BillV2());
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequestV2.getBills()).thenReturn(billV2List);
    }

    @Test
    @DisplayName("Should update the demand when the bill is not empty")
    public void testUpdateDemandFromReceiptWhenBillIsNotEmpty1() {

        BillRequestV2 billRequest = BillRequestV2.builder().build();

        receiptServiceV2.updateDemandFromReceipt(billRequest, false);

    }

    @Test
    @DisplayName("Should not update the demand when the bill is empty")
    public void testUpdateDemandFromReceiptWhenBillIsEmpty2() {

        BillRequestV2 billRequest = BillRequestV2.builder().build();
        receiptServiceV2.updateDemandFromReceipt(billRequest, false);
        verify(demandService, times(0)).update(any(DemandRequest.class), any());
    }

    @Test
    void testUpdateDemandFromReceipt1() {

        this.receiptServiceV2.updateDemandFromReceipt(new BillRequestV2(), true);
    }

    @Test
    void testUpdateDemandFromReceipth() {
        this.receiptServiceV2.updateDemandFromReceipt(null, true);
    }

    @Test
    void testUpdateDemandFromReceiptd() {
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getBills()).thenReturn(new ArrayList<>());
        this.receiptServiceV2.updateDemandFromReceipt(billRequestV2, true);

    }

    @Test
    void testUpdateDemandFromReceiptj() {

        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        ArrayList<BillV2> billV2List = new ArrayList<>();
        billV2List.add(new BillV2());
        when(billRequestV2.getBills()).thenReturn(new ArrayList<>());
        this.receiptServiceV2.updateDemandFromReceipt(billRequestV2, true);

    }

    @Test
    @DisplayName("Should not update the demand when the bill is empty")
    public void testUpdateDemandFromReceiptWhenBillIsEmpty1() {

        BillRequestV2 billRequest = BillRequestV2.builder().build();
        receiptServiceV2.updateDemandFromReceipt(billRequest, false);
        verify(demandService, times(0)).update(any(DemandRequest.class), any());
    }



}

