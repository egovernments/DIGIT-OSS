package org.egov.collection.repository;

import lombok.extern.slf4j.Slf4j;
import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentDetail;
import org.egov.collection.model.PaymentSearchCriteria;
import org.egov.collection.repository.querybuilder.PaymentQueryBuilder;
import org.egov.collection.repository.rowmapper.PaymentRowMapper;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.*;

@Slf4j
@Repository
public class PaymentRepository {


    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    private PaymentQueryBuilder paymentQueryBuilder;

    private PaymentRowMapper paymentRowMapper;

    @Autowired
    public PaymentRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate, PaymentQueryBuilder paymentQueryBuilder, PaymentRowMapper paymentRowMapper) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
        this.paymentQueryBuilder = paymentQueryBuilder;
        this.paymentRowMapper = paymentRowMapper;
    }




    @Transactional
    public void savePayment(Payment payment){
        try {

            List<MapSqlParameterSource> paymentDetailSource = new ArrayList<>();
            List<MapSqlParameterSource> billSource = new ArrayList<>();
            List<MapSqlParameterSource> billDetailSource = new ArrayList<>();
            List<MapSqlParameterSource> billAccountDetailSource = new ArrayList<>();

            for (PaymentDetail paymentDetail : payment.getPaymentDetails()) {
                paymentDetailSource.add(getParametersForPaymentDetailCreate(payment.getId(), paymentDetail));
                billSource.add(getParamtersForBillCreate(paymentDetail.getBill()));
                paymentDetail.getBill().getBillDetails().forEach(billDetail -> {
                    billDetailSource.add(getParamtersForBillDetailCreate(billDetail));
                    billDetail.getBillAccountDetails().forEach(billAccountDetail -> {
                        billAccountDetailSource.add(getParametersForBillAccountDetailCreate(billAccountDetail));
                    });
                });

            }
            namedParameterJdbcTemplate.update(INSERT_PAYMENT_SQL, getParametersForPaymentCreate(payment));
            namedParameterJdbcTemplate.batchUpdate(INSERT_PAYMENTDETAIL_SQL, paymentDetailSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(INSERT_BILL_SQL, billSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(INSERT_BILLDETAIL_SQL, billDetailSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(INSERT_BILLACCOUNTDETAIL_SQL,  billAccountDetailSource.toArray(new MapSqlParameterSource[0]));

        }catch (Exception e){
            log.error("Failed to persist payment to database", e);
            throw new CustomException("PAYMENT_CREATION_FAILED", e.getMessage());
        }
    }


    public List<Payment> fetchPayments(PaymentSearchCriteria paymentSearchCriteria){
        Map<String, Object> preparedStatementValues = new HashMap<>();
        String query = paymentQueryBuilder.getPaymentSearchQuery(paymentSearchCriteria, preparedStatementValues);
        log.debug(query);
        List<Payment> payments = namedParameterJdbcTemplate.query(query, preparedStatementValues,paymentRowMapper);
        return payments;
    }



    public void updateStatus(List<Payment> payments){
        List<MapSqlParameterSource> paymentSource = new ArrayList<>();
        List<MapSqlParameterSource> paymentDetailSource = new ArrayList<>();
        List<MapSqlParameterSource> billSource = new ArrayList<>();
        try {

            for(Payment payment : payments){
                paymentSource.add(getParametersForPaymentStatusUpdate(payment));
                for (PaymentDetail paymentDetail : payment.getPaymentDetails()) {
                    paymentDetailSource.add(getParametersForPaymentDetailStatusUpdate(paymentDetail));
                    billSource.add(getParamtersForBillStatusUpdate(paymentDetail.getBill()));
                }
            }

            namedParameterJdbcTemplate.batchUpdate(COPY_PAYMENT_SQL, paymentSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(COPY_PAYMENTDETAIL_SQL, paymentDetailSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(COPY_BILL_SQL, billSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(UPDATE_STATUS_PAYMENT_SQL, paymentSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(UPDATE_STATUS_PAYMENTDETAIL_SQL, paymentDetailSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(UPDATE_STATUS_BILL_SQL, billSource.toArray(new MapSqlParameterSource[0]));
        }
        catch(Exception e){
            log.error("Failed to persist cancel Receipt to database", e);
            throw new CustomException("CANCEL_RECEIPT_FAILED", "Unable to cancel Receipt");
        }
    }


    public void updatePayment(List<Payment> payments){
        List<MapSqlParameterSource> paymentHeaderSource = new ArrayList<>();
        List<MapSqlParameterSource> paymentDetailSource = new ArrayList<>();
        List<MapSqlParameterSource> instrumentHeaderSource = new ArrayList<>();
        try {


            for (Receipt receipt : receipts) {
                BillDetail billDetail = receipt.getBill().get(0).getBillDetails().get(0);
                receiptHeaderSource.add(getParametersForReceiptHeaderUpdate(receipt, billDetail));
                for (BillAccountDetail billAccountDetail : billDetail.getBillAccountDetails()) {
                    receiptDetailSource.add(getParametersForReceiptDetails(billAccountDetail, billDetail.getId()));
                }
                instrumentHeaderSource.add(getParametersForInstrumentHeaderUpdate(receipt.getInstrument(),
                        receipt.getAuditDetails()));
            }
            namedParameterJdbcTemplate.batchUpdate(COPY_RCPT_HEADER_SQL, receiptHeaderSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(COPY_RCPT_DETALS_SQL, receiptDetailSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(COPY_INSTRUMENT_HEADER_SQL, instrumentHeaderSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(UPDATE_RECEIPT_HEADER_SQL, receiptHeaderSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(UPDATE_INSTRUMENT_HEADER_SQL, instrumentHeaderSource.toArray(new MapSqlParameterSource[0]));

        }catch (Exception e){
            log.error("Failed to update receipt to database", e);
            throw new CustomException("RECEIPT_UPDATION_FAILED", "Unable to update receipt");
        }
    }



}
