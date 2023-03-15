package org.egov.collection.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.node.MissingNode;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.egov.collection.config.ApplicationProperties;
import org.egov.collection.model.AuditDetails;
import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentDetail;
import org.egov.collection.model.enums.InstrumentStatusEnum;
import org.egov.collection.model.enums.PaymentModeEnum;
import org.egov.collection.model.enums.PaymentStatusEnum;
import org.egov.collection.producer.CollectionProducer;
import org.egov.collection.repository.PaymentRepository;
import org.egov.collection.util.PaymentWorkflowValidator;
import org.egov.collection.web.contract.Bill;
import org.egov.collection.web.contract.BillDetail;
import org.egov.collection.web.contract.PaymentWorkflow;
import org.egov.collection.web.contract.PaymentWorkflowRequest;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

class PaymentWorkflowServiceTest {

    @Test
    void testPerformWorkflow4() {

        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        when(paymentRepository.fetchPayments((org.egov.collection.model.PaymentSearchCriteria) any()))
                .thenReturn(new ArrayList<>());
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentWorkflow paymentWorkflow = new PaymentWorkflow();
        paymentWorkflow.setAction(PaymentWorkflow.PaymentAction.CANCEL);
        paymentWorkflow.setAdditionalDetails(MissingNode.getInstance());
        paymentWorkflow.setPaymentId("42");
        paymentWorkflow.setReason("Just cause");
        paymentWorkflow.setTenantId("42");

        ArrayList<PaymentWorkflow> paymentWorkflowList = new ArrayList<>();
        paymentWorkflowList.add(paymentWorkflow);
        PaymentWorkflowRequest paymentWorkflowRequest = mock(PaymentWorkflowRequest.class);
        when(paymentWorkflowRequest.getRequestInfo()).thenThrow(
                new CustomException("Payment not found with paymentId {} or not in editable status ", "An error occurred"));
        when(paymentWorkflowRequest.getPaymentWorkflows()).thenReturn(paymentWorkflowList);
        doNothing().when(paymentWorkflowRequest).setPaymentWorkflows((List<PaymentWorkflow>) any());
        doNothing().when(paymentWorkflowRequest).setRequestInfo((RequestInfo) any());
        paymentWorkflowRequest.setPaymentWorkflows(new ArrayList<>());
        paymentWorkflowRequest.setRequestInfo(new RequestInfo());
        assertThrows(CustomException.class, () -> paymentWorkflowService.performWorkflow(paymentWorkflowRequest));
        verify(paymentRepository).fetchPayments((org.egov.collection.model.PaymentSearchCriteria) any());
        verify(paymentWorkflowRequest, atLeast(1)).getPaymentWorkflows();
        verify(paymentWorkflowRequest).getRequestInfo();
        verify(paymentWorkflowRequest).setPaymentWorkflows((List<PaymentWorkflow>) any());
        verify(paymentWorkflowRequest).setRequestInfo((RequestInfo) any());
    }

    @Test
    void testPerformWorkflow12() {

        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        when(paymentRepository.fetchPayments((org.egov.collection.model.PaymentSearchCriteria) any()))
                .thenReturn(new ArrayList<>());
        PaymentWorkflowValidator paymentWorkflowValidator = mock(PaymentWorkflowValidator.class);
        when(paymentWorkflowValidator.validateForRemit((List<PaymentWorkflow>) any(), (List<Payment>) any()))
                .thenReturn(new ArrayList<>());
        when(paymentWorkflowValidator.validateForCancel((List<PaymentWorkflow>) any(), (List<Payment>) any()))
                .thenReturn(new ArrayList<>());
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentWorkflow paymentWorkflow = new PaymentWorkflow();
        paymentWorkflow.setAction(PaymentWorkflow.PaymentAction.REMIT);
        paymentWorkflow.setAdditionalDetails(MissingNode.getInstance());
        paymentWorkflow.setPaymentId("42");
        paymentWorkflow.setReason("Just cause");
        paymentWorkflow.setTenantId("42");

        PaymentWorkflow paymentWorkflow1 = new PaymentWorkflow();
        paymentWorkflow1.setAction(PaymentWorkflow.PaymentAction.CANCEL);
        paymentWorkflow1.setAdditionalDetails(MissingNode.getInstance());
        paymentWorkflow1.setPaymentId("42");
        paymentWorkflow1.setReason("Just cause");
        paymentWorkflow1.setTenantId("42");

        ArrayList<PaymentWorkflow> paymentWorkflowList = new ArrayList<>();
        paymentWorkflowList.add(paymentWorkflow1);
        paymentWorkflowList.add(paymentWorkflow);
        PaymentWorkflowRequest paymentWorkflowRequest = mock(PaymentWorkflowRequest.class);
        when(paymentWorkflowRequest.getRequestInfo()).thenReturn(new RequestInfo());
        when(paymentWorkflowRequest.getPaymentWorkflows()).thenReturn(paymentWorkflowList);
        doNothing().when(paymentWorkflowRequest).setPaymentWorkflows((List<PaymentWorkflow>) any());
        doNothing().when(paymentWorkflowRequest).setRequestInfo((RequestInfo) any());
        paymentWorkflowRequest.setPaymentWorkflows(new ArrayList<>());
        paymentWorkflowRequest.setRequestInfo(new RequestInfo());
        assertThrows(CustomException.class, () -> paymentWorkflowService.performWorkflow(paymentWorkflowRequest));
        verify(paymentWorkflowRequest, atLeast(1)).getPaymentWorkflows();
        verify(paymentWorkflowRequest).setPaymentWorkflows((List<PaymentWorkflow>) any());
        verify(paymentWorkflowRequest).setRequestInfo((RequestInfo) any());
    }

    @Test
    void testPerformWorkflow13() {

        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        when(paymentRepository.fetchPayments((org.egov.collection.model.PaymentSearchCriteria) any()))
                .thenReturn(new ArrayList<>());
        PaymentWorkflowValidator paymentWorkflowValidator = mock(PaymentWorkflowValidator.class);
        when(paymentWorkflowValidator.validateForRemit((List<PaymentWorkflow>) any(), (List<Payment>) any()))
                .thenThrow(new CustomException("?key=", "An error occurred"));
        when(paymentWorkflowValidator.validateForCancel((List<PaymentWorkflow>) any(), (List<Payment>) any()))
                .thenReturn(new ArrayList<>());
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        PaymentWorkflow paymentWorkflow = new PaymentWorkflow();
        paymentWorkflow.setAction(PaymentWorkflow.PaymentAction.REMIT);
        paymentWorkflow.setAdditionalDetails(MissingNode.getInstance());
        paymentWorkflow.setPaymentId("42");
        paymentWorkflow.setReason("Just cause");
        paymentWorkflow.setTenantId("42");

        ArrayList<PaymentWorkflow> paymentWorkflowList = new ArrayList<>();
        paymentWorkflowList.add(paymentWorkflow);
        PaymentWorkflowRequest paymentWorkflowRequest = mock(PaymentWorkflowRequest.class);
        when(paymentWorkflowRequest.getRequestInfo()).thenReturn(new RequestInfo());
        when(paymentWorkflowRequest.getPaymentWorkflows()).thenReturn(paymentWorkflowList);
        doNothing().when(paymentWorkflowRequest).setPaymentWorkflows((List<PaymentWorkflow>) any());
        doNothing().when(paymentWorkflowRequest).setRequestInfo((RequestInfo) any());
        paymentWorkflowRequest.setPaymentWorkflows(new ArrayList<>());
        paymentWorkflowRequest.setRequestInfo(new RequestInfo());
        assertThrows(CustomException.class, () -> paymentWorkflowService.performWorkflow(paymentWorkflowRequest));
        verify(paymentRepository, atLeast(1)).fetchPayments((org.egov.collection.model.PaymentSearchCriteria) any());
        verify(paymentWorkflowValidator).validateForRemit((List<PaymentWorkflow>) any(), (List<Payment>) any());
        verify(paymentWorkflowRequest, atLeast(1)).getPaymentWorkflows();
        verify(paymentWorkflowRequest).getRequestInfo();
        verify(paymentWorkflowRequest).setPaymentWorkflows((List<PaymentWorkflow>) any());
        verify(paymentWorkflowRequest).setRequestInfo((RequestInfo) any());
    }

    @Test
    void testGenerateNewReceiptUponStatusChange4() {

        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());

        ArrayList arrayList = new ArrayList();
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();
        arrayList.add(new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CASH, 1L, "42",
                InstrumentStatusEnum.APPROVED, "?key=", auditDetails, additionalDetails, new ArrayList<>(), "?key=", "42",
                "?key=", "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42"));
        assertTrue(paymentWorkflowService.generateNewReceiptUponStatusChange(arrayList, new RequestInfo()).isEmpty());
    }

    @Test
    void testGenerateNewReceiptUponStatusChange6() {

        PaymentRepository paymentRepository = mock(PaymentRepository.class);
        PaymentWorkflowValidator paymentWorkflowValidator = new PaymentWorkflowValidator();
        CollectionProducer collectionProducer = new CollectionProducer();
        PaymentWorkflowService paymentWorkflowService = new PaymentWorkflowService(paymentRepository,
                paymentWorkflowValidator, collectionProducer, new ApplicationProperties());
        Payment payment = mock(Payment.class);
        when(payment.getTenantId()).thenReturn("42");

        ArrayList arrayList = new ArrayList();
        arrayList.add(payment);
        assertTrue(paymentWorkflowService.generateNewReceiptUponStatusChange(arrayList, new RequestInfo()).isEmpty());
        verify(payment).getTenantId();
    }

    @Test
    void testUpdateAuditDetails5() {

        Payment payment = mock(Payment.class);
        when(payment.getPaymentDetails()).thenReturn(new ArrayList<>());
        when(payment.getAuditDetails()).thenReturn(new AuditDetails());

        User user = new User();
        user.setId(123L);

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(user);
        PaymentWorkflowService.updateAuditDetails(payment, requestInfo);
        verify(payment).getPaymentDetails();
        verify(payment, atLeast(1)).getAuditDetails();
    }

    @Test
    void testUpdateAuditDetails8() {

        Payment payment = mock(Payment.class);
        when(payment.getPaymentDetails()).thenThrow(new CustomException("Code", "An error occurred"));
        when(payment.getAuditDetails()).thenReturn(new AuditDetails());

        User user = new User();
        user.setId(123L);

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(user);
        assertThrows(CustomException.class, () -> PaymentWorkflowService.updateAuditDetails(payment, requestInfo));
        verify(payment).getPaymentDetails();
        verify(payment, atLeast(1)).getAuditDetails();
    }

    @Test
    void testUpdateAuditDetails11() {

        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getBill()).thenThrow(new CustomException("Code", "An error occurred"));
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());

        ArrayList<PaymentDetail> paymentDetailList = new ArrayList<>();
        paymentDetailList.add(paymentDetail);
        Payment payment = mock(Payment.class);
        when(payment.getPaymentDetails()).thenReturn(paymentDetailList);
        when(payment.getAuditDetails()).thenReturn(new AuditDetails());

        User user = new User();
        user.setId(123L);

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(user);
        assertThrows(CustomException.class, () -> PaymentWorkflowService.updateAuditDetails(payment, requestInfo));
        verify(payment).getPaymentDetails();
        verify(payment, atLeast(1)).getAuditDetails();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
        verify(paymentDetail).getBill();
    }

    @Test
    void testUpdateAuditDetails12() {

        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        MissingNode additionalDetails = MissingNode.getInstance();
        ArrayList<BillDetail> billDetails = new ArrayList<>();
        AuditDetails auditDetails = new AuditDetails();
        ArrayList<String> collectionModesNotAllowed = new ArrayList<>();
        BigDecimal minimumAmountToBePaid = BigDecimal.valueOf(42L);
        BigDecimal totalAmount = BigDecimal.valueOf(42L);
        when(paymentDetail.getBill()).thenReturn(new Bill("42", "42", "Paid By", "Payer Name", "42 Main St",
                "jane.doe@example.org", "42", Bill.StatusEnum.ACTIVE, "Just cause", true, additionalDetails, billDetails, "42",
                auditDetails, collectionModesNotAllowed, true, true, minimumAmountToBePaid, "Business Service", totalAmount,
                "Consumer Code", "42", 1L, BigDecimal.valueOf(42L)));
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());

        ArrayList<PaymentDetail> paymentDetailList = new ArrayList<>();
        paymentDetailList.add(paymentDetail);
        Payment payment = mock(Payment.class);
        when(payment.getPaymentDetails()).thenReturn(paymentDetailList);
        when(payment.getAuditDetails()).thenReturn(new AuditDetails());

        User user = new User();
        user.setId(123L);

        RequestInfo requestInfo = new RequestInfo();
        requestInfo.setUserInfo(user);
        PaymentWorkflowService.updateAuditDetails(payment, requestInfo);
        verify(payment).getPaymentDetails();
        verify(payment, atLeast(1)).getAuditDetails();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
        verify(paymentDetail, atLeast(1)).getBill();
    }
}

