package org.egov.collection.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.MissingNode;
import com.fasterxml.jackson.databind.node.NullNode;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import org.egov.collection.model.AuditDetails;

import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentDetail;

import org.egov.collection.model.PaymentSearchCriteria;
import org.egov.collection.model.enums.InstrumentStatusEnum;
import org.egov.collection.model.enums.PaymentModeEnum;
import org.egov.collection.model.enums.PaymentStatusEnum;

import org.egov.collection.repository.querybuilder.PaymentQueryBuilder;
import org.egov.collection.repository.rowmapper.BillRowMapper;
import org.egov.collection.repository.rowmapper.PaymentRowMapper;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {PaymentRepository.class})
@ExtendWith(SpringExtension.class)
class PaymentRepositoryTest {
    @MockBean
    private BillRowMapper billRowMapper;

    @MockBean
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    @MockBean
    private PaymentQueryBuilder paymentQueryBuilder;

    @Autowired
    private PaymentRepository paymentRepository;

    @MockBean
    private PaymentRowMapper paymentRowMapper;

    @Test
    void testSavePayment() {
        assertThrows(CustomException.class, () -> this.paymentRepository.savePayment(new Payment()));
    }

    @Test
    void testSavePayment2() {
        Payment payment = new Payment();
        payment.addpaymentDetailsItem(new PaymentDetail());
        assertThrows(CustomException.class, () -> this.paymentRepository.savePayment(payment));
    }

    @Test
    void testSavePayment3() {
        Payment payment = new Payment();
        payment.setPaymentDetails(new ArrayList<>());
        assertThrows(CustomException.class, () -> this.paymentRepository.savePayment(payment));
    }

    @Test
    void testSavePayment4() throws DataAccessException {
        when(this.namedParameterJdbcTemplate.update((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource) any())).thenReturn(1);
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();
        this.paymentRepository
                .savePayment(new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CASH, 1L, "42",
                        InstrumentStatusEnum.APPROVED, "Failed to persist payment to database", auditDetails, additionalDetails,
                        new ArrayList<>(), "Failed to persist payment to database", "42", "Failed to persist payment to database",
                        "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42"));
        verify(this.namedParameterJdbcTemplate).update((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource) any());
        verify(this.namedParameterJdbcTemplate, atLeast(1)).batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any());
    }

    @Test
    void testSavePayment5() throws DataAccessException {
        when(this.namedParameterJdbcTemplate.update((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource) any())).thenReturn(1);
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        MissingNode additionalDetails = MissingNode.getInstance();
        assertThrows(CustomException.class,
                () -> this.paymentRepository.savePayment(new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L,
                        PaymentModeEnum.CASH, 1L, "42", InstrumentStatusEnum.APPROVED, "Failed to persist payment to database",
                        null, additionalDetails, new ArrayList<>(), "Failed to persist payment to database", "42",
                        "Failed to persist payment to database", "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW,
                        "42")));
    }

    @Test
    void testSavePayment6() throws DataAccessException {
        when(this.namedParameterJdbcTemplate.update((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource) any())).thenReturn(1);
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        NullNode additionalDetails = NullNode.getInstance();
        Payment payment = new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CASH, 1L, "42",
                InstrumentStatusEnum.APPROVED, "Failed to persist payment to database", auditDetails, additionalDetails,
                new ArrayList<>(), "Failed to persist payment to database", "42", "Failed to persist payment to database",
                "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42");

        this.paymentRepository.savePayment(payment);
        verify(this.namedParameterJdbcTemplate).update((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource) any());
        verify(this.namedParameterJdbcTemplate, atLeast(1)).batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any());
        assertEquals("null", payment.getAdditionalDetails().toPrettyString());
    }

    @Test
    void testSavePayment7() throws DataAccessException {
        when(this.namedParameterJdbcTemplate.update((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource) any())).thenReturn(1);
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});
        assertThrows(CustomException.class, () -> this.paymentRepository.savePayment(null));
    }

    @Test
    void testFetchPayments() throws DataAccessException {
        when(this.paymentQueryBuilder.getIdQuery((PaymentSearchCriteria) any(), (java.util.Map<String, Object>) any()))
                .thenReturn("Id Query");
        when(this.namedParameterJdbcTemplate.query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any())).thenReturn(new ArrayList<>());
        assertTrue(this.paymentRepository.fetchPayments(new PaymentSearchCriteria()).isEmpty());
        verify(this.paymentQueryBuilder).getIdQuery((PaymentSearchCriteria) any(), (java.util.Map<String, Object>) any());
        verify(this.namedParameterJdbcTemplate).query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any());
    }

    @Test
    void testFetchPayments2() throws DataAccessException {
        when(this.paymentQueryBuilder.getIdQuery((PaymentSearchCriteria) any(), (java.util.Map<String, Object>) any()))
                .thenReturn("Id Query");
        when(this.namedParameterJdbcTemplate.query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any()))
                .thenThrow(new CustomException("Code", "An error occurred"));
        assertThrows(CustomException.class, () -> this.paymentRepository.fetchPayments(new PaymentSearchCriteria()));
        verify(this.paymentQueryBuilder).getIdQuery((PaymentSearchCriteria) any(), (java.util.Map<String, Object>) any());
        verify(this.namedParameterJdbcTemplate).query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any());
    }

    @Test
    void testFetchPayments3() throws DataAccessException {
        when(this.paymentQueryBuilder.getPaymentSearchQuery((List<String>) any(), (java.util.Map<String, Object>) any()))
                .thenReturn("Payment Search Query");
        when(this.paymentQueryBuilder.getIdQuery((PaymentSearchCriteria) any(), (java.util.Map<String, Object>) any()))
                .thenReturn("Id Query");

        ArrayList<Object> objectList = new ArrayList<>();
        objectList.add("42");
        when(this.namedParameterJdbcTemplate.query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any()))
                .thenThrow(new CustomException("Query: ", "An error occurred"));
        when(this.namedParameterJdbcTemplate.query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any())).thenReturn(objectList);
        assertThrows(CustomException.class, () -> this.paymentRepository.fetchPayments(new PaymentSearchCriteria()));
        verify(this.paymentQueryBuilder).getIdQuery((PaymentSearchCriteria) any(), (java.util.Map<String, Object>) any());
        verify(this.paymentQueryBuilder).getPaymentSearchQuery((List<String>) any(), (java.util.Map<String, Object>) any());
        verify(this.namedParameterJdbcTemplate).query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any());
        verify(this.namedParameterJdbcTemplate).query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any());
    }

    @Test
    void testFetchPayments4() throws DataAccessException {
        when(this.paymentQueryBuilder.getPaymentSearchQuery((List<String>) any(), (java.util.Map<String, Object>) any()))
                .thenReturn("Payment Search Query");
        when(this.paymentQueryBuilder.getIdQuery((PaymentSearchCriteria) any(), (java.util.Map<String, Object>) any()))
                .thenReturn("Id Query");

        ArrayList<Object> objectList = new ArrayList<>();
        objectList.add("42");
        ArrayList<Object> objectList1 = new ArrayList<>();
        when(this.namedParameterJdbcTemplate.query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any())).thenReturn(objectList1);
        when(this.namedParameterJdbcTemplate.query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any())).thenReturn(objectList);
        List<Payment> actualFetchPaymentsResult = this.paymentRepository.fetchPayments(new PaymentSearchCriteria());
        assertSame(objectList1, actualFetchPaymentsResult);
        assertTrue(actualFetchPaymentsResult.isEmpty());
        verify(this.paymentQueryBuilder).getIdQuery((PaymentSearchCriteria) any(), (java.util.Map<String, Object>) any());
        verify(this.paymentQueryBuilder).getPaymentSearchQuery((List<String>) any(), (java.util.Map<String, Object>) any());
        verify(this.namedParameterJdbcTemplate).query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any());
        verify(this.namedParameterJdbcTemplate).query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any());
    }

    @Test
    void testGetPaymentsCount() throws DataAccessException {
        when(this.paymentQueryBuilder.getPaymentCountQuery((String) any(), (String) any(),
                (java.util.Map<String, Object>) any())).thenReturn("3");
        when(this.namedParameterJdbcTemplate.queryForObject((String) any(), (java.util.Map<String, ?>) any(),
                (Class<Object>) any())).thenThrow(new CustomException("Code", "An error occurred"));
        assertThrows(CustomException.class, () -> this.paymentRepository.getPaymentsCount("42", "Business Service"));
        verify(this.paymentQueryBuilder).getPaymentCountQuery((String) any(), (String) any(),
                (java.util.Map<String, Object>) any());
        verify(this.namedParameterJdbcTemplate).queryForObject((String) any(), (java.util.Map<String, ?>) any(),
                (Class<Object>) any());
    }

    @Test
    void testGetPaymentsCount2() throws DataAccessException {
        when(this.paymentQueryBuilder.getPaymentCountQuery((String) any(), (String) any(),
                (java.util.Map<String, Object>) any())).thenReturn("3");
        when(this.namedParameterJdbcTemplate.queryForObject((String) any(), (java.util.Map<String, ?>) any(),
                (Class<Object>) any())).thenReturn(1L);
        assertEquals(1L, this.paymentRepository.getPaymentsCount("42", "Business Service").longValue());
        verify(this.paymentQueryBuilder).getPaymentCountQuery((String) any(), (String) any(),
                (java.util.Map<String, Object>) any());
        verify(this.namedParameterJdbcTemplate).queryForObject((String) any(), (java.util.Map<String, ?>) any(),
                (Class<Object>) any());
    }

    @Test
    void testFetchPaymentsForPlainSearch() throws DataAccessException {
        ArrayList<Object> objectList = new ArrayList<>();
        when(this.namedParameterJdbcTemplate.query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any())).thenReturn(objectList);
        List<Payment> actualFetchPaymentsForPlainSearchResult = this.paymentRepository
                .fetchPaymentsForPlainSearch(new PaymentSearchCriteria());
        assertSame(objectList, actualFetchPaymentsForPlainSearchResult);
        assertTrue(actualFetchPaymentsForPlainSearchResult.isEmpty());
        verify(this.namedParameterJdbcTemplate).query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any());
    }

    @Test
    void testFetchPaymentsForPlainSearch3() throws DataAccessException {
        ArrayList<Object> objectList = new ArrayList<>();
        when(this.namedParameterJdbcTemplate.query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any())).thenReturn(objectList);
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
        List<Payment> actualFetchPaymentsForPlainSearchResult = this.paymentRepository
                .fetchPaymentsForPlainSearch(paymentSearchCriteria);
        assertSame(objectList, actualFetchPaymentsForPlainSearchResult);
        assertTrue(actualFetchPaymentsForPlainSearchResult.isEmpty());
        verify(this.namedParameterJdbcTemplate).query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.ResultSetExtractor<Object>) any());
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
    }

    @Test
    void testUpdateStatus() {
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});
        this.paymentRepository.updateStatus(new ArrayList<>());
        verify(this.namedParameterJdbcTemplate, atLeast(1)).batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any());
    }

    @Test
    void testUpdateStatus2() {
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});

        ArrayList<Payment> paymentList = new ArrayList<>();
        paymentList.add(new Payment());
        assertThrows(CustomException.class, () -> this.paymentRepository.updateStatus(paymentList));
    }

    @Test
    void testUpdateStatus3() {
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any()))
                .thenThrow(new CustomException("INSERT INTO egcl_payment_audit SELECT * FROM egcl_payment WHERE id = :id;",
                        "An error occurred"));
        assertThrows(CustomException.class, () -> this.paymentRepository.updateStatus(new ArrayList<>()));
        verify(this.namedParameterJdbcTemplate).batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any());
    }

    @Test
    void testUpdateStatus4() {
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});

        Payment payment = new Payment();
        payment.setInstrumentStatus(InstrumentStatusEnum.APPROVED);

        ArrayList<Payment> paymentList = new ArrayList<>();
        paymentList.add(payment);
        assertThrows(CustomException.class, () -> this.paymentRepository.updateStatus(paymentList));
    }

    @Test
    void testUpdateStatus5() {
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});

        ArrayList<Payment> paymentList = new ArrayList<>();
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();
        paymentList.add(new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CASH, 1L, "42",
                InstrumentStatusEnum.APPROVED, "id", auditDetails, additionalDetails, new ArrayList<>(), "id", "42", "id",
                "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42"));
        this.paymentRepository.updateStatus(paymentList);
        verify(this.namedParameterJdbcTemplate, atLeast(1)).batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any());
    }

    @Test
    void testUpdateStatus6() {
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});

        ArrayList<Payment> paymentList = new ArrayList<>();
        paymentList.add(null);
        assertThrows(CustomException.class, () -> this.paymentRepository.updateStatus(paymentList));
    }

    @Test
    void testUpdateStatus7() {
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});

        ArrayList<Payment> paymentList = new ArrayList<>();
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        MissingNode additionalDetails = MissingNode.getInstance();
        paymentList.add(new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CASH, 1L, "42",
                InstrumentStatusEnum.APPROVED, "id", null, additionalDetails, new ArrayList<>(), "id", "42", "id", "42 Main St",
                "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42"));
        assertThrows(CustomException.class, () -> this.paymentRepository.updateStatus(paymentList));
    }

    @Test
    void testUpdateStatus8() {
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});

        ArrayList<PaymentDetail> paymentDetailList = new ArrayList<>();
        paymentDetailList.add(new PaymentDetail());
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        Payment e = new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CASH, 1L, "42",
                InstrumentStatusEnum.APPROVED, "id", auditDetails, MissingNode.getInstance(), paymentDetailList, "id", "42",
                "id", "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42");

        ArrayList<Payment> paymentList = new ArrayList<>();
        paymentList.add(e);
        assertThrows(CustomException.class, () -> this.paymentRepository.updateStatus(paymentList));
    }

    @Test
    void testUpdatePayment() {
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});
        this.paymentRepository.updatePayment(new ArrayList<>());
        verify(this.namedParameterJdbcTemplate, atLeast(1)).batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any());
    }

    @Test
    void testUpdatePayment2() {
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});

        ArrayList<Payment> paymentList = new ArrayList<>();
        paymentList.add(new Payment());
        assertThrows(CustomException.class, () -> this.paymentRepository.updatePayment(paymentList));
    }

    @Test
    void testUpdatePayment3() {
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenThrow(new CustomException(
                "UPDATE egcl_payment SET additionaldetails=:additionaldetails, paidby=:paidby, payername=:payername,"
                        + " payeraddress=:payeraddress, payeremail=:payeremail, payerid=:payerid,paymentstatus=:paymentstatus,"
                        + " createdby=:createdby, createdtime=:createdtime, lastmodifiedby=:lastmodifiedby, lastmodifiedtime="
                        + ":lastmodifiedtime WHERE id=:id ",
                "An error occurred"));
        assertThrows(CustomException.class, () -> this.paymentRepository.updatePayment(new ArrayList<>()));
        verify(this.namedParameterJdbcTemplate).batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any());
    }

    @Test
    void testUpdatePayment4() {
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});

        Payment payment = new Payment();
        payment.setAuditDetails(new AuditDetails());

        ArrayList<Payment> paymentList = new ArrayList<>();
        paymentList.add(payment);
        assertThrows(CustomException.class, () -> this.paymentRepository.updatePayment(paymentList));
    }

    @Test
    void testUpdatePayment5() {
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});

        ArrayList<Payment> paymentList = new ArrayList<>();
        BigDecimal totalDue = BigDecimal.valueOf(42L);
        BigDecimal totalAmountPaid = BigDecimal.valueOf(42L);
        AuditDetails auditDetails = new AuditDetails();
        MissingNode additionalDetails = MissingNode.getInstance();
        paymentList.add(new Payment("42", "42", totalDue, totalAmountPaid, "42", 1L, PaymentModeEnum.CASH, 1L, "42",
                InstrumentStatusEnum.APPROVED, "id", auditDetails, additionalDetails, new ArrayList<>(), "id", "42", "id",
                "42 Main St", "jane.doe@example.org", "42", PaymentStatusEnum.NEW, "42"));
        this.paymentRepository.updatePayment(paymentList);
        verify(this.namedParameterJdbcTemplate, atLeast(1)).batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any());
    }

    @Test
    void testUpdatePayment6() {
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});

        ArrayList<Payment> paymentList = new ArrayList<>();
        paymentList.add(null);
        assertThrows(CustomException.class, () -> this.paymentRepository.updatePayment(paymentList));
    }

    @Test
    void testUpdateFileStoreId() {
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});
        this.paymentRepository.updateFileStoreId(new ArrayList<>());
        verify(this.namedParameterJdbcTemplate).batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any());
    }

    @Test
    void testUpdateFileStoreId2() {
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});

        ArrayList<Map<String, String>> mapList = new ArrayList<>();
        mapList.add(new HashMap<>());
        this.paymentRepository.updateFileStoreId(mapList);
        verify(this.namedParameterJdbcTemplate).batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any());
    }

    @Test
    void testUpdateFileStoreId3() {
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenThrow(
                new CustomException("UPDATE egcl_payment SET filestoreid=:filestoreid WHERE id=:id;", "An error occurred"));
        assertThrows(CustomException.class, () -> this.paymentRepository.updateFileStoreId(new ArrayList<>()));
        verify(this.namedParameterJdbcTemplate).batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any());
    }

    @Test
    void testUpdateFileStoreId4() {
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});

        ArrayList<Map<String, String>> mapList = new ArrayList<>();
        mapList.add(new HashMap<>());
        mapList.add(new HashMap<>());
        this.paymentRepository.updateFileStoreId(mapList);
        verify(this.namedParameterJdbcTemplate).batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any());
    }

    @Test
    void testFetchPaymentIds() throws DataAccessException {
        ArrayList<Object> objectList = new ArrayList<>();
        when(this.namedParameterJdbcTemplate.query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any())).thenReturn(objectList);
        List<String> actualFetchPaymentIdsResult = this.paymentRepository.fetchPaymentIds(new PaymentSearchCriteria());
        assertSame(objectList, actualFetchPaymentIdsResult);
        assertTrue(actualFetchPaymentIdsResult.isEmpty());
        verify(this.namedParameterJdbcTemplate).query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any());
    }

    @Test
    void testFetchPaymentIds3() throws DataAccessException {
        when(this.namedParameterJdbcTemplate.query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any()))
                .thenThrow(new CustomException("offset", "An error occurred"));
        assertThrows(CustomException.class, () -> this.paymentRepository.fetchPaymentIds(new PaymentSearchCriteria()));
        verify(this.namedParameterJdbcTemplate).query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any());
    }

    @Test
    void testFetchPaymentIdsByCriteria() throws DataAccessException {
        when(this.paymentQueryBuilder.getIdQuery((PaymentSearchCriteria) any(), (java.util.Map<String, Object>) any()))
                .thenReturn("Id Query");
        ArrayList<Object> objectList = new ArrayList<>();
        when(this.namedParameterJdbcTemplate.query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any())).thenReturn(objectList);
        List<String> actualFetchPaymentIdsByCriteriaResult = this.paymentRepository
                .fetchPaymentIdsByCriteria(new PaymentSearchCriteria());
        assertSame(objectList, actualFetchPaymentIdsByCriteriaResult);
        assertTrue(actualFetchPaymentIdsByCriteriaResult.isEmpty());
        verify(this.paymentQueryBuilder).getIdQuery((PaymentSearchCriteria) any(), (java.util.Map<String, Object>) any());
        verify(this.namedParameterJdbcTemplate).query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any());
    }

    @Test
    void testFetchPaymentIdsByCriteria2() throws DataAccessException {
        when(this.paymentQueryBuilder.getIdQuery((PaymentSearchCriteria) any(), (java.util.Map<String, Object>) any()))
                .thenReturn("Id Query");
        when(this.namedParameterJdbcTemplate.query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any()))
                .thenThrow(new CustomException("Code", "An error occurred"));
        assertThrows(CustomException.class,
                () -> this.paymentRepository.fetchPaymentIdsByCriteria(new PaymentSearchCriteria()));
        verify(this.paymentQueryBuilder).getIdQuery((PaymentSearchCriteria) any(), (java.util.Map<String, Object>) any());
        verify(this.namedParameterJdbcTemplate).query((String) any(), (java.util.Map<String, ?>) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any());
    }

    @Test
    void testFetchIfsccode() throws DataAccessException {
        ArrayList<Object> objectList = new ArrayList<>();
        when(this.namedParameterJdbcTemplate.query((String) any(), (org.springframework.jdbc.core.RowMapper<Object>) any()))
                .thenReturn(objectList);
        List<String> actualFetchIfsccodeResult = this.paymentRepository.fetchIfsccode();
        assertSame(objectList, actualFetchIfsccodeResult);
        assertTrue(actualFetchIfsccodeResult.isEmpty());
        verify(this.namedParameterJdbcTemplate).query((String) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any());
    }

    @Test
    void testFetchIfsccode2() throws DataAccessException {
        when(this.namedParameterJdbcTemplate.query((String) any(), (org.springframework.jdbc.core.RowMapper<Object>) any()))
                .thenThrow(new CustomException("SELECT distinct ifsccode from egcl_payment where ifsccode is not null ",
                        "An error occurred"));
        assertThrows(CustomException.class, () -> this.paymentRepository.fetchIfsccode());
        verify(this.namedParameterJdbcTemplate).query((String) any(),
                (org.springframework.jdbc.core.RowMapper<Object>) any());
    }

    @Test
    void testUpdatePaymentBankDetail() {
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});
        this.paymentRepository.updatePaymentBankDetail(MissingNode.getInstance(), "Ifsccode");
        verify(this.namedParameterJdbcTemplate, atLeast(1)).batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any());
    }

    @Test
    void testUpdatePaymentBankDetail2() {
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any())).thenReturn(new int[]{1, 1, 1, 1});
        this.paymentRepository.updatePaymentBankDetail(null, "Ifsccode");
        verify(this.namedParameterJdbcTemplate, atLeast(1)).batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any());
    }

    @Test
    void testUpdatePaymentBankDetail3() {
        when(this.namedParameterJdbcTemplate.batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any()))
                .thenThrow(new CustomException("additionaldetails", "An error occurred"));
        assertThrows(CustomException.class,
                () -> this.paymentRepository.updatePaymentBankDetail(MissingNode.getInstance(), "Ifsccode"));
        verify(this.namedParameterJdbcTemplate).batchUpdate((String) any(),
                (org.springframework.jdbc.core.namedparam.SqlParameterSource[]) any());
    }
}

