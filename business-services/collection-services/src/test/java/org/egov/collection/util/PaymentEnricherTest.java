package org.egov.collection.util;

import com.fasterxml.jackson.databind.node.MissingNode;
import org.egov.collection.model.AuditDetails;
import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentDetail;
import org.egov.collection.model.PaymentRequest;
import org.egov.collection.model.enums.*;
import org.egov.collection.repository.BillingServiceRepository;
import org.egov.collection.repository.IdGenRepository;
import org.egov.collection.service.MDMSService;
import org.egov.collection.web.contract.Bill;
import org.egov.collection.web.contract.BillAccountDetail;
import org.egov.collection.web.contract.BillDetail;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.math.BigDecimal;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ContextConfiguration(classes = {PaymentEnricher.class})
@ExtendWith(SpringExtension.class)
class PaymentEnricherTest {
    @MockBean
    private BillingServiceRepository billingServiceRepository;

    @MockBean
    private IdGenRepository idGenRepository;

    @MockBean
    private MDMSService mDMSService;

    @Autowired
    private PaymentEnricher paymentEnricher;

    @Test
    void testEnrichPaymentPreValidate2() {

        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setPayment(new Payment());
       // this.paymentEnricher.enrichPaymentPreValidate(paymentRequest);
       // assertThrows(CustomException.class, () -> PaymentRequest.enrichPaymentPreValidate(paymentRequest));
        PaymentRequest RequestInfo;
       // when(paymentEnricher.enrichPaymentPreValidate(RequestInfo)).thenReturn(new paymentRequest());
    }

    @Test
    void testEnrichPaymentPreValidate5() {
        Payment payment = mock(Payment.class);
        when(payment.getTenantId()).thenReturn("42");
        when(payment.getPaymentDetails()).thenReturn(new ArrayList<>());

        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setRequestInfo(new RequestInfo());
        paymentRequest.setPayment(payment);
        assertThrows(CustomException.class, () -> this.paymentEnricher.enrichPaymentPreValidate(paymentRequest));
        verify(payment).getTenantId();
        verify(payment, atLeast(1)).getPaymentDetails();
    }

    @Test
    void testEnrichPaymentPreValidate6() {
        Payment payment = mock(Payment.class);
        when(payment.getTenantId()).thenReturn("42");
        when(payment.getPaymentDetails()).thenReturn(new ArrayList<>());

        PaymentRequest paymentRequest = new PaymentRequest();
        paymentRequest.setRequestInfo(new RequestInfo("42", "USER_INFO_INVALID", 4L, "USER_INFO_INVALID",
                "USER_INFO_INVALID", "USER_INFO_INVALID", "42", "ABC123", "42", new User()));
        paymentRequest.setPayment(payment);
        assertThrows(CustomException.class, () -> this.paymentEnricher.enrichPaymentPreValidate(paymentRequest));
        verify(payment).getTenantId();
        verify(payment, atLeast(1)).getPaymentDetails();
    }

    @Test
    void testEnrichPaymentPostValidate6() {
        when(this.idGenRepository.generateTransactionNumber((RequestInfo) any(), (String) any())).thenReturn("42");

        Payment payment = new Payment();
        payment.setPaymentMode(PaymentModeEnum.ONLINE);
        PaymentRequest paymentRequest = mock(PaymentRequest.class);
        when(paymentRequest.getRequestInfo()).thenReturn(new RequestInfo());
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();
        when(paymentRequest.getPayment())
                .thenReturn(new Payment("42", "42", totalDue, totalAmountPaid, "42", 4L, PaymentModeEnum.CASH, 4L, "42",
                        InstrumentStatusEnum.APPROVED, "Ifsc Code", auditDetails, additionalDetails, new ArrayList<>(), "Paid By",
                        "42", "Payer Name", "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42"));
        doNothing().when(paymentRequest).setPayment((Payment) any());
        paymentRequest.setPayment(payment);
        this.paymentEnricher.enrichPaymentPostValidate(paymentRequest);
        verify(this.idGenRepository).generateTransactionNumber((RequestInfo) any(), (String) any());
        verify(paymentRequest, atLeast(1)).getPayment();
        verify(paymentRequest).getRequestInfo();
        verify(paymentRequest).setPayment((Payment) any());
    }

    @Test
    void testEnrichPaymentPostValidate7() {
        when(this.idGenRepository.generateTransactionNumber((RequestInfo) any(), (String) any())).thenReturn("42");

        Payment payment = new Payment();
        payment.setPaymentMode(PaymentModeEnum.ONLINE);
        PaymentRequest paymentRequest = mock(PaymentRequest.class);
        when(paymentRequest.getRequestInfo()).thenThrow(new CustomException("Code", "An error occurred"));
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();
        when(paymentRequest.getPayment())
                .thenReturn(new Payment("42", "42", totalDue, totalAmountPaid, "42", 4L, PaymentModeEnum.CASH, 4L, "42",
                        InstrumentStatusEnum.APPROVED, "Ifsc Code", auditDetails, additionalDetails, new ArrayList<>(), "Paid By",
                        "42", "Payer Name", "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42"));
        doNothing().when(paymentRequest).setPayment((Payment) any());
        paymentRequest.setPayment(payment);
        assertThrows(CustomException.class, () -> this.paymentEnricher.enrichPaymentPostValidate(paymentRequest));
        verify(paymentRequest, atLeast(1)).getPayment();
        verify(paymentRequest).getRequestInfo();
        verify(paymentRequest).setPayment((Payment) any());
    }

    @Test
    void testEnrichPaymentPostValidate8() {
        when(this.idGenRepository.generateTransactionNumber((RequestInfo) any(), (String) any())).thenReturn("42");

        Payment payment = new Payment();
        payment.setPaymentMode(PaymentModeEnum.ONLINE);
        PaymentRequest paymentRequest = mock(PaymentRequest.class);
        when(paymentRequest.getRequestInfo()).thenReturn(new RequestInfo());
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();
        when(paymentRequest.getPayment())
                .thenReturn(new Payment("42", "42", totalDue, totalAmountPaid, "42", 4L, PaymentModeEnum.CHEQUE, 4L, "42",
                        InstrumentStatusEnum.APPROVED, "Ifsc Code", auditDetails, additionalDetails, new ArrayList<>(), "Paid By",
                        "42", "Payer Name", "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42"));
        doNothing().when(paymentRequest).setPayment((Payment) any());
        paymentRequest.setPayment(payment);
        this.paymentEnricher.enrichPaymentPostValidate(paymentRequest);
        verify(paymentRequest, atLeast(1)).getPayment();
        verify(paymentRequest).setPayment((Payment) any());
    }

    @Test
    void testEnrichPaymentPostValidate9() {
        when(this.idGenRepository.generateTransactionNumber((RequestInfo) any(), (String) any())).thenReturn("42");

        Payment payment = new Payment();
        payment.setPaymentMode(PaymentModeEnum.ONLINE);
        PaymentRequest paymentRequest = mock(PaymentRequest.class);
        when(paymentRequest.getRequestInfo()).thenReturn(new RequestInfo());
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();
        when(paymentRequest.getPayment())
                .thenReturn(new Payment("42", "42", totalDue, totalAmountPaid, "42", 4L, PaymentModeEnum.ONLINE, 4L, "42",
                        InstrumentStatusEnum.APPROVED, "Ifsc Code", auditDetails, additionalDetails, new ArrayList<>(), "Paid By",
                        "42", "Payer Name", "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42"));
        doNothing().when(paymentRequest).setPayment((Payment) any());
        paymentRequest.setPayment(payment);
        this.paymentEnricher.enrichPaymentPostValidate(paymentRequest);
        verify(paymentRequest, atLeast(1)).getPayment();
        verify(paymentRequest).setPayment((Payment) any());
    }

    @Test
    void testEnrichPaymentPostValidate11() {
        when(this.idGenRepository.generateReceiptNumber((RequestInfo) any(), (String) any(), (String) any()))
                .thenReturn("42");
        when(this.idGenRepository.generateTransactionNumber((RequestInfo) any(), (String) any())).thenReturn("42");

        Payment payment = new Payment();
        payment.setPaymentMode(PaymentModeEnum.ONLINE);

        ArrayList<PaymentDetail> paymentDetailList = new ArrayList<>();
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        Bill bill = new Bill();
        MissingNode additionalDetails = MissingNode.getInstance();
        paymentDetailList.add(new PaymentDetail("42", "42", "42", totalDue, totalAmountPaid, "42", "42", 4L, 4L,
                "Receipt Type", "Business Service", "42", bill, additionalDetails, new AuditDetails()));
        BigDecimal totalDue1 = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid1 = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        Payment payment1 = new Payment("42", "42", totalDue1, totalAmountPaid1, "42", 4L, PaymentModeEnum.CASH, 4L, "42",
                InstrumentStatusEnum.APPROVED, "Ifsc Code", auditDetails, MissingNode.getInstance(), paymentDetailList,
                "Paid By", "42", "Payer Name", "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42");

        PaymentRequest paymentRequest = mock(PaymentRequest.class);
        when(paymentRequest.getRequestInfo()).thenReturn(new RequestInfo());
        when(paymentRequest.getPayment()).thenReturn(payment1);
        doNothing().when(paymentRequest).setPayment((Payment) any());
        paymentRequest.setPayment(payment);
        this.paymentEnricher.enrichPaymentPostValidate(paymentRequest);
        verify(this.idGenRepository).generateReceiptNumber((RequestInfo) any(), (String) any(), (String) any());
        verify(this.idGenRepository).generateTransactionNumber((RequestInfo) any(), (String) any());
        verify(paymentRequest, atLeast(1)).getPayment();
        verify(paymentRequest, atLeast(1)).getRequestInfo();
        verify(paymentRequest).setPayment((Payment) any());
    }

    @Test
    void testEnrichPaymentPostValidate13() {
        when(this.idGenRepository.generateReceiptNumber((RequestInfo) any(), (String) any(), (String) any()))
                .thenThrow(new CustomException("Code", "An error occurred"));
        when(this.idGenRepository.generateTransactionNumber((RequestInfo) any(), (String) any())).thenReturn("42");

        Payment payment = new Payment();
        payment.setPaymentMode(PaymentModeEnum.ONLINE);

        ArrayList<PaymentDetail> paymentDetailList = new ArrayList<>();
        paymentDetailList.add(new PaymentDetail());
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        Payment payment1 = new Payment("42", "42", totalDue, totalAmountPaid, "42", 4L, PaymentModeEnum.CASH, 4L, "42",
                InstrumentStatusEnum.APPROVED, "Ifsc Code", auditDetails, MissingNode.getInstance(), paymentDetailList,
                "Paid By", "42", "Payer Name", "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42");

        PaymentRequest paymentRequest = mock(PaymentRequest.class);
        when(paymentRequest.getRequestInfo()).thenReturn(new RequestInfo());
        when(paymentRequest.getPayment()).thenReturn(payment1);
        doNothing().when(paymentRequest).setPayment((Payment) any());
        paymentRequest.setPayment(payment);
        assertThrows(CustomException.class, () -> this.paymentEnricher.enrichPaymentPostValidate(paymentRequest));
        verify(this.idGenRepository).generateReceiptNumber((RequestInfo) any(), (String) any(), (String) any());
        verify(paymentRequest).getPayment();
        verify(paymentRequest).getRequestInfo();
        verify(paymentRequest).setPayment((Payment) any());
    }

    @Test
    void testEnrichAdvanceTaxHead() {
        this.paymentEnricher.enrichAdvanceTaxHead(new ArrayList<>());
    }

    @Test
    void testEnrichAdvanceTaxHead3() {

        ArrayList<Bill> billList = new ArrayList<>();
        MissingNode additionalDetails = MissingNode.getInstance();
        ArrayList<BillDetail> billDetails = new ArrayList<>();
        AuditDetails auditDetails = new AuditDetails();
        ArrayList<String> collectionModesNotAllowed = new ArrayList<>();
        BigDecimal minimumAmountToBePaid = BigDecimal.valueOf(42L);
        BigDecimal totalAmount = BigDecimal.valueOf(42L);
        billList.add(new Bill("42", "42", "Paid By", "Payer Name", "42 Main St", "jane.doe@example.org", "42",
                Bill.StatusEnum.ACTIVE, "Just cause", true, additionalDetails, billDetails, "42", auditDetails,
                collectionModesNotAllowed, true, true, minimumAmountToBePaid, "Business Service", totalAmount, "Consumer Code",
                "42", 1L, BigDecimal.valueOf(42L)));
        this.paymentEnricher.enrichAdvanceTaxHead(billList);
    }

    @Test
    void testEnrichAdvanceTaxHead5() {
        Bill bill = mock(Bill.class);
        when(bill.getBillDetails()).thenReturn(new ArrayList<>());

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(bill);
        this.paymentEnricher.enrichAdvanceTaxHead(billList);
        verify(bill).getBillDetails();
    }

    @Test
    void testEnrichAdvanceTaxHead7() {
        ArrayList<BillDetail> billDetailList = new ArrayList<>();
        BigDecimal amount = BigDecimal.valueOf(42L);
        BigDecimal amountPaid = BigDecimal.valueOf(42L);
        MissingNode additionalDetails = MissingNode.getInstance();
        ArrayList<BillAccountDetail> billAccountDetails = new ArrayList<>();
        billDetailList.add(new BillDetail("42", "42", "42", "42", amount, amountPaid, 4L, 4L, additionalDetails, "Channel",
                "Voucher Header", "Boundary", "42", 4L, billAccountDetails, CollectionType.COUNTER, new AuditDetails(),
                "Bill Description", 4L, "Display Message", true, "Cancellation Remarks"));
        Bill bill = mock(Bill.class);
        when(bill.getBillDetails()).thenReturn(billDetailList);

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(bill);
        this.paymentEnricher.enrichAdvanceTaxHead(billList);
        verify(bill).getBillDetails();
    }

    @Test
    void testEnrichAdvanceTaxHead9() {
        BillDetail billDetail = new BillDetail();
        BigDecimal amount = BigDecimal.valueOf(42L);
        BigDecimal adjustedAmount = BigDecimal.valueOf(42L);
        MissingNode additionalDetails = MissingNode.getInstance();
        billDetail.addBillAccountDetail(new BillAccountDetail("42", "42", "42", "42", 4, amount, adjustedAmount, true,
                "Tax Head Code", additionalDetails, Purpose.ARREAR, new AuditDetails()));

        ArrayList<BillDetail> billDetailList = new ArrayList<>();
        billDetailList.add(billDetail);
        Bill bill = mock(Bill.class);
        when(bill.getBillDetails()).thenReturn(billDetailList);

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(bill);
        this.paymentEnricher.enrichAdvanceTaxHead(billList);
        verify(bill).getBillDetails();
    }

    @Test
    void testEnrichAdvanceTaxHead10() {
        BillAccountDetail billAccountDetail = new BillAccountDetail();
        billAccountDetail.setPurpose(Purpose.ARREAR);

        BillDetail billDetail = new BillDetail();
        billDetail.addBillAccountDetail(billAccountDetail);

        ArrayList<BillDetail> billDetailList = new ArrayList<>();
        billDetailList.add(billDetail);
        Bill bill = mock(Bill.class);
        when(bill.getBillDetails()).thenReturn(billDetailList);

        ArrayList<Bill> billList = new ArrayList<>();
        billList.add(bill);
        this.paymentEnricher.enrichAdvanceTaxHead(billList);
        verify(bill).getBillDetails();
    }
}

