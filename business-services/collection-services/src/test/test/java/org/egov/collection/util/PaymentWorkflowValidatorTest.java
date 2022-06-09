package org.egov.collection.util;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.node.MissingNode;

import java.util.ArrayList;
import java.util.List;

import org.egov.collection.model.Payment;
import org.egov.collection.web.contract.PaymentWorkflow;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {PaymentWorkflowValidator.class})
@ExtendWith(SpringExtension.class)
class PaymentWorkflowValidatorTest {
    @Autowired
    private PaymentWorkflowValidator paymentWorkflowValidator;

    @Test
    void testValidateForRemit() {
        ArrayList<PaymentWorkflow> paymentWorkflows = new ArrayList<>();
        assertTrue(this.paymentWorkflowValidator.validateForRemit(paymentWorkflows, new ArrayList<>()).isEmpty());
    }

    @Test
    void testValidateForRemit2() {
        PaymentWorkflow paymentWorkflow = new PaymentWorkflow();
        paymentWorkflow.setAction(PaymentWorkflow.PaymentAction.CANCEL);
        paymentWorkflow.setAdditionalDetails(MissingNode.getInstance());
        paymentWorkflow.setPaymentId("42");
        paymentWorkflow.setReason("Just cause");
        paymentWorkflow.setTenantId("42");

        ArrayList<PaymentWorkflow> paymentWorkflowList = new ArrayList<>();
        paymentWorkflowList.add(paymentWorkflow);
        assertThrows(CustomException.class,
                () -> this.paymentWorkflowValidator.validateForRemit(paymentWorkflowList, new ArrayList<>()));
    }

    @Test
    void testValidateForRemit3() {
        ArrayList<PaymentWorkflow> paymentWorkflows = new ArrayList<>();

        ArrayList<Payment> paymentList = new ArrayList<>();
        paymentList.add(new Payment());
        assertTrue(this.paymentWorkflowValidator.validateForRemit(paymentWorkflows, paymentList).isEmpty());
    }

    @Test
    void testValidateForRemit4() {
        PaymentWorkflow paymentWorkflow = mock(PaymentWorkflow.class);
        when(paymentWorkflow.getPaymentId()).thenReturn("42");
        doNothing().when(paymentWorkflow).setAction((PaymentWorkflow.PaymentAction) any());
        doNothing().when(paymentWorkflow).setAdditionalDetails((com.fasterxml.jackson.databind.JsonNode) any());
        doNothing().when(paymentWorkflow).setPaymentId((String) any());
        doNothing().when(paymentWorkflow).setReason((String) any());
        doNothing().when(paymentWorkflow).setTenantId((String) any());
        paymentWorkflow.setAction(PaymentWorkflow.PaymentAction.CANCEL);
        paymentWorkflow.setAdditionalDetails(MissingNode.getInstance());
        paymentWorkflow.setPaymentId("42");
        paymentWorkflow.setReason("Just cause");
        paymentWorkflow.setTenantId("42");

        ArrayList<PaymentWorkflow> paymentWorkflowList = new ArrayList<>();
        paymentWorkflowList.add(paymentWorkflow);
        assertThrows(CustomException.class,
                () -> this.paymentWorkflowValidator.validateForRemit(paymentWorkflowList, new ArrayList<>()));
        verify(paymentWorkflow, atLeast(1)).getPaymentId();
        verify(paymentWorkflow).setAction((PaymentWorkflow.PaymentAction) any());
        verify(paymentWorkflow).setAdditionalDetails((com.fasterxml.jackson.databind.JsonNode) any());
        verify(paymentWorkflow).setPaymentId((String) any());
        verify(paymentWorkflow).setReason((String) any());
        verify(paymentWorkflow).setTenantId((String) any());
    }

    @Test
    void testValidateForCancel() {
        ArrayList<PaymentWorkflow> paymentWorkflows = new ArrayList<>();
        ArrayList<Payment> paymentList = new ArrayList<>();
        assertTrue(this.paymentWorkflowValidator.validateForCancel(paymentWorkflows, paymentList).isEmpty());
        assertTrue(paymentList.isEmpty());
    }

    @Test
    void testValidateForCancel2() {
        PaymentWorkflow paymentWorkflow = new PaymentWorkflow();
        paymentWorkflow.setAction(PaymentWorkflow.PaymentAction.CANCEL);
        paymentWorkflow.setAdditionalDetails(MissingNode.getInstance());
        paymentWorkflow.setPaymentId("42");
        paymentWorkflow.setReason("Just cause");
        paymentWorkflow.setTenantId("42");

        ArrayList<PaymentWorkflow> paymentWorkflowList = new ArrayList<>();
        paymentWorkflowList.add(paymentWorkflow);
        assertThrows(CustomException.class,
                () -> this.paymentWorkflowValidator.validateForCancel(paymentWorkflowList, new ArrayList<>()));
    }

    @Test
    void testValidateForCancel5() {
        PaymentWorkflow paymentWorkflow = mock(PaymentWorkflow.class);
        when(paymentWorkflow.getPaymentId()).thenReturn("42");
        doNothing().when(paymentWorkflow).setAction((PaymentWorkflow.PaymentAction) any());
        doNothing().when(paymentWorkflow).setAdditionalDetails((com.fasterxml.jackson.databind.JsonNode) any());
        doNothing().when(paymentWorkflow).setPaymentId((String) any());
        doNothing().when(paymentWorkflow).setReason((String) any());
        doNothing().when(paymentWorkflow).setTenantId((String) any());
        paymentWorkflow.setAction(PaymentWorkflow.PaymentAction.CANCEL);
        paymentWorkflow.setAdditionalDetails(MissingNode.getInstance());
        paymentWorkflow.setPaymentId("42");
        paymentWorkflow.setReason("Just cause");
        paymentWorkflow.setTenantId("42");

        ArrayList<PaymentWorkflow> paymentWorkflowList = new ArrayList<>();
        paymentWorkflowList.add(paymentWorkflow);
        assertThrows(CustomException.class,
                () -> this.paymentWorkflowValidator.validateForCancel(paymentWorkflowList, new ArrayList<>()));
        verify(paymentWorkflow, atLeast(1)).getPaymentId();
        verify(paymentWorkflow).setAction((PaymentWorkflow.PaymentAction) any());
        verify(paymentWorkflow).setAdditionalDetails((com.fasterxml.jackson.databind.JsonNode) any());
        verify(paymentWorkflow).setPaymentId((String) any());
        verify(paymentWorkflow).setReason((String) any());
        verify(paymentWorkflow).setTenantId((String) any());
    }
}

