package org.egov.demand.service;

import static org.mockito.Mockito.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.node.MissingNode;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.model.AuditDetails;
import org.egov.demand.model.BillDetailV2;
import org.egov.demand.model.BillV2;
import org.egov.demand.model.Demand;
import org.egov.demand.model.DemandDetail;

import org.egov.demand.util.Util;
import org.egov.demand.web.contract.BillRequestV2;
import org.egov.demand.web.validator.DemandValidatorV1;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {ReceiptServiceV2.class})
@ExtendWith(SpringExtension.class)
class ReceiptServiceV2Test {
    @MockBean
    private DemandService demandService;

    @MockBean
    private DemandValidatorV1 demandValidatorV1;

    @Autowired
    private ReceiptServiceV2 receiptServiceV2;

    @MockBean
    private Util util;

    /**
     * Method under test: {@link ReceiptServiceV2#updateDemandFromReceipt(BillRequestV2, Boolean)}
     */
    @Test
    void testUpdateDemandFromReceipt() {
        // TODO: Complete this test.
        //   Reason: R004 No meaningful assertions found.
        //   Diffblue Cover was unable to create an assertion.
        //   Make sure that fields modified by updateDemandFromReceipt(BillRequestV2, Boolean)
        //   have package-private, protected, or public getters.
        //   See https://diff.blue/R004 to resolve this issue.

        this.receiptServiceV2.updateDemandFromReceipt(new BillRequestV2(), true);
    }

    /**
     * Method under test: {@link ReceiptServiceV2#updateDemandFromReceipt(BillRequestV2, Boolean)}
     */
    @Test
    void testUpdateDemandFromReceipt2() {
        // TODO: Complete this test.
        //   Reason: R004 No meaningful assertions found.
        //   Diffblue Cover was unable to create an assertion.
        //   Make sure that fields modified by updateDemandFromReceipt(BillRequestV2, Boolean)
        //   have package-private, protected, or public getters.
        //   See https://diff.blue/R004 to resolve this issue.

        this.receiptServiceV2.updateDemandFromReceipt(null, true);
    }

    /**
     * Method under test: {@link ReceiptServiceV2#updateDemandFromReceipt(BillRequestV2, Boolean)}
     */
    @Test
    void testUpdateDemandFromReceipt3() {
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getBills()).thenReturn(new ArrayList<>());
        this.receiptServiceV2.updateDemandFromReceipt(billRequestV2, true);
        verify(billRequestV2).getBills();
    }

    /**
     * Method under test: {@link ReceiptServiceV2#updateDemandFromReceipt(BillRequestV2, Boolean)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateDemandFromReceipt4() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.service.ReceiptServiceV2.lambda$updateDemandFromReceipt$1(ReceiptServiceV2.java:66)
        //       at java.util.ArrayList.forEach(ArrayList.java:1541)
        //       at org.egov.demand.service.ReceiptServiceV2.updateDemandFromReceipt(ReceiptServiceV2.java:64)
        //   In order to prevent updateDemandFromReceipt(BillRequestV2, Boolean)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromReceipt(BillRequestV2, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        ArrayList<BillV2> billV2List = new ArrayList<>();
        billV2List.add(new BillV2());
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getBills()).thenReturn(billV2List);
        this.receiptServiceV2.updateDemandFromReceipt(billRequestV2, true);
    }

    /**
     * Method under test: {@link ReceiptServiceV2#updateDemandFromReceipt(BillRequestV2, Boolean)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateDemandFromReceipt5() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.service.ReceiptServiceV2.lambda$updateDemandFromReceipt$1(ReceiptServiceV2.java:66)
        //       at java.util.ArrayList.forEach(ArrayList.java:1541)
        //       at org.egov.demand.service.ReceiptServiceV2.updateDemandFromReceipt(ReceiptServiceV2.java:64)
        //   In order to prevent updateDemandFromReceipt(BillRequestV2, Boolean)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromReceipt(BillRequestV2, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        ArrayList<BillV2> billV2List = new ArrayList<>();
        billV2List.add(null);
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getBills()).thenReturn(billV2List);
        this.receiptServiceV2.updateDemandFromReceipt(billRequestV2, true);
    }

    /**
     * Method under test: {@link ReceiptServiceV2#updateDemandFromReceipt(BillRequestV2, Boolean)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateDemandFromReceipt6() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.service.ReceiptServiceV2.getAdvanceTaxhead(ReceiptServiceV2.java:341)
        //       at org.egov.demand.service.ReceiptServiceV2.updateDemandFromBill(ReceiptServiceV2.java:96)
        //       at org.egov.demand.service.ReceiptServiceV2.updateDemandFromReceipt(ReceiptServiceV2.java:72)
        //   In order to prevent updateDemandFromReceipt(BillRequestV2, Boolean)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromReceipt(BillRequestV2, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (java.util.List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        when(this.demandService.getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(new ArrayList<>());

        ArrayList<BillV2> billV2List = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.valueOf(42L);
        MissingNode additionalDetails = MissingNode.getInstance();
        ArrayList<BillDetailV2> billDetails = new ArrayList<>();
        billV2List.add(new BillV2("42", "42", "Payer Name", "42 Main St", "jane.doe@example.org", BillV2.BillStatus.ACTIVE,
                totalAmount, "Business Service", "42", 1L, "Consumer Code", additionalDetails, billDetails, "42", "42",
                new AuditDetails()));
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequestV2.getBills()).thenReturn(billV2List);
        this.receiptServiceV2.updateDemandFromReceipt(billRequestV2, true);
    }

    /**
     * Method under test: {@link ReceiptServiceV2#updateDemandFromReceipt(BillRequestV2, Boolean)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateDemandFromReceipt7() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.service.ReceiptServiceV2.getAdvanceTaxhead(ReceiptServiceV2.java:341)
        //       at org.egov.demand.service.ReceiptServiceV2.updateDemandFromBill(ReceiptServiceV2.java:96)
        //       at org.egov.demand.service.ReceiptServiceV2.updateDemandFromReceipt(ReceiptServiceV2.java:72)
        //   In order to prevent updateDemandFromReceipt(BillRequestV2, Boolean)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromReceipt(BillRequestV2, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (java.util.List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        when(this.demandService.getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(new ArrayList<>());

        ArrayList<BillDetailV2> billDetailV2List = new ArrayList<>();
        billDetailV2List.add(new BillDetailV2());
        BigDecimal totalAmount = BigDecimal.valueOf(42L);
        MissingNode additionalDetails = MissingNode.getInstance();
        BillV2 e = new BillV2("42", "42", "Payer Name", "42 Main St", "jane.doe@example.org", BillV2.BillStatus.ACTIVE,
                totalAmount, "Business Service", "42", 1L, "Consumer Code", additionalDetails, billDetailV2List, "42", "42",
                new AuditDetails());

        ArrayList<BillV2> billV2List = new ArrayList<>();
        billV2List.add(e);
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequestV2.getBills()).thenReturn(billV2List);
        this.receiptServiceV2.updateDemandFromReceipt(billRequestV2, true);
    }

    /**
     * Method under test: {@link ReceiptServiceV2#updateDemandFromBill(BillRequestV2, java.util.Set, Boolean)}
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
        //       at org.egov.demand.service.ReceiptServiceV2.updateDemandFromBill(ReceiptServiceV2.java:86)
        //   In order to prevent updateDemandFromBill(BillRequestV2, Set, Boolean)
        //   from throwing IndexOutOfBoundsException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromBill(BillRequestV2, Set, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        BillRequestV2 billRequest = new BillRequestV2();
        this.receiptServiceV2.updateDemandFromBill(billRequest, new HashSet<>(), true);
    }

    /**
     * Method under test: {@link ReceiptServiceV2#updateDemandFromBill(BillRequestV2, java.util.Set, Boolean)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateDemandFromBill2() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.service.ReceiptServiceV2.updateDemandFromBill(ReceiptServiceV2.java:85)
        //   In order to prevent updateDemandFromBill(BillRequestV2, Set, Boolean)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromBill(BillRequestV2, Set, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        this.receiptServiceV2.updateDemandFromBill(null, new HashSet<>(), true);
    }

    /**
     * Method under test: {@link ReceiptServiceV2#updateDemandFromBill(BillRequestV2, java.util.Set, Boolean)}
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
        //       at org.egov.demand.service.ReceiptServiceV2.updateDemandFromBill(ReceiptServiceV2.java:86)
        //   In order to prevent updateDemandFromBill(BillRequestV2, Set, Boolean)
        //   from throwing IndexOutOfBoundsException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromBill(BillRequestV2, Set, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getBills()).thenReturn(new ArrayList<>());
        this.receiptServiceV2.updateDemandFromBill(billRequestV2, new HashSet<>(), true);
    }

    /**
     * Method under test: {@link ReceiptServiceV2#updateDemandFromBill(BillRequestV2, java.util.Set, Boolean)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateDemandFromBill4() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at java.lang.String.replace(String.java:2143)
        //       at org.egov.demand.service.ReceiptServiceV2.getAdvanceTaxhead(ReceiptServiceV2.java:339)
        //       at org.egov.demand.service.ReceiptServiceV2.updateDemandFromBill(ReceiptServiceV2.java:96)
        //   In order to prevent updateDemandFromBill(BillRequestV2, Set, Boolean)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromBill(BillRequestV2, Set, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (java.util.List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        when(this.demandService.getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(new ArrayList<>());

        ArrayList<BillV2> billV2List = new ArrayList<>();
        billV2List.add(new BillV2());
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequestV2.getBills()).thenReturn(billV2List);
        this.receiptServiceV2.updateDemandFromBill(billRequestV2, new HashSet<>(), true);
    }

    /**
     * Method under test: {@link ReceiptServiceV2#updateDemandFromBill(BillRequestV2, java.util.Set, Boolean)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateDemandFromBill5() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.service.ReceiptServiceV2.getAdvanceTaxhead(ReceiptServiceV2.java:341)
        //       at org.egov.demand.service.ReceiptServiceV2.updateDemandFromBill(ReceiptServiceV2.java:96)
        //   In order to prevent updateDemandFromBill(BillRequestV2, Set, Boolean)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromBill(BillRequestV2, Set, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (java.util.List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        when(this.demandService.getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(new ArrayList<>());

        ArrayList<BillV2> billV2List = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.valueOf(42L);
        MissingNode additionalDetails = MissingNode.getInstance();
        ArrayList<BillDetailV2> billDetails = new ArrayList<>();
        billV2List.add(new BillV2("42", "42", "BillingService", "42 Main St", "jane.doe@example.org",
                BillV2.BillStatus.ACTIVE, totalAmount, "BillingService", "42", 2L, "BillingService", additionalDetails,
                billDetails, "42", "42", new AuditDetails()));
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequestV2.getBills()).thenReturn(billV2List);
        this.receiptServiceV2.updateDemandFromBill(billRequestV2, new HashSet<>(), true);
    }

    /**
     * Method under test: {@link ReceiptServiceV2#updateDemandFromBill(BillRequestV2, java.util.Set, Boolean)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateDemandFromBill6() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.NullPointerException
        //       at org.egov.demand.service.ReceiptServiceV2.updateDemandFromBill(ReceiptServiceV2.java:86)
        //   In order to prevent updateDemandFromBill(BillRequestV2, Set, Boolean)
        //   from throwing NullPointerException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromBill(BillRequestV2, Set, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (java.util.List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());
        when(this.demandService.getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(new ArrayList<>());

        ArrayList<BillV2> billV2List = new ArrayList<>();
        billV2List.add(null);
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequestV2.getBills()).thenReturn(billV2List);
        this.receiptServiceV2.updateDemandFromBill(billRequestV2, new HashSet<>(), true);
    }

    /**
     * Method under test: {@link ReceiptServiceV2#updateDemandFromBill(BillRequestV2, java.util.Set, Boolean)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateDemandFromBill7() {
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
        //       at org.egov.demand.service.ReceiptServiceV2.updateDemandFromBill(ReceiptServiceV2.java:92)
        //   In order to prevent updateDemandFromBill(BillRequestV2, Set, Boolean)
        //   from throwing IllegalStateException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromBill(BillRequestV2, Set, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (java.util.List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());

        ArrayList<Demand> demandList = new ArrayList<>();
        demandList.add(new Demand());
        demandList.add(new Demand());
        when(this.demandService.getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(demandList);

        ArrayList<BillV2> billV2List = new ArrayList<>();
        billV2List.add(new BillV2());
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequestV2.getBills()).thenReturn(billV2List);
        this.receiptServiceV2.updateDemandFromBill(billRequestV2, new HashSet<>(), true);
    }

    /**
     * Method under test: {@link ReceiptServiceV2#updateDemandFromBill(BillRequestV2, java.util.Set, Boolean)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateDemandFromBill8() {
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
        //       at org.egov.demand.service.ReceiptServiceV2.updateDemandFromBill(ReceiptServiceV2.java:92)
        //   In order to prevent updateDemandFromBill(BillRequestV2, Set, Boolean)
        //   from throwing IllegalStateException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromBill(BillRequestV2, Set, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (java.util.List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());

        Demand demand = new Demand();
        demand.addDemandDetailsItem(new DemandDetail());

        ArrayList<Demand> demandList = new ArrayList<>();
        demandList.add(demand);
        demandList.add(new Demand());
        when(this.demandService.getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(demandList);

        ArrayList<BillV2> billV2List = new ArrayList<>();
        billV2List.add(new BillV2());
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequestV2.getBills()).thenReturn(billV2List);
        this.receiptServiceV2.updateDemandFromBill(billRequestV2, new HashSet<>(), true);
    }

    /**
     * Method under test: {@link ReceiptServiceV2#updateDemandFromBill(BillRequestV2, java.util.Set, Boolean)}
     */
    @Test
    @Disabled("TODO: Complete this test")
    void testUpdateDemandFromBill9() {
        // TODO: Complete this test.
        //   Reason: R013 No inputs found that don't throw a trivial exception.
        //   Diffblue Cover tried to run the arrange/act section, but the method under
        //   test threw
        //   java.lang.IllegalStateException: Duplicate key null (attempted merging values Demand(id=null, tenantId=null, consumerCode=null, consumerType=null, businessService=null, payer=null, taxPeriodFrom=null, taxPeriodTo=null, demandDetails=[DemandDetail(id=null, demandId=null, taxHeadMasterCode=null, taxAmount=null, collectionAmount=0, additionalDetails=null, auditDetails=null, tenantId=null), DemandDetail(id=null, demandId=null, taxHeadMasterCode=null, taxAmount=null, collectionAmount=0, additionalDetails=null, auditDetails=null, tenantId=null)], auditDetails=null, fixedBillExpiryDate=null, billExpiryTime=null, additionalDetails=null, minimumAmountPayable=0, isPaymentCompleted=false, status=null) and Demand(id=null, tenantId=null, consumerCode=null, consumerType=null, businessService=null, payer=null, taxPeriodFrom=null, taxPeriodTo=null, demandDetails=[], auditDetails=null, fixedBillExpiryDate=null, billExpiryTime=null, additionalDetails=null, minimumAmountPayable=0, isPaymentCompleted=false, status=null))
        //       at java.util.stream.Collectors.duplicateKeyException(Collectors.java:133)
        //       at java.util.stream.Collectors.lambda$uniqKeysMapAccumulator$1(Collectors.java:180)
        //       at java.util.stream.ReduceOps$3ReducingSink.accept(ReduceOps.java:169)
        //       at java.util.ArrayList$ArrayListSpliterator.forEachRemaining(ArrayList.java:1655)
        //       at java.util.stream.AbstractPipeline.copyInto(AbstractPipeline.java:484)
        //       at java.util.stream.AbstractPipeline.wrapAndCopyInto(AbstractPipeline.java:474)
        //       at java.util.stream.ReduceOps$ReduceOp.evaluateSequential(ReduceOps.java:913)
        //       at java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:234)
        //       at java.util.stream.ReferencePipeline.collect(ReferencePipeline.java:578)
        //       at org.egov.demand.service.ReceiptServiceV2.updateDemandFromBill(ReceiptServiceV2.java:92)
        //   In order to prevent updateDemandFromBill(BillRequestV2, Set, Boolean)
        //   from throwing IllegalStateException, add constructors or factory
        //   methods that make it easier to construct fully initialized objects used in
        //   updateDemandFromBill(BillRequestV2, Set, Boolean).
        //   See https://diff.blue/R013 to resolve this issue.

        when(this.util.getAttributeValues((MdmsCriteriaReq) any())).thenReturn(null);
        when(this.util.prepareMdMsRequest((String) any(), (String) any(), (java.util.List<String>) any(), (String) any(),
                (RequestInfo) any())).thenReturn(new MdmsCriteriaReq());

        Demand demand = new Demand();
        demand.addDemandDetailsItem(new DemandDetail());
        demand.addDemandDetailsItem(new DemandDetail());

        ArrayList<Demand> demandList = new ArrayList<>();
        demandList.add(demand);
        demandList.add(new Demand());
        when(this.demandService.getDemands((org.egov.demand.model.DemandCriteria) any(), (RequestInfo) any()))
                .thenReturn(demandList);

        ArrayList<BillV2> billV2List = new ArrayList<>();
        billV2List.add(new BillV2());
        BillRequestV2 billRequestV2 = mock(BillRequestV2.class);
        when(billRequestV2.getRequestInfo()).thenReturn(new RequestInfo());
        when(billRequestV2.getBills()).thenReturn(billV2List);
        this.receiptServiceV2.updateDemandFromBill(billRequestV2, new HashSet<>(), true);
    }
}

