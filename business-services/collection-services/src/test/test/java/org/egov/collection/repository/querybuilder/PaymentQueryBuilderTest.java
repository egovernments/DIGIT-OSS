package org.egov.collection.repository.querybuilder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.BigIntegerNode;
import com.fasterxml.jackson.databind.node.BinaryNode;
import com.fasterxml.jackson.databind.node.BooleanNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.LongNode;
import com.fasterxml.jackson.databind.node.MissingNode;
import com.fasterxml.jackson.databind.node.NullNode;

import java.io.IOException;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

import org.egov.collection.config.ApplicationProperties;
import org.egov.collection.model.AuditDetails;
import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentDetail;
import org.egov.collection.model.PaymentSearchCriteria;
import org.egov.collection.model.enums.CollectionType;
import org.egov.collection.model.enums.InstrumentStatusEnum;
import org.egov.collection.model.enums.PaymentModeEnum;
import org.egov.collection.model.enums.PaymentStatusEnum;
import org.egov.collection.model.enums.Purpose;
import org.egov.collection.web.contract.Bill;
import org.egov.collection.web.contract.BillAccountDetail;
import org.egov.collection.web.contract.BillDetail;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

//@ContextConfiguration(classes = {PaymentQueryBuilder.class, ApplicationProperties.class})
//@ExtendWith(SpringExtension.class)
class PaymentQueryBuilderTest {
    @MockBean
    private boolean aBoolean;

    @Autowired
    private PaymentQueryBuilder paymentQueryBuilder;

    @Test
    void testGetParametersForPaymentCreate3() {
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();

        Payment payment = new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CASH, 1L, "42",
                InstrumentStatusEnum.APPROVED, "Ifsc Code", auditDetails, additionalDetails, new ArrayList<>(), "Paid By", "42",
                "Payer Name", "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42");
        payment.setPaymentMode(PaymentModeEnum.CASH);
        assertEquals(23, PaymentQueryBuilder.getParametersForPaymentCreate(payment).getParameterNames().length);
    }

    @Test
    void testGetParametersForPaymentCreate5() {
        AuditDetails auditDetails = mock(AuditDetails.class);
        when(auditDetails.getCreatedTime()).thenReturn(1L);
        when(auditDetails.getLastModifiedTime()).thenReturn(1L);
        when(auditDetails.getCreatedBy()).thenReturn("Jan 1, 2020 8:00am GMT+0100");
        when(auditDetails.getLastModifiedBy()).thenReturn("Jan 1, 2020 9:00am GMT+0100");
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        MissingNode additionalDetails = MissingNode.getInstance();

        Payment payment = new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CASH, 1L, "42",
                InstrumentStatusEnum.APPROVED, "Ifsc Code", auditDetails, additionalDetails, new ArrayList<>(), "Paid By", "42",
                "Payer Name", "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42");
        payment.setPaymentMode(PaymentModeEnum.CASH);
        assertEquals(23, PaymentQueryBuilder.getParametersForPaymentCreate(payment).getParameterNames().length);
        verify(auditDetails).getCreatedTime();
        verify(auditDetails).getLastModifiedTime();
        verify(auditDetails).getCreatedBy();
        verify(auditDetails).getLastModifiedBy();
    }

    @Test
    void testGetParametersForPaymentCreate6() {
        AuditDetails auditDetails = mock(AuditDetails.class);
        when(auditDetails.getCreatedTime()).thenReturn(1L);
        when(auditDetails.getLastModifiedTime()).thenReturn(1L);
        when(auditDetails.getCreatedBy()).thenReturn("Jan 1, 2020 8:00am GMT+0100");
        when(auditDetails.getLastModifiedBy()).thenReturn("Jan 1, 2020 9:00am GMT+0100");
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        NullNode additionalDetails = NullNode.getInstance();

        Payment payment = new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CASH, 1L, "42",
                InstrumentStatusEnum.APPROVED, "Ifsc Code", auditDetails, additionalDetails, new ArrayList<>(), "Paid By", "42",
                "Payer Name", "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42");
        payment.setPaymentMode(PaymentModeEnum.CASH);
        assertEquals(23, PaymentQueryBuilder.getParametersForPaymentCreate(payment).getParameterNames().length);
        verify(auditDetails).getCreatedTime();
        verify(auditDetails).getLastModifiedTime();
        verify(auditDetails).getCreatedBy();
        verify(auditDetails).getLastModifiedBy();
    }

    @Test
    void testGetParametersForPaymentCreate7() {
        AuditDetails auditDetails = mock(AuditDetails.class);
        when(auditDetails.getCreatedTime()).thenReturn(1L);
        when(auditDetails.getLastModifiedTime()).thenReturn(1L);
        when(auditDetails.getCreatedBy()).thenReturn("Jan 1, 2020 8:00am GMT+0100");
        when(auditDetails.getLastModifiedBy()).thenReturn("Jan 1, 2020 9:00am GMT+0100");
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        BooleanNode additionalDetails = BooleanNode.getFalse();

        Payment payment = new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CASH, 1L, "42",
                InstrumentStatusEnum.APPROVED, "Ifsc Code", auditDetails, additionalDetails, new ArrayList<>(), "Paid By", "42",
                "Payer Name", "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42");
        payment.setPaymentMode(PaymentModeEnum.CASH);
        assertEquals(23, PaymentQueryBuilder.getParametersForPaymentCreate(payment).getParameterNames().length);
        verify(auditDetails).getCreatedTime();
        verify(auditDetails).getLastModifiedTime();
        verify(auditDetails).getCreatedBy();
        verify(auditDetails).getLastModifiedBy();
    }

    @Test
    void testGetParametersForPaymentDetailCreate2() {
        PaymentDetail paymentDetail = new PaymentDetail();
        paymentDetail.setAuditDetails(new AuditDetails());
        assertEquals(17,
                PaymentQueryBuilder.getParametersForPaymentDetailCreate("42", paymentDetail).getParameterNames().length);
    }

    @Test
    void testGetParametersForPaymentDetailCreate3() {
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        Bill bill = new Bill();
        MissingNode additionalDetails = MissingNode.getInstance();
        assertEquals(17,
                PaymentQueryBuilder
                        .getParametersForPaymentDetailCreate("42",
                                new PaymentDetail("42", "42", "42", totalDue, totalAmountPaid, "42", "42", 1L, 1L, "id", "id", "42",
                                        bill, additionalDetails, new AuditDetails()))
                        .getParameterNames().length);
    }

    @Test
    void testGetParametersForPaymentDetailCreate5() {
        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getAdditionalDetails()).thenReturn(MissingNode.getInstance());
        when(paymentDetail.getManualReceiptDate()).thenReturn(1L);
        when(paymentDetail.getReceiptDate()).thenReturn(1L);
        when(paymentDetail.getBillId()).thenReturn("42");
        when(paymentDetail.getBusinessService()).thenReturn("Business Service");
        when(paymentDetail.getId()).thenReturn("42");
        when(paymentDetail.getManualReceiptNumber()).thenReturn("42");
        when(paymentDetail.getReceiptNumber()).thenReturn("42");
        when(paymentDetail.getReceiptType()).thenReturn("Receipt Type");
        when(paymentDetail.getTenantId()).thenReturn("42");
        when(paymentDetail.getTotalAmountPaid()).thenReturn(BigDecimal.valueOf(42L));
        when(paymentDetail.getTotalDue()).thenReturn(BigDecimal.valueOf(42L));
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());
        assertEquals(17,
                PaymentQueryBuilder.getParametersForPaymentDetailCreate("42", paymentDetail).getParameterNames().length);
        verify(paymentDetail).getAdditionalDetails();
        verify(paymentDetail).getManualReceiptDate();
        verify(paymentDetail).getReceiptDate();
        verify(paymentDetail).getBillId();
        verify(paymentDetail).getBusinessService();
        verify(paymentDetail).getId();
        verify(paymentDetail).getManualReceiptNumber();
        verify(paymentDetail).getReceiptNumber();
        verify(paymentDetail).getReceiptType();
        verify(paymentDetail).getTenantId();
        verify(paymentDetail).getTotalAmountPaid();
        verify(paymentDetail).getTotalDue();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentDetailCreate6() {
        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getAdditionalDetails()).thenReturn(new ArrayNode(JsonNodeFactory.withExactBigDecimals(true)));
        when(paymentDetail.getManualReceiptDate()).thenReturn(1L);
        when(paymentDetail.getReceiptDate()).thenReturn(1L);
        when(paymentDetail.getBillId()).thenReturn("42");
        when(paymentDetail.getBusinessService()).thenReturn("Business Service");
        when(paymentDetail.getId()).thenReturn("42");
        when(paymentDetail.getManualReceiptNumber()).thenReturn("42");
        when(paymentDetail.getReceiptNumber()).thenReturn("42");
        when(paymentDetail.getReceiptType()).thenReturn("Receipt Type");
        when(paymentDetail.getTenantId()).thenReturn("42");
        when(paymentDetail.getTotalAmountPaid()).thenReturn(BigDecimal.valueOf(42L));
        when(paymentDetail.getTotalDue()).thenReturn(BigDecimal.valueOf(42L));
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());
        assertEquals(17,
                PaymentQueryBuilder.getParametersForPaymentDetailCreate("42", paymentDetail).getParameterNames().length);
        verify(paymentDetail).getAdditionalDetails();
        verify(paymentDetail).getManualReceiptDate();
        verify(paymentDetail).getReceiptDate();
        verify(paymentDetail).getBillId();
        verify(paymentDetail).getBusinessService();
        verify(paymentDetail).getId();
        verify(paymentDetail).getManualReceiptNumber();
        verify(paymentDetail).getReceiptNumber();
        verify(paymentDetail).getReceiptType();
        verify(paymentDetail).getTenantId();
        verify(paymentDetail).getTotalAmountPaid();
        verify(paymentDetail).getTotalDue();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentDetailCreate7() {
        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getAdditionalDetails()).thenReturn(new BigIntegerNode(BigInteger.valueOf(42L)));
        when(paymentDetail.getManualReceiptDate()).thenReturn(1L);
        when(paymentDetail.getReceiptDate()).thenReturn(1L);
        when(paymentDetail.getBillId()).thenReturn("42");
        when(paymentDetail.getBusinessService()).thenReturn("Business Service");
        when(paymentDetail.getId()).thenReturn("42");
        when(paymentDetail.getManualReceiptNumber()).thenReturn("42");
        when(paymentDetail.getReceiptNumber()).thenReturn("42");
        when(paymentDetail.getReceiptType()).thenReturn("Receipt Type");
        when(paymentDetail.getTenantId()).thenReturn("42");
        when(paymentDetail.getTotalAmountPaid()).thenReturn(BigDecimal.valueOf(42L));
        when(paymentDetail.getTotalDue()).thenReturn(BigDecimal.valueOf(42L));
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());
        assertEquals(17,
                PaymentQueryBuilder.getParametersForPaymentDetailCreate("42", paymentDetail).getParameterNames().length);
        verify(paymentDetail).getAdditionalDetails();
        verify(paymentDetail).getManualReceiptDate();
        verify(paymentDetail).getReceiptDate();
        verify(paymentDetail).getBillId();
        verify(paymentDetail).getBusinessService();
        verify(paymentDetail).getId();
        verify(paymentDetail).getManualReceiptNumber();
        verify(paymentDetail).getReceiptNumber();
        verify(paymentDetail).getReceiptType();
        verify(paymentDetail).getTenantId();
        verify(paymentDetail).getTotalAmountPaid();
        verify(paymentDetail).getTotalDue();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentDetailCreate8() throws UnsupportedEncodingException {
        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getAdditionalDetails()).thenReturn(new BinaryNode("AAAAAAAA".getBytes("UTF-8")));
        when(paymentDetail.getManualReceiptDate()).thenReturn(1L);
        when(paymentDetail.getReceiptDate()).thenReturn(1L);
        when(paymentDetail.getBillId()).thenReturn("42");
        when(paymentDetail.getBusinessService()).thenReturn("Business Service");
        when(paymentDetail.getId()).thenReturn("42");
        when(paymentDetail.getManualReceiptNumber()).thenReturn("42");
        when(paymentDetail.getReceiptNumber()).thenReturn("42");
        when(paymentDetail.getReceiptType()).thenReturn("Receipt Type");
        when(paymentDetail.getTenantId()).thenReturn("42");
        when(paymentDetail.getTotalAmountPaid()).thenReturn(BigDecimal.valueOf(42L));
        when(paymentDetail.getTotalDue()).thenReturn(BigDecimal.valueOf(42L));
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());
        assertEquals(17,
                PaymentQueryBuilder.getParametersForPaymentDetailCreate("42", paymentDetail).getParameterNames().length);
        verify(paymentDetail).getAdditionalDetails();
        verify(paymentDetail).getManualReceiptDate();
        verify(paymentDetail).getReceiptDate();
        verify(paymentDetail).getBillId();
        verify(paymentDetail).getBusinessService();
        verify(paymentDetail).getId();
        verify(paymentDetail).getManualReceiptNumber();
        verify(paymentDetail).getReceiptNumber();
        verify(paymentDetail).getReceiptType();
        verify(paymentDetail).getTenantId();
        verify(paymentDetail).getTotalAmountPaid();
        verify(paymentDetail).getTotalDue();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentDetailCreate9() {
        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getAdditionalDetails()).thenReturn(NullNode.getInstance());
        when(paymentDetail.getManualReceiptDate()).thenReturn(1L);
        when(paymentDetail.getReceiptDate()).thenReturn(1L);
        when(paymentDetail.getBillId()).thenReturn("42");
        when(paymentDetail.getBusinessService()).thenReturn("Business Service");
        when(paymentDetail.getId()).thenReturn("42");
        when(paymentDetail.getManualReceiptNumber()).thenReturn("42");
        when(paymentDetail.getReceiptNumber()).thenReturn("42");
        when(paymentDetail.getReceiptType()).thenReturn("Receipt Type");
        when(paymentDetail.getTenantId()).thenReturn("42");
        when(paymentDetail.getTotalAmountPaid()).thenReturn(BigDecimal.valueOf(42L));
        when(paymentDetail.getTotalDue()).thenReturn(BigDecimal.valueOf(42L));
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());
        assertEquals(17,
                PaymentQueryBuilder.getParametersForPaymentDetailCreate("42", paymentDetail).getParameterNames().length);
        verify(paymentDetail).getAdditionalDetails();
        verify(paymentDetail).getManualReceiptDate();
        verify(paymentDetail).getReceiptDate();
        verify(paymentDetail).getBillId();
        verify(paymentDetail).getBusinessService();
        verify(paymentDetail).getId();
        verify(paymentDetail).getManualReceiptNumber();
        verify(paymentDetail).getReceiptNumber();
        verify(paymentDetail).getReceiptType();
        verify(paymentDetail).getTenantId();
        verify(paymentDetail).getTotalAmountPaid();
        verify(paymentDetail).getTotalDue();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParamtersForBillCreate3() {
        MissingNode additionalDetails = MissingNode.getInstance();
        ArrayList<BillDetail> billDetails = new ArrayList<>();
        AuditDetails auditDetails = new AuditDetails();
        ArrayList<String> collectionModesNotAllowed = new ArrayList<>();
        BigDecimal minimumAmountToBePaid = BigDecimal.valueOf(42L);
        BigDecimal totalAmount = BigDecimal.valueOf(42L);

        Bill bill = new Bill("42", "42", "Paid By", "Payer Name", "42 Main St", "jane.doe@example.org", "42",
                Bill.StatusEnum.ACTIVE, "Just cause", true, additionalDetails, billDetails, "42", auditDetails,
                collectionModesNotAllowed, true, true, minimumAmountToBePaid, "Business Service", totalAmount, "Consumer Code",
                "42", 1L, BigDecimal.valueOf(42L));
        bill.setStatus(Bill.StatusEnum.ACTIVE);
        MapSqlParameterSource actualParamtersForBillCreate = PaymentQueryBuilder.getParamtersForBillCreate(bill);
        assertEquals(19, actualParamtersForBillCreate.getParameterNames().length);
        Map<String, Object> values = actualParamtersForBillCreate.getValues();
        Object expectedValue = values.get("collectionmodesnotallowed");
        assertSame(expectedValue, ((PGobject) values.get("additionaldetails")).getValue());
        assertEquals("jsonb", ((PGobject) values.get("additionaldetails")).getType());
    }

    @Test
    void testGetParamtersForBillCreate4() {
        ArrayNode additionalDetails = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        ArrayList<BillDetail> billDetails = new ArrayList<>();
        AuditDetails auditDetails = new AuditDetails();
        ArrayList<String> collectionModesNotAllowed = new ArrayList<>();
        BigDecimal minimumAmountToBePaid = BigDecimal.valueOf(42L);
        BigDecimal totalAmount = BigDecimal.valueOf(42L);

        Bill bill = new Bill("42", "42", "Paid By", "Payer Name", "42 Main St", "jane.doe@example.org", "42",
                Bill.StatusEnum.ACTIVE, "Just cause", true, additionalDetails, billDetails, "42", auditDetails,
                collectionModesNotAllowed, true, true, minimumAmountToBePaid, "Business Service", totalAmount, "Consumer Code",
                "42", 1L, BigDecimal.valueOf(42L));
        bill.setStatus(Bill.StatusEnum.ACTIVE);
        MapSqlParameterSource actualParamtersForBillCreate = PaymentQueryBuilder.getParamtersForBillCreate(bill);
        assertEquals(19, actualParamtersForBillCreate.getParameterNames().length);
        assertEquals("[]", ((PGobject) actualParamtersForBillCreate.getValues().get("additionaldetails")).getValue());
        assertEquals("jsonb", ((PGobject) actualParamtersForBillCreate.getValues().get("additionaldetails")).getType());
    }

    @Test
    void testGetParamtersForBillCreate5() {
        BigIntegerNode additionalDetails = new BigIntegerNode(BigInteger.valueOf(42L));
        ArrayList<BillDetail> billDetails = new ArrayList<>();
        AuditDetails auditDetails = new AuditDetails();
        ArrayList<String> collectionModesNotAllowed = new ArrayList<>();
        BigDecimal minimumAmountToBePaid = BigDecimal.valueOf(42L);
        BigDecimal totalAmount = BigDecimal.valueOf(42L);

        Bill bill = new Bill("42", "42", "Paid By", "Payer Name", "42 Main St", "jane.doe@example.org", "42",
                Bill.StatusEnum.ACTIVE, "Just cause", true, additionalDetails, billDetails, "42", auditDetails,
                collectionModesNotAllowed, true, true, minimumAmountToBePaid, "Business Service", totalAmount, "Consumer Code",
                "42", 1L, BigDecimal.valueOf(42L));
        bill.setStatus(Bill.StatusEnum.ACTIVE);
        MapSqlParameterSource actualParamtersForBillCreate = PaymentQueryBuilder.getParamtersForBillCreate(bill);
        assertEquals(19, actualParamtersForBillCreate.getParameterNames().length);
        assertEquals("42", ((PGobject) actualParamtersForBillCreate.getValues().get("additionaldetails")).getValue());
        assertEquals("jsonb", ((PGobject) actualParamtersForBillCreate.getValues().get("additionaldetails")).getType());
    }

    @Test
    void testGetParamtersForBillCreate6() throws UnsupportedEncodingException {
        BinaryNode additionalDetails = new BinaryNode("AAAAAAAA".getBytes("UTF-8"));
        ArrayList<BillDetail> billDetails = new ArrayList<>();
        AuditDetails auditDetails = new AuditDetails();
        ArrayList<String> collectionModesNotAllowed = new ArrayList<>();
        BigDecimal minimumAmountToBePaid = BigDecimal.valueOf(42L);
        BigDecimal totalAmount = BigDecimal.valueOf(42L);

        Bill bill = new Bill("42", "42", "Paid By", "Payer Name", "42 Main St", "jane.doe@example.org", "42",
                Bill.StatusEnum.ACTIVE, "Just cause", true, additionalDetails, billDetails, "42", auditDetails,
                collectionModesNotAllowed, true, true, minimumAmountToBePaid, "Business Service", totalAmount, "Consumer Code",
                "42", 1L, BigDecimal.valueOf(42L));
        bill.setStatus(Bill.StatusEnum.ACTIVE);
        MapSqlParameterSource actualParamtersForBillCreate = PaymentQueryBuilder.getParamtersForBillCreate(bill);
        assertEquals(19, actualParamtersForBillCreate.getParameterNames().length);
        assertEquals("\"QUFBQUFBQUE=\"",
                ((PGobject) actualParamtersForBillCreate.getValues().get("additionaldetails")).getValue());
        assertEquals("jsonb", ((PGobject) actualParamtersForBillCreate.getValues().get("additionaldetails")).getType());
    }

    @Test
    void testGetParamtersForBillCreate7() {
        NullNode additionalDetails = NullNode.getInstance();
        ArrayList<BillDetail> billDetails = new ArrayList<>();
        AuditDetails auditDetails = new AuditDetails();
        ArrayList<String> collectionModesNotAllowed = new ArrayList<>();
        BigDecimal minimumAmountToBePaid = BigDecimal.valueOf(42L);
        BigDecimal totalAmount = BigDecimal.valueOf(42L);

        Bill bill = new Bill("42", "42", "Paid By", "Payer Name", "42 Main St", "jane.doe@example.org", "42",
                Bill.StatusEnum.ACTIVE, "Just cause", true, additionalDetails, billDetails, "42", auditDetails,
                collectionModesNotAllowed, true, true, minimumAmountToBePaid, "Business Service", totalAmount, "Consumer Code",
                "42", 1L, BigDecimal.valueOf(42L));
        bill.setStatus(Bill.StatusEnum.ACTIVE);
        MapSqlParameterSource actualParamtersForBillCreate = PaymentQueryBuilder.getParamtersForBillCreate(bill);
        assertEquals(19, actualParamtersForBillCreate.getParameterNames().length);
        assertEquals("null", ((PGobject) actualParamtersForBillCreate.getValues().get("additionaldetails")).getValue());
        assertEquals("jsonb", ((PGobject) actualParamtersForBillCreate.getValues().get("additionaldetails")).getType());
    }

    @Test
    void testGetParamtersForBillCreate8() {
        AuditDetails auditDetails = mock(AuditDetails.class);
        when(auditDetails.getCreatedTime()).thenReturn(1L);
        when(auditDetails.getLastModifiedTime()).thenReturn(1L);
        when(auditDetails.getCreatedBy()).thenReturn("Jan 1, 2020 8:00am GMT+0100");
        when(auditDetails.getLastModifiedBy()).thenReturn("Jan 1, 2020 9:00am GMT+0100");
        MissingNode additionalDetails = MissingNode.getInstance();
        ArrayList<BillDetail> billDetails = new ArrayList<>();
        ArrayList<String> collectionModesNotAllowed = new ArrayList<>();
        BigDecimal minimumAmountToBePaid = BigDecimal.valueOf(42L);
        BigDecimal totalAmount = BigDecimal.valueOf(42L);

        Bill bill = new Bill("42", "42", "Paid By", "Payer Name", "42 Main St", "jane.doe@example.org", "42",
                Bill.StatusEnum.ACTIVE, "Just cause", true, additionalDetails, billDetails, "42", auditDetails,
                collectionModesNotAllowed, true, true, minimumAmountToBePaid, "Business Service", totalAmount, "Consumer Code",
                "42", 1L, BigDecimal.valueOf(42L));
        bill.setStatus(Bill.StatusEnum.ACTIVE);
        MapSqlParameterSource actualParamtersForBillCreate = PaymentQueryBuilder.getParamtersForBillCreate(bill);
        assertEquals(19, actualParamtersForBillCreate.getParameterNames().length);
        Map<String, Object> values = actualParamtersForBillCreate.getValues();
        Object expectedValue = values.get("collectionmodesnotallowed");
        assertSame(expectedValue, ((PGobject) values.get("additionaldetails")).getValue());
        assertEquals("jsonb", ((PGobject) values.get("additionaldetails")).getType());
        verify(auditDetails).getCreatedTime();
        verify(auditDetails).getLastModifiedTime();
        verify(auditDetails).getCreatedBy();
        verify(auditDetails).getLastModifiedBy();
    }

    @Test
    void testGetParamtersForBillDetailCreate() {
        assertEquals(20, PaymentQueryBuilder.getParamtersForBillDetailCreate(new BillDetail()).getParameterNames().length);
    }

    @Test
    void testGetParamtersForBillDetailCreate2() {
        BigDecimal amount = BigDecimal.valueOf(42L);
        BigDecimal amountPaid = BigDecimal.valueOf(42L);
        MissingNode additionalDetails = MissingNode.getInstance();
        ArrayList<BillAccountDetail> billAccountDetails = new ArrayList<>();
        assertEquals(20, PaymentQueryBuilder
                .getParamtersForBillDetailCreate(
                        new BillDetail("42", "42", "42", "42", amount, amountPaid, 1L, 1L, additionalDetails, "id", "id", "id",
                                "42", 1L, billAccountDetails, CollectionType.COUNTER, new AuditDetails(), "id", 1L, "id", true, "id"))
                .getParameterNames().length);
    }

    @Test
    void testGetParamtersForBillDetailCreate4() {
        BillDetail billDetail = mock(BillDetail.class);
        when(billDetail.getAdditionalDetails()).thenReturn(MissingNode.getInstance());
        when(billDetail.getCallBackForApportioning()).thenReturn(true);
        when(billDetail.getExpiryDate()).thenReturn(1L);
        when(billDetail.getFromPeriod()).thenReturn(1L);
        when(billDetail.getManualReceiptDate()).thenReturn(1L);
        when(billDetail.getToPeriod()).thenReturn(1L);
        when(billDetail.getBillDescription()).thenReturn("Bill Description");
        when(billDetail.getBillId()).thenReturn("42");
        when(billDetail.getBoundary()).thenReturn("Boundary");
        when(billDetail.getCancellationRemarks()).thenReturn("Cancellation Remarks");
        when(billDetail.getChannel()).thenReturn("Channel");
        when(billDetail.getDemandId()).thenReturn("42");
        when(billDetail.getDisplayMessage()).thenReturn("Display Message");
        when(billDetail.getId()).thenReturn("42");
        when(billDetail.getManualReceiptNumber()).thenReturn("42");
        when(billDetail.getTenantId()).thenReturn("42");
        when(billDetail.getVoucherHeader()).thenReturn("Voucher Header");
        when(billDetail.getAmount()).thenReturn(BigDecimal.valueOf(42L));
        when(billDetail.getAmountPaid()).thenReturn(BigDecimal.valueOf(42L));
        when(billDetail.getCollectionType()).thenReturn(CollectionType.COUNTER);
        assertEquals(20, PaymentQueryBuilder.getParamtersForBillDetailCreate(billDetail).getParameterNames().length);
        verify(billDetail).getAdditionalDetails();
        verify(billDetail).getCallBackForApportioning();
        verify(billDetail).getExpiryDate();
        verify(billDetail).getFromPeriod();
        verify(billDetail).getManualReceiptDate();
        verify(billDetail).getToPeriod();
        verify(billDetail).getBillDescription();
        verify(billDetail).getBillId();
        verify(billDetail).getBoundary();
        verify(billDetail).getCancellationRemarks();
        verify(billDetail).getChannel();
        verify(billDetail).getDemandId();
        verify(billDetail).getDisplayMessage();
        verify(billDetail).getId();
        verify(billDetail).getManualReceiptNumber();
        verify(billDetail).getTenantId();
        verify(billDetail).getVoucherHeader();
        verify(billDetail).getAmount();
        verify(billDetail).getAmountPaid();
        verify(billDetail).getCollectionType();
    }

    @Test
    void testGetParamtersForBillDetailCreate5() {
        BillDetail billDetail = mock(BillDetail.class);
        when(billDetail.getAdditionalDetails()).thenReturn(new ArrayNode(JsonNodeFactory.withExactBigDecimals(true)));
        when(billDetail.getCallBackForApportioning()).thenReturn(true);
        when(billDetail.getExpiryDate()).thenReturn(1L);
        when(billDetail.getFromPeriod()).thenReturn(1L);
        when(billDetail.getManualReceiptDate()).thenReturn(1L);
        when(billDetail.getToPeriod()).thenReturn(1L);
        when(billDetail.getBillDescription()).thenReturn("Bill Description");
        when(billDetail.getBillId()).thenReturn("42");
        when(billDetail.getBoundary()).thenReturn("Boundary");
        when(billDetail.getCancellationRemarks()).thenReturn("Cancellation Remarks");
        when(billDetail.getChannel()).thenReturn("Channel");
        when(billDetail.getDemandId()).thenReturn("42");
        when(billDetail.getDisplayMessage()).thenReturn("Display Message");
        when(billDetail.getId()).thenReturn("42");
        when(billDetail.getManualReceiptNumber()).thenReturn("42");
        when(billDetail.getTenantId()).thenReturn("42");
        when(billDetail.getVoucherHeader()).thenReturn("Voucher Header");
        when(billDetail.getAmount()).thenReturn(BigDecimal.valueOf(42L));
        when(billDetail.getAmountPaid()).thenReturn(BigDecimal.valueOf(42L));
        when(billDetail.getCollectionType()).thenReturn(CollectionType.COUNTER);
        assertEquals(20, PaymentQueryBuilder.getParamtersForBillDetailCreate(billDetail).getParameterNames().length);
        verify(billDetail).getAdditionalDetails();
        verify(billDetail).getCallBackForApportioning();
        verify(billDetail).getExpiryDate();
        verify(billDetail).getFromPeriod();
        verify(billDetail).getManualReceiptDate();
        verify(billDetail).getToPeriod();
        verify(billDetail).getBillDescription();
        verify(billDetail).getBillId();
        verify(billDetail).getBoundary();
        verify(billDetail).getCancellationRemarks();
        verify(billDetail).getChannel();
        verify(billDetail).getDemandId();
        verify(billDetail).getDisplayMessage();
        verify(billDetail).getId();
        verify(billDetail).getManualReceiptNumber();
        verify(billDetail).getTenantId();
        verify(billDetail).getVoucherHeader();
        verify(billDetail).getAmount();
        verify(billDetail).getAmountPaid();
        verify(billDetail).getCollectionType();
    }

    @Test
    void testGetParamtersForBillDetailCreate6() {
        BillDetail billDetail = mock(BillDetail.class);
        when(billDetail.getAdditionalDetails()).thenReturn(new BigIntegerNode(BigInteger.valueOf(42L)));
        when(billDetail.getCallBackForApportioning()).thenReturn(true);
        when(billDetail.getExpiryDate()).thenReturn(1L);
        when(billDetail.getFromPeriod()).thenReturn(1L);
        when(billDetail.getManualReceiptDate()).thenReturn(1L);
        when(billDetail.getToPeriod()).thenReturn(1L);
        when(billDetail.getBillDescription()).thenReturn("Bill Description");
        when(billDetail.getBillId()).thenReturn("42");
        when(billDetail.getBoundary()).thenReturn("Boundary");
        when(billDetail.getCancellationRemarks()).thenReturn("Cancellation Remarks");
        when(billDetail.getChannel()).thenReturn("Channel");
        when(billDetail.getDemandId()).thenReturn("42");
        when(billDetail.getDisplayMessage()).thenReturn("Display Message");
        when(billDetail.getId()).thenReturn("42");
        when(billDetail.getManualReceiptNumber()).thenReturn("42");
        when(billDetail.getTenantId()).thenReturn("42");
        when(billDetail.getVoucherHeader()).thenReturn("Voucher Header");
        when(billDetail.getAmount()).thenReturn(BigDecimal.valueOf(42L));
        when(billDetail.getAmountPaid()).thenReturn(BigDecimal.valueOf(42L));
        when(billDetail.getCollectionType()).thenReturn(CollectionType.COUNTER);
        assertEquals(20, PaymentQueryBuilder.getParamtersForBillDetailCreate(billDetail).getParameterNames().length);
        verify(billDetail).getAdditionalDetails();
        verify(billDetail).getCallBackForApportioning();
        verify(billDetail).getExpiryDate();
        verify(billDetail).getFromPeriod();
        verify(billDetail).getManualReceiptDate();
        verify(billDetail).getToPeriod();
        verify(billDetail).getBillDescription();
        verify(billDetail).getBillId();
        verify(billDetail).getBoundary();
        verify(billDetail).getCancellationRemarks();
        verify(billDetail).getChannel();
        verify(billDetail).getDemandId();
        verify(billDetail).getDisplayMessage();
        verify(billDetail).getId();
        verify(billDetail).getManualReceiptNumber();
        verify(billDetail).getTenantId();
        verify(billDetail).getVoucherHeader();
        verify(billDetail).getAmount();
        verify(billDetail).getAmountPaid();
        verify(billDetail).getCollectionType();
    }

    @Test
    void testGetParamtersForBillDetailCreate7() throws UnsupportedEncodingException {
        BillDetail billDetail = mock(BillDetail.class);
        when(billDetail.getAdditionalDetails()).thenReturn(new BinaryNode("AAAAAAAA".getBytes("UTF-8")));
        when(billDetail.getCallBackForApportioning()).thenReturn(true);
        when(billDetail.getExpiryDate()).thenReturn(1L);
        when(billDetail.getFromPeriod()).thenReturn(1L);
        when(billDetail.getManualReceiptDate()).thenReturn(1L);
        when(billDetail.getToPeriod()).thenReturn(1L);
        when(billDetail.getBillDescription()).thenReturn("Bill Description");
        when(billDetail.getBillId()).thenReturn("42");
        when(billDetail.getBoundary()).thenReturn("Boundary");
        when(billDetail.getCancellationRemarks()).thenReturn("Cancellation Remarks");
        when(billDetail.getChannel()).thenReturn("Channel");
        when(billDetail.getDemandId()).thenReturn("42");
        when(billDetail.getDisplayMessage()).thenReturn("Display Message");
        when(billDetail.getId()).thenReturn("42");
        when(billDetail.getManualReceiptNumber()).thenReturn("42");
        when(billDetail.getTenantId()).thenReturn("42");
        when(billDetail.getVoucherHeader()).thenReturn("Voucher Header");
        when(billDetail.getAmount()).thenReturn(BigDecimal.valueOf(42L));
        when(billDetail.getAmountPaid()).thenReturn(BigDecimal.valueOf(42L));
        when(billDetail.getCollectionType()).thenReturn(CollectionType.COUNTER);
        assertEquals(20, PaymentQueryBuilder.getParamtersForBillDetailCreate(billDetail).getParameterNames().length);
        verify(billDetail).getAdditionalDetails();
        verify(billDetail).getCallBackForApportioning();
        verify(billDetail).getExpiryDate();
        verify(billDetail).getFromPeriod();
        verify(billDetail).getManualReceiptDate();
        verify(billDetail).getToPeriod();
        verify(billDetail).getBillDescription();
        verify(billDetail).getBillId();
        verify(billDetail).getBoundary();
        verify(billDetail).getCancellationRemarks();
        verify(billDetail).getChannel();
        verify(billDetail).getDemandId();
        verify(billDetail).getDisplayMessage();
        verify(billDetail).getId();
        verify(billDetail).getManualReceiptNumber();
        verify(billDetail).getTenantId();
        verify(billDetail).getVoucherHeader();
        verify(billDetail).getAmount();
        verify(billDetail).getAmountPaid();
        verify(billDetail).getCollectionType();
    }

    @Test
    void testGetParamtersForBillDetailCreate8() {
        BillDetail billDetail = mock(BillDetail.class);
        when(billDetail.getAdditionalDetails()).thenReturn(NullNode.getInstance());
        when(billDetail.getCallBackForApportioning()).thenReturn(true);
        when(billDetail.getExpiryDate()).thenReturn(1L);
        when(billDetail.getFromPeriod()).thenReturn(1L);
        when(billDetail.getManualReceiptDate()).thenReturn(1L);
        when(billDetail.getToPeriod()).thenReturn(1L);
        when(billDetail.getBillDescription()).thenReturn("Bill Description");
        when(billDetail.getBillId()).thenReturn("42");
        when(billDetail.getBoundary()).thenReturn("Boundary");
        when(billDetail.getCancellationRemarks()).thenReturn("Cancellation Remarks");
        when(billDetail.getChannel()).thenReturn("Channel");
        when(billDetail.getDemandId()).thenReturn("42");
        when(billDetail.getDisplayMessage()).thenReturn("Display Message");
        when(billDetail.getId()).thenReturn("42");
        when(billDetail.getManualReceiptNumber()).thenReturn("42");
        when(billDetail.getTenantId()).thenReturn("42");
        when(billDetail.getVoucherHeader()).thenReturn("Voucher Header");
        when(billDetail.getAmount()).thenReturn(BigDecimal.valueOf(42L));
        when(billDetail.getAmountPaid()).thenReturn(BigDecimal.valueOf(42L));
        when(billDetail.getCollectionType()).thenReturn(CollectionType.COUNTER);
        assertEquals(20, PaymentQueryBuilder.getParamtersForBillDetailCreate(billDetail).getParameterNames().length);
        verify(billDetail).getAdditionalDetails();
        verify(billDetail).getCallBackForApportioning();
        verify(billDetail).getExpiryDate();
        verify(billDetail).getFromPeriod();
        verify(billDetail).getManualReceiptDate();
        verify(billDetail).getToPeriod();
        verify(billDetail).getBillDescription();
        verify(billDetail).getBillId();
        verify(billDetail).getBoundary();
        verify(billDetail).getCancellationRemarks();
        verify(billDetail).getChannel();
        verify(billDetail).getDemandId();
        verify(billDetail).getDisplayMessage();
        verify(billDetail).getId();
        verify(billDetail).getManualReceiptNumber();
        verify(billDetail).getTenantId();
        verify(billDetail).getVoucherHeader();
        verify(billDetail).getAmount();
        verify(billDetail).getAmountPaid();
        verify(billDetail).getCollectionType();
    }

    @Test
    void testGetParametersForBillAccountDetailCreate() {
        assertEquals(10, PaymentQueryBuilder.getParametersForBillAccountDetailCreate(new BillAccountDetail())
                .getParameterNames().length);
    }

    @Test
    void testGetParametersForBillAccountDetailCreate2() {
        BigDecimal amount = BigDecimal.valueOf(42L);
        BigDecimal adjustedAmount = BigDecimal.valueOf(42L);
        MissingNode additionalDetails = MissingNode.getInstance();
        assertEquals(10,
                PaymentQueryBuilder
                        .getParametersForBillAccountDetailCreate(new BillAccountDetail("42", "42", "42", "42", 1, amount,
                                adjustedAmount, true, "id", additionalDetails, Purpose.ARREAR, new AuditDetails()))
                        .getParameterNames().length);
    }

    @Test
    void testGetParametersForBillAccountDetailCreate4() {
        BillAccountDetail billAccountDetail = mock(BillAccountDetail.class);
        when(billAccountDetail.getAdditionalDetails()).thenReturn(MissingNode.getInstance());
        when(billAccountDetail.getIsActualDemand()).thenReturn(true);
        when(billAccountDetail.getOrder()).thenReturn(1);
        when(billAccountDetail.getBillDetailId()).thenReturn("42");
        when(billAccountDetail.getDemandDetailId()).thenReturn("42");
        when(billAccountDetail.getId()).thenReturn("42");
        when(billAccountDetail.getTaxHeadCode()).thenReturn("Tax Head Code");
        when(billAccountDetail.getTenantId()).thenReturn("42");
        when(billAccountDetail.getAdjustedAmount()).thenReturn(BigDecimal.valueOf(42L));
        when(billAccountDetail.getAmount()).thenReturn(BigDecimal.valueOf(42L));
        assertEquals(10,
                PaymentQueryBuilder.getParametersForBillAccountDetailCreate(billAccountDetail).getParameterNames().length);
        verify(billAccountDetail).getAdditionalDetails();
        verify(billAccountDetail).getIsActualDemand();
        verify(billAccountDetail).getOrder();
        verify(billAccountDetail).getBillDetailId();
        verify(billAccountDetail).getDemandDetailId();
        verify(billAccountDetail).getId();
        verify(billAccountDetail).getTaxHeadCode();
        verify(billAccountDetail).getTenantId();
        verify(billAccountDetail).getAdjustedAmount();
        verify(billAccountDetail).getAmount();
    }

    @Test
    void testGetParametersForBillAccountDetailCreate5() {
        BillAccountDetail billAccountDetail = mock(BillAccountDetail.class);
        when(billAccountDetail.getAdditionalDetails())
                .thenReturn(new ArrayNode(JsonNodeFactory.withExactBigDecimals(true)));
        when(billAccountDetail.getIsActualDemand()).thenReturn(true);
        when(billAccountDetail.getOrder()).thenReturn(1);
        when(billAccountDetail.getBillDetailId()).thenReturn("42");
        when(billAccountDetail.getDemandDetailId()).thenReturn("42");
        when(billAccountDetail.getId()).thenReturn("42");
        when(billAccountDetail.getTaxHeadCode()).thenReturn("Tax Head Code");
        when(billAccountDetail.getTenantId()).thenReturn("42");
        when(billAccountDetail.getAdjustedAmount()).thenReturn(BigDecimal.valueOf(42L));
        when(billAccountDetail.getAmount()).thenReturn(BigDecimal.valueOf(42L));
        assertEquals(10,
                PaymentQueryBuilder.getParametersForBillAccountDetailCreate(billAccountDetail).getParameterNames().length);
        verify(billAccountDetail).getAdditionalDetails();
        verify(billAccountDetail).getIsActualDemand();
        verify(billAccountDetail).getOrder();
        verify(billAccountDetail).getBillDetailId();
        verify(billAccountDetail).getDemandDetailId();
        verify(billAccountDetail).getId();
        verify(billAccountDetail).getTaxHeadCode();
        verify(billAccountDetail).getTenantId();
        verify(billAccountDetail).getAdjustedAmount();
        verify(billAccountDetail).getAmount();
    }

    @Test
    void testGetParametersForBillAccountDetailCreate6() {
        BillAccountDetail billAccountDetail = mock(BillAccountDetail.class);
        when(billAccountDetail.getAdditionalDetails()).thenReturn(new BigIntegerNode(BigInteger.valueOf(42L)));
        when(billAccountDetail.getIsActualDemand()).thenReturn(true);
        when(billAccountDetail.getOrder()).thenReturn(1);
        when(billAccountDetail.getBillDetailId()).thenReturn("42");
        when(billAccountDetail.getDemandDetailId()).thenReturn("42");
        when(billAccountDetail.getId()).thenReturn("42");
        when(billAccountDetail.getTaxHeadCode()).thenReturn("Tax Head Code");
        when(billAccountDetail.getTenantId()).thenReturn("42");
        when(billAccountDetail.getAdjustedAmount()).thenReturn(BigDecimal.valueOf(42L));
        when(billAccountDetail.getAmount()).thenReturn(BigDecimal.valueOf(42L));
        assertEquals(10,
                PaymentQueryBuilder.getParametersForBillAccountDetailCreate(billAccountDetail).getParameterNames().length);
        verify(billAccountDetail).getAdditionalDetails();
        verify(billAccountDetail).getIsActualDemand();
        verify(billAccountDetail).getOrder();
        verify(billAccountDetail).getBillDetailId();
        verify(billAccountDetail).getDemandDetailId();
        verify(billAccountDetail).getId();
        verify(billAccountDetail).getTaxHeadCode();
        verify(billAccountDetail).getTenantId();
        verify(billAccountDetail).getAdjustedAmount();
        verify(billAccountDetail).getAmount();
    }

    @Test
    void testGetParametersForBillAccountDetailCreate7() throws UnsupportedEncodingException {
        BillAccountDetail billAccountDetail = mock(BillAccountDetail.class);
        when(billAccountDetail.getAdditionalDetails()).thenReturn(new BinaryNode("AAAAAAAA".getBytes("UTF-8")));
        when(billAccountDetail.getIsActualDemand()).thenReturn(true);
        when(billAccountDetail.getOrder()).thenReturn(1);
        when(billAccountDetail.getBillDetailId()).thenReturn("42");
        when(billAccountDetail.getDemandDetailId()).thenReturn("42");
        when(billAccountDetail.getId()).thenReturn("42");
        when(billAccountDetail.getTaxHeadCode()).thenReturn("Tax Head Code");
        when(billAccountDetail.getTenantId()).thenReturn("42");
        when(billAccountDetail.getAdjustedAmount()).thenReturn(BigDecimal.valueOf(42L));
        when(billAccountDetail.getAmount()).thenReturn(BigDecimal.valueOf(42L));
        assertEquals(10,
                PaymentQueryBuilder.getParametersForBillAccountDetailCreate(billAccountDetail).getParameterNames().length);
        verify(billAccountDetail).getAdditionalDetails();
        verify(billAccountDetail).getIsActualDemand();
        verify(billAccountDetail).getOrder();
        verify(billAccountDetail).getBillDetailId();
        verify(billAccountDetail).getDemandDetailId();
        verify(billAccountDetail).getId();
        verify(billAccountDetail).getTaxHeadCode();
        verify(billAccountDetail).getTenantId();
        verify(billAccountDetail).getAdjustedAmount();
        verify(billAccountDetail).getAmount();
    }

    @Test
    void testGetParametersForBillAccountDetailCreate8() {
        BillAccountDetail billAccountDetail = mock(BillAccountDetail.class);
        when(billAccountDetail.getAdditionalDetails()).thenReturn(NullNode.getInstance());
        when(billAccountDetail.getIsActualDemand()).thenReturn(true);
        when(billAccountDetail.getOrder()).thenReturn(1);
        when(billAccountDetail.getBillDetailId()).thenReturn("42");
        when(billAccountDetail.getDemandDetailId()).thenReturn("42");
        when(billAccountDetail.getId()).thenReturn("42");
        when(billAccountDetail.getTaxHeadCode()).thenReturn("Tax Head Code");
        when(billAccountDetail.getTenantId()).thenReturn("42");
        when(billAccountDetail.getAdjustedAmount()).thenReturn(BigDecimal.valueOf(42L));
        when(billAccountDetail.getAmount()).thenReturn(BigDecimal.valueOf(42L));
        assertEquals(10,
                PaymentQueryBuilder.getParametersForBillAccountDetailCreate(billAccountDetail).getParameterNames().length);
        verify(billAccountDetail).getAdditionalDetails();
        verify(billAccountDetail).getIsActualDemand();
        verify(billAccountDetail).getOrder();
        verify(billAccountDetail).getBillDetailId();
        verify(billAccountDetail).getDemandDetailId();
        verify(billAccountDetail).getId();
        verify(billAccountDetail).getTaxHeadCode();
        verify(billAccountDetail).getTenantId();
        verify(billAccountDetail).getAdjustedAmount();
        verify(billAccountDetail).getAmount();
    }

    @Test
    void testGetParametersForBillAccountDetailCreate9() {
        BillAccountDetail billAccountDetail = mock(BillAccountDetail.class);
        when(billAccountDetail.getAdditionalDetails()).thenReturn(LongNode.valueOf(4L));
        when(billAccountDetail.getIsActualDemand()).thenReturn(true);
        when(billAccountDetail.getOrder()).thenReturn(1);
        when(billAccountDetail.getBillDetailId()).thenReturn("42");
        when(billAccountDetail.getDemandDetailId()).thenReturn("42");
        when(billAccountDetail.getId()).thenReturn("42");
        when(billAccountDetail.getTaxHeadCode()).thenReturn("Tax Head Code");
        when(billAccountDetail.getTenantId()).thenReturn("42");
        when(billAccountDetail.getAdjustedAmount()).thenReturn(BigDecimal.valueOf(42L));
        when(billAccountDetail.getAmount()).thenReturn(BigDecimal.valueOf(42L));
        assertEquals(10,
                PaymentQueryBuilder.getParametersForBillAccountDetailCreate(billAccountDetail).getParameterNames().length);
        verify(billAccountDetail).getAdditionalDetails();
        verify(billAccountDetail).getIsActualDemand();
        verify(billAccountDetail).getOrder();
        verify(billAccountDetail).getBillDetailId();
        verify(billAccountDetail).getDemandDetailId();
        verify(billAccountDetail).getId();
        verify(billAccountDetail).getTaxHeadCode();
        verify(billAccountDetail).getTenantId();
        verify(billAccountDetail).getAdjustedAmount();
        verify(billAccountDetail).getAmount();
    }

    @Test
    void testGetParametersForBillAccountDetailCreate10() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addArray();
        BillAccountDetail billAccountDetail = mock(BillAccountDetail.class);
        when(billAccountDetail.getAdditionalDetails()).thenReturn(arrayNode);
        when(billAccountDetail.getIsActualDemand()).thenReturn(true);
        when(billAccountDetail.getOrder()).thenReturn(1);
        when(billAccountDetail.getBillDetailId()).thenReturn("42");
        when(billAccountDetail.getDemandDetailId()).thenReturn("42");
        when(billAccountDetail.getId()).thenReturn("42");
        when(billAccountDetail.getTaxHeadCode()).thenReturn("Tax Head Code");
        when(billAccountDetail.getTenantId()).thenReturn("42");
        when(billAccountDetail.getAdjustedAmount()).thenReturn(BigDecimal.valueOf(42L));
        when(billAccountDetail.getAmount()).thenReturn(BigDecimal.valueOf(42L));
        assertEquals(10,
                PaymentQueryBuilder.getParametersForBillAccountDetailCreate(billAccountDetail).getParameterNames().length);
        verify(billAccountDetail).getAdditionalDetails();
        verify(billAccountDetail).getIsActualDemand();
        verify(billAccountDetail).getOrder();
        verify(billAccountDetail).getBillDetailId();
        verify(billAccountDetail).getDemandDetailId();
        verify(billAccountDetail).getId();
        verify(billAccountDetail).getTaxHeadCode();
        verify(billAccountDetail).getTenantId();
        verify(billAccountDetail).getAdjustedAmount();
        verify(billAccountDetail).getAmount();
    }

    @Test
    void testGetParametersForBillAccountDetailCreate11() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addObject();
        BillAccountDetail billAccountDetail = mock(BillAccountDetail.class);
        when(billAccountDetail.getAdditionalDetails()).thenReturn(arrayNode);
        when(billAccountDetail.getIsActualDemand()).thenReturn(true);
        when(billAccountDetail.getOrder()).thenReturn(1);
        when(billAccountDetail.getBillDetailId()).thenReturn("42");
        when(billAccountDetail.getDemandDetailId()).thenReturn("42");
        when(billAccountDetail.getId()).thenReturn("42");
        when(billAccountDetail.getTaxHeadCode()).thenReturn("Tax Head Code");
        when(billAccountDetail.getTenantId()).thenReturn("42");
        when(billAccountDetail.getAdjustedAmount()).thenReturn(BigDecimal.valueOf(42L));
        when(billAccountDetail.getAmount()).thenReturn(BigDecimal.valueOf(42L));
        assertEquals(10,
                PaymentQueryBuilder.getParametersForBillAccountDetailCreate(billAccountDetail).getParameterNames().length);
        verify(billAccountDetail).getAdditionalDetails();
        verify(billAccountDetail).getIsActualDemand();
        verify(billAccountDetail).getOrder();
        verify(billAccountDetail).getBillDetailId();
        verify(billAccountDetail).getDemandDetailId();
        verify(billAccountDetail).getId();
        verify(billAccountDetail).getTaxHeadCode();
        verify(billAccountDetail).getTenantId();
        verify(billAccountDetail).getAdjustedAmount();
        verify(billAccountDetail).getAmount();
    }

    @Test
    void testGetParametersForBillAccountDetailCreate12() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addPOJO("Value");
        BillAccountDetail billAccountDetail = mock(BillAccountDetail.class);
        when(billAccountDetail.getAdditionalDetails()).thenReturn(arrayNode);
        when(billAccountDetail.getIsActualDemand()).thenReturn(true);
        when(billAccountDetail.getOrder()).thenReturn(1);
        when(billAccountDetail.getBillDetailId()).thenReturn("42");
        when(billAccountDetail.getDemandDetailId()).thenReturn("42");
        when(billAccountDetail.getId()).thenReturn("42");
        when(billAccountDetail.getTaxHeadCode()).thenReturn("Tax Head Code");
        when(billAccountDetail.getTenantId()).thenReturn("42");
        when(billAccountDetail.getAdjustedAmount()).thenReturn(BigDecimal.valueOf(42L));
        when(billAccountDetail.getAmount()).thenReturn(BigDecimal.valueOf(42L));
        assertEquals(10,
                PaymentQueryBuilder.getParametersForBillAccountDetailCreate(billAccountDetail).getParameterNames().length);
        verify(billAccountDetail).getAdditionalDetails();
        verify(billAccountDetail).getIsActualDemand();
        verify(billAccountDetail).getOrder();
        verify(billAccountDetail).getBillDetailId();
        verify(billAccountDetail).getDemandDetailId();
        verify(billAccountDetail).getId();
        verify(billAccountDetail).getTaxHeadCode();
        verify(billAccountDetail).getTenantId();
        verify(billAccountDetail).getAdjustedAmount();
        verify(billAccountDetail).getAmount();
    }

    @Test
    void testGetParametersForBillAccountDetailCreate13() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addNull();
        BillAccountDetail billAccountDetail = mock(BillAccountDetail.class);
        when(billAccountDetail.getAdditionalDetails()).thenReturn(arrayNode);
        when(billAccountDetail.getIsActualDemand()).thenReturn(true);
        when(billAccountDetail.getOrder()).thenReturn(1);
        when(billAccountDetail.getBillDetailId()).thenReturn("42");
        when(billAccountDetail.getDemandDetailId()).thenReturn("42");
        when(billAccountDetail.getId()).thenReturn("42");
        when(billAccountDetail.getTaxHeadCode()).thenReturn("Tax Head Code");
        when(billAccountDetail.getTenantId()).thenReturn("42");
        when(billAccountDetail.getAdjustedAmount()).thenReturn(BigDecimal.valueOf(42L));
        when(billAccountDetail.getAmount()).thenReturn(BigDecimal.valueOf(42L));
        assertEquals(10,
                PaymentQueryBuilder.getParametersForBillAccountDetailCreate(billAccountDetail).getParameterNames().length);
        verify(billAccountDetail).getAdditionalDetails();
        verify(billAccountDetail).getIsActualDemand();
        verify(billAccountDetail).getOrder();
        verify(billAccountDetail).getBillDetailId();
        verify(billAccountDetail).getDemandDetailId();
        verify(billAccountDetail).getId();
        verify(billAccountDetail).getTaxHeadCode();
        verify(billAccountDetail).getTenantId();
        verify(billAccountDetail).getAdjustedAmount();
        verify(billAccountDetail).getAmount();
    }

    @Test
    void testGetPaymentCountQuery() {

        PaymentQueryBuilder paymentQueryBuilder = new PaymentQueryBuilder();
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals(PaymentQueryBuilder.SELECT_COUNT_PAYMENT_SQL,
                paymentQueryBuilder.getPaymentCountQuery("42", "Business Service", stringObjectMap));
        assertEquals(2, stringObjectMap.size());
    }

    @Test
    void testGetPaymentSearchQuery() {

        PaymentQueryBuilder paymentQueryBuilder = new PaymentQueryBuilder();
        ArrayList<String> ids = new ArrayList<>();
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT py.*,pyd.*,py.id as py_id,py.tenantId as py_tenantId,py.totalAmountPaid as py_totalAmountPaid"
                        + ",py.createdBy as py_createdBy,py.createdtime as py_createdtime,py.lastModifiedBy as py_lastModifiedBy"
                        + ",py.lastmodifiedtime as py_lastmodifiedtime,py.additionalDetails as py_additionalDetails,pyd.id as"
                        + " pyd_id, pyd.tenantId as pyd_tenantId, pyd.manualreceiptnumber as manualreceiptnumber,pyd.manualreceiptdate"
                        + " as manualreceiptdate, pyd.createdBy as pyd_createdBy,pyd.createdtime as pyd_createdtime,pyd.lastModifiedBy"
                        + " as pyd_lastModifiedBy,pyd.lastmodifiedtime as pyd_lastmodifiedtime,pyd.additionalDetails as"
                        + " pyd_additionalDetails FROM egcl_payment py   INNER JOIN egcl_paymentdetail pyd ON pyd.paymentid ="
                        + " py.id  WHERE  py.id IN (:id)   ORDER BY py.transactiondate DESC ",
                paymentQueryBuilder.getPaymentSearchQuery(ids, stringObjectMap));
        assertEquals(1, stringObjectMap.size());
    }

    @Test
    void testGetPaymentSearchQuery2() {

        PaymentQueryBuilder paymentQueryBuilder = new PaymentQueryBuilder();
        ArrayList<String> ids = new ArrayList<>();

        HashMap<String, Object> stringObjectMap = new HashMap<>();
        stringObjectMap.put(PaymentQueryBuilder.SELECT_PAYMENT_SQL, "Value");
        assertEquals("SELECT py.*,pyd.*,py.id as py_id,py.tenantId as py_tenantId,py.totalAmountPaid as py_totalAmountPaid"
                        + ",py.createdBy as py_createdBy,py.createdtime as py_createdtime,py.lastModifiedBy as py_lastModifiedBy"
                        + ",py.lastmodifiedtime as py_lastmodifiedtime,py.additionalDetails as py_additionalDetails,pyd.id as"
                        + " pyd_id, pyd.tenantId as pyd_tenantId, pyd.manualreceiptnumber as manualreceiptnumber,pyd.manualreceiptdate"
                        + " as manualreceiptdate, pyd.createdBy as pyd_createdBy,pyd.createdtime as pyd_createdtime,pyd.lastModifiedBy"
                        + " as pyd_lastModifiedBy,pyd.lastmodifiedtime as pyd_lastmodifiedtime,pyd.additionalDetails as"
                        + " pyd_additionalDetails FROM egcl_payment py   INNER JOIN egcl_paymentdetail pyd ON pyd.paymentid ="
                        + " py.id  AND py.id IN (:id)   ORDER BY py.transactiondate DESC ",
                paymentQueryBuilder.getPaymentSearchQuery(ids, stringObjectMap));
        assertEquals(2, stringObjectMap.size());
    }

    @Test
    void testGetPaymentSearchQueryForPlainSearch() {
        PaymentSearchCriteria searchCriteria = new PaymentSearchCriteria();
        assertEquals("SELECT py.*,pyd.*,py.id as py_id,py.tenantId as py_tenantId,py.totalAmountPaid as py_totalAmountPaid"
                        + ",py.createdBy as py_createdBy,py.createdtime as py_createdtime,py.lastModifiedBy as py_lastModifiedBy"
                        + ",py.lastmodifiedtime as py_lastmodifiedtime,py.additionalDetails as py_additionalDetails,pyd.id as"
                        + " pyd_id, pyd.tenantId as pyd_tenantId, pyd.manualreceiptnumber as manualreceiptnumber,pyd.manualreceiptdate"
                        + " as manualreceiptdate, pyd.createdBy as pyd_createdBy,pyd.createdtime as pyd_createdtime,pyd.lastModifiedBy"
                        + " as pyd_lastModifiedBy,pyd.lastmodifiedtime as pyd_lastmodifiedtime,pyd.additionalDetails as"
                        + " pyd_additionalDetails FROM egcl_payment py   INNER JOIN egcl_paymentdetail pyd ON pyd.paymentid ="
                        + " py.id  ORDER BY py.transactiondate DESC ",
                PaymentQueryBuilder.getPaymentSearchQueryForPlainSearch(searchCriteria, new HashMap<>()));
    }

    @Test
    void testGetPaymentSearchQueryForPlainSearch3() {
        HashSet<String> ids = new HashSet<>();
        HashSet<String> billIds = new HashSet<>();
        HashSet<String> tenantIds = new HashSet<>();
        HashSet<String> receiptNumbers = new HashSet<>();
        HashSet<String> status = new HashSet<>();
        HashSet<String> instrumentStatus = new HashSet<>();
        HashSet<String> paymentModes = new HashSet<>();
        ArrayList<String> payerIds = new ArrayList<>();
        HashSet<String> consumerCodes = new HashSet<>();
        PaymentSearchCriteria paymentSearchCriteria = new PaymentSearchCriteria(ids, billIds, "42", tenantIds,
                receiptNumbers, status, instrumentStatus, paymentModes, payerIds, consumerCodes, new HashSet<>(), "42", "42",
                1L, 1L, 2, 1, true);

        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT py.*,pyd.*,py.id as py_id,py.tenantId as py_tenantId,py.totalAmountPaid as py_totalAmountPaid"
                        + ",py.createdBy as py_createdBy,py.createdtime as py_createdtime,py.lastModifiedBy as py_lastModifiedBy"
                        + ",py.lastmodifiedtime as py_lastmodifiedtime,py.additionalDetails as py_additionalDetails,pyd.id as"
                        + " pyd_id, pyd.tenantId as pyd_tenantId, pyd.manualreceiptnumber as manualreceiptnumber,pyd.manualreceiptdate"
                        + " as manualreceiptdate, pyd.createdBy as pyd_createdBy,pyd.createdtime as pyd_createdtime,pyd.lastModifiedBy"
                        + " as pyd_lastModifiedBy,pyd.lastmodifiedtime as pyd_lastmodifiedtime,pyd.additionalDetails as"
                        + " pyd_additionalDetails FROM egcl_payment py   INNER JOIN egcl_paymentdetail pyd ON pyd.paymentid ="
                        + " py.id  WHERE  py.tenantId LIKE :tenantId AND py.mobileNumber = :mobileNumber AND py.transactionNumber"
                        + " = :transactionNumber AND py.transactionDate >= :fromDate AND py.transactionDate <= :toDate ORDER BY"
                        + " py.transactiondate DESC ",
                PaymentQueryBuilder.getPaymentSearchQueryForPlainSearch(paymentSearchCriteria, stringObjectMap));
        assertEquals(86400001L, paymentSearchCriteria.getToDate().longValue());
        assertEquals(5, stringObjectMap.size());
    }

    @Test
    void testGetPaymentSearchQueryForPlainSearch4() {
        PaymentSearchCriteria paymentSearchCriteria = mock(PaymentSearchCriteria.class);
        when(paymentSearchCriteria.getFromDate()).thenReturn(1L);
        when(paymentSearchCriteria.getToDate()).thenReturn(1L);
        when(paymentSearchCriteria.getMobileNumber()).thenReturn("42");
        when(paymentSearchCriteria.getTenantId()).thenReturn("42");
        when(paymentSearchCriteria.getTransactionNumber()).thenReturn("42");
        when(paymentSearchCriteria.getPayerIds()).thenReturn(new ArrayList<>());
        when(paymentSearchCriteria.getBillIds()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getBusinessServices()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getConsumerCodes()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getIds()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getInstrumentStatus()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getPaymentModes()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getReceiptNumbers()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getStatus()).thenReturn(new HashSet<>());
        doNothing().when(paymentSearchCriteria).setToDate((Long) any());
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT py.*,pyd.*,py.id as py_id,py.tenantId as py_tenantId,py.totalAmountPaid as py_totalAmountPaid"
                        + ",py.createdBy as py_createdBy,py.createdtime as py_createdtime,py.lastModifiedBy as py_lastModifiedBy"
                        + ",py.lastmodifiedtime as py_lastmodifiedtime,py.additionalDetails as py_additionalDetails,pyd.id as"
                        + " pyd_id, pyd.tenantId as pyd_tenantId, pyd.manualreceiptnumber as manualreceiptnumber,pyd.manualreceiptdate"
                        + " as manualreceiptdate, pyd.createdBy as pyd_createdBy,pyd.createdtime as pyd_createdtime,pyd.lastModifiedBy"
                        + " as pyd_lastModifiedBy,pyd.lastmodifiedtime as pyd_lastmodifiedtime,pyd.additionalDetails as"
                        + " pyd_additionalDetails FROM egcl_payment py   INNER JOIN egcl_paymentdetail pyd ON pyd.paymentid ="
                        + " py.id  WHERE  py.tenantId LIKE :tenantId AND py.mobileNumber = :mobileNumber AND py.transactionNumber"
                        + " = :transactionNumber AND py.transactionDate >= :fromDate AND py.transactionDate <= :toDate ORDER BY"
                        + " py.transactiondate DESC ",
                PaymentQueryBuilder.getPaymentSearchQueryForPlainSearch(paymentSearchCriteria, stringObjectMap));
        verify(paymentSearchCriteria, atLeast(1)).getFromDate();
        verify(paymentSearchCriteria, atLeast(1)).getToDate();
        verify(paymentSearchCriteria, atLeast(1)).getMobileNumber();
        verify(paymentSearchCriteria, atLeast(1)).getTenantId();
        verify(paymentSearchCriteria, atLeast(1)).getTransactionNumber();
        verify(paymentSearchCriteria).getPayerIds();
        verify(paymentSearchCriteria).getBillIds();
        verify(paymentSearchCriteria).getBusinessServices();
        verify(paymentSearchCriteria).getConsumerCodes();
        verify(paymentSearchCriteria).getIds();
        verify(paymentSearchCriteria).getInstrumentStatus();
        verify(paymentSearchCriteria).getPaymentModes();
        verify(paymentSearchCriteria, atLeast(1)).getReceiptNumbers();
        verify(paymentSearchCriteria).getStatus();
        verify(paymentSearchCriteria).setToDate((Long) any());
        assertEquals(5, stringObjectMap.size());
    }

    @Test
    void testGetPaymentSearchQueryForPlainSearch5() {
        PaymentSearchCriteria paymentSearchCriteria = mock(PaymentSearchCriteria.class);
        when(paymentSearchCriteria.getFromDate()).thenReturn(1L);
        when(paymentSearchCriteria.getToDate()).thenReturn(1L);
        when(paymentSearchCriteria.getMobileNumber()).thenReturn(" WHERE ");
        when(paymentSearchCriteria.getTenantId()).thenReturn("42");
        when(paymentSearchCriteria.getTransactionNumber()).thenReturn("42");
        when(paymentSearchCriteria.getPayerIds()).thenReturn(new ArrayList<>());
        when(paymentSearchCriteria.getBillIds()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getBusinessServices()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getConsumerCodes()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getIds()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getInstrumentStatus()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getPaymentModes()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getReceiptNumbers()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getStatus()).thenReturn(new HashSet<>());
        doNothing().when(paymentSearchCriteria).setToDate((Long) any());
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT py.*,pyd.*,py.id as py_id,py.tenantId as py_tenantId,py.totalAmountPaid as py_totalAmountPaid"
                        + ",py.createdBy as py_createdBy,py.createdtime as py_createdtime,py.lastModifiedBy as py_lastModifiedBy"
                        + ",py.lastmodifiedtime as py_lastmodifiedtime,py.additionalDetails as py_additionalDetails,pyd.id as"
                        + " pyd_id, pyd.tenantId as pyd_tenantId, pyd.manualreceiptnumber as manualreceiptnumber,pyd.manualreceiptdate"
                        + " as manualreceiptdate, pyd.createdBy as pyd_createdBy,pyd.createdtime as pyd_createdtime,pyd.lastModifiedBy"
                        + " as pyd_lastModifiedBy,pyd.lastmodifiedtime as pyd_lastmodifiedtime,pyd.additionalDetails as"
                        + " pyd_additionalDetails FROM egcl_payment py   INNER JOIN egcl_paymentdetail pyd ON pyd.paymentid ="
                        + " py.id  WHERE  py.tenantId LIKE :tenantId AND py.mobileNumber = :mobileNumber AND py.transactionNumber"
                        + " = :transactionNumber AND py.transactionDate >= :fromDate AND py.transactionDate <= :toDate ORDER BY"
                        + " py.transactiondate DESC ",
                PaymentQueryBuilder.getPaymentSearchQueryForPlainSearch(paymentSearchCriteria, stringObjectMap));
        verify(paymentSearchCriteria, atLeast(1)).getFromDate();
        verify(paymentSearchCriteria, atLeast(1)).getToDate();
        verify(paymentSearchCriteria, atLeast(1)).getMobileNumber();
        verify(paymentSearchCriteria, atLeast(1)).getTenantId();
        verify(paymentSearchCriteria, atLeast(1)).getTransactionNumber();
        verify(paymentSearchCriteria).getPayerIds();
        verify(paymentSearchCriteria).getBillIds();
        verify(paymentSearchCriteria).getBusinessServices();
        verify(paymentSearchCriteria).getConsumerCodes();
        verify(paymentSearchCriteria).getIds();
        verify(paymentSearchCriteria).getInstrumentStatus();
        verify(paymentSearchCriteria).getPaymentModes();
        verify(paymentSearchCriteria, atLeast(1)).getReceiptNumbers();
        verify(paymentSearchCriteria).getStatus();
        verify(paymentSearchCriteria).setToDate((Long) any());
        assertEquals(5, stringObjectMap.size());
    }

    @Test
    void testGetPaymentSearchQueryForPlainSearch6() {
        PaymentSearchCriteria paymentSearchCriteria = mock(PaymentSearchCriteria.class);
        when(paymentSearchCriteria.getFromDate()).thenReturn(1L);
        when(paymentSearchCriteria.getToDate()).thenReturn(1L);
        when(paymentSearchCriteria.getMobileNumber()).thenReturn("");
        when(paymentSearchCriteria.getTenantId()).thenReturn("42");
        when(paymentSearchCriteria.getTransactionNumber()).thenReturn("42");
        when(paymentSearchCriteria.getPayerIds()).thenReturn(new ArrayList<>());
        when(paymentSearchCriteria.getBillIds()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getBusinessServices()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getConsumerCodes()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getIds()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getInstrumentStatus()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getPaymentModes()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getReceiptNumbers()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getStatus()).thenReturn(new HashSet<>());
        doNothing().when(paymentSearchCriteria).setToDate((Long) any());
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT py.*,pyd.*,py.id as py_id,py.tenantId as py_tenantId,py.totalAmountPaid as py_totalAmountPaid"
                        + ",py.createdBy as py_createdBy,py.createdtime as py_createdtime,py.lastModifiedBy as py_lastModifiedBy"
                        + ",py.lastmodifiedtime as py_lastmodifiedtime,py.additionalDetails as py_additionalDetails,pyd.id as"
                        + " pyd_id, pyd.tenantId as pyd_tenantId, pyd.manualreceiptnumber as manualreceiptnumber,pyd.manualreceiptdate"
                        + " as manualreceiptdate, pyd.createdBy as pyd_createdBy,pyd.createdtime as pyd_createdtime,pyd.lastModifiedBy"
                        + " as pyd_lastModifiedBy,pyd.lastmodifiedtime as pyd_lastmodifiedtime,pyd.additionalDetails as"
                        + " pyd_additionalDetails FROM egcl_payment py   INNER JOIN egcl_paymentdetail pyd ON pyd.paymentid ="
                        + " py.id  WHERE  py.tenantId LIKE :tenantId AND py.transactionNumber = :transactionNumber AND"
                        + " py.transactionDate >= :fromDate AND py.transactionDate <= :toDate ORDER BY py.transactiondate DESC ",
                PaymentQueryBuilder.getPaymentSearchQueryForPlainSearch(paymentSearchCriteria, stringObjectMap));
        verify(paymentSearchCriteria, atLeast(1)).getFromDate();
        verify(paymentSearchCriteria, atLeast(1)).getToDate();
        verify(paymentSearchCriteria).getMobileNumber();
        verify(paymentSearchCriteria, atLeast(1)).getTenantId();
        verify(paymentSearchCriteria, atLeast(1)).getTransactionNumber();
        verify(paymentSearchCriteria).getPayerIds();
        verify(paymentSearchCriteria).getBillIds();
        verify(paymentSearchCriteria).getBusinessServices();
        verify(paymentSearchCriteria).getConsumerCodes();
        verify(paymentSearchCriteria).getIds();
        verify(paymentSearchCriteria).getInstrumentStatus();
        verify(paymentSearchCriteria).getPaymentModes();
        verify(paymentSearchCriteria, atLeast(1)).getReceiptNumbers();
        verify(paymentSearchCriteria).getStatus();
        verify(paymentSearchCriteria).setToDate((Long) any());
        assertEquals(4, stringObjectMap.size());
    }

    @Test
    void testGetPaymentSearchQueryForPlainSearch7() {
        PaymentSearchCriteria paymentSearchCriteria = mock(PaymentSearchCriteria.class);
        when(paymentSearchCriteria.getFromDate()).thenReturn(1L);
        when(paymentSearchCriteria.getToDate()).thenReturn(1L);
        when(paymentSearchCriteria.getMobileNumber()).thenReturn("42");
        when(paymentSearchCriteria.getTenantId()).thenReturn(PaymentQueryBuilder.SELECT_PAYMENT_SQL);
        when(paymentSearchCriteria.getTransactionNumber()).thenReturn("42");
        when(paymentSearchCriteria.getPayerIds()).thenReturn(new ArrayList<>());
        when(paymentSearchCriteria.getBillIds()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getBusinessServices()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getConsumerCodes()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getIds()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getInstrumentStatus()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getPaymentModes()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getReceiptNumbers()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getStatus()).thenReturn(new HashSet<>());
        doNothing().when(paymentSearchCriteria).setToDate((Long) any());
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT py.*,pyd.*,py.id as py_id,py.tenantId as py_tenantId,py.totalAmountPaid as py_totalAmountPaid"
                        + ",py.createdBy as py_createdBy,py.createdtime as py_createdtime,py.lastModifiedBy as py_lastModifiedBy"
                        + ",py.lastmodifiedtime as py_lastmodifiedtime,py.additionalDetails as py_additionalDetails,pyd.id as"
                        + " pyd_id, pyd.tenantId as pyd_tenantId, pyd.manualreceiptnumber as manualreceiptnumber,pyd.manualreceiptdate"
                        + " as manualreceiptdate, pyd.createdBy as pyd_createdBy,pyd.createdtime as pyd_createdtime,pyd.lastModifiedBy"
                        + " as pyd_lastModifiedBy,pyd.lastmodifiedtime as pyd_lastmodifiedtime,pyd.additionalDetails as"
                        + " pyd_additionalDetails FROM egcl_payment py   INNER JOIN egcl_paymentdetail pyd ON pyd.paymentid ="
                        + " py.id  WHERE  py.tenantId =:tenantId AND py.mobileNumber = :mobileNumber AND py.transactionNumber ="
                        + " :transactionNumber AND py.transactionDate >= :fromDate AND py.transactionDate <= :toDate ORDER BY"
                        + " py.transactiondate DESC ",
                PaymentQueryBuilder.getPaymentSearchQueryForPlainSearch(paymentSearchCriteria, stringObjectMap));
        verify(paymentSearchCriteria, atLeast(1)).getFromDate();
        verify(paymentSearchCriteria, atLeast(1)).getToDate();
        verify(paymentSearchCriteria, atLeast(1)).getMobileNumber();
        verify(paymentSearchCriteria, atLeast(1)).getTenantId();
        verify(paymentSearchCriteria, atLeast(1)).getTransactionNumber();
        verify(paymentSearchCriteria).getPayerIds();
        verify(paymentSearchCriteria).getBillIds();
        verify(paymentSearchCriteria).getBusinessServices();
        verify(paymentSearchCriteria).getConsumerCodes();
        verify(paymentSearchCriteria).getIds();
        verify(paymentSearchCriteria).getInstrumentStatus();
        verify(paymentSearchCriteria).getPaymentModes();
        verify(paymentSearchCriteria, atLeast(1)).getReceiptNumbers();
        verify(paymentSearchCriteria).getStatus();
        verify(paymentSearchCriteria).setToDate((Long) any());
        assertEquals(5, stringObjectMap.size());
    }

    @Test
    void testGetPaymentSearchQueryForPlainSearch8() {
        ArrayList<String> stringList = new ArrayList<>();
        stringList.add(PaymentQueryBuilder.SELECT_PAYMENT_SQL);
        PaymentSearchCriteria paymentSearchCriteria = mock(PaymentSearchCriteria.class);
        when(paymentSearchCriteria.getFromDate()).thenReturn(1L);
        when(paymentSearchCriteria.getToDate()).thenReturn(1L);
        when(paymentSearchCriteria.getMobileNumber()).thenReturn("42");
        when(paymentSearchCriteria.getTenantId()).thenReturn("42");
        when(paymentSearchCriteria.getTransactionNumber()).thenReturn("42");
        when(paymentSearchCriteria.getPayerIds()).thenReturn(stringList);
        when(paymentSearchCriteria.getBillIds()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getBusinessServices()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getConsumerCodes()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getIds()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getInstrumentStatus()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getPaymentModes()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getReceiptNumbers()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getStatus()).thenReturn(new HashSet<>());
        doNothing().when(paymentSearchCriteria).setToDate((Long) any());
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT py.*,pyd.*,py.id as py_id,py.tenantId as py_tenantId,py.totalAmountPaid as py_totalAmountPaid"
                        + ",py.createdBy as py_createdBy,py.createdtime as py_createdtime,py.lastModifiedBy as py_lastModifiedBy"
                        + ",py.lastmodifiedtime as py_lastmodifiedtime,py.additionalDetails as py_additionalDetails,pyd.id as"
                        + " pyd_id, pyd.tenantId as pyd_tenantId, pyd.manualreceiptnumber as manualreceiptnumber,pyd.manualreceiptdate"
                        + " as manualreceiptdate, pyd.createdBy as pyd_createdBy,pyd.createdtime as pyd_createdtime,pyd.lastModifiedBy"
                        + " as pyd_lastModifiedBy,pyd.lastmodifiedtime as pyd_lastmodifiedtime,pyd.additionalDetails as"
                        + " pyd_additionalDetails FROM egcl_payment py   INNER JOIN egcl_paymentdetail pyd ON pyd.paymentid ="
                        + " py.id  WHERE  py.tenantId LIKE :tenantId AND py.mobileNumber = :mobileNumber AND py.transactionNumber"
                        + " = :transactionNumber AND py.transactionDate >= :fromDate AND py.transactionDate <= :toDate AND"
                        + " py.payerid IN (:payerid)   ORDER BY py.transactiondate DESC ",
                PaymentQueryBuilder.getPaymentSearchQueryForPlainSearch(paymentSearchCriteria, stringObjectMap));
        verify(paymentSearchCriteria, atLeast(1)).getFromDate();
        verify(paymentSearchCriteria, atLeast(1)).getToDate();
        verify(paymentSearchCriteria, atLeast(1)).getMobileNumber();
        verify(paymentSearchCriteria, atLeast(1)).getTenantId();
        verify(paymentSearchCriteria, atLeast(1)).getTransactionNumber();
        verify(paymentSearchCriteria, atLeast(1)).getPayerIds();
        verify(paymentSearchCriteria).getBillIds();
        verify(paymentSearchCriteria).getBusinessServices();
        verify(paymentSearchCriteria).getConsumerCodes();
        verify(paymentSearchCriteria).getIds();
        verify(paymentSearchCriteria).getInstrumentStatus();
        verify(paymentSearchCriteria).getPaymentModes();
        verify(paymentSearchCriteria, atLeast(1)).getReceiptNumbers();
        verify(paymentSearchCriteria).getStatus();
        verify(paymentSearchCriteria).setToDate((Long) any());
        assertEquals(6, stringObjectMap.size());
    }

    @Test
    void testGetPaymentSearchQueryForPlainSearch9() {
        HashSet<String> stringSet = new HashSet<>();
        stringSet.add(PaymentQueryBuilder.SELECT_PAYMENT_SQL);
        PaymentSearchCriteria paymentSearchCriteria = mock(PaymentSearchCriteria.class);
        when(paymentSearchCriteria.getFromDate()).thenReturn(1L);
        when(paymentSearchCriteria.getToDate()).thenReturn(1L);
        when(paymentSearchCriteria.getMobileNumber()).thenReturn("42");
        when(paymentSearchCriteria.getTenantId()).thenReturn("42");
        when(paymentSearchCriteria.getTransactionNumber()).thenReturn("42");
        when(paymentSearchCriteria.getPayerIds()).thenReturn(new ArrayList<>());
        when(paymentSearchCriteria.getBillIds()).thenReturn(stringSet);
        when(paymentSearchCriteria.getBusinessServices()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getConsumerCodes()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getIds()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getInstrumentStatus()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getPaymentModes()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getReceiptNumbers()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getStatus()).thenReturn(new HashSet<>());
        doNothing().when(paymentSearchCriteria).setToDate((Long) any());
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT py.*,pyd.*,py.id as py_id,py.tenantId as py_tenantId,py.totalAmountPaid as py_totalAmountPaid"
                        + ",py.createdBy as py_createdBy,py.createdtime as py_createdtime,py.lastModifiedBy as py_lastModifiedBy"
                        + ",py.lastmodifiedtime as py_lastmodifiedtime,py.additionalDetails as py_additionalDetails,pyd.id as"
                        + " pyd_id, pyd.tenantId as pyd_tenantId, pyd.manualreceiptnumber as manualreceiptnumber,pyd.manualreceiptdate"
                        + " as manualreceiptdate, pyd.createdBy as pyd_createdBy,pyd.createdtime as pyd_createdtime,pyd.lastModifiedBy"
                        + " as pyd_lastModifiedBy,pyd.lastmodifiedtime as pyd_lastmodifiedtime,pyd.additionalDetails as"
                        + " pyd_additionalDetails FROM egcl_payment py   INNER JOIN egcl_paymentdetail pyd ON pyd.paymentid ="
                        + " py.id  WHERE  py.tenantId LIKE :tenantId AND py.mobileNumber = :mobileNumber AND py.transactionNumber"
                        + " = :transactionNumber AND py.transactionDate >= :fromDate AND py.transactionDate <= :toDate AND id in"
                        + " (select pyd.paymentid from egcl_paymentdetail as pyd  WHERE  pyd.billid in (:billid))  ORDER BY"
                        + " py.transactiondate DESC ",
                PaymentQueryBuilder.getPaymentSearchQueryForPlainSearch(paymentSearchCriteria, stringObjectMap));
        verify(paymentSearchCriteria, atLeast(1)).getFromDate();
        verify(paymentSearchCriteria, atLeast(1)).getToDate();
        verify(paymentSearchCriteria, atLeast(1)).getMobileNumber();
        verify(paymentSearchCriteria, atLeast(1)).getTenantId();
        verify(paymentSearchCriteria, atLeast(1)).getTransactionNumber();
        verify(paymentSearchCriteria).getPayerIds();
        verify(paymentSearchCriteria, atLeast(1)).getBillIds();
        verify(paymentSearchCriteria).getBusinessServices();
        verify(paymentSearchCriteria).getConsumerCodes();
        verify(paymentSearchCriteria).getIds();
        verify(paymentSearchCriteria).getInstrumentStatus();
        verify(paymentSearchCriteria).getPaymentModes();
        verify(paymentSearchCriteria, atLeast(1)).getReceiptNumbers();
        verify(paymentSearchCriteria).getStatus();
        verify(paymentSearchCriteria).setToDate((Long) any());
        assertEquals(6, stringObjectMap.size());
    }

    @Test
    void testGetPaymentSearchQueryForPlainSearch10() {
        HashSet<String> stringSet = new HashSet<>();
        stringSet.add(PaymentQueryBuilder.SELECT_PAYMENT_SQL);
        PaymentSearchCriteria paymentSearchCriteria = mock(PaymentSearchCriteria.class);
        when(paymentSearchCriteria.getFromDate()).thenReturn(1L);
        when(paymentSearchCriteria.getToDate()).thenReturn(1L);
        when(paymentSearchCriteria.getMobileNumber()).thenReturn("42");
        when(paymentSearchCriteria.getTenantId()).thenReturn("42");
        when(paymentSearchCriteria.getTransactionNumber()).thenReturn("42");
        when(paymentSearchCriteria.getPayerIds()).thenReturn(new ArrayList<>());
        when(paymentSearchCriteria.getBillIds()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getBusinessServices()).thenReturn(stringSet);
        when(paymentSearchCriteria.getConsumerCodes()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getIds()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getInstrumentStatus()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getPaymentModes()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getReceiptNumbers()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getStatus()).thenReturn(new HashSet<>());
        doNothing().when(paymentSearchCriteria).setToDate((Long) any());
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT py.*,pyd.*,py.id as py_id,py.tenantId as py_tenantId,py.totalAmountPaid as py_totalAmountPaid"
                        + ",py.createdBy as py_createdBy,py.createdtime as py_createdtime,py.lastModifiedBy as py_lastModifiedBy"
                        + ",py.lastmodifiedtime as py_lastmodifiedtime,py.additionalDetails as py_additionalDetails,pyd.id as"
                        + " pyd_id, pyd.tenantId as pyd_tenantId, pyd.manualreceiptnumber as manualreceiptnumber,pyd.manualreceiptdate"
                        + " as manualreceiptdate, pyd.createdBy as pyd_createdBy,pyd.createdtime as pyd_createdtime,pyd.lastModifiedBy"
                        + " as pyd_lastModifiedBy,pyd.lastmodifiedtime as pyd_lastmodifiedtime,pyd.additionalDetails as"
                        + " pyd_additionalDetails FROM egcl_payment py   INNER JOIN egcl_paymentdetail pyd ON pyd.paymentid ="
                        + " py.id  WHERE  py.tenantId LIKE :tenantId AND py.mobileNumber = :mobileNumber AND py.transactionNumber"
                        + " = :transactionNumber AND py.transactionDate >= :fromDate AND py.transactionDate <= :toDate AND id in"
                        + " (select pyd.paymentid from egcl_paymentdetail as pyd  WHERE  pyd.businessService IN (:businessService)"
                        + "  )  ORDER BY py.transactiondate DESC ",
                PaymentQueryBuilder.getPaymentSearchQueryForPlainSearch(paymentSearchCriteria, stringObjectMap));
        verify(paymentSearchCriteria, atLeast(1)).getFromDate();
        verify(paymentSearchCriteria, atLeast(1)).getToDate();
        verify(paymentSearchCriteria, atLeast(1)).getMobileNumber();
        verify(paymentSearchCriteria, atLeast(1)).getTenantId();
        verify(paymentSearchCriteria, atLeast(1)).getTransactionNumber();
        verify(paymentSearchCriteria).getPayerIds();
        verify(paymentSearchCriteria).getBillIds();
        verify(paymentSearchCriteria, atLeast(1)).getBusinessServices();
        verify(paymentSearchCriteria).getConsumerCodes();
        verify(paymentSearchCriteria).getIds();
        verify(paymentSearchCriteria).getInstrumentStatus();
        verify(paymentSearchCriteria).getPaymentModes();
        verify(paymentSearchCriteria, atLeast(1)).getReceiptNumbers();
        verify(paymentSearchCriteria).getStatus();
        verify(paymentSearchCriteria).setToDate((Long) any());
        assertEquals(6, stringObjectMap.size());
    }

    @Test
    void testGetPaymentSearchQueryForPlainSearch11() {
        HashSet<String> stringSet = new HashSet<>();
        stringSet.add(PaymentQueryBuilder.SELECT_PAYMENT_SQL);
        PaymentSearchCriteria paymentSearchCriteria = mock(PaymentSearchCriteria.class);
        when(paymentSearchCriteria.getFromDate()).thenReturn(1L);
        when(paymentSearchCriteria.getToDate()).thenReturn(1L);
        when(paymentSearchCriteria.getMobileNumber()).thenReturn("42");
        when(paymentSearchCriteria.getTenantId()).thenReturn("42");
        when(paymentSearchCriteria.getTransactionNumber()).thenReturn("42");
        when(paymentSearchCriteria.getPayerIds()).thenReturn(new ArrayList<>());
        when(paymentSearchCriteria.getBillIds()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getBusinessServices()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getConsumerCodes()).thenReturn(stringSet);
        when(paymentSearchCriteria.getIds()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getInstrumentStatus()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getPaymentModes()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getReceiptNumbers()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getStatus()).thenReturn(new HashSet<>());
        doNothing().when(paymentSearchCriteria).setToDate((Long) any());
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT py.*,pyd.*,py.id as py_id,py.tenantId as py_tenantId,py.totalAmountPaid as py_totalAmountPaid"
                        + ",py.createdBy as py_createdBy,py.createdtime as py_createdtime,py.lastModifiedBy as py_lastModifiedBy"
                        + ",py.lastmodifiedtime as py_lastmodifiedtime,py.additionalDetails as py_additionalDetails,pyd.id as"
                        + " pyd_id, pyd.tenantId as pyd_tenantId, pyd.manualreceiptnumber as manualreceiptnumber,pyd.manualreceiptdate"
                        + " as manualreceiptdate, pyd.createdBy as pyd_createdBy,pyd.createdtime as pyd_createdtime,pyd.lastModifiedBy"
                        + " as pyd_lastModifiedBy,pyd.lastmodifiedtime as pyd_lastmodifiedtime,pyd.additionalDetails as"
                        + " pyd_additionalDetails FROM egcl_payment py   INNER JOIN egcl_paymentdetail pyd ON pyd.paymentid ="
                        + " py.id  WHERE  py.tenantId LIKE :tenantId AND py.mobileNumber = :mobileNumber AND py.transactionNumber"
                        + " = :transactionNumber AND py.transactionDate >= :fromDate AND py.transactionDate <= :toDate AND id in"
                        + " (select paymentid from egcl_paymentdetail as pyd where pyd.billid in ( select id from egcl_bill as"
                        + " bill where bill.consumercode in (:consumerCodes)) ) ORDER BY py.transactiondate DESC ",
                PaymentQueryBuilder.getPaymentSearchQueryForPlainSearch(paymentSearchCriteria, stringObjectMap));
        verify(paymentSearchCriteria, atLeast(1)).getFromDate();
        verify(paymentSearchCriteria, atLeast(1)).getToDate();
        verify(paymentSearchCriteria, atLeast(1)).getMobileNumber();
        verify(paymentSearchCriteria, atLeast(1)).getTenantId();
        verify(paymentSearchCriteria, atLeast(1)).getTransactionNumber();
        verify(paymentSearchCriteria).getPayerIds();
        verify(paymentSearchCriteria).getBillIds();
        verify(paymentSearchCriteria).getBusinessServices();
        verify(paymentSearchCriteria, atLeast(1)).getConsumerCodes();
        verify(paymentSearchCriteria).getIds();
        verify(paymentSearchCriteria).getInstrumentStatus();
        verify(paymentSearchCriteria).getPaymentModes();
        verify(paymentSearchCriteria, atLeast(1)).getReceiptNumbers();
        verify(paymentSearchCriteria).getStatus();
        verify(paymentSearchCriteria).setToDate((Long) any());
        assertEquals(6, stringObjectMap.size());
    }

    @Test
    void testGetPaymentSearchQueryForPlainSearch12() {
        HashSet<String> stringSet = new HashSet<>();
        stringSet.add(PaymentQueryBuilder.SELECT_PAYMENT_SQL);
        PaymentSearchCriteria paymentSearchCriteria = mock(PaymentSearchCriteria.class);
        when(paymentSearchCriteria.getFromDate()).thenReturn(1L);
        when(paymentSearchCriteria.getToDate()).thenReturn(1L);
        when(paymentSearchCriteria.getMobileNumber()).thenReturn("42");
        when(paymentSearchCriteria.getTenantId()).thenReturn("42");
        when(paymentSearchCriteria.getTransactionNumber()).thenReturn("42");
        when(paymentSearchCriteria.getPayerIds()).thenReturn(new ArrayList<>());
        when(paymentSearchCriteria.getBillIds()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getBusinessServices()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getConsumerCodes()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getIds()).thenReturn(stringSet);
        when(paymentSearchCriteria.getInstrumentStatus()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getPaymentModes()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getReceiptNumbers()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getStatus()).thenReturn(new HashSet<>());
        doNothing().when(paymentSearchCriteria).setToDate((Long) any());
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT py.*,pyd.*,py.id as py_id,py.tenantId as py_tenantId,py.totalAmountPaid as py_totalAmountPaid"
                        + ",py.createdBy as py_createdBy,py.createdtime as py_createdtime,py.lastModifiedBy as py_lastModifiedBy"
                        + ",py.lastmodifiedtime as py_lastmodifiedtime,py.additionalDetails as py_additionalDetails,pyd.id as"
                        + " pyd_id, pyd.tenantId as pyd_tenantId, pyd.manualreceiptnumber as manualreceiptnumber,pyd.manualreceiptdate"
                        + " as manualreceiptdate, pyd.createdBy as pyd_createdBy,pyd.createdtime as pyd_createdtime,pyd.lastModifiedBy"
                        + " as pyd_lastModifiedBy,pyd.lastmodifiedtime as pyd_lastmodifiedtime,pyd.additionalDetails as"
                        + " pyd_additionalDetails FROM egcl_payment py   INNER JOIN egcl_paymentdetail pyd ON pyd.paymentid ="
                        + " py.id  WHERE  py.tenantId LIKE :tenantId AND py.id IN (:id)   AND py.mobileNumber = :mobileNumber AND"
                        + " py.transactionNumber = :transactionNumber AND py.transactionDate >= :fromDate AND py.transactionDate"
                        + " <= :toDate ORDER BY py.transactiondate DESC ",
                PaymentQueryBuilder.getPaymentSearchQueryForPlainSearch(paymentSearchCriteria, stringObjectMap));
        verify(paymentSearchCriteria, atLeast(1)).getFromDate();
        verify(paymentSearchCriteria, atLeast(1)).getToDate();
        verify(paymentSearchCriteria, atLeast(1)).getMobileNumber();
        verify(paymentSearchCriteria, atLeast(1)).getTenantId();
        verify(paymentSearchCriteria, atLeast(1)).getTransactionNumber();
        verify(paymentSearchCriteria).getPayerIds();
        verify(paymentSearchCriteria).getBillIds();
        verify(paymentSearchCriteria).getBusinessServices();
        verify(paymentSearchCriteria).getConsumerCodes();
        verify(paymentSearchCriteria, atLeast(1)).getIds();
        verify(paymentSearchCriteria).getInstrumentStatus();
        verify(paymentSearchCriteria).getPaymentModes();
        verify(paymentSearchCriteria, atLeast(1)).getReceiptNumbers();
        verify(paymentSearchCriteria).getStatus();
        verify(paymentSearchCriteria).setToDate((Long) any());
        assertEquals(6, stringObjectMap.size());
    }

    @Test
    void testGetPaymentSearchQueryForPlainSearch13() {
        HashSet<String> stringSet = new HashSet<>();
        stringSet.add(PaymentQueryBuilder.SELECT_PAYMENT_SQL);
        PaymentSearchCriteria paymentSearchCriteria = mock(PaymentSearchCriteria.class);
        when(paymentSearchCriteria.getFromDate()).thenReturn(1L);
        when(paymentSearchCriteria.getToDate()).thenReturn(1L);
        when(paymentSearchCriteria.getMobileNumber()).thenReturn("42");
        when(paymentSearchCriteria.getTenantId()).thenReturn("42");
        when(paymentSearchCriteria.getTransactionNumber()).thenReturn("42");
        when(paymentSearchCriteria.getPayerIds()).thenReturn(new ArrayList<>());
        when(paymentSearchCriteria.getBillIds()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getBusinessServices()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getConsumerCodes()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getIds()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getInstrumentStatus()).thenReturn(stringSet);
        when(paymentSearchCriteria.getPaymentModes()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getReceiptNumbers()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getStatus()).thenReturn(new HashSet<>());
        doNothing().when(paymentSearchCriteria).setToDate((Long) any());
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT py.*,pyd.*,py.id as py_id,py.tenantId as py_tenantId,py.totalAmountPaid as py_totalAmountPaid"
                        + ",py.createdBy as py_createdBy,py.createdtime as py_createdtime,py.lastModifiedBy as py_lastModifiedBy"
                        + ",py.lastmodifiedtime as py_lastmodifiedtime,py.additionalDetails as py_additionalDetails,pyd.id as"
                        + " pyd_id, pyd.tenantId as pyd_tenantId, pyd.manualreceiptnumber as manualreceiptnumber,pyd.manualreceiptdate"
                        + " as manualreceiptdate, pyd.createdBy as pyd_createdBy,pyd.createdtime as pyd_createdtime,pyd.lastModifiedBy"
                        + " as pyd_lastModifiedBy,pyd.lastmodifiedtime as pyd_lastmodifiedtime,pyd.additionalDetails as"
                        + " pyd_additionalDetails FROM egcl_payment py   INNER JOIN egcl_paymentdetail pyd ON pyd.paymentid ="
                        + " py.id  WHERE  py.tenantId LIKE :tenantId AND UPPER(py.instrumentStatus) in (:instrumentStatus) AND"
                        + " py.mobileNumber = :mobileNumber AND py.transactionNumber = :transactionNumber AND py.transactionDate"
                        + " >= :fromDate AND py.transactionDate <= :toDate ORDER BY py.transactiondate DESC ",
                PaymentQueryBuilder.getPaymentSearchQueryForPlainSearch(paymentSearchCriteria, stringObjectMap));
        verify(paymentSearchCriteria, atLeast(1)).getFromDate();
        verify(paymentSearchCriteria, atLeast(1)).getToDate();
        verify(paymentSearchCriteria, atLeast(1)).getMobileNumber();
        verify(paymentSearchCriteria, atLeast(1)).getTenantId();
        verify(paymentSearchCriteria, atLeast(1)).getTransactionNumber();
        verify(paymentSearchCriteria).getPayerIds();
        verify(paymentSearchCriteria).getBillIds();
        verify(paymentSearchCriteria).getBusinessServices();
        verify(paymentSearchCriteria).getConsumerCodes();
        verify(paymentSearchCriteria).getIds();
        verify(paymentSearchCriteria, atLeast(1)).getInstrumentStatus();
        verify(paymentSearchCriteria).getPaymentModes();
        verify(paymentSearchCriteria, atLeast(1)).getReceiptNumbers();
        verify(paymentSearchCriteria).getStatus();
        verify(paymentSearchCriteria).setToDate((Long) any());
        assertEquals(6, stringObjectMap.size());
    }

    @Test
    void testGetPaymentSearchQueryForPlainSearch14() {
        HashSet<String> stringSet = new HashSet<>();
        stringSet.add(PaymentQueryBuilder.SELECT_PAYMENT_SQL);
        PaymentSearchCriteria paymentSearchCriteria = mock(PaymentSearchCriteria.class);
        when(paymentSearchCriteria.getFromDate()).thenReturn(1L);
        when(paymentSearchCriteria.getToDate()).thenReturn(1L);
        when(paymentSearchCriteria.getMobileNumber()).thenReturn("42");
        when(paymentSearchCriteria.getTenantId()).thenReturn("42");
        when(paymentSearchCriteria.getTransactionNumber()).thenReturn("42");
        when(paymentSearchCriteria.getPayerIds()).thenReturn(new ArrayList<>());
        when(paymentSearchCriteria.getBillIds()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getBusinessServices()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getConsumerCodes()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getIds()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getInstrumentStatus()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getPaymentModes()).thenReturn(stringSet);
        when(paymentSearchCriteria.getReceiptNumbers()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getStatus()).thenReturn(new HashSet<>());
        doNothing().when(paymentSearchCriteria).setToDate((Long) any());
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT py.*,pyd.*,py.id as py_id,py.tenantId as py_tenantId,py.totalAmountPaid as py_totalAmountPaid"
                        + ",py.createdBy as py_createdBy,py.createdtime as py_createdtime,py.lastModifiedBy as py_lastModifiedBy"
                        + ",py.lastmodifiedtime as py_lastmodifiedtime,py.additionalDetails as py_additionalDetails,pyd.id as"
                        + " pyd_id, pyd.tenantId as pyd_tenantId, pyd.manualreceiptnumber as manualreceiptnumber,pyd.manualreceiptdate"
                        + " as manualreceiptdate, pyd.createdBy as pyd_createdBy,pyd.createdtime as pyd_createdtime,pyd.lastModifiedBy"
                        + " as pyd_lastModifiedBy,pyd.lastmodifiedtime as pyd_lastmodifiedtime,pyd.additionalDetails as"
                        + " pyd_additionalDetails FROM egcl_payment py   INNER JOIN egcl_paymentdetail pyd ON pyd.paymentid ="
                        + " py.id  WHERE  py.tenantId LIKE :tenantId AND UPPER(py.paymentMode) in (:paymentMode) AND py.mobileNumber"
                        + " = :mobileNumber AND py.transactionNumber = :transactionNumber AND py.transactionDate >= :fromDate AND"
                        + " py.transactionDate <= :toDate ORDER BY py.transactiondate DESC ",
                PaymentQueryBuilder.getPaymentSearchQueryForPlainSearch(paymentSearchCriteria, stringObjectMap));
        verify(paymentSearchCriteria, atLeast(1)).getFromDate();
        verify(paymentSearchCriteria, atLeast(1)).getToDate();
        verify(paymentSearchCriteria, atLeast(1)).getMobileNumber();
        verify(paymentSearchCriteria, atLeast(1)).getTenantId();
        verify(paymentSearchCriteria, atLeast(1)).getTransactionNumber();
        verify(paymentSearchCriteria).getPayerIds();
        verify(paymentSearchCriteria).getBillIds();
        verify(paymentSearchCriteria).getBusinessServices();
        verify(paymentSearchCriteria).getConsumerCodes();
        verify(paymentSearchCriteria).getIds();
        verify(paymentSearchCriteria).getInstrumentStatus();
        verify(paymentSearchCriteria, atLeast(1)).getPaymentModes();
        verify(paymentSearchCriteria, atLeast(1)).getReceiptNumbers();
        verify(paymentSearchCriteria).getStatus();
        verify(paymentSearchCriteria).setToDate((Long) any());
        assertEquals(6, stringObjectMap.size());
    }

    @Test
    void testGetPaymentSearchQueryForPlainSearch15() {
        HashSet<String> stringSet = new HashSet<>();
        stringSet.add(PaymentQueryBuilder.SELECT_PAYMENT_SQL);
        PaymentSearchCriteria paymentSearchCriteria = mock(PaymentSearchCriteria.class);
        when(paymentSearchCriteria.getFromDate()).thenReturn(1L);
        when(paymentSearchCriteria.getToDate()).thenReturn(1L);
        when(paymentSearchCriteria.getMobileNumber()).thenReturn("42");
        when(paymentSearchCriteria.getTenantId()).thenReturn("42");
        when(paymentSearchCriteria.getTransactionNumber()).thenReturn("42");
        when(paymentSearchCriteria.getPayerIds()).thenReturn(new ArrayList<>());
        when(paymentSearchCriteria.getBillIds()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getBusinessServices()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getConsumerCodes()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getIds()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getInstrumentStatus()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getPaymentModes()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getReceiptNumbers()).thenReturn(stringSet);
        when(paymentSearchCriteria.getStatus()).thenReturn(new HashSet<>());
        doNothing().when(paymentSearchCriteria).setToDate((Long) any());
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT py.*,pyd.*,py.id as py_id,py.tenantId as py_tenantId,py.totalAmountPaid as py_totalAmountPaid"
                        + ",py.createdBy as py_createdBy,py.createdtime as py_createdtime,py.lastModifiedBy as py_lastModifiedBy"
                        + ",py.lastmodifiedtime as py_lastmodifiedtime,py.additionalDetails as py_additionalDetails,pyd.id as"
                        + " pyd_id, pyd.tenantId as pyd_tenantId, pyd.manualreceiptnumber as manualreceiptnumber,pyd.manualreceiptdate"
                        + " as manualreceiptdate, pyd.createdBy as pyd_createdBy,pyd.createdtime as pyd_createdtime,pyd.lastModifiedBy"
                        + " as pyd_lastModifiedBy,pyd.lastmodifiedtime as pyd_lastmodifiedtime,pyd.additionalDetails as"
                        + " pyd_additionalDetails FROM egcl_payment py   INNER JOIN egcl_paymentdetail pyd ON pyd.paymentid ="
                        + " py.id  WHERE  py.tenantId LIKE :tenantId AND py.mobileNumber = :mobileNumber AND py.transactionNumber"
                        + " = :transactionNumber AND py.transactionDate >= :fromDate AND py.transactionDate <= :toDate AND id in"
                        + " (select pyd.paymentid from egcl_paymentdetail as pyd  WHERE  pyd.receiptNumber IN (:receiptnumber) "
                        + " )  ORDER BY py.transactiondate DESC ",
                PaymentQueryBuilder.getPaymentSearchQueryForPlainSearch(paymentSearchCriteria, stringObjectMap));
        verify(paymentSearchCriteria, atLeast(1)).getFromDate();
        verify(paymentSearchCriteria, atLeast(1)).getToDate();
        verify(paymentSearchCriteria, atLeast(1)).getMobileNumber();
        verify(paymentSearchCriteria, atLeast(1)).getTenantId();
        verify(paymentSearchCriteria, atLeast(1)).getTransactionNumber();
        verify(paymentSearchCriteria).getPayerIds();
        verify(paymentSearchCriteria).getBillIds();
        verify(paymentSearchCriteria).getBusinessServices();
        verify(paymentSearchCriteria).getConsumerCodes();
        verify(paymentSearchCriteria).getIds();
        verify(paymentSearchCriteria).getInstrumentStatus();
        verify(paymentSearchCriteria).getPaymentModes();
        verify(paymentSearchCriteria, atLeast(1)).getReceiptNumbers();
        verify(paymentSearchCriteria).getStatus();
        verify(paymentSearchCriteria).setToDate((Long) any());
        assertEquals(6, stringObjectMap.size());
    }

    @Test
    void testGetPaymentSearchQueryForPlainSearch16() {
        HashSet<String> stringSet = new HashSet<>();
        stringSet.add(PaymentQueryBuilder.SELECT_PAYMENT_SQL);
        PaymentSearchCriteria paymentSearchCriteria = mock(PaymentSearchCriteria.class);
        when(paymentSearchCriteria.getFromDate()).thenReturn(1L);
        when(paymentSearchCriteria.getToDate()).thenReturn(1L);
        when(paymentSearchCriteria.getMobileNumber()).thenReturn("42");
        when(paymentSearchCriteria.getTenantId()).thenReturn("42");
        when(paymentSearchCriteria.getTransactionNumber()).thenReturn("42");
        when(paymentSearchCriteria.getPayerIds()).thenReturn(new ArrayList<>());
        when(paymentSearchCriteria.getBillIds()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getBusinessServices()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getConsumerCodes()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getIds()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getInstrumentStatus()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getPaymentModes()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getReceiptNumbers()).thenReturn(new HashSet<>());
        when(paymentSearchCriteria.getStatus()).thenReturn(stringSet);
        doNothing().when(paymentSearchCriteria).setToDate((Long) any());
        HashMap<String, Object> stringObjectMap = new HashMap<>();
        assertEquals("SELECT py.*,pyd.*,py.id as py_id,py.tenantId as py_tenantId,py.totalAmountPaid as py_totalAmountPaid"
                        + ",py.createdBy as py_createdBy,py.createdtime as py_createdtime,py.lastModifiedBy as py_lastModifiedBy"
                        + ",py.lastmodifiedtime as py_lastmodifiedtime,py.additionalDetails as py_additionalDetails,pyd.id as"
                        + " pyd_id, pyd.tenantId as pyd_tenantId, pyd.manualreceiptnumber as manualreceiptnumber,pyd.manualreceiptdate"
                        + " as manualreceiptdate, pyd.createdBy as pyd_createdBy,pyd.createdtime as pyd_createdtime,pyd.lastModifiedBy"
                        + " as pyd_lastModifiedBy,pyd.lastmodifiedtime as pyd_lastmodifiedtime,pyd.additionalDetails as"
                        + " pyd_additionalDetails FROM egcl_payment py   INNER JOIN egcl_paymentdetail pyd ON pyd.paymentid ="
                        + " py.id  WHERE  py.tenantId LIKE :tenantId AND UPPER(py.paymentstatus) in (:status) AND py.mobileNumber"
                        + " = :mobileNumber AND py.transactionNumber = :transactionNumber AND py.transactionDate >= :fromDate AND"
                        + " py.transactionDate <= :toDate ORDER BY py.transactiondate DESC ",
                PaymentQueryBuilder.getPaymentSearchQueryForPlainSearch(paymentSearchCriteria, stringObjectMap));
        verify(paymentSearchCriteria, atLeast(1)).getFromDate();
        verify(paymentSearchCriteria, atLeast(1)).getToDate();
        verify(paymentSearchCriteria, atLeast(1)).getMobileNumber();
        verify(paymentSearchCriteria, atLeast(1)).getTenantId();
        verify(paymentSearchCriteria, atLeast(1)).getTransactionNumber();
        verify(paymentSearchCriteria).getPayerIds();
        verify(paymentSearchCriteria).getBillIds();
        verify(paymentSearchCriteria).getBusinessServices();
        verify(paymentSearchCriteria).getConsumerCodes();
        verify(paymentSearchCriteria).getIds();
        verify(paymentSearchCriteria).getInstrumentStatus();
        verify(paymentSearchCriteria).getPaymentModes();
        verify(paymentSearchCriteria, atLeast(1)).getReceiptNumbers();
        verify(paymentSearchCriteria, atLeast(1)).getStatus();
        verify(paymentSearchCriteria).setToDate((Long) any());
        assertEquals(6, stringObjectMap.size());
    }

    @Test
    void testGetParamtersForBillStatusUpdate3() {
        MissingNode additionalDetails = MissingNode.getInstance();
        ArrayList<BillDetail> billDetails = new ArrayList<>();
        AuditDetails auditDetails = new AuditDetails();
        ArrayList<String> collectionModesNotAllowed = new ArrayList<>();
        BigDecimal minimumAmountToBePaid = BigDecimal.valueOf(42L);
        BigDecimal totalAmount = BigDecimal.valueOf(42L);

        Bill bill = new Bill("42", "42", "Paid By", "Payer Name", "42 Main St", "jane.doe@example.org", "42",
                Bill.StatusEnum.ACTIVE, "Just cause", true, additionalDetails, billDetails, "42", auditDetails,
                collectionModesNotAllowed, true, true, minimumAmountToBePaid, "Business Service", totalAmount, "Consumer Code",
                "42", 1L, BigDecimal.valueOf(42L));
        bill.setStatus(Bill.StatusEnum.ACTIVE);
        MapSqlParameterSource actualParamtersForBillStatusUpdate = PaymentQueryBuilder
                .getParamtersForBillStatusUpdate(bill);
        assertEquals(7, actualParamtersForBillStatusUpdate.getParameterNames().length);
        assertEquals("", ((PGobject) actualParamtersForBillStatusUpdate.getValues().get("additionaldetails")).getValue());
        assertEquals("jsonb",
                ((PGobject) actualParamtersForBillStatusUpdate.getValues().get("additionaldetails")).getType());
    }

    @Test
    void testGetParamtersForBillStatusUpdate4() {
        ArrayNode additionalDetails = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        ArrayList<BillDetail> billDetails = new ArrayList<>();
        AuditDetails auditDetails = new AuditDetails();
        ArrayList<String> collectionModesNotAllowed = new ArrayList<>();
        BigDecimal minimumAmountToBePaid = BigDecimal.valueOf(42L);
        BigDecimal totalAmount = BigDecimal.valueOf(42L);

        Bill bill = new Bill("42", "42", "Paid By", "Payer Name", "42 Main St", "jane.doe@example.org", "42",
                Bill.StatusEnum.ACTIVE, "Just cause", true, additionalDetails, billDetails, "42", auditDetails,
                collectionModesNotAllowed, true, true, minimumAmountToBePaid, "Business Service", totalAmount, "Consumer Code",
                "42", 1L, BigDecimal.valueOf(42L));
        bill.setStatus(Bill.StatusEnum.ACTIVE);
        MapSqlParameterSource actualParamtersForBillStatusUpdate = PaymentQueryBuilder
                .getParamtersForBillStatusUpdate(bill);
        assertEquals(7, actualParamtersForBillStatusUpdate.getParameterNames().length);
        assertEquals("[]", ((PGobject) actualParamtersForBillStatusUpdate.getValues().get("additionaldetails")).getValue());
        assertEquals("jsonb",
                ((PGobject) actualParamtersForBillStatusUpdate.getValues().get("additionaldetails")).getType());
    }

    @Test
    void testGetParamtersForBillStatusUpdate5() {
        BigIntegerNode additionalDetails = new BigIntegerNode(BigInteger.valueOf(42L));
        ArrayList<BillDetail> billDetails = new ArrayList<>();
        AuditDetails auditDetails = new AuditDetails();
        ArrayList<String> collectionModesNotAllowed = new ArrayList<>();
        BigDecimal minimumAmountToBePaid = BigDecimal.valueOf(42L);
        BigDecimal totalAmount = BigDecimal.valueOf(42L);

        Bill bill = new Bill("42", "42", "Paid By", "Payer Name", "42 Main St", "jane.doe@example.org", "42",
                Bill.StatusEnum.ACTIVE, "Just cause", true, additionalDetails, billDetails, "42", auditDetails,
                collectionModesNotAllowed, true, true, minimumAmountToBePaid, "Business Service", totalAmount, "Consumer Code",
                "42", 1L, BigDecimal.valueOf(42L));
        bill.setStatus(Bill.StatusEnum.ACTIVE);
        MapSqlParameterSource actualParamtersForBillStatusUpdate = PaymentQueryBuilder
                .getParamtersForBillStatusUpdate(bill);
        assertEquals(7, actualParamtersForBillStatusUpdate.getParameterNames().length);
        assertEquals("42", ((PGobject) actualParamtersForBillStatusUpdate.getValues().get("additionaldetails")).getValue());
        assertEquals("jsonb",
                ((PGobject) actualParamtersForBillStatusUpdate.getValues().get("additionaldetails")).getType());
    }

    @Test
    void testGetParamtersForBillStatusUpdate6() throws UnsupportedEncodingException {
        BinaryNode additionalDetails = new BinaryNode("AAAAAAAA".getBytes("UTF-8"));
        ArrayList<BillDetail> billDetails = new ArrayList<>();
        AuditDetails auditDetails = new AuditDetails();
        ArrayList<String> collectionModesNotAllowed = new ArrayList<>();
        BigDecimal minimumAmountToBePaid = BigDecimal.valueOf(42L);
        BigDecimal totalAmount = BigDecimal.valueOf(42L);

        Bill bill = new Bill("42", "42", "Paid By", "Payer Name", "42 Main St", "jane.doe@example.org", "42",
                Bill.StatusEnum.ACTIVE, "Just cause", true, additionalDetails, billDetails, "42", auditDetails,
                collectionModesNotAllowed, true, true, minimumAmountToBePaid, "Business Service", totalAmount, "Consumer Code",
                "42", 1L, BigDecimal.valueOf(42L));
        bill.setStatus(Bill.StatusEnum.ACTIVE);
        MapSqlParameterSource actualParamtersForBillStatusUpdate = PaymentQueryBuilder
                .getParamtersForBillStatusUpdate(bill);
        assertEquals(7, actualParamtersForBillStatusUpdate.getParameterNames().length);
        assertEquals("\"QUFBQUFBQUE=\"",
                ((PGobject) actualParamtersForBillStatusUpdate.getValues().get("additionaldetails")).getValue());
        assertEquals("jsonb",
                ((PGobject) actualParamtersForBillStatusUpdate.getValues().get("additionaldetails")).getType());
    }

    @Test
    void testGetParamtersForBillStatusUpdate7() {
        NullNode additionalDetails = NullNode.getInstance();
        ArrayList<BillDetail> billDetails = new ArrayList<>();
        AuditDetails auditDetails = new AuditDetails();
        ArrayList<String> collectionModesNotAllowed = new ArrayList<>();
        BigDecimal minimumAmountToBePaid = BigDecimal.valueOf(42L);
        BigDecimal totalAmount = BigDecimal.valueOf(42L);

        Bill bill = new Bill("42", "42", "Paid By", "Payer Name", "42 Main St", "jane.doe@example.org", "42",
                Bill.StatusEnum.ACTIVE, "Just cause", true, additionalDetails, billDetails, "42", auditDetails,
                collectionModesNotAllowed, true, true, minimumAmountToBePaid, "Business Service", totalAmount, "Consumer Code",
                "42", 1L, BigDecimal.valueOf(42L));
        bill.setStatus(Bill.StatusEnum.ACTIVE);
        MapSqlParameterSource actualParamtersForBillStatusUpdate = PaymentQueryBuilder
                .getParamtersForBillStatusUpdate(bill);
        assertEquals(7, actualParamtersForBillStatusUpdate.getParameterNames().length);
        assertEquals("null",
                ((PGobject) actualParamtersForBillStatusUpdate.getValues().get("additionaldetails")).getValue());
        assertEquals("jsonb",
                ((PGobject) actualParamtersForBillStatusUpdate.getValues().get("additionaldetails")).getType());
    }

    @Test
    void testGetParamtersForBillStatusUpdate8() {
        AuditDetails auditDetails = mock(AuditDetails.class);
        when(auditDetails.getLastModifiedTime()).thenReturn(1L);
        when(auditDetails.getLastModifiedBy()).thenReturn("Jan 1, 2020 9:00am GMT+0100");
        MissingNode additionalDetails = MissingNode.getInstance();
        ArrayList<BillDetail> billDetails = new ArrayList<>();
        ArrayList<String> collectionModesNotAllowed = new ArrayList<>();
        BigDecimal minimumAmountToBePaid = BigDecimal.valueOf(42L);
        BigDecimal totalAmount = BigDecimal.valueOf(42L);

        Bill bill = new Bill("42", "42", "Paid By", "Payer Name", "42 Main St", "jane.doe@example.org", "42",
                Bill.StatusEnum.ACTIVE, "Just cause", true, additionalDetails, billDetails, "42", auditDetails,
                collectionModesNotAllowed, true, true, minimumAmountToBePaid, "Business Service", totalAmount, "Consumer Code",
                "42", 1L, BigDecimal.valueOf(42L));
        bill.setStatus(Bill.StatusEnum.ACTIVE);
        MapSqlParameterSource actualParamtersForBillStatusUpdate = PaymentQueryBuilder
                .getParamtersForBillStatusUpdate(bill);
        assertEquals(7, actualParamtersForBillStatusUpdate.getParameterNames().length);
        assertEquals("", ((PGobject) actualParamtersForBillStatusUpdate.getValues().get("additionaldetails")).getValue());
        assertEquals("jsonb",
                ((PGobject) actualParamtersForBillStatusUpdate.getValues().get("additionaldetails")).getType());
        verify(auditDetails).getLastModifiedTime();
        verify(auditDetails).getLastModifiedBy();
    }

    @Test
    void testGetParametersForPaymentDetailStatusUpdate2() {
        PaymentDetail paymentDetail = new PaymentDetail();
        paymentDetail.setAuditDetails(new AuditDetails());
        assertEquals(4,
                PaymentQueryBuilder.getParametersForPaymentDetailStatusUpdate(paymentDetail).getParameterNames().length);
    }

    @Test
    void testGetParametersForPaymentDetailStatusUpdate3() {
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        Bill bill = new Bill();
        MissingNode additionalDetails = MissingNode.getInstance();
        MapSqlParameterSource actualParametersForPaymentDetailStatusUpdate = PaymentQueryBuilder
                .getParametersForPaymentDetailStatusUpdate(new PaymentDetail("42", "42", "42", totalDue, totalAmountPaid, "42",
                        "42", 1L, 1L, "id", "id", "42", bill, additionalDetails, new AuditDetails()));
        assertEquals(4, actualParametersForPaymentDetailStatusUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentDetailStatusUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("",
                ((PGobject) actualParametersForPaymentDetailStatusUpdate.getValues().get("additionaldetails")).getValue());
    }

    @Test
    void testGetParametersForPaymentDetailStatusUpdate5() {
        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getAdditionalDetails()).thenReturn(MissingNode.getInstance());
        when(paymentDetail.getId()).thenReturn("42");
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentDetailStatusUpdate = PaymentQueryBuilder
                .getParametersForPaymentDetailStatusUpdate(paymentDetail);
        assertEquals(4, actualParametersForPaymentDetailStatusUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentDetailStatusUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("",
                ((PGobject) actualParametersForPaymentDetailStatusUpdate.getValues().get("additionaldetails")).getValue());
        verify(paymentDetail).getAdditionalDetails();
        verify(paymentDetail).getId();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentDetailStatusUpdate6() {
        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getAdditionalDetails()).thenReturn(new ArrayNode(JsonNodeFactory.withExactBigDecimals(true)));
        when(paymentDetail.getId()).thenReturn("42");
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentDetailStatusUpdate = PaymentQueryBuilder
                .getParametersForPaymentDetailStatusUpdate(paymentDetail);
        assertEquals(4, actualParametersForPaymentDetailStatusUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentDetailStatusUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("[]",
                ((PGobject) actualParametersForPaymentDetailStatusUpdate.getValues().get("additionaldetails")).getValue());
        verify(paymentDetail).getAdditionalDetails();
        verify(paymentDetail).getId();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentDetailStatusUpdate7() {
        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getAdditionalDetails()).thenReturn(new BigIntegerNode(BigInteger.valueOf(42L)));
        when(paymentDetail.getId()).thenReturn("42");
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentDetailStatusUpdate = PaymentQueryBuilder
                .getParametersForPaymentDetailStatusUpdate(paymentDetail);
        assertEquals(4, actualParametersForPaymentDetailStatusUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentDetailStatusUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("42",
                ((PGobject) actualParametersForPaymentDetailStatusUpdate.getValues().get("additionaldetails")).getValue());
        verify(paymentDetail).getAdditionalDetails();
        verify(paymentDetail).getId();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentDetailStatusUpdate8() throws UnsupportedEncodingException {
        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getAdditionalDetails()).thenReturn(new BinaryNode("AAAAAAAA".getBytes("UTF-8")));
        when(paymentDetail.getId()).thenReturn("42");
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentDetailStatusUpdate = PaymentQueryBuilder
                .getParametersForPaymentDetailStatusUpdate(paymentDetail);
        assertEquals(4, actualParametersForPaymentDetailStatusUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentDetailStatusUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("\"QUFBQUFBQUE=\"",
                ((PGobject) actualParametersForPaymentDetailStatusUpdate.getValues().get("additionaldetails")).getValue());
        verify(paymentDetail).getAdditionalDetails();
        verify(paymentDetail).getId();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentDetailStatusUpdate9() {
        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getAdditionalDetails()).thenReturn(NullNode.getInstance());
        when(paymentDetail.getId()).thenReturn("42");
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentDetailStatusUpdate = PaymentQueryBuilder
                .getParametersForPaymentDetailStatusUpdate(paymentDetail);
        assertEquals(4, actualParametersForPaymentDetailStatusUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentDetailStatusUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("null",
                ((PGobject) actualParametersForPaymentDetailStatusUpdate.getValues().get("additionaldetails")).getValue());
        verify(paymentDetail).getAdditionalDetails();
        verify(paymentDetail).getId();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentDetailStatusUpdate10() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addArray();
        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getAdditionalDetails()).thenReturn(arrayNode);
        when(paymentDetail.getId()).thenReturn("42");
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentDetailStatusUpdate = PaymentQueryBuilder
                .getParametersForPaymentDetailStatusUpdate(paymentDetail);
        assertEquals(4, actualParametersForPaymentDetailStatusUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentDetailStatusUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("[[]]",
                ((PGobject) actualParametersForPaymentDetailStatusUpdate.getValues().get("additionaldetails")).getValue());
        verify(paymentDetail).getAdditionalDetails();
        verify(paymentDetail).getId();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentDetailStatusUpdate11() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addObject();
        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getAdditionalDetails()).thenReturn(arrayNode);
        when(paymentDetail.getId()).thenReturn("42");
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentDetailStatusUpdate = PaymentQueryBuilder
                .getParametersForPaymentDetailStatusUpdate(paymentDetail);
        assertEquals(4, actualParametersForPaymentDetailStatusUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentDetailStatusUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("[{}]",
                ((PGobject) actualParametersForPaymentDetailStatusUpdate.getValues().get("additionaldetails")).getValue());
        verify(paymentDetail).getAdditionalDetails();
        verify(paymentDetail).getId();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentDetailStatusUpdate12() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addPOJO("Value");
        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getAdditionalDetails()).thenReturn(arrayNode);
        when(paymentDetail.getId()).thenReturn("42");
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentDetailStatusUpdate = PaymentQueryBuilder
                .getParametersForPaymentDetailStatusUpdate(paymentDetail);
        assertEquals(4, actualParametersForPaymentDetailStatusUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentDetailStatusUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("[\"Value\"]",
                ((PGobject) actualParametersForPaymentDetailStatusUpdate.getValues().get("additionaldetails")).getValue());
        verify(paymentDetail).getAdditionalDetails();
        verify(paymentDetail).getId();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentDetailStatusUpdate13() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addNull();
        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getAdditionalDetails()).thenReturn(arrayNode);
        when(paymentDetail.getId()).thenReturn("42");
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentDetailStatusUpdate = PaymentQueryBuilder
                .getParametersForPaymentDetailStatusUpdate(paymentDetail);
        assertEquals(4, actualParametersForPaymentDetailStatusUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentDetailStatusUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("[null]",
                ((PGobject) actualParametersForPaymentDetailStatusUpdate.getValues().get("additionaldetails")).getValue());
        verify(paymentDetail).getAdditionalDetails();
        verify(paymentDetail).getId();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentDetailStatusUpdate14() throws UnsupportedEncodingException {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.add("AAAAAAAA".getBytes("UTF-8"));
        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getAdditionalDetails()).thenReturn(arrayNode);
        when(paymentDetail.getId()).thenReturn("42");
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentDetailStatusUpdate = PaymentQueryBuilder
                .getParametersForPaymentDetailStatusUpdate(paymentDetail);
        assertEquals(4, actualParametersForPaymentDetailStatusUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentDetailStatusUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("[\"QUFBQUFBQUE=\"]",
                ((PGobject) actualParametersForPaymentDetailStatusUpdate.getValues().get("additionaldetails")).getValue());
        verify(paymentDetail).getAdditionalDetails();
        verify(paymentDetail).getId();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentStatusUpdate3() {
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();

        Payment payment = new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CASH, 1L, "42",
                InstrumentStatusEnum.APPROVED, "Ifsc Code", auditDetails, additionalDetails, new ArrayList<>(), "Paid By", "42",
                "Payer Name", "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42");
        payment.setInstrumentStatus(InstrumentStatusEnum.APPROVED);
        MapSqlParameterSource actualParametersForPaymentStatusUpdate = PaymentQueryBuilder
                .getParametersForPaymentStatusUpdate(payment);
        assertEquals(6, actualParametersForPaymentStatusUpdate.getParameterNames().length);
        assertEquals("",
                ((PGobject) actualParametersForPaymentStatusUpdate.getValues().get("additionaldetails")).getValue());
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentStatusUpdate.getValues().get("additionaldetails")).getType());
    }

    @Test
    void testGetParametersForPaymentStatusUpdate5() {
        AuditDetails auditDetails = mock(AuditDetails.class);
        when(auditDetails.getLastModifiedTime()).thenReturn(1L);
        when(auditDetails.getLastModifiedBy()).thenReturn("Jan 1, 2020 9:00am GMT+0100");
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        MissingNode additionalDetails = MissingNode.getInstance();

        Payment payment = new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CASH, 1L, "42",
                InstrumentStatusEnum.APPROVED, "Ifsc Code", auditDetails, additionalDetails, new ArrayList<>(), "Paid By", "42",
                "Payer Name", "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42");
        payment.setInstrumentStatus(InstrumentStatusEnum.APPROVED);
        MapSqlParameterSource actualParametersForPaymentStatusUpdate = PaymentQueryBuilder
                .getParametersForPaymentStatusUpdate(payment);
        assertEquals(6, actualParametersForPaymentStatusUpdate.getParameterNames().length);
        assertEquals("",
                ((PGobject) actualParametersForPaymentStatusUpdate.getValues().get("additionaldetails")).getValue());
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentStatusUpdate.getValues().get("additionaldetails")).getType());
        verify(auditDetails).getLastModifiedTime();
        verify(auditDetails).getLastModifiedBy();
    }

    @Test
    void testGetParametersForPaymentStatusUpdate6() {
        AuditDetails auditDetails = mock(AuditDetails.class);
        when(auditDetails.getLastModifiedTime()).thenReturn(1L);
        when(auditDetails.getLastModifiedBy()).thenReturn("Jan 1, 2020 9:00am GMT+0100");
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        NullNode additionalDetails = NullNode.getInstance();

        Payment payment = new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CASH, 1L, "42",
                InstrumentStatusEnum.APPROVED, "Ifsc Code", auditDetails, additionalDetails, new ArrayList<>(), "Paid By", "42",
                "Payer Name", "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42");
        payment.setInstrumentStatus(InstrumentStatusEnum.APPROVED);
        MapSqlParameterSource actualParametersForPaymentStatusUpdate = PaymentQueryBuilder
                .getParametersForPaymentStatusUpdate(payment);
        assertEquals(6, actualParametersForPaymentStatusUpdate.getParameterNames().length);
        assertEquals("null",
                ((PGobject) actualParametersForPaymentStatusUpdate.getValues().get("additionaldetails")).getValue());
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentStatusUpdate.getValues().get("additionaldetails")).getType());
        verify(auditDetails).getLastModifiedTime();
        verify(auditDetails).getLastModifiedBy();
    }

    @Test
    void testGetParametersForPaymentStatusUpdate7() {
        AuditDetails auditDetails = mock(AuditDetails.class);
        when(auditDetails.getLastModifiedTime()).thenReturn(1L);
        when(auditDetails.getLastModifiedBy()).thenReturn("Jan 1, 2020 9:00am GMT+0100");
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        BooleanNode additionalDetails = BooleanNode.getFalse();

        Payment payment = new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CASH, 1L, "42",
                InstrumentStatusEnum.APPROVED, "Ifsc Code", auditDetails, additionalDetails, new ArrayList<>(), "Paid By", "42",
                "Payer Name", "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42");
        payment.setInstrumentStatus(InstrumentStatusEnum.APPROVED);
        MapSqlParameterSource actualParametersForPaymentStatusUpdate = PaymentQueryBuilder
                .getParametersForPaymentStatusUpdate(payment);
        assertEquals(6, actualParametersForPaymentStatusUpdate.getParameterNames().length);
        String expectedValue = Boolean.FALSE.toString();
        assertEquals(expectedValue,
                ((PGobject) actualParametersForPaymentStatusUpdate.getValues().get("additionaldetails")).getValue());
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentStatusUpdate.getValues().get("additionaldetails")).getType());
        verify(auditDetails).getLastModifiedTime();
        verify(auditDetails).getLastModifiedBy();
    }

    @Test
    void testGetParametersForPaymentUpdate2() {
        Payment payment = new Payment();
        payment.setAuditDetails(new AuditDetails());
        assertEquals(8, PaymentQueryBuilder.getParametersForPaymentUpdate(payment).getParameterNames().length);
    }

    @Test
    void testGetParametersForPaymentUpdate3() {
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();
        MapSqlParameterSource actualParametersForPaymentUpdate = PaymentQueryBuilder.getParametersForPaymentUpdate(
                new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CASH, 1L, "42",
                        InstrumentStatusEnum.APPROVED, "id", auditDetails, additionalDetails, new ArrayList<>(), "id", "42", "id",
                        "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42"));
        assertEquals(8, actualParametersForPaymentUpdate.getParameterNames().length);
        assertEquals("jsonb", ((PGobject) actualParametersForPaymentUpdate.getValues().get("additionalDetails")).getType());
        assertEquals("", ((PGobject) actualParametersForPaymentUpdate.getValues().get("additionalDetails")).getValue());
    }

    @Test
    void testGetParametersForPaymentUpdate5() {
        Payment payment = mock(Payment.class);
        when(payment.getAdditionalDetails()).thenReturn(MissingNode.getInstance());
        when(payment.getId()).thenReturn("42");
        when(payment.getPaidBy()).thenReturn("Paid By");
        when(payment.getPayerAddress()).thenReturn("42 Main St");
        when(payment.getPayerEmail()).thenReturn("jane.doe@example.org");
        when(payment.getPayerName()).thenReturn("Payer Name");
        when(payment.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentUpdate = PaymentQueryBuilder.getParametersForPaymentUpdate(payment);
        assertEquals(8, actualParametersForPaymentUpdate.getParameterNames().length);
        assertEquals("jsonb", ((PGobject) actualParametersForPaymentUpdate.getValues().get("additionalDetails")).getType());
        assertEquals("", ((PGobject) actualParametersForPaymentUpdate.getValues().get("additionalDetails")).getValue());
        verify(payment).getAdditionalDetails();
        verify(payment).getId();
        verify(payment).getPaidBy();
        verify(payment).getPayerAddress();
        verify(payment).getPayerEmail();
        verify(payment).getPayerName();
        verify(payment, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentUpdate6() {
        Payment payment = mock(Payment.class);
        when(payment.getAdditionalDetails()).thenReturn(new ArrayNode(JsonNodeFactory.withExactBigDecimals(true)));
        when(payment.getId()).thenReturn("42");
        when(payment.getPaidBy()).thenReturn("Paid By");
        when(payment.getPayerAddress()).thenReturn("42 Main St");
        when(payment.getPayerEmail()).thenReturn("jane.doe@example.org");
        when(payment.getPayerName()).thenReturn("Payer Name");
        when(payment.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentUpdate = PaymentQueryBuilder.getParametersForPaymentUpdate(payment);
        assertEquals(8, actualParametersForPaymentUpdate.getParameterNames().length);
        assertEquals("jsonb", ((PGobject) actualParametersForPaymentUpdate.getValues().get("additionalDetails")).getType());
        assertEquals("[]", ((PGobject) actualParametersForPaymentUpdate.getValues().get("additionalDetails")).getValue());
        verify(payment).getAdditionalDetails();
        verify(payment).getId();
        verify(payment).getPaidBy();
        verify(payment).getPayerAddress();
        verify(payment).getPayerEmail();
        verify(payment).getPayerName();
        verify(payment, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentUpdate7() {
        Payment payment = mock(Payment.class);
        when(payment.getAdditionalDetails()).thenReturn(new BigIntegerNode(BigInteger.valueOf(42L)));
        when(payment.getId()).thenReturn("42");
        when(payment.getPaidBy()).thenReturn("Paid By");
        when(payment.getPayerAddress()).thenReturn("42 Main St");
        when(payment.getPayerEmail()).thenReturn("jane.doe@example.org");
        when(payment.getPayerName()).thenReturn("Payer Name");
        when(payment.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentUpdate = PaymentQueryBuilder.getParametersForPaymentUpdate(payment);
        assertEquals(8, actualParametersForPaymentUpdate.getParameterNames().length);
        assertEquals("jsonb", ((PGobject) actualParametersForPaymentUpdate.getValues().get("additionalDetails")).getType());
        assertEquals("42", ((PGobject) actualParametersForPaymentUpdate.getValues().get("additionalDetails")).getValue());
        verify(payment).getAdditionalDetails();
        verify(payment).getId();
        verify(payment).getPaidBy();
        verify(payment).getPayerAddress();
        verify(payment).getPayerEmail();
        verify(payment).getPayerName();
        verify(payment, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentUpdate8() throws UnsupportedEncodingException {
        Payment payment = mock(Payment.class);
        when(payment.getAdditionalDetails()).thenReturn(new BinaryNode("AAAAAAAA".getBytes("UTF-8")));
        when(payment.getId()).thenReturn("42");
        when(payment.getPaidBy()).thenReturn("Paid By");
        when(payment.getPayerAddress()).thenReturn("42 Main St");
        when(payment.getPayerEmail()).thenReturn("jane.doe@example.org");
        when(payment.getPayerName()).thenReturn("Payer Name");
        when(payment.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentUpdate = PaymentQueryBuilder.getParametersForPaymentUpdate(payment);
        assertEquals(8, actualParametersForPaymentUpdate.getParameterNames().length);
        assertEquals("jsonb", ((PGobject) actualParametersForPaymentUpdate.getValues().get("additionalDetails")).getType());
        assertEquals("\"QUFBQUFBQUE=\"",
                ((PGobject) actualParametersForPaymentUpdate.getValues().get("additionalDetails")).getValue());
        verify(payment).getAdditionalDetails();
        verify(payment).getId();
        verify(payment).getPaidBy();
        verify(payment).getPayerAddress();
        verify(payment).getPayerEmail();
        verify(payment).getPayerName();
        verify(payment, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentUpdate9() {
        Payment payment = mock(Payment.class);
        when(payment.getAdditionalDetails()).thenReturn(NullNode.getInstance());
        when(payment.getId()).thenReturn("42");
        when(payment.getPaidBy()).thenReturn("Paid By");
        when(payment.getPayerAddress()).thenReturn("42 Main St");
        when(payment.getPayerEmail()).thenReturn("jane.doe@example.org");
        when(payment.getPayerName()).thenReturn("Payer Name");
        when(payment.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentUpdate = PaymentQueryBuilder.getParametersForPaymentUpdate(payment);
        assertEquals(8, actualParametersForPaymentUpdate.getParameterNames().length);
        assertEquals("jsonb", ((PGobject) actualParametersForPaymentUpdate.getValues().get("additionalDetails")).getType());
        assertEquals("null", ((PGobject) actualParametersForPaymentUpdate.getValues().get("additionalDetails")).getValue());
        verify(payment).getAdditionalDetails();
        verify(payment).getId();
        verify(payment).getPaidBy();
        verify(payment).getPayerAddress();
        verify(payment).getPayerEmail();
        verify(payment).getPayerName();
        verify(payment, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentUpdate10() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addArray();
        Payment payment = mock(Payment.class);
        when(payment.getAdditionalDetails()).thenReturn(arrayNode);
        when(payment.getId()).thenReturn("42");
        when(payment.getPaidBy()).thenReturn("Paid By");
        when(payment.getPayerAddress()).thenReturn("42 Main St");
        when(payment.getPayerEmail()).thenReturn("jane.doe@example.org");
        when(payment.getPayerName()).thenReturn("Payer Name");
        when(payment.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentUpdate = PaymentQueryBuilder.getParametersForPaymentUpdate(payment);
        assertEquals(8, actualParametersForPaymentUpdate.getParameterNames().length);
        assertEquals("jsonb", ((PGobject) actualParametersForPaymentUpdate.getValues().get("additionalDetails")).getType());
        assertEquals("[[]]", ((PGobject) actualParametersForPaymentUpdate.getValues().get("additionalDetails")).getValue());
        verify(payment).getAdditionalDetails();
        verify(payment).getId();
        verify(payment).getPaidBy();
        verify(payment).getPayerAddress();
        verify(payment).getPayerEmail();
        verify(payment).getPayerName();
        verify(payment, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentUpdate11() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addObject();
        Payment payment = mock(Payment.class);
        when(payment.getAdditionalDetails()).thenReturn(arrayNode);
        when(payment.getId()).thenReturn("42");
        when(payment.getPaidBy()).thenReturn("Paid By");
        when(payment.getPayerAddress()).thenReturn("42 Main St");
        when(payment.getPayerEmail()).thenReturn("jane.doe@example.org");
        when(payment.getPayerName()).thenReturn("Payer Name");
        when(payment.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentUpdate = PaymentQueryBuilder.getParametersForPaymentUpdate(payment);
        assertEquals(8, actualParametersForPaymentUpdate.getParameterNames().length);
        assertEquals("jsonb", ((PGobject) actualParametersForPaymentUpdate.getValues().get("additionalDetails")).getType());
        assertEquals("[{}]", ((PGobject) actualParametersForPaymentUpdate.getValues().get("additionalDetails")).getValue());
        verify(payment).getAdditionalDetails();
        verify(payment).getId();
        verify(payment).getPaidBy();
        verify(payment).getPayerAddress();
        verify(payment).getPayerEmail();
        verify(payment).getPayerName();
        verify(payment, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentUpdate12() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addPOJO("Value");
        Payment payment = mock(Payment.class);
        when(payment.getAdditionalDetails()).thenReturn(arrayNode);
        when(payment.getId()).thenReturn("42");
        when(payment.getPaidBy()).thenReturn("Paid By");
        when(payment.getPayerAddress()).thenReturn("42 Main St");
        when(payment.getPayerEmail()).thenReturn("jane.doe@example.org");
        when(payment.getPayerName()).thenReturn("Payer Name");
        when(payment.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentUpdate = PaymentQueryBuilder.getParametersForPaymentUpdate(payment);
        assertEquals(8, actualParametersForPaymentUpdate.getParameterNames().length);
        assertEquals("jsonb", ((PGobject) actualParametersForPaymentUpdate.getValues().get("additionalDetails")).getType());
        assertEquals("[\"Value\"]",
                ((PGobject) actualParametersForPaymentUpdate.getValues().get("additionalDetails")).getValue());
        verify(payment).getAdditionalDetails();
        verify(payment).getId();
        verify(payment).getPaidBy();
        verify(payment).getPayerAddress();
        verify(payment).getPayerEmail();
        verify(payment).getPayerName();
        verify(payment, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentUpdate13() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addNull();
        Payment payment = mock(Payment.class);
        when(payment.getAdditionalDetails()).thenReturn(arrayNode);
        when(payment.getId()).thenReturn("42");
        when(payment.getPaidBy()).thenReturn("Paid By");
        when(payment.getPayerAddress()).thenReturn("42 Main St");
        when(payment.getPayerEmail()).thenReturn("jane.doe@example.org");
        when(payment.getPayerName()).thenReturn("Payer Name");
        when(payment.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentUpdate = PaymentQueryBuilder.getParametersForPaymentUpdate(payment);
        assertEquals(8, actualParametersForPaymentUpdate.getParameterNames().length);
        assertEquals("jsonb", ((PGobject) actualParametersForPaymentUpdate.getValues().get("additionalDetails")).getType());
        assertEquals("[null]",
                ((PGobject) actualParametersForPaymentUpdate.getValues().get("additionalDetails")).getValue());
        verify(payment).getAdditionalDetails();
        verify(payment).getId();
        verify(payment).getPaidBy();
        verify(payment).getPayerAddress();
        verify(payment).getPayerEmail();
        verify(payment).getPayerName();
        verify(payment, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentUpdate14() throws UnsupportedEncodingException {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.add("AAAAAAAA".getBytes("UTF-8"));
        Payment payment = mock(Payment.class);
        when(payment.getAdditionalDetails()).thenReturn(arrayNode);
        when(payment.getId()).thenReturn("42");
        when(payment.getPaidBy()).thenReturn("Paid By");
        when(payment.getPayerAddress()).thenReturn("42 Main St");
        when(payment.getPayerEmail()).thenReturn("jane.doe@example.org");
        when(payment.getPayerName()).thenReturn("Payer Name");
        when(payment.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentUpdate = PaymentQueryBuilder.getParametersForPaymentUpdate(payment);
        assertEquals(8, actualParametersForPaymentUpdate.getParameterNames().length);
        assertEquals("jsonb", ((PGobject) actualParametersForPaymentUpdate.getValues().get("additionalDetails")).getType());
        assertEquals("[\"QUFBQUFBQUE=\"]",
                ((PGobject) actualParametersForPaymentUpdate.getValues().get("additionalDetails")).getValue());
        verify(payment).getAdditionalDetails();
        verify(payment).getId();
        verify(payment).getPaidBy();
        verify(payment).getPayerAddress();
        verify(payment).getPayerEmail();
        verify(payment).getPayerName();
        verify(payment, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentDetailUpdate2() {
        PaymentDetail paymentDetail = new PaymentDetail();
        paymentDetail.setAuditDetails(new AuditDetails());
        assertEquals(4, PaymentQueryBuilder.getParametersForPaymentDetailUpdate(paymentDetail).getParameterNames().length);
    }

    @Test
    void testGetParametersForPaymentDetailUpdate3() {
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        Bill bill = new Bill();
        MissingNode additionalDetails = MissingNode.getInstance();
        MapSqlParameterSource actualParametersForPaymentDetailUpdate = PaymentQueryBuilder
                .getParametersForPaymentDetailUpdate(new PaymentDetail("42", "42", "42", totalDue, totalAmountPaid, "42", "42",
                        1L, 1L, "id", "id", "42", bill, additionalDetails, new AuditDetails()));
        assertEquals(4, actualParametersForPaymentDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentDetailUpdate.getValues().get("additionalDetails")).getType());
        assertEquals("",
                ((PGobject) actualParametersForPaymentDetailUpdate.getValues().get("additionalDetails")).getValue());
    }

    @Test
    void testGetParametersForPaymentDetailUpdate5() {
        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getAdditionalDetails()).thenReturn(MissingNode.getInstance());
        when(paymentDetail.getId()).thenReturn("42");
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentDetailUpdate = PaymentQueryBuilder
                .getParametersForPaymentDetailUpdate(paymentDetail);
        assertEquals(4, actualParametersForPaymentDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentDetailUpdate.getValues().get("additionalDetails")).getType());
        assertEquals("",
                ((PGobject) actualParametersForPaymentDetailUpdate.getValues().get("additionalDetails")).getValue());
        verify(paymentDetail).getAdditionalDetails();
        verify(paymentDetail).getId();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentDetailUpdate6() {
        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getAdditionalDetails()).thenReturn(new ArrayNode(JsonNodeFactory.withExactBigDecimals(true)));
        when(paymentDetail.getId()).thenReturn("42");
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentDetailUpdate = PaymentQueryBuilder
                .getParametersForPaymentDetailUpdate(paymentDetail);
        assertEquals(4, actualParametersForPaymentDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentDetailUpdate.getValues().get("additionalDetails")).getType());
        assertEquals("[]",
                ((PGobject) actualParametersForPaymentDetailUpdate.getValues().get("additionalDetails")).getValue());
        verify(paymentDetail).getAdditionalDetails();
        verify(paymentDetail).getId();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentDetailUpdate7() {
        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getAdditionalDetails()).thenReturn(new BigIntegerNode(BigInteger.valueOf(42L)));
        when(paymentDetail.getId()).thenReturn("42");
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentDetailUpdate = PaymentQueryBuilder
                .getParametersForPaymentDetailUpdate(paymentDetail);
        assertEquals(4, actualParametersForPaymentDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentDetailUpdate.getValues().get("additionalDetails")).getType());
        assertEquals("42",
                ((PGobject) actualParametersForPaymentDetailUpdate.getValues().get("additionalDetails")).getValue());
        verify(paymentDetail).getAdditionalDetails();
        verify(paymentDetail).getId();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentDetailUpdate8() throws UnsupportedEncodingException {
        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getAdditionalDetails()).thenReturn(new BinaryNode("AAAAAAAA".getBytes("UTF-8")));
        when(paymentDetail.getId()).thenReturn("42");
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentDetailUpdate = PaymentQueryBuilder
                .getParametersForPaymentDetailUpdate(paymentDetail);
        assertEquals(4, actualParametersForPaymentDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentDetailUpdate.getValues().get("additionalDetails")).getType());
        assertEquals("\"QUFBQUFBQUE=\"",
                ((PGobject) actualParametersForPaymentDetailUpdate.getValues().get("additionalDetails")).getValue());
        verify(paymentDetail).getAdditionalDetails();
        verify(paymentDetail).getId();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentDetailUpdate9() {
        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getAdditionalDetails()).thenReturn(NullNode.getInstance());
        when(paymentDetail.getId()).thenReturn("42");
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentDetailUpdate = PaymentQueryBuilder
                .getParametersForPaymentDetailUpdate(paymentDetail);
        assertEquals(4, actualParametersForPaymentDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentDetailUpdate.getValues().get("additionalDetails")).getType());
        assertEquals("null",
                ((PGobject) actualParametersForPaymentDetailUpdate.getValues().get("additionalDetails")).getValue());
        verify(paymentDetail).getAdditionalDetails();
        verify(paymentDetail).getId();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentDetailUpdate10() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addArray();
        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getAdditionalDetails()).thenReturn(arrayNode);
        when(paymentDetail.getId()).thenReturn("42");
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentDetailUpdate = PaymentQueryBuilder
                .getParametersForPaymentDetailUpdate(paymentDetail);
        assertEquals(4, actualParametersForPaymentDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentDetailUpdate.getValues().get("additionalDetails")).getType());
        assertEquals("[[]]",
                ((PGobject) actualParametersForPaymentDetailUpdate.getValues().get("additionalDetails")).getValue());
        verify(paymentDetail).getAdditionalDetails();
        verify(paymentDetail).getId();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentDetailUpdate11() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addObject();
        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getAdditionalDetails()).thenReturn(arrayNode);
        when(paymentDetail.getId()).thenReturn("42");
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentDetailUpdate = PaymentQueryBuilder
                .getParametersForPaymentDetailUpdate(paymentDetail);
        assertEquals(4, actualParametersForPaymentDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentDetailUpdate.getValues().get("additionalDetails")).getType());
        assertEquals("[{}]",
                ((PGobject) actualParametersForPaymentDetailUpdate.getValues().get("additionalDetails")).getValue());
        verify(paymentDetail).getAdditionalDetails();
        verify(paymentDetail).getId();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentDetailUpdate12() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addPOJO("Value");
        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getAdditionalDetails()).thenReturn(arrayNode);
        when(paymentDetail.getId()).thenReturn("42");
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentDetailUpdate = PaymentQueryBuilder
                .getParametersForPaymentDetailUpdate(paymentDetail);
        assertEquals(4, actualParametersForPaymentDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentDetailUpdate.getValues().get("additionalDetails")).getType());
        assertEquals("[\"Value\"]",
                ((PGobject) actualParametersForPaymentDetailUpdate.getValues().get("additionalDetails")).getValue());
        verify(paymentDetail).getAdditionalDetails();
        verify(paymentDetail).getId();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentDetailUpdate13() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addNull();
        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getAdditionalDetails()).thenReturn(arrayNode);
        when(paymentDetail.getId()).thenReturn("42");
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentDetailUpdate = PaymentQueryBuilder
                .getParametersForPaymentDetailUpdate(paymentDetail);
        assertEquals(4, actualParametersForPaymentDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentDetailUpdate.getValues().get("additionalDetails")).getType());
        assertEquals("[null]",
                ((PGobject) actualParametersForPaymentDetailUpdate.getValues().get("additionalDetails")).getValue());
        verify(paymentDetail).getAdditionalDetails();
        verify(paymentDetail).getId();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForPaymentDetailUpdate14() throws UnsupportedEncodingException {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.add("AAAAAAAA".getBytes("UTF-8"));
        PaymentDetail paymentDetail = mock(PaymentDetail.class);
        when(paymentDetail.getAdditionalDetails()).thenReturn(arrayNode);
        when(paymentDetail.getId()).thenReturn("42");
        when(paymentDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParametersForPaymentDetailUpdate = PaymentQueryBuilder
                .getParametersForPaymentDetailUpdate(paymentDetail);
        assertEquals(4, actualParametersForPaymentDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForPaymentDetailUpdate.getValues().get("additionalDetails")).getType());
        assertEquals("[\"QUFBQUFBQUE=\"]",
                ((PGobject) actualParametersForPaymentDetailUpdate.getValues().get("additionalDetails")).getValue());
        verify(paymentDetail).getAdditionalDetails();
        verify(paymentDetail).getId();
        verify(paymentDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParamtersForBillUpdate2() {
        Bill bill = new Bill();
        bill.setAuditDetails(new AuditDetails());
        assertEquals(6, PaymentQueryBuilder.getParamtersForBillUpdate(bill).getParameterNames().length);
    }

    @Test
    void testGetParamtersForBillUpdate3() {
        MissingNode additionalDetails = MissingNode.getInstance();
        ArrayList<BillDetail> billDetails = new ArrayList<>();
        AuditDetails auditDetails = new AuditDetails();
        ArrayList<String> collectionModesNotAllowed = new ArrayList<>();
        BigDecimal minimumAmountToBePaid = BigDecimal.valueOf(42L);
        BigDecimal totalAmount = BigDecimal.valueOf(42L);
        MapSqlParameterSource actualParamtersForBillUpdate = PaymentQueryBuilder.getParamtersForBillUpdate(
                new Bill("42", "42", "id", "id", "42 Main St", "jane.doe@example.org", "42", Bill.StatusEnum.ACTIVE,
                        "Just cause", true, additionalDetails, billDetails, "42", auditDetails, collectionModesNotAllowed, true,
                        true, minimumAmountToBePaid, "id", totalAmount, "id", "42", 1L, BigDecimal.valueOf(42L)));
        assertEquals(6, actualParamtersForBillUpdate.getParameterNames().length);
        assertEquals("jsonb", ((PGobject) actualParamtersForBillUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("", ((PGobject) actualParamtersForBillUpdate.getValues().get("additionaldetails")).getValue());
    }

    @Test
    void testGetParamtersForBillUpdate5() {
        Bill bill = mock(Bill.class);
        when(bill.getAdditionalDetails()).thenReturn(MissingNode.getInstance());
        when(bill.getId()).thenReturn("42");
        when(bill.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParamtersForBillUpdate = PaymentQueryBuilder.getParamtersForBillUpdate(bill);
        assertEquals(6, actualParamtersForBillUpdate.getParameterNames().length);
        assertEquals("jsonb", ((PGobject) actualParamtersForBillUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("", ((PGobject) actualParamtersForBillUpdate.getValues().get("additionaldetails")).getValue());
        verify(bill).getAdditionalDetails();
        verify(bill).getId();
        verify(bill, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParamtersForBillUpdate6() {
        Bill bill = mock(Bill.class);
        when(bill.getAdditionalDetails()).thenReturn(new ArrayNode(JsonNodeFactory.withExactBigDecimals(true)));
        when(bill.getId()).thenReturn("42");
        when(bill.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParamtersForBillUpdate = PaymentQueryBuilder.getParamtersForBillUpdate(bill);
        assertEquals(6, actualParamtersForBillUpdate.getParameterNames().length);
        assertEquals("jsonb", ((PGobject) actualParamtersForBillUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("[]", ((PGobject) actualParamtersForBillUpdate.getValues().get("additionaldetails")).getValue());
        verify(bill).getAdditionalDetails();
        verify(bill).getId();
        verify(bill, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParamtersForBillUpdate7() {
        Bill bill = mock(Bill.class);
        when(bill.getAdditionalDetails()).thenReturn(new BigIntegerNode(BigInteger.valueOf(42L)));
        when(bill.getId()).thenReturn("42");
        when(bill.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParamtersForBillUpdate = PaymentQueryBuilder.getParamtersForBillUpdate(bill);
        assertEquals(6, actualParamtersForBillUpdate.getParameterNames().length);
        assertEquals("jsonb", ((PGobject) actualParamtersForBillUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("42", ((PGobject) actualParamtersForBillUpdate.getValues().get("additionaldetails")).getValue());
        verify(bill).getAdditionalDetails();
        verify(bill).getId();
        verify(bill, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParamtersForBillUpdate8() throws UnsupportedEncodingException {
        Bill bill = mock(Bill.class);
        when(bill.getAdditionalDetails()).thenReturn(new BinaryNode("AAAAAAAA".getBytes("UTF-8")));
        when(bill.getId()).thenReturn("42");
        when(bill.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParamtersForBillUpdate = PaymentQueryBuilder.getParamtersForBillUpdate(bill);
        assertEquals(6, actualParamtersForBillUpdate.getParameterNames().length);
        assertEquals("jsonb", ((PGobject) actualParamtersForBillUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("\"QUFBQUFBQUE=\"",
                ((PGobject) actualParamtersForBillUpdate.getValues().get("additionaldetails")).getValue());
        verify(bill).getAdditionalDetails();
        verify(bill).getId();
        verify(bill, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParamtersForBillUpdate9() {
        Bill bill = mock(Bill.class);
        when(bill.getAdditionalDetails()).thenReturn(NullNode.getInstance());
        when(bill.getId()).thenReturn("42");
        when(bill.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParamtersForBillUpdate = PaymentQueryBuilder.getParamtersForBillUpdate(bill);
        assertEquals(6, actualParamtersForBillUpdate.getParameterNames().length);
        assertEquals("jsonb", ((PGobject) actualParamtersForBillUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("null", ((PGobject) actualParamtersForBillUpdate.getValues().get("additionaldetails")).getValue());
        verify(bill).getAdditionalDetails();
        verify(bill).getId();
        verify(bill, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParamtersForBillUpdate10() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addArray();
        Bill bill = mock(Bill.class);
        when(bill.getAdditionalDetails()).thenReturn(arrayNode);
        when(bill.getId()).thenReturn("42");
        when(bill.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParamtersForBillUpdate = PaymentQueryBuilder.getParamtersForBillUpdate(bill);
        assertEquals(6, actualParamtersForBillUpdate.getParameterNames().length);
        assertEquals("jsonb", ((PGobject) actualParamtersForBillUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("[[]]", ((PGobject) actualParamtersForBillUpdate.getValues().get("additionaldetails")).getValue());
        verify(bill).getAdditionalDetails();
        verify(bill).getId();
        verify(bill, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParamtersForBillUpdate11() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addObject();
        Bill bill = mock(Bill.class);
        when(bill.getAdditionalDetails()).thenReturn(arrayNode);
        when(bill.getId()).thenReturn("42");
        when(bill.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParamtersForBillUpdate = PaymentQueryBuilder.getParamtersForBillUpdate(bill);
        assertEquals(6, actualParamtersForBillUpdate.getParameterNames().length);
        assertEquals("jsonb", ((PGobject) actualParamtersForBillUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("[{}]", ((PGobject) actualParamtersForBillUpdate.getValues().get("additionaldetails")).getValue());
        verify(bill).getAdditionalDetails();
        verify(bill).getId();
        verify(bill, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParamtersForBillUpdate12() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addPOJO("Value");
        Bill bill = mock(Bill.class);
        when(bill.getAdditionalDetails()).thenReturn(arrayNode);
        when(bill.getId()).thenReturn("42");
        when(bill.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParamtersForBillUpdate = PaymentQueryBuilder.getParamtersForBillUpdate(bill);
        assertEquals(6, actualParamtersForBillUpdate.getParameterNames().length);
        assertEquals("jsonb", ((PGobject) actualParamtersForBillUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("[\"Value\"]",
                ((PGobject) actualParamtersForBillUpdate.getValues().get("additionaldetails")).getValue());
        verify(bill).getAdditionalDetails();
        verify(bill).getId();
        verify(bill, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParamtersForBillUpdate13() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addNull();
        Bill bill = mock(Bill.class);
        when(bill.getAdditionalDetails()).thenReturn(arrayNode);
        when(bill.getId()).thenReturn("42");
        when(bill.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParamtersForBillUpdate = PaymentQueryBuilder.getParamtersForBillUpdate(bill);
        assertEquals(6, actualParamtersForBillUpdate.getParameterNames().length);
        assertEquals("jsonb", ((PGobject) actualParamtersForBillUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("[null]", ((PGobject) actualParamtersForBillUpdate.getValues().get("additionaldetails")).getValue());
        verify(bill).getAdditionalDetails();
        verify(bill).getId();
        verify(bill, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParamtersForBillUpdate14() throws UnsupportedEncodingException {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.add("AAAAAAAA".getBytes("UTF-8"));
        Bill bill = mock(Bill.class);
        when(bill.getAdditionalDetails()).thenReturn(arrayNode);
        when(bill.getId()).thenReturn("42");
        when(bill.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParamtersForBillUpdate = PaymentQueryBuilder.getParamtersForBillUpdate(bill);
        assertEquals(6, actualParamtersForBillUpdate.getParameterNames().length);
        assertEquals("jsonb", ((PGobject) actualParamtersForBillUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("[\"QUFBQUFBQUE=\"]",
                ((PGobject) actualParamtersForBillUpdate.getValues().get("additionaldetails")).getValue());
        verify(bill).getAdditionalDetails();
        verify(bill).getId();
        verify(bill, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParamtersForBillDetailUpdate2() {
        BillDetail billDetail = new BillDetail();
        billDetail.setAuditDetails(new AuditDetails());
        assertEquals(11, PaymentQueryBuilder.getParamtersForBillDetailUpdate(billDetail).getParameterNames().length);
    }

    @Test
    void testGetParamtersForBillDetailUpdate3() {
        BigDecimal amount = BigDecimal.valueOf(42L);
        BigDecimal amountPaid = BigDecimal.valueOf(42L);
        MissingNode additionalDetails = MissingNode.getInstance();
        ArrayList<BillAccountDetail> billAccountDetails = new ArrayList<>();
        MapSqlParameterSource actualParamtersForBillDetailUpdate = PaymentQueryBuilder.getParamtersForBillDetailUpdate(
                new BillDetail("42", "42", "42", "42", amount, amountPaid, 1L, 1L, additionalDetails, "id", "id", "id", "42",
                        1L, billAccountDetails, CollectionType.COUNTER, new AuditDetails(), "id", 1L, "id", true, "id"));
        assertEquals(11, actualParamtersForBillDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParamtersForBillDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("", ((PGobject) actualParamtersForBillDetailUpdate.getValues().get("additionaldetails")).getValue());
    }

    @Test
    void testGetParamtersForBillDetailUpdate5() {
        BillDetail billDetail = mock(BillDetail.class);
        when(billDetail.getAdditionalDetails()).thenReturn(MissingNode.getInstance());
        when(billDetail.getManualReceiptDate()).thenReturn(1L);
        when(billDetail.getBillDescription()).thenReturn("Bill Description");
        when(billDetail.getDisplayMessage()).thenReturn("Display Message");
        when(billDetail.getId()).thenReturn("42");
        when(billDetail.getManualReceiptNumber()).thenReturn("42");
        when(billDetail.getVoucherHeader()).thenReturn("Voucher Header");
        when(billDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParamtersForBillDetailUpdate = PaymentQueryBuilder
                .getParamtersForBillDetailUpdate(billDetail);
        assertEquals(11, actualParamtersForBillDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParamtersForBillDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("", ((PGobject) actualParamtersForBillDetailUpdate.getValues().get("additionaldetails")).getValue());
        verify(billDetail).getAdditionalDetails();
        verify(billDetail).getManualReceiptDate();
        verify(billDetail).getBillDescription();
        verify(billDetail).getDisplayMessage();
        verify(billDetail).getId();
        verify(billDetail).getManualReceiptNumber();
        verify(billDetail).getVoucherHeader();
        verify(billDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParamtersForBillDetailUpdate6() {
        BillDetail billDetail = mock(BillDetail.class);
        when(billDetail.getAdditionalDetails()).thenReturn(new ArrayNode(JsonNodeFactory.withExactBigDecimals(true)));
        when(billDetail.getManualReceiptDate()).thenReturn(1L);
        when(billDetail.getBillDescription()).thenReturn("Bill Description");
        when(billDetail.getDisplayMessage()).thenReturn("Display Message");
        when(billDetail.getId()).thenReturn("42");
        when(billDetail.getManualReceiptNumber()).thenReturn("42");
        when(billDetail.getVoucherHeader()).thenReturn("Voucher Header");
        when(billDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParamtersForBillDetailUpdate = PaymentQueryBuilder
                .getParamtersForBillDetailUpdate(billDetail);
        assertEquals(11, actualParamtersForBillDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParamtersForBillDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("[]", ((PGobject) actualParamtersForBillDetailUpdate.getValues().get("additionaldetails")).getValue());
        verify(billDetail).getAdditionalDetails();
        verify(billDetail).getManualReceiptDate();
        verify(billDetail).getBillDescription();
        verify(billDetail).getDisplayMessage();
        verify(billDetail).getId();
        verify(billDetail).getManualReceiptNumber();
        verify(billDetail).getVoucherHeader();
        verify(billDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParamtersForBillDetailUpdate7() {
        BillDetail billDetail = mock(BillDetail.class);
        when(billDetail.getAdditionalDetails()).thenReturn(new BigIntegerNode(BigInteger.valueOf(42L)));
        when(billDetail.getManualReceiptDate()).thenReturn(1L);
        when(billDetail.getBillDescription()).thenReturn("Bill Description");
        when(billDetail.getDisplayMessage()).thenReturn("Display Message");
        when(billDetail.getId()).thenReturn("42");
        when(billDetail.getManualReceiptNumber()).thenReturn("42");
        when(billDetail.getVoucherHeader()).thenReturn("Voucher Header");
        when(billDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParamtersForBillDetailUpdate = PaymentQueryBuilder
                .getParamtersForBillDetailUpdate(billDetail);
        assertEquals(11, actualParamtersForBillDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParamtersForBillDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("42", ((PGobject) actualParamtersForBillDetailUpdate.getValues().get("additionaldetails")).getValue());
        verify(billDetail).getAdditionalDetails();
        verify(billDetail).getManualReceiptDate();
        verify(billDetail).getBillDescription();
        verify(billDetail).getDisplayMessage();
        verify(billDetail).getId();
        verify(billDetail).getManualReceiptNumber();
        verify(billDetail).getVoucherHeader();
        verify(billDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParamtersForBillDetailUpdate8() throws UnsupportedEncodingException {
        BillDetail billDetail = mock(BillDetail.class);
        when(billDetail.getAdditionalDetails()).thenReturn(new BinaryNode("AAAAAAAA".getBytes("UTF-8")));
        when(billDetail.getManualReceiptDate()).thenReturn(1L);
        when(billDetail.getBillDescription()).thenReturn("Bill Description");
        when(billDetail.getDisplayMessage()).thenReturn("Display Message");
        when(billDetail.getId()).thenReturn("42");
        when(billDetail.getManualReceiptNumber()).thenReturn("42");
        when(billDetail.getVoucherHeader()).thenReturn("Voucher Header");
        when(billDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParamtersForBillDetailUpdate = PaymentQueryBuilder
                .getParamtersForBillDetailUpdate(billDetail);
        assertEquals(11, actualParamtersForBillDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParamtersForBillDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("\"QUFBQUFBQUE=\"",
                ((PGobject) actualParamtersForBillDetailUpdate.getValues().get("additionaldetails")).getValue());
        verify(billDetail).getAdditionalDetails();
        verify(billDetail).getManualReceiptDate();
        verify(billDetail).getBillDescription();
        verify(billDetail).getDisplayMessage();
        verify(billDetail).getId();
        verify(billDetail).getManualReceiptNumber();
        verify(billDetail).getVoucherHeader();
        verify(billDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParamtersForBillDetailUpdate9() {
        BillDetail billDetail = mock(BillDetail.class);
        when(billDetail.getAdditionalDetails()).thenReturn(NullNode.getInstance());
        when(billDetail.getManualReceiptDate()).thenReturn(1L);
        when(billDetail.getBillDescription()).thenReturn("Bill Description");
        when(billDetail.getDisplayMessage()).thenReturn("Display Message");
        when(billDetail.getId()).thenReturn("42");
        when(billDetail.getManualReceiptNumber()).thenReturn("42");
        when(billDetail.getVoucherHeader()).thenReturn("Voucher Header");
        when(billDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParamtersForBillDetailUpdate = PaymentQueryBuilder
                .getParamtersForBillDetailUpdate(billDetail);
        assertEquals(11, actualParamtersForBillDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParamtersForBillDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("null",
                ((PGobject) actualParamtersForBillDetailUpdate.getValues().get("additionaldetails")).getValue());
        verify(billDetail).getAdditionalDetails();
        verify(billDetail).getManualReceiptDate();
        verify(billDetail).getBillDescription();
        verify(billDetail).getDisplayMessage();
        verify(billDetail).getId();
        verify(billDetail).getManualReceiptNumber();
        verify(billDetail).getVoucherHeader();
        verify(billDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParamtersForBillDetailUpdate10() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addArray();
        BillDetail billDetail = mock(BillDetail.class);
        when(billDetail.getAdditionalDetails()).thenReturn(arrayNode);
        when(billDetail.getManualReceiptDate()).thenReturn(1L);
        when(billDetail.getBillDescription()).thenReturn("Bill Description");
        when(billDetail.getDisplayMessage()).thenReturn("Display Message");
        when(billDetail.getId()).thenReturn("42");
        when(billDetail.getManualReceiptNumber()).thenReturn("42");
        when(billDetail.getVoucherHeader()).thenReturn("Voucher Header");
        when(billDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParamtersForBillDetailUpdate = PaymentQueryBuilder
                .getParamtersForBillDetailUpdate(billDetail);
        assertEquals(11, actualParamtersForBillDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParamtersForBillDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("[[]]",
                ((PGobject) actualParamtersForBillDetailUpdate.getValues().get("additionaldetails")).getValue());
        verify(billDetail).getAdditionalDetails();
        verify(billDetail).getManualReceiptDate();
        verify(billDetail).getBillDescription();
        verify(billDetail).getDisplayMessage();
        verify(billDetail).getId();
        verify(billDetail).getManualReceiptNumber();
        verify(billDetail).getVoucherHeader();
        verify(billDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParamtersForBillDetailUpdate11() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addObject();
        BillDetail billDetail = mock(BillDetail.class);
        when(billDetail.getAdditionalDetails()).thenReturn(arrayNode);
        when(billDetail.getManualReceiptDate()).thenReturn(1L);
        when(billDetail.getBillDescription()).thenReturn("Bill Description");
        when(billDetail.getDisplayMessage()).thenReturn("Display Message");
        when(billDetail.getId()).thenReturn("42");
        when(billDetail.getManualReceiptNumber()).thenReturn("42");
        when(billDetail.getVoucherHeader()).thenReturn("Voucher Header");
        when(billDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParamtersForBillDetailUpdate = PaymentQueryBuilder
                .getParamtersForBillDetailUpdate(billDetail);
        assertEquals(11, actualParamtersForBillDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParamtersForBillDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("[{}]",
                ((PGobject) actualParamtersForBillDetailUpdate.getValues().get("additionaldetails")).getValue());
        verify(billDetail).getAdditionalDetails();
        verify(billDetail).getManualReceiptDate();
        verify(billDetail).getBillDescription();
        verify(billDetail).getDisplayMessage();
        verify(billDetail).getId();
        verify(billDetail).getManualReceiptNumber();
        verify(billDetail).getVoucherHeader();
        verify(billDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParamtersForBillDetailUpdate12() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addPOJO("Value");
        BillDetail billDetail = mock(BillDetail.class);
        when(billDetail.getAdditionalDetails()).thenReturn(arrayNode);
        when(billDetail.getManualReceiptDate()).thenReturn(1L);
        when(billDetail.getBillDescription()).thenReturn("Bill Description");
        when(billDetail.getDisplayMessage()).thenReturn("Display Message");
        when(billDetail.getId()).thenReturn("42");
        when(billDetail.getManualReceiptNumber()).thenReturn("42");
        when(billDetail.getVoucherHeader()).thenReturn("Voucher Header");
        when(billDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParamtersForBillDetailUpdate = PaymentQueryBuilder
                .getParamtersForBillDetailUpdate(billDetail);
        assertEquals(11, actualParamtersForBillDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParamtersForBillDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("[\"Value\"]",
                ((PGobject) actualParamtersForBillDetailUpdate.getValues().get("additionaldetails")).getValue());
        verify(billDetail).getAdditionalDetails();
        verify(billDetail).getManualReceiptDate();
        verify(billDetail).getBillDescription();
        verify(billDetail).getDisplayMessage();
        verify(billDetail).getId();
        verify(billDetail).getManualReceiptNumber();
        verify(billDetail).getVoucherHeader();
        verify(billDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParamtersForBillDetailUpdate13() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addNull();
        BillDetail billDetail = mock(BillDetail.class);
        when(billDetail.getAdditionalDetails()).thenReturn(arrayNode);
        when(billDetail.getManualReceiptDate()).thenReturn(1L);
        when(billDetail.getBillDescription()).thenReturn("Bill Description");
        when(billDetail.getDisplayMessage()).thenReturn("Display Message");
        when(billDetail.getId()).thenReturn("42");
        when(billDetail.getManualReceiptNumber()).thenReturn("42");
        when(billDetail.getVoucherHeader()).thenReturn("Voucher Header");
        when(billDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParamtersForBillDetailUpdate = PaymentQueryBuilder
                .getParamtersForBillDetailUpdate(billDetail);
        assertEquals(11, actualParamtersForBillDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParamtersForBillDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("[null]",
                ((PGobject) actualParamtersForBillDetailUpdate.getValues().get("additionaldetails")).getValue());
        verify(billDetail).getAdditionalDetails();
        verify(billDetail).getManualReceiptDate();
        verify(billDetail).getBillDescription();
        verify(billDetail).getDisplayMessage();
        verify(billDetail).getId();
        verify(billDetail).getManualReceiptNumber();
        verify(billDetail).getVoucherHeader();
        verify(billDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParamtersForBillDetailUpdate14() throws UnsupportedEncodingException {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.add("AAAAAAAA".getBytes("UTF-8"));
        BillDetail billDetail = mock(BillDetail.class);
        when(billDetail.getAdditionalDetails()).thenReturn(arrayNode);
        when(billDetail.getManualReceiptDate()).thenReturn(1L);
        when(billDetail.getBillDescription()).thenReturn("Bill Description");
        when(billDetail.getDisplayMessage()).thenReturn("Display Message");
        when(billDetail.getId()).thenReturn("42");
        when(billDetail.getManualReceiptNumber()).thenReturn("42");
        when(billDetail.getVoucherHeader()).thenReturn("Voucher Header");
        when(billDetail.getAuditDetails()).thenReturn(new AuditDetails());
        MapSqlParameterSource actualParamtersForBillDetailUpdate = PaymentQueryBuilder
                .getParamtersForBillDetailUpdate(billDetail);
        assertEquals(11, actualParamtersForBillDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParamtersForBillDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("[\"QUFBQUFBQUE=\"]",
                ((PGobject) actualParamtersForBillDetailUpdate.getValues().get("additionaldetails")).getValue());
        verify(billDetail).getAdditionalDetails();
        verify(billDetail).getManualReceiptDate();
        verify(billDetail).getBillDescription();
        verify(billDetail).getDisplayMessage();
        verify(billDetail).getId();
        verify(billDetail).getManualReceiptNumber();
        verify(billDetail).getVoucherHeader();
        verify(billDetail, atLeast(1)).getAuditDetails();
    }

    @Test
    void testGetParametersForBankDetailUpdate() {
        MapSqlParameterSource actualParametersForBankDetailUpdate = PaymentQueryBuilder
                .getParametersForBankDetailUpdate(MissingNode.getInstance(), "Ifsccode");
        assertEquals(2, actualParametersForBankDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForBankDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("", ((PGobject) actualParametersForBankDetailUpdate.getValues().get("additionaldetails")).getValue());
    }

    @Test
    void testGetParametersForBankDetailUpdate2() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        MapSqlParameterSource actualParametersForBankDetailUpdate = PaymentQueryBuilder
                .getParametersForBankDetailUpdate(arrayNode, "Ifsccode");
        assertEquals(2, actualParametersForBankDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForBankDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("[]",
                ((PGobject) actualParametersForBankDetailUpdate.getValues().get("additionaldetails")).getValue());
        assertEquals("[ ]", arrayNode.toPrettyString());
    }

    @Test
    void testGetParametersForBankDetailUpdate3() {
        assertEquals(2, PaymentQueryBuilder.getParametersForBankDetailUpdate(null, "Ifsccode").getParameterNames().length);
    }

    @Test
    void testGetParametersForBankDetailUpdate4() {
        BigIntegerNode bigIntegerNode = new BigIntegerNode(BigInteger.valueOf(42L));
        MapSqlParameterSource actualParametersForBankDetailUpdate = PaymentQueryBuilder
                .getParametersForBankDetailUpdate(bigIntegerNode, "Ifsccode");
        assertEquals(2, actualParametersForBankDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForBankDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("42",
                ((PGobject) actualParametersForBankDetailUpdate.getValues().get("additionaldetails")).getValue());
        assertEquals("42", bigIntegerNode.toPrettyString());
    }

    @Test
    void testGetParametersForBankDetailUpdate5() throws UnsupportedEncodingException {
        BinaryNode binaryNode = new BinaryNode("AAAAAAAA".getBytes("UTF-8"));
        MapSqlParameterSource actualParametersForBankDetailUpdate = PaymentQueryBuilder
                .getParametersForBankDetailUpdate(binaryNode, "Ifsccode");
        assertEquals(2, actualParametersForBankDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForBankDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("\"QUFBQUFBQUE=\"",
                ((PGobject) actualParametersForBankDetailUpdate.getValues().get("additionaldetails")).getValue());
        assertEquals("\"QUFBQUFBQUE=\"", binaryNode.toPrettyString());
    }

    @Test
    void testGetParametersForBankDetailUpdate6() {
        NullNode instance = NullNode.getInstance();
        MapSqlParameterSource actualParametersForBankDetailUpdate = PaymentQueryBuilder
                .getParametersForBankDetailUpdate(instance, "Ifsccode");
        assertEquals(2, actualParametersForBankDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForBankDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("null",
                ((PGobject) actualParametersForBankDetailUpdate.getValues().get("additionaldetails")).getValue());
        assertEquals("null", instance.toPrettyString());
    }

    @Test
    void testGetParametersForBankDetailUpdate7() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addArray();
        MapSqlParameterSource actualParametersForBankDetailUpdate = PaymentQueryBuilder
                .getParametersForBankDetailUpdate(arrayNode, "Ifsccode");
        assertEquals(2, actualParametersForBankDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForBankDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("[[]]",
                ((PGobject) actualParametersForBankDetailUpdate.getValues().get("additionaldetails")).getValue());
        assertEquals("[ [ ] ]", arrayNode.toPrettyString());
    }

    @Test
    void testGetParametersForBankDetailUpdate8() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addObject();
        MapSqlParameterSource actualParametersForBankDetailUpdate = PaymentQueryBuilder
                .getParametersForBankDetailUpdate(arrayNode, "Ifsccode");
        assertEquals(2, actualParametersForBankDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForBankDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("[{}]",
                ((PGobject) actualParametersForBankDetailUpdate.getValues().get("additionaldetails")).getValue());
        assertEquals("[ { } ]", arrayNode.toPrettyString());
    }

    @Test
    void testGetParametersForBankDetailUpdate9() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addPOJO("Value");
        MapSqlParameterSource actualParametersForBankDetailUpdate = PaymentQueryBuilder
                .getParametersForBankDetailUpdate(arrayNode, "Ifsccode");
        assertEquals(2, actualParametersForBankDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForBankDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("[\"Value\"]",
                ((PGobject) actualParametersForBankDetailUpdate.getValues().get("additionaldetails")).getValue());
        assertEquals("[ \"Value\" ]", arrayNode.toPrettyString());
    }

    @Test
    void testGetParametersForBankDetailUpdate10() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addNull();
        MapSqlParameterSource actualParametersForBankDetailUpdate = PaymentQueryBuilder
                .getParametersForBankDetailUpdate(arrayNode, "Ifsccode");
        assertEquals(2, actualParametersForBankDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForBankDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("[null]",
                ((PGobject) actualParametersForBankDetailUpdate.getValues().get("additionaldetails")).getValue());
        assertEquals("[ null ]", arrayNode.toPrettyString());
    }

    @Test
    void testGetParametersForBankDetailUpdate11() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        arrayNode.addPOJO(42);
        MapSqlParameterSource actualParametersForBankDetailUpdate = PaymentQueryBuilder
                .getParametersForBankDetailUpdate(arrayNode, "Ifsccode");
        assertEquals(2, actualParametersForBankDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersForBankDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("[42]",
                ((PGobject) actualParametersForBankDetailUpdate.getValues().get("additionaldetails")).getValue());
        assertEquals("[ 42 ]", arrayNode.toPrettyString());
    }

    @Test
    void testGetParametersEmptyDtlBankDetailUpdate() {
        MapSqlParameterSource actualParametersEmptyDtlBankDetailUpdate = PaymentQueryBuilder
                .getParametersEmptyDtlBankDetailUpdate(MissingNode.getInstance(), "Ifsccode");
        assertEquals(2, actualParametersEmptyDtlBankDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersEmptyDtlBankDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("{\"bankDetails\":null}",
                ((PGobject) actualParametersEmptyDtlBankDetailUpdate.getValues().get("additionaldetails")).getValue());
    }

    @Test
    void testGetParametersEmptyDtlBankDetailUpdate2() {
        ArrayNode arrayNode = new ArrayNode(JsonNodeFactory.withExactBigDecimals(true));
        MapSqlParameterSource actualParametersEmptyDtlBankDetailUpdate = PaymentQueryBuilder
                .getParametersEmptyDtlBankDetailUpdate(arrayNode, "Ifsccode");
        assertEquals(2, actualParametersEmptyDtlBankDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersEmptyDtlBankDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("{\"bankDetails\":[]}",
                ((PGobject) actualParametersEmptyDtlBankDetailUpdate.getValues().get("additionaldetails")).getValue());
        assertEquals("[ ]", arrayNode.toPrettyString());
    }

    @Test
    void testGetParametersEmptyDtlBankDetailUpdate3() {
        MapSqlParameterSource actualParametersEmptyDtlBankDetailUpdate = PaymentQueryBuilder
                .getParametersEmptyDtlBankDetailUpdate(null, "Ifsccode");
        assertEquals(2, actualParametersEmptyDtlBankDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersEmptyDtlBankDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("{\"bankDetails\":null}",
                ((PGobject) actualParametersEmptyDtlBankDetailUpdate.getValues().get("additionaldetails")).getValue());
    }

    @Test
    void testGetParametersEmptyDtlBankDetailUpdate4() {
        MapSqlParameterSource actualParametersEmptyDtlBankDetailUpdate = PaymentQueryBuilder
                .getParametersEmptyDtlBankDetailUpdate(null, "Ifsccode");
        assertEquals(2, actualParametersEmptyDtlBankDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersEmptyDtlBankDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("{\"bankDetails\":null}",
                ((PGobject) actualParametersEmptyDtlBankDetailUpdate.getValues().get("additionaldetails")).getValue());
    }

    @Test
    void testGetParametersEmptyDtlBankDetailUpdate5() throws UnsupportedEncodingException {
        BinaryNode binaryNode = new BinaryNode("AAAAAAAA".getBytes("UTF-8"));
        MapSqlParameterSource actualParametersEmptyDtlBankDetailUpdate = PaymentQueryBuilder
                .getParametersEmptyDtlBankDetailUpdate(binaryNode, "Ifsccode");
        assertEquals(2, actualParametersEmptyDtlBankDetailUpdate.getParameterNames().length);
        assertEquals("jsonb",
                ((PGobject) actualParametersEmptyDtlBankDetailUpdate.getValues().get("additionaldetails")).getType());
        assertEquals("{\"bankDetails\":\"QUFBQUFBQUE=\"}",
                ((PGobject) actualParametersEmptyDtlBankDetailUpdate.getValues().get("additionaldetails")).getValue());
        assertEquals("\"QUFBQUFBQUE=\"", binaryNode.toPrettyString());
    }

    @Test
    void testConstructor() {
        new PaymentQueryBuilder();
    }
}

