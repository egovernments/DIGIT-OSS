package org.egov.collection.repository;

import static java.util.Collections.reverseOrder;
import static org.egov.collection.config.CollectionServiceConstants.KEY_FILESTOREID;
import static org.egov.collection.config.CollectionServiceConstants.KEY_ID;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.*;

import java.util.*;
import java.util.stream.Collectors;

import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentDetail;
import org.egov.collection.model.PaymentSearchCriteria;
import org.egov.collection.repository.querybuilder.PaymentQueryBuilder;
import org.egov.collection.repository.rowmapper.BillRowMapper;
import org.egov.collection.repository.rowmapper.PaymentRowMapper;
import org.egov.collection.web.contract.Bill;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.JsonNode;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
public class PaymentRepository {


    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    private PaymentQueryBuilder paymentQueryBuilder;

    private PaymentRowMapper paymentRowMapper;
    
    private BillRowMapper billRowMapper;

    @Autowired
    public PaymentRepository(NamedParameterJdbcTemplate namedParameterJdbcTemplate, PaymentQueryBuilder paymentQueryBuilder, 
    		PaymentRowMapper paymentRowMapper, BillRowMapper billRowMapper) {
        this.namedParameterJdbcTemplate = namedParameterJdbcTemplate;
        this.paymentQueryBuilder = paymentQueryBuilder;
        this.paymentRowMapper = paymentRowMapper;
        this.billRowMapper = billRowMapper;
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


    public List<Payment> fetchPayments(PaymentSearchCriteria paymentSearchCriteria) {
        Map<String, Object> preparedStatementValues = new HashMap<>();

        List<String> ids = fetchPaymentIdsByCriteria(paymentSearchCriteria);

        if(CollectionUtils.isEmpty(ids))
            return new LinkedList<>();

        String query = paymentQueryBuilder.getPaymentSearchQuery(ids, preparedStatementValues);
        log.info("Query: " + query);
        log.info("preparedStatementValues: " + preparedStatementValues);
        List<Payment> payments = namedParameterJdbcTemplate.query(query, preparedStatementValues, paymentRowMapper);
        if (!CollectionUtils.isEmpty(payments)) {
            Set<String> billIds = new HashSet<>();
            for (Payment payment : payments) {
                billIds.addAll(payment.getPaymentDetails().stream().map(detail -> detail.getBillId()).collect(Collectors.toSet()));
            }
            Map<String, Bill> billMap = getBills(billIds);
            for (Payment payment : payments) {
                payment.getPaymentDetails().forEach(detail -> {
                    detail.setBill(billMap.get(detail.getBillId()));
                });
            }
            payments.sort(reverseOrder(Comparator.comparingLong(Payment::getTransactionDate)));
        }

        return payments;
    }
    
    public Long getPaymentsCount (String tenantId, String businessService) {
    	
    	Map<String, Object> preparedStatementValues = new HashMap<>();
    	String query = paymentQueryBuilder.getPaymentCountQuery(tenantId, businessService, preparedStatementValues);
    	return namedParameterJdbcTemplate.queryForObject(query, preparedStatementValues, Long.class);
    }

    public List<Payment> fetchPaymentsForPlainSearch(PaymentSearchCriteria paymentSearchCriteria) {
        Map<String, Object> preparedStatementValues = new HashMap<>();
        String query = paymentQueryBuilder.getPaymentSearchQueryForPlainSearch(paymentSearchCriteria, preparedStatementValues);
        log.info("Query: " + query);
        log.info("preparedStatementValues: " + preparedStatementValues);
        List<Payment> payments = namedParameterJdbcTemplate.query(query, preparedStatementValues, paymentRowMapper);
        if (!CollectionUtils.isEmpty(payments)) {
            Set<String> billIds = new HashSet<>();
            for (Payment payment : payments) {
                billIds.addAll(payment.getPaymentDetails().stream().map(detail -> detail.getBillId()).collect(Collectors.toSet()));
            }
            Map<String, Bill> billMap = getBills(billIds);
            for (Payment payment : payments) {
                payment.getPaymentDetails().forEach(detail -> {
                    detail.setBill(billMap.get(detail.getBillId()));
                });
            }
            payments.sort(reverseOrder(Comparator.comparingLong(Payment::getTransactionDate)));
        }

        return payments;
    }


    
    private Map<String, Bill> getBills(Set<String> ids){
    	Map<String, Bill> mapOfIdAndBills = new HashMap<>();
        Map<String, Object> preparedStatementValues = new HashMap<>();
        preparedStatementValues.put("id", ids);
        String query = paymentQueryBuilder.getBillQuery();
        List<Bill> bills = namedParameterJdbcTemplate.query(query, preparedStatementValues, billRowMapper);
        bills.forEach(bill -> {
        	mapOfIdAndBills.put(bill.getId(), bill);
        });
        
        return mapOfIdAndBills;

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
            namedParameterJdbcTemplate.batchUpdate(STATUS_UPDATE_PAYMENT_SQL, paymentSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(STATUS_UPDATE_PAYMENTDETAIL_SQL, paymentDetailSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(STATUS_UPDATE_BILL_SQL, billSource.toArray(new MapSqlParameterSource[0]));
        }
        catch(Exception e){
            log.error("Failed to persist cancel Receipt to database", e);
            throw new CustomException("CANCEL_RECEIPT_FAILED", "Unable to cancel Receipt");
        }
    }


    public void updatePayment(List<Payment> payments){
        List<MapSqlParameterSource> paymentSource = new ArrayList<>();
        List<MapSqlParameterSource> paymentDetailSource = new ArrayList<>();
        List<MapSqlParameterSource> billSource = new ArrayList<>();
        List<MapSqlParameterSource> billDetailSource = new ArrayList<>();

        try {

            for (Payment payment : payments) {
                paymentSource.add(getParametersForPaymentUpdate(payment));
                payment.getPaymentDetails().forEach(paymentDetail -> {
                    paymentDetailSource.add(getParametersForPaymentDetailUpdate(paymentDetail));
                    billSource.add(getParamtersForBillUpdate(paymentDetail.getBill()));

                    paymentDetail.getBill().getBillDetails().forEach(billDetail -> {
                        billDetailSource.add(getParamtersForBillDetailUpdate(billDetail));
                    });

                });
            }
            namedParameterJdbcTemplate.batchUpdate(UPDATE_PAYMENT_SQL, paymentSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(UPDATE_PAYMENTDETAIL_SQL, paymentDetailSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(UPDATE_BILL_SQL, billSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(UPDATE_BILLDETAIL_SQL, billDetailSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(COPY_PAYMENT_SQL, paymentSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(COPY_PAYMENTDETAIL_SQL, paymentDetailSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(COPY_BILL_SQL, billSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(COPY_BILLDETAIL_SQL, billDetailSource.toArray(new MapSqlParameterSource[0]));
        }catch (Exception e){
            log.error("Failed to update receipt to database", e);
            throw new CustomException("RECEIPT_UPDATION_FAILED", "Unable to update receipt");
        }
    }


    public void updateFileStoreId(List<Map<String,String>> idToFileStoreIdMaps){

        List<MapSqlParameterSource> fileStoreIdSource = new ArrayList<>();

        idToFileStoreIdMaps.forEach(map -> {
            MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();
            sqlParameterSource.addValue("id",map.get(KEY_ID));
            sqlParameterSource.addValue("filestoreid",map.get(KEY_FILESTOREID));
            fileStoreIdSource.add(sqlParameterSource);
        });

        namedParameterJdbcTemplate.batchUpdate(FILESTOREID_UPDATE_PAYMENT_SQL,fileStoreIdSource.toArray(new MapSqlParameterSource[0]));

    }

    public List<String> fetchPaymentIds(PaymentSearchCriteria paymentSearchCriteria) {

        Map<String, Object> preparedStatementValues = new HashMap<>();
        preparedStatementValues.put("offset", paymentSearchCriteria.getOffset());
        preparedStatementValues.put("limit", paymentSearchCriteria.getLimit());

        return namedParameterJdbcTemplate.query("SELECT id from egcl_payment ORDER BY createdtime offset " + ":offset " + "limit :limit", preparedStatementValues, new SingleColumnRowMapper<>(String.class));

    }

    public List<String> fetchPaymentIdsByCriteria(PaymentSearchCriteria paymentSearchCriteria) {
        Map<String, Object> preparedStatementValues = new HashMap<>();
        String query = paymentQueryBuilder.getIdQuery(paymentSearchCriteria, preparedStatementValues);
        return namedParameterJdbcTemplate.query(query, preparedStatementValues, new SingleColumnRowMapper<>(String.class));
	}

	/**
	 * API is to get the distinct ifsccode from payment
	 * 
	 * @return ifsccode list
	 */
	public List<String> fetchIfsccode() {

		return namedParameterJdbcTemplate.query("SELECT distinct ifsccode from egcl_payment where ifsccode is not null ",
				new SingleColumnRowMapper<>(String.class));

	}

	/**
	 * API, All payments with @param ifsccode, additional details updated
	 * with @param additionaldetails
	 * 
	 * @param additionaldetails
	 * @param ifsccode
	 */

	@Transactional
	public void updatePaymentBankDetail(JsonNode additionaldetails, String ifsccode) {
		List<MapSqlParameterSource> parameterSource = new ArrayList<>();
		parameterSource.add(getParametersForBankDetailUpdate(additionaldetails, ifsccode));

		/**
		 * UPDATE_PAYMENT_BANKDETAIL_SQL query adds the bankdetails data to
		 * existing object type additionaldetails ex: object type
		 * additionaldetails data {"isWhatsapp": false }
		 */
		namedParameterJdbcTemplate.batchUpdate(UPDATE_PAYMENT_BANKDETAIL_SQL,
				parameterSource.toArray(new MapSqlParameterSource[0]));

		List<MapSqlParameterSource> emptyAddtlParameterSource = new ArrayList<>();
		emptyAddtlParameterSource.add(getParametersEmptyDtlBankDetailUpdate(additionaldetails, ifsccode));
		/**
		 * UPDATE_PAYMENT_BANKDETAIL_EMPTYADDTL_SQL query update the bankdetails
		 * to empty/null additionaldetails. ex: empty or 'null'
		 * additionaldetails data.
		 */
		namedParameterJdbcTemplate.batchUpdate(UPDATE_PAYMENT_BANKDETAIL_EMPTYADDTL_SQL,
				emptyAddtlParameterSource.toArray(new MapSqlParameterSource[0]));

		/**
		 * UPDATE_PAYMENT_BANKDETAIL_ARRAYADDTL_SQL query adds bankdetails data
		 * to existing array type additionaldetails. ex: array additional data
		 * :[{"bankName": "State Bank of India", "branchName": "Chandigarh Main
		 * Branch"}]
		 * 
		 */
		namedParameterJdbcTemplate.batchUpdate(UPDATE_PAYMENT_BANKDETAIL_ARRAYADDTL_SQL,
				emptyAddtlParameterSource.toArray(new MapSqlParameterSource[0]));

	}
}