package org.egov.collection.repository;

import static java.util.Collections.reverseOrder;
import static org.egov.collection.config.CollectionServiceConstants.KEY_FILESTOREID;
import static org.egov.collection.config.CollectionServiceConstants.KEY_ID;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.COPY_BILLDETAIL_SQL;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.COPY_BILL_SQL;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.COPY_PAYMENTDETAIL_SQL;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.COPY_PAYMENT_SQL;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.FILESTOREID_UPDATE_PAYMENT_SQL;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.INSERT_BILLACCOUNTDETAIL_SQL;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.INSERT_BILLDETAIL_SQL;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.INSERT_BILL_SQL;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.INSERT_PAYMENTDETAIL_SQL;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.INSERT_PAYMENT_SQL;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.STATUS_UPDATE_BILL_SQL;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.STATUS_UPDATE_PAYMENTDETAIL_SQL;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.STATUS_UPDATE_PAYMENT_SQL;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.UPDATE_BILLDETAIL_SQL;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.UPDATE_BILL_SQL;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.UPDATE_PAYMENTDETAIL_SQL;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.UPDATE_PAYMENT_BANKDETAIL_ARRAYADDTL_SQL;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.UPDATE_PAYMENT_BANKDETAIL_EMPTYADDTL_SQL;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.UPDATE_PAYMENT_BANKDETAIL_SQL;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.UPDATE_PAYMENT_SQL;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.getParametersEmptyDtlBankDetailUpdate;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.getParametersForBankDetailUpdate;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.getParametersForBillAccountDetailCreate;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.getParametersForPaymentCreate;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.getParametersForPaymentDetailCreate;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.getParametersForPaymentDetailStatusUpdate;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.getParametersForPaymentDetailUpdate;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.getParametersForPaymentStatusUpdate;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.getParametersForPaymentUpdate;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.getParamtersForBillCreate;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.getParamtersForBillDetailCreate;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.getParamtersForBillDetailUpdate;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.getParamtersForBillStatusUpdate;
import static org.egov.collection.repository.querybuilder.PaymentQueryBuilder.getParamtersForBillUpdate;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentDetail;
import org.egov.collection.model.PaymentSearchCriteria;
import org.egov.collection.repository.querybuilder.PaymentQueryBuilder;
import org.egov.collection.repository.rowmapper.BillRowMapper;
import org.egov.collection.repository.rowmapper.PaymentRowMapper;
import org.egov.collection.web.contract.Bill;
import org.egov.common.exception.InvalidTenantIdException;
import org.egov.common.utils.MultiStateInstanceUtil;
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
    private MultiStateInstanceUtil centralInstanceUtil;

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
            String sqlPayment = centralInstanceUtil.replaceSchemaPlaceholder(INSERT_PAYMENT_SQL, payment.getTenantId());
            namedParameterJdbcTemplate.update(sqlPayment, getParametersForPaymentCreate(payment));
            String sqlPaymentDetail = centralInstanceUtil.replaceSchemaPlaceholder(INSERT_PAYMENTDETAIL_SQL, payment.getTenantId());
            namedParameterJdbcTemplate.batchUpdate(sqlPaymentDetail, paymentDetailSource.toArray(new MapSqlParameterSource[0]));
            String sqlBill = centralInstanceUtil.replaceSchemaPlaceholder(INSERT_BILL_SQL,payment.getTenantId());
            namedParameterJdbcTemplate.batchUpdate(sqlBill, billSource.toArray(new MapSqlParameterSource[0]));
            String sqlBillDetail = centralInstanceUtil.replaceSchemaPlaceholder(INSERT_BILLDETAIL_SQL,payment.getTenantId());
            namedParameterJdbcTemplate.batchUpdate(sqlBillDetail, billDetailSource.toArray(new MapSqlParameterSource[0]));
            String sqlBillAccount = centralInstanceUtil.replaceSchemaPlaceholder(INSERT_BILLACCOUNTDETAIL_SQL,payment.getTenantId());
            namedParameterJdbcTemplate.batchUpdate(sqlBillAccount,  billAccountDetailSource.toArray(new MapSqlParameterSource[0]));

        }catch (InvalidTenantIdException e) {
        	
        	throw new CustomException("EG_CL_TENANTID_ERROR",
					"TenantId length is not sufficient to replace query schema in a multi state instance");
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
		try {
			query = centralInstanceUtil.replaceSchemaPlaceholder(query, paymentSearchCriteria.getTenantId());
		} catch (InvalidTenantIdException e) {

			throw new CustomException("EG_CL_TENANTID_ERROR",
					"TenantId length is not sufficient to replace query schema in a multi state instance");
		}
        log.info("Query: " + query);
        log.info("preparedStatementValues: " + preparedStatementValues);
        List<Payment> payments = namedParameterJdbcTemplate.query(query, preparedStatementValues, paymentRowMapper);
        if (!CollectionUtils.isEmpty(payments)) {
            Set<String> billIds = new HashSet<>();
            for (Payment payment : payments) {
                billIds.addAll(payment.getPaymentDetails().stream().map(detail -> detail.getBillId()).collect(Collectors.toSet()));
            }
            Map<String, Bill> billMap = getBills(billIds, paymentSearchCriteria.getTenantId());
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
		try {
			query = centralInstanceUtil.replaceSchemaPlaceholder(query, paymentSearchCriteria.getTenantId());
		} catch (InvalidTenantIdException e) {

			throw new CustomException("EG_CL_TENANTID_ERROR",
					"TenantId length is not sufficient to replace query schema in a multi state instance");
		}
        log.info("Query: " + query);
        log.info("preparedStatementValues: " + preparedStatementValues);
        List<Payment> payments = namedParameterJdbcTemplate.query(query, preparedStatementValues, paymentRowMapper);
        if (!CollectionUtils.isEmpty(payments)) {
            Set<String> billIds = new HashSet<>();
            for (Payment payment : payments) {
                billIds.addAll(payment.getPaymentDetails().stream().map(detail -> detail.getBillId()).collect(Collectors.toSet()));
            }
            Map<String, Bill> billMap = getBills(billIds, paymentSearchCriteria.getTenantId());
            for (Payment payment : payments) {
                payment.getPaymentDetails().forEach(detail -> {
                    detail.setBill(billMap.get(detail.getBillId()));
                });
            }
            payments.sort(reverseOrder(Comparator.comparingLong(Payment::getTransactionDate)));
        }

        return payments;
    }


    
    private Map<String, Bill> getBills(Set<String> ids, String tenantId){
    	Map<String, Bill> mapOfIdAndBills = new HashMap<>();
        Map<String, Object> preparedStatementValues = new HashMap<>();
        preparedStatementValues.put("id", ids);
        String query = PaymentQueryBuilder.getBillQuery();
		try {
			query = centralInstanceUtil.replaceSchemaPlaceholder(query, tenantId);
		} catch (InvalidTenantIdException e) {

			throw new CustomException("EG_CL_TENANTID_ERROR",
					"TenantId length is not sufficient to replace query schema in a multi state instance");
		}
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
            String tenantId = payments.get(0).getTenantId();
            namedParameterJdbcTemplate.batchUpdate(centralInstanceUtil.replaceSchemaPlaceholder(COPY_PAYMENT_SQL,tenantId), paymentSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(centralInstanceUtil.replaceSchemaPlaceholder(COPY_PAYMENTDETAIL_SQL,tenantId), paymentDetailSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(centralInstanceUtil.replaceSchemaPlaceholder(COPY_BILL_SQL,tenantId), billSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(centralInstanceUtil.replaceSchemaPlaceholder(STATUS_UPDATE_PAYMENT_SQL,tenantId), paymentSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(centralInstanceUtil.replaceSchemaPlaceholder(STATUS_UPDATE_PAYMENTDETAIL_SQL,tenantId), paymentDetailSource.toArray(new MapSqlParameterSource[0]));
            namedParameterJdbcTemplate.batchUpdate(centralInstanceUtil.replaceSchemaPlaceholder(STATUS_UPDATE_BILL_SQL,tenantId), billSource.toArray(new MapSqlParameterSource[0]));
        }catch (InvalidTenantIdException e) {
        	
        	throw new CustomException("EG_CL_TENANTID_ERROR",
					"TenantId length is not sufficient to replace query schema in a multi state instance");
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
            String sqlPayment = centralInstanceUtil.replaceSchemaPlaceholder(UPDATE_PAYMENT_SQL, payments.get(0).getTenantId());
            namedParameterJdbcTemplate.batchUpdate(sqlPayment, paymentSource.toArray(new MapSqlParameterSource[0]));
            String sqlPaymentDetail = centralInstanceUtil.replaceSchemaPlaceholder(UPDATE_PAYMENTDETAIL_SQL,payments.get(0).getTenantId());
            namedParameterJdbcTemplate.batchUpdate(sqlPaymentDetail, paymentDetailSource.toArray(new MapSqlParameterSource[0]));
            String sqlBill = centralInstanceUtil.replaceSchemaPlaceholder(UPDATE_BILL_SQL,payments.get(0).getTenantId());
            namedParameterJdbcTemplate.batchUpdate(sqlBill, billSource.toArray(new MapSqlParameterSource[0]));
            String sqlBillDetail = centralInstanceUtil.replaceSchemaPlaceholder(UPDATE_BILLDETAIL_SQL, payments.get(0).getTenantId());
            namedParameterJdbcTemplate.batchUpdate(sqlBillDetail, billDetailSource.toArray(new MapSqlParameterSource[0]));
            String sqlCopyPayment = centralInstanceUtil.replaceSchemaPlaceholder(COPY_PAYMENT_SQL, payments.get(0).getTenantId());
            namedParameterJdbcTemplate.batchUpdate(sqlCopyPayment, paymentSource.toArray(new MapSqlParameterSource[0]));
            String sqlCopyPaymentDetail = centralInstanceUtil.replaceSchemaPlaceholder(COPY_PAYMENTDETAIL_SQL,payments.get(0).getTenantId());
            namedParameterJdbcTemplate.batchUpdate(sqlCopyPaymentDetail, paymentDetailSource.toArray(new MapSqlParameterSource[0]));
            String sqlCopyBill = centralInstanceUtil.replaceSchemaPlaceholder(COPY_BILL_SQL, payments.get(0).getTenantId());
            namedParameterJdbcTemplate.batchUpdate(sqlCopyBill, billSource.toArray(new MapSqlParameterSource[0]));
            String sqlCopyBillDetail = centralInstanceUtil.replaceSchemaPlaceholder(COPY_BILLDETAIL_SQL, payments.get(0).getTenantId());
            namedParameterJdbcTemplate.batchUpdate(sqlCopyBillDetail, billDetailSource.toArray(new MapSqlParameterSource[0]));
        
        }catch (InvalidTenantIdException e) {
        	
        	throw new CustomException("EG_CL_TENANTID_ERROR",
					"TenantId length is not sufficient to replace query schema in a multi state instance");
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
		try {
			query = centralInstanceUtil.replaceSchemaPlaceholder(query, paymentSearchCriteria.getTenantId());
		} catch (InvalidTenantIdException e) {

			throw new CustomException("EG_CL_TENANTID_ERROR",
					"TenantId length is not sufficient to replace query schema in a multi state instance");
		}
		return namedParameterJdbcTemplate.query(query, preparedStatementValues,
				new SingleColumnRowMapper<>(String.class));
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