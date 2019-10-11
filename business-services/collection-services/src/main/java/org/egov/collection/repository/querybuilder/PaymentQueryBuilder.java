package org.egov.collection.repository.querybuilder;

import com.fasterxml.jackson.databind.JsonNode;
import org.apache.commons.lang3.StringUtils;
import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentDetail;
import org.egov.collection.model.PaymentSearchCriteria;
import org.egov.collection.web.contract.Bill;
import org.egov.collection.web.contract.BillAccountDetail;
import org.egov.collection.web.contract.BillDetail;
import org.egov.tracer.model.CustomException;
import org.postgresql.util.PGobject;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.sql.SQLException;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;
import java.util.Objects;

import static java.util.stream.Collectors.toSet;

@Service
public class PaymentQueryBuilder {


    public static final String SELECT_PAYMENT_SQL = "SELECT py.*,pyd.*,bill.*,bd.*,bacdt.*, " +
            "py.id as py_id,py.tenantId as py_tenantId,py.totalAmountPaid as py_totalAmountPaid,py.createdBy as py_createdBy,py.createdDate as py_createdDate," +
            "py.lastModifiedBy as py_lastModifiedBy,py.lastModifiedDate as py_lastModifiedDate," +
            "pyd.id as pyd_id,pyd.tenantId as pyd_tenantId,pyd.createdBy as pyd_createdBy,pyd.createdDate as pyd_createdDate,pyd.lastModifiedBy as pyd_lastModifiedBy," +
            "pyd.lastModifiedDate as pyd_lastModifiedDate," +
            "bill.createdby as bill_createdby,bill.createddate as bill_createddate,bill.lastmodifiedby as bill_lastmodifiedby," +
            "bill.lastmodifieddate as bill_lastmodifieddate,bill.id as bill_id," +
            "bill.status as bill_status," +
            "bill.tenantid as bill_tenantid,bill.totalamount as bill_totalamount," +
            "bd.createdby as bd_createdby,bd.createddate as bd_createddate,bd.lastmodifiedby as bd_lastmodifiedby," +
            "bd.lastmodifieddate as bd_lastmodifieddate,bd.id as bd_id,bd.tenantid as bd_tenantid," +
            "bacdt.createdby as bacdt_createdby,bacdt.createddate as bacdt_createddate,bacdt.lastmodifiedby as bacdt_lastmodifiedby," +
            "bacdt.lastmodifieddate as bacdt_lastmodifieddate," +
            "bacdt.id as bacdt_id,bacdt.tenantid as bacdt_tenantid" +
            " FROM egcl_payment py  " +
            " INNER JOIN egcl_paymentdetail pyd ON pyd.paymentid = py.id " +
            " INNER JOIN egcl_bill bill ON bill.id = pyd.billid " +
            " INNER JOIN egcl_billdetial bd ON bd.billid = bill.id " +
            " INNER JOIN egcl_billaccountdetail bacdt ON bacdt.billdetailid = bd.id  ";

    private static final String PAGINATION_WRAPPER = "SELECT * FROM " +
            "(SELECT *, DENSE_RANK() OVER (ORDER BY py_id) offset_ FROM " +
            "({baseQuery})" +
            " result) result_offset " +
            "WHERE offset_ > :offset AND offset_ <= :limit";


    public static final String INSERT_PAYMENT_SQL = "INSERT INTO egcl_payment(" +
            "            id, tenantid, totaldue, totalamountpaid, transactionnumber, transactiondate, " +
            "            paymentmode, instrumentdate, instrumentnumber,instrumentStatus, ifsccode, additionaldetails, " +
            "            paidby, mobilenumber, payername, payeraddress, payeremail, payerid, " +
            "            paymentstatus, createdby, createddate, lastmodifiedby, lastmodifieddate)" +
            "            VALUES (:id, :tenantid, :totaldue, :totalamountpaid, :transactionnumber, :transactiondate, " +
            "            :paymentmode, :instrumentdate, :instrumentnumber, :instrumentStatus, :ifsccode, :additionaldetails," +
            "            :paidby, :mobilenumber, :payername, :payeraddress, :payeremail, :payerid, " +
            "            :paymentstatus, :createdby, :createddate, :lastmodifiedby, :lastmodifieddate);";


    public static final String INSERT_PAYMENTDETAIL_SQL = "INSERT INTO egcl_paymentdetail(" +
            "            id, tenantid, paymentid, due, amountpaid, receiptnumber, businessservice, " +
            "            billid, paymentdetailstatus, additionaldetails, createdby, createddate, " +
            "            lastmodifiedby, lastmodifieddate)" +
            "            VALUES (:id, :tenantid, :paymentid, :due, :amountpaid, :receiptnumber, :businessservice, " +
            "            :billid, :paymentdetailstatus, :additionaldetails, :createdby, :createddate," +
            "            :lastmodifiedby, :lastmodifieddate);";


    public static final String INSERT_BILL_SQL = "INSERT INTO egcl_bill(" +
            "            id, status, iscancelled, additionaldetails, tenantid, collectionmodesnotallowed," +
            "            partpaymentallowed, isadvanceallowed, minimumamounttobepaid, " +
            "            businessservice, totalamount, consumercode, billnumber, billdate," +
            "            createdby, createddate, lastmodifiedby, lastmodifieddate) " +
            "    VALUES (:id, :status, :iscancelled, :additionaldetails, :tenantid, :collectionmodesnotallowed," +
            "            :partpaymentallowed, :isadvanceallowed, :minimumamounttobepaid," +
            "            :businessservice, :totalamount, :consumercode, :billnumber, :billdate," +
            "            :createdby, :createddate, :lastmodifiedby, :lastmodifieddate);";


    public static final String INSERT_BILLDETAIL_SQL = "INSERT INTO egcl_billdetial(" +
            "            id, tenantid, demandid, billid, amount, amountpaid, fromperiod," +
            "            toperiod, collectedamount, additionaldetails, receiptnumber," +
            "            receiptdate, receipttype, channel, voucherheader, boundary, reasonforcancellation," +
            "            manualreceiptnumber, manualreceiptdate, status, collectiontype," +
            "            billdescription, expirydate, displaymessage, callbackforapportioning," +
            "            cancellationremarks, createdby, createddate, lastmodifiedby," +
            "            lastmodifieddate)" +
            "    VALUES (:id, :tenantid, :demandid, :billid, :amount, :amountpaid, :fromperiod," +
            "            :toperiod, :collectedamount, :additionaldetails, :receiptnumber," +
            "            :receiptdate, :receipttype, :channel, :voucherheader, :boundary, :reasonforcancellation," +
            "            :manualreceiptnumber, :manualreceiptdate, :status, :collectiontype," +
            "            :billdescription, :expirydate, :displaymessage, :callbackforapportioning" +
            "            :cancellationremarks, :createdby, :createddate, :lastmodifiedby," +
            "            :lastmodifieddate);";


    public static final String INSERT_BILLACCOUNTDETAIL_SQL = "INSERT INTO egcl_billaccountdetail(" +
            "            id, tenantid, paymentdetailid, billdetailid, demanddetailid, " +
            "            \"order\", amount, isactualdemand, taxheadcode, additionaldetails, " +
            "            createdby, createddate, lastmodifiedby, lastmodifieddate)" +
            "            VALUES (:id, :tenantid, :paymentdetailid, :billdetailid, :demanddetailid, " +
            "            :order, :amount, :isactualdemand, :taxheadcode, :additionaldetails," +
            "            :createdby, :createddate, :lastmodifiedby, :lastmodifieddate);";

    public static final String UPDATE_STATUS_BILL_SQL = "UPDATE egcl_bill " +
            "   SET  status= :status, iscancelled= :iscancelled, additionaldetails= :additionaldetails, createdby=:createdby," +
            "   createddate= :createddate,lastmodifiedby= :lastmodifiedby, lastmodifieddate=:lastmodifieddate" +
            "   WHERE id=:id;";

    public static final String UPDATE_STATUS_PAYMENT_SQL = "UPDATE egcl_payment SET instrumentstatus=:instrumentstatus,additionaldetails=:additionaldetails," +
            " paymentstatus=:paymentstatus,createdby=:createdby, createddate=:createddate, lastmodifiedby=:lastmodifiedby,lastmodifieddate=:lastmodifieddate" +
            " WHERE id=:id;";

    public static final String UPDATE_STATUS_PAYMENTDETAIL_SQL = "UPDATE egcl_paymentdetail SET  additionaldetails=:additionaldetails, createdby=:createdby," +
            " createddate=:createddate, lastmodifiedby=:lastmodifiedby, lastmodifieddate=:lastmodifieddate " +
            " WHERE id=:id;";

    public static final String COPY_PAYMENT_SQL = "INSERT INTO egcl_payment_audit SELECT * FROM egcl_payment WHERE id = :id;";

    public static final String COPY_PAYMENTDETAIL_SQL = "INSERT INTO egcl_paymentdetail_audit SELECT * FROM egcl_paymentdetail WHERE id = :id;";

    public static final String COPY_BILL_SQL = "INSERT INTO egcl_bill_audit SELECT * FROM egcl_bill WHERE id = :id;";



    public static MapSqlParameterSource getParametersForPaymentCreate(Payment payment) {
        MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();

        sqlParameterSource.addValue("id", payment.getId());
        sqlParameterSource.addValue("tenantid", payment.getTenantId());
        sqlParameterSource.addValue("totaldue", payment.getTotalDue());
        sqlParameterSource.addValue("totalamountpaid", payment.getTotalAmountPaid());
        sqlParameterSource.addValue("transactionnumber", payment.getTransactionNumber());
        sqlParameterSource.addValue("transactiondate", payment.getTransactionDate());
        sqlParameterSource.addValue("paymentmode", payment.getPaymentMode());
        sqlParameterSource.addValue("instrumentdate", payment.getInstrumentDate());
        sqlParameterSource.addValue("instrumentnumber", payment.getInstrumentNumber());
        sqlParameterSource.addValue("instrumentStatus", payment.getInstrumentStatus());
        sqlParameterSource.addValue("ifsccode", payment.getIfscCode());
        sqlParameterSource.addValue("additionaldetails", payment.getAdditionalDetails());
        sqlParameterSource.addValue("paidby", payment.getPaidBy());
        sqlParameterSource.addValue("mobilenumber", payment.getMobileNumber());
        sqlParameterSource.addValue("payername", payment.getPayerName());
        sqlParameterSource.addValue("payeraddress", payment.getPayerAddress());
        sqlParameterSource.addValue("payeremail", payment.getPayerEmail());
        sqlParameterSource.addValue("payerid", payment.getPayerId());
        sqlParameterSource.addValue("paymentstatus", payment.getPaymentStatus());
        sqlParameterSource.addValue("createdby", payment.getAuditDetails().getCreatedBy());
        sqlParameterSource.addValue("createddate", payment.getAuditDetails().getCreatedDate());
        sqlParameterSource.addValue("lastmodifiedby", payment.getAuditDetails().getLastModifiedBy());
        sqlParameterSource.addValue("lastmodifieddate", payment.getAuditDetails().getLastModifiedDate());

        return sqlParameterSource;

    }


    public static MapSqlParameterSource getParametersForPaymentDetailCreate(String paymentId,PaymentDetail paymentDetail) {
        MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();

        sqlParameterSource.addValue("id", paymentDetail.getId());
        sqlParameterSource.addValue("tenantid", paymentDetail.getTenantId());
        sqlParameterSource.addValue("paymentid", paymentId);
        sqlParameterSource.addValue("due", paymentDetail.getTotalDue());
        sqlParameterSource.addValue("amountpaid", paymentDetail.getTotalAmountPaid());
        sqlParameterSource.addValue("receiptnumber", paymentDetail.getReceiptNumber());
        sqlParameterSource.addValue("businessservice", paymentDetail.getBusinessService());
        sqlParameterSource.addValue("billid", paymentDetail.getBillId());
        sqlParameterSource.addValue("additionaldetails", paymentDetail.getAdditionalDetails());
        sqlParameterSource.addValue("createdby", paymentDetail.getAuditDetails().getCreatedBy());
        sqlParameterSource.addValue("createddate", paymentDetail.getAuditDetails().getCreatedDate());
        sqlParameterSource.addValue("lastmodifiedby", paymentDetail.getAuditDetails().getLastModifiedBy());
        sqlParameterSource.addValue("lastmodifieddate", paymentDetail.getAuditDetails().getLastModifiedDate());

        return sqlParameterSource;

    }



    public static MapSqlParameterSource getParamtersForBillCreate(Bill bill){

        MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();

        sqlParameterSource.addValue("id", bill.getId());
        sqlParameterSource.addValue("status", bill.getStatus());
        sqlParameterSource.addValue("iscancelled", bill.getIsCancelled());
        sqlParameterSource.addValue("additionaldetails", bill.getAdditionalDetails());
        sqlParameterSource.addValue("tenantid", bill.getTenantId());
        sqlParameterSource.addValue("collectionmodesnotallowed", StringUtils.join(bill.getCollectionModesNotAllowed(),","));
        sqlParameterSource.addValue("partpaymentallowed", bill.getPartPaymentAllowed());
        sqlParameterSource.addValue("isadvanceallowed", bill.getIsAdvanceAllowed());
        sqlParameterSource.addValue("minimumamounttobepaid", bill.getMinimumAmountToBePaid());
        sqlParameterSource.addValue("businessservice", bill.getBusinessService());
        sqlParameterSource.addValue("totalamount", bill.getTotalAmount());
        sqlParameterSource.addValue("consumercode", bill.getConsumerCode());
        sqlParameterSource.addValue("billnumber", bill.getBillNumber());
        sqlParameterSource.addValue("billdate", bill.getBillDate());
        sqlParameterSource.addValue("status", bill.getStatus());
        sqlParameterSource.addValue("reasonforcancellation", bill.getReasonForCancellation());
        sqlParameterSource.addValue("createdby", bill.getAuditDetails().getCreatedBy());
        sqlParameterSource.addValue("createddate", bill.getAuditDetails().getCreatedDate());
        sqlParameterSource.addValue("lastmodifiedby", bill.getAuditDetails().getLastModifiedBy());
        sqlParameterSource.addValue("lastmodifieddate", bill.getAuditDetails().getLastModifiedDate());

        return sqlParameterSource;
    }



    public static MapSqlParameterSource getParamtersForBillDetailCreate(BillDetail billDetail) {

        MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();
        sqlParameterSource.addValue("id", billDetail.getId());
        sqlParameterSource.addValue("tenantid", billDetail.getTenantId());
        sqlParameterSource.addValue("demandid", billDetail.getDemandId());
        sqlParameterSource.addValue("billid", billDetail.getBillId());
        sqlParameterSource.addValue("amount", billDetail.getAmount());
        sqlParameterSource.addValue("amountpaid", billDetail.getAmountPaid());
        sqlParameterSource.addValue("fromperiod", billDetail.getFromPeriod());
        sqlParameterSource.addValue("toperiod", billDetail.getToPeriod());
        sqlParameterSource.addValue("collectedamount", billDetail.getCollectedAmount());
        sqlParameterSource.addValue("additionaldetails", billDetail.getAdditionalDetails());
        sqlParameterSource.addValue("receiptdate", billDetail.getReceiptDate());
        sqlParameterSource.addValue("receipttype", billDetail.getReceiptType());
        sqlParameterSource.addValue("channel", billDetail.getChannel());
        sqlParameterSource.addValue("voucherheader", billDetail.getVoucherHeader());
        sqlParameterSource.addValue("boundary", billDetail.getBoundary());
        sqlParameterSource.addValue("manualreceiptnumber", billDetail.getManualReceiptNumber());
        sqlParameterSource.addValue("manualreceiptdate", billDetail.getManualReceiptDate());
        sqlParameterSource.addValue("collectiontype", billDetail.getCollectionType());
        sqlParameterSource.addValue("billdescription", billDetail.getBillDescription());
        sqlParameterSource.addValue("expirydate", billDetail.getExpiryDate());
        sqlParameterSource.addValue("displaymessage", billDetail.getDisplayMessage());
        sqlParameterSource.addValue("callbackforapportioning", billDetail.getCallBackForApportioning());
        sqlParameterSource.addValue("cancellationremarks", billDetail.getCancellationRemarks());
        sqlParameterSource.addValue("createdby", billDetail.getAuditDetails().getCreatedBy());
        sqlParameterSource.addValue("createddate", billDetail.getAuditDetails().getCreatedDate());
        sqlParameterSource.addValue("lastmodifiedby", billDetail.getAuditDetails().getLastModifiedBy());
        sqlParameterSource.addValue("lastmodifieddate", billDetail.getAuditDetails().getLastModifiedDate());

        return sqlParameterSource;
    }


    public static MapSqlParameterSource getParametersForBillAccountDetailCreate(BillAccountDetail billAccountDetail) {
        MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();

        sqlParameterSource.addValue("id", billAccountDetail.getId());
        sqlParameterSource.addValue("tenantid", billAccountDetail.getTenantId());
        sqlParameterSource.addValue("billdetailid", billAccountDetail.getBillDetailId());
        sqlParameterSource.addValue("demanddetailid", billAccountDetail.getDemandDetailId());
        sqlParameterSource.addValue("order", billAccountDetail.getOrder());
        sqlParameterSource.addValue("amount", billAccountDetail.getAmount());
        sqlParameterSource.addValue("isactualdemand", billAccountDetail.getIsActualDemand());
        sqlParameterSource.addValue("taxheadcode", billAccountDetail.getTaxHeadCode());
        sqlParameterSource.addValue("additionaldetails", billAccountDetail.getAdditionalDetails());
        sqlParameterSource.addValue("createdby", billAccountDetail.getAuditDetails().getCreatedBy());
        sqlParameterSource.addValue("createddate", billAccountDetail.getAuditDetails().getCreatedDate());
        sqlParameterSource.addValue("lastmodifiedby", billAccountDetail.getAuditDetails().getLastModifiedBy());
        sqlParameterSource.addValue("lastmodifieddate", billAccountDetail.getAuditDetails().getCreatedDate());

        return sqlParameterSource;
    }



    public static String getPaymentSearchQuery(PaymentSearchCriteria searchCriteria,
                                               Map<String, Object> preparedStatementValues) {
        StringBuilder selectQuery = new StringBuilder(SELECT_PAYMENT_SQL);

        addWhereClause(selectQuery, preparedStatementValues, searchCriteria);

        return addPaginationClause(selectQuery, preparedStatementValues, searchCriteria);
    }


    private static void addWhereClause(StringBuilder selectQuery, Map<String, Object> preparedStatementValues,
                                       PaymentSearchCriteria searchCriteria) {

        if (StringUtils.isNotBlank(searchCriteria.getTenantId())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            if(searchCriteria.getTenantId().split("\\.").length > 1) {
                selectQuery.append(" py.tenantId =:tenantId");
                preparedStatementValues.put("tenantId", searchCriteria.getTenantId());
            }
            else {
                selectQuery.append(" py.tenantId LIKE :tenantId");
                preparedStatementValues.put("tenantId", searchCriteria.getTenantId() + "%");
            }

        }

        if (searchCriteria.getReceiptNumbers() != null && !searchCriteria.getReceiptNumbers().isEmpty()) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" pyd.receiptNumber IN (:receiptnumber)  ");
            preparedStatementValues.put("receiptnumber", searchCriteria.getReceiptNumbers());
        }

        if (CollectionUtils.isEmpty(searchCriteria.getStatus())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" UPPER(py.paymentstatus) in (:status)");
            preparedStatementValues.put("status",
                    searchCriteria.getStatus()
                            .stream()
                            .map(String::toUpperCase)
                            .collect(toSet())
            );
        }

        if (CollectionUtils.isEmpty(searchCriteria.getInstrumentStatus())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" UPPER(py.instrumentStatus) in (:instrumentStatus)");
            preparedStatementValues.put("instrumentStatus",
                    searchCriteria.getStatus()
                            .stream()
                            .map(String::toUpperCase)
                            .collect(toSet())
            );
        }

        if (!CollectionUtils.isEmpty(searchCriteria.getPaymentModes())) {

            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" UPPER(py.paymentMode) in (:paymentMode)");
            preparedStatementValues.put("paymentMode",
                    searchCriteria.getPaymentModes()
                            .stream()
                            .map(String::toUpperCase)
                            .collect(toSet())
            );
        }

        if (StringUtils.isNotBlank(searchCriteria.getMobileNumber())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" py.mobileNumber = :mobileNumber");
            preparedStatementValues.put("mobileNumber", searchCriteria.getMobileNumber());
        }

        if (StringUtils.isNotBlank(searchCriteria.getTransactionNumber())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" py.transactionNumber = :transactionNumber");
            preparedStatementValues.put("transactionNumber", searchCriteria.getTransactionNumber());
        }

        if (searchCriteria.getFromDate() != null) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" py.transactionDate >= :fromDate");
            preparedStatementValues.put("fromDate", searchCriteria.getFromDate());
        }

        if (searchCriteria.getToDate() != null) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" py.transactionDate <= :toDate");
            Calendar c = Calendar.getInstance();
            c.setTime(new Date(searchCriteria.getToDate()));
            c.add(Calendar.DATE, 1);
            searchCriteria.setToDate(c.getTime().getTime());

            preparedStatementValues.put("toDate", searchCriteria.getToDate());
        }

        if (CollectionUtils.isEmpty(searchCriteria.getPayerIds())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" py.payerid IN (:payerid)  ");
            preparedStatementValues.put("payerid", searchCriteria.getPayerIds());
        }

        if (!CollectionUtils.isEmpty(searchCriteria.getConsumerCodes())) {

            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" bill.consumerCode in (:consumerCodes)");
            preparedStatementValues.put("consumerCodes", searchCriteria.getConsumerCodes());
        }


    }


    private static String addPaginationClause(StringBuilder selectQuery, Map<String, Object> preparedStatementValues,
                                              PaymentSearchCriteria criteria) {

        if (criteria.getLimit()!=null && criteria.getLimit() != 0) {
            String finalQuery = PAGINATION_WRAPPER.replace("{baseQuery}", selectQuery);
            preparedStatementValues.put("offset", criteria.getOffset());
            preparedStatementValues.put("limit", criteria.getOffset() + criteria.getLimit());

            return addOrderByClause(finalQuery, criteria);

        } else
            return addOrderByClause(selectQuery.toString(), criteria);
    }

    private static String addOrderByClause(String selectQuery,
                                           PaymentSearchCriteria criteria) {
        return selectQuery + " ORDER BY py.transactiondate DESC ";
    }


    private static void addClauseIfRequired(Map<String, Object> values, StringBuilder queryString) {
        if (values.isEmpty())
            queryString.append(" WHERE ");
        else {
            queryString.append(" AND");
        }
    }



    public static MapSqlParameterSource getParamtersForBillStatusUpdate(Bill bill){

        MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();

        sqlParameterSource.addValue("id", bill.getId());
        sqlParameterSource.addValue("status", bill.getStatus());
        sqlParameterSource.addValue("iscancelled", bill.getIsCancelled());
        sqlParameterSource.addValue("additionaldetails", bill.getAdditionalDetails());
        sqlParameterSource.addValue("status", bill.getStatus());
        sqlParameterSource.addValue("reasonforcancellation", bill.getReasonForCancellation());
        sqlParameterSource.addValue("createdby", bill.getAuditDetails().getCreatedBy());
        sqlParameterSource.addValue("createddate", bill.getAuditDetails().getCreatedDate());
        sqlParameterSource.addValue("lastmodifiedby", bill.getAuditDetails().getLastModifiedBy());
        sqlParameterSource.addValue("lastmodifieddate", bill.getAuditDetails().getLastModifiedDate());

        return sqlParameterSource;
    }


    public static MapSqlParameterSource getParametersForPaymentDetailStatusUpdate(PaymentDetail paymentDetail) {
        MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();

        sqlParameterSource.addValue("id", paymentDetail.getId());
        sqlParameterSource.addValue("additionaldetails", paymentDetail.getAdditionalDetails());
        sqlParameterSource.addValue("createdby", paymentDetail.getAuditDetails().getCreatedBy());
        sqlParameterSource.addValue("createddate", paymentDetail.getAuditDetails().getCreatedDate());
        sqlParameterSource.addValue("lastmodifiedby", paymentDetail.getAuditDetails().getLastModifiedBy());
        sqlParameterSource.addValue("lastmodifieddate", paymentDetail.getAuditDetails().getLastModifiedDate());

        return sqlParameterSource;

    }


    public static MapSqlParameterSource getParametersForPaymentStatusUpdate(Payment payment) {
        MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();

        sqlParameterSource.addValue("id", payment.getId());
        sqlParameterSource.addValue("instrumentStatus", payment.getInstrumentStatus());
        sqlParameterSource.addValue("additionaldetails", payment.getAdditionalDetails());
        sqlParameterSource.addValue("createdby", payment.getAuditDetails().getCreatedBy());
        sqlParameterSource.addValue("createddate", payment.getAuditDetails().getCreatedDate());
        sqlParameterSource.addValue("lastmodifiedby", payment.getAuditDetails().getLastModifiedBy());
        sqlParameterSource.addValue("lastmodifieddate", payment.getAuditDetails().getLastModifiedDate());

        return sqlParameterSource;

    }



    public static MapSqlParameterSource getParametersForPaymentUpdate(Payment payment) {
        MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();

        sqlParameterSource.addValue("id", payment.getId());
        sqlParameterSource.addValue("paidby", payment.getPaidBy());
        sqlParameterSource.addValue("payeraddress", payment.getPayerAddress());
        sqlParameterSource.addValue("payeremail", payment.getPayerEmail());
        sqlParameterSource.addValue("payername", payment.getPayerName());
        sqlParameterSource.addValue("additionalDetails", getJsonb(payment.getAdditionalDetails()));
        sqlParameterSource.addValue("lastmodifiedby", payment.getAuditDetails().getLastModifiedBy());
        sqlParameterSource.addValue("lastmodifieddate", payment.getAuditDetails().getLastModifiedDate());


        return sqlParameterSource;

    }


    public static MapSqlParameterSource getParametersForPaymentDetailUpdate(PaymentDetail paymentDetail) {
        MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();

        sqlParameterSource.addValue("id", paymentDetail.getId());
        sqlParameterSource.addValue("additionalDetails", getJsonb(paymentDetail.getAdditionalDetails()));
        sqlParameterSource.addValue("lastmodifiedby", paymentDetail.getAuditDetails().getLastModifiedBy());
        sqlParameterSource.addValue("lastmodifieddate", paymentDetail.getAuditDetails().getLastModifiedDate());

        // Temporary code below, to enable backward compatibility with previous API
        sqlParameterSource.addValue("status", billDetail.getStatus());


        return sqlParameterSource;

    }

    public static MapSqlParameterSource getParamtersForBillDetailUpdate(BillDetail billDetail) {

        MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();
        sqlParameterSource.addValue("id", billDetail.getId());
        sqlParameterSource.addValue("additionaldetails", billDetail.getAdditionalDetails());
        sqlParameterSource.addValue("voucherheader", billDetail.getVoucherHeader());
        sqlParameterSource.addValue("manualreceiptnumber", billDetail.getManualReceiptNumber());
        sqlParameterSource.addValue("manualreceiptdate", billDetail.getManualReceiptDate());
        sqlParameterSource.addValue("billdescription", billDetail.getBillDescription());
        sqlParameterSource.addValue("displaymessage", billDetail.getDisplayMessage());
        sqlParameterSource.addValue("cancellationremarks", billDetail.getCancellationRemarks());
        sqlParameterSource.addValue("createdby", billDetail.getAuditDetails().getCreatedBy());
        sqlParameterSource.addValue("createddate", billDetail.getAuditDetails().getCreatedDate());
        sqlParameterSource.addValue("lastmodifiedby", billDetail.getAuditDetails().getLastModifiedBy());
        sqlParameterSource.addValue("lastmodifieddate", billDetail.getAuditDetails().getLastModifiedDate());

        return sqlParameterSource;
    }





    private static PGobject getJsonb(JsonNode node) {
        if (Objects.isNull(node))
            return null;

        PGobject pgObject = new PGobject();
        pgObject.setType("jsonb");
        try {
            pgObject.setValue(node.toString());
            return pgObject;
        } catch (SQLException e) {
            throw new CustomException("UNABLE_TO_CREATE_RECEIPT", "Invalid JSONB value provided");
        }

    }












}
