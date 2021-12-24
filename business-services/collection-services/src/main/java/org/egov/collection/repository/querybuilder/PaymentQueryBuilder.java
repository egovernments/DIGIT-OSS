package org.egov.collection.repository.querybuilder;

import static java.util.stream.Collectors.toSet;

import java.sql.SQLException;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.apache.commons.lang3.StringUtils;
import org.egov.collection.config.ApplicationProperties;
import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentDetail;
import org.egov.collection.model.PaymentSearchCriteria;
import org.egov.collection.web.contract.Bill;
import org.egov.collection.web.contract.BillAccountDetail;
import org.egov.collection.web.contract.BillDetail;
import org.egov.tracer.model.CustomException;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Service
public class PaymentQueryBuilder {

    @Autowired
    private ApplicationProperties configs;

    public static final String SELECT_PAYMENT_SQL = "SELECT py.*,pyd.*," +
            "py.id as py_id,py.tenantId as py_tenantId,py.totalAmountPaid as py_totalAmountPaid,py.createdBy as py_createdBy,py.createdtime as py_createdtime," +
            "py.lastModifiedBy as py_lastModifiedBy,py.lastmodifiedtime as py_lastmodifiedtime,py.additionalDetails as py_additionalDetails," +
            "pyd.id as pyd_id, pyd.tenantId as pyd_tenantId, pyd.manualreceiptnumber as manualreceiptnumber,pyd.manualreceiptdate as manualreceiptdate, pyd.createdBy as pyd_createdBy,pyd.createdtime as pyd_createdtime,pyd.lastModifiedBy as pyd_lastModifiedBy," +
            "pyd.lastmodifiedtime as pyd_lastmodifiedtime,pyd.additionalDetails as pyd_additionalDetails" +
            " FROM {schema}.egcl_payment py  " +
            " INNER JOIN {schema}.egcl_paymentdetail pyd ON pyd.paymentid = py.id ";
    
    public static final String SELECT_COUNT_PAYMENT_SQL = "SELECT count(distinct(py.id)) FROM {schema}.egcl_payment py "
    		+ "INNER JOIN {schema}.egcl_paymentdetail pyd ON pyd.paymentid = py.id where pyd.businessservice= :businessservice and pyd.tenantid= :tenantid ";

    /*public static final String ID_QUERY = "SELECT DISTINCT py.id as id,py.transactiondate as date " +
            " FROM egcl_payment py  " +
            " INNER JOIN egcl_paymentdetail pyd ON pyd.paymentid = py.id " +
            " INNER JOIN egcl_bill bill ON bill.id = pyd.billid " +
            " INNER JOIN egcl_billdetial bd ON bd.billid = bill.id " ;*/

    public static final String ID_QUERY = "WITH py_filtered as (" +
            "select id from {schema}.egcl_payment as py_inner {{WHERE_CLAUSE}} ) " +
            " SELECT py.id as id FROM py_filtered as py " +
            " INNER JOIN {schema}.egcl_paymentdetail as pyd ON pyd.paymentid = py.id and pyd.tenantid {{operator}} :tenantId " +
            " INNER JOIN {schema}.egcl_bill bill ON bill.id = pyd.billid " +
            " INNER JOIN {schema}.egcl_billdetial bd ON bd.billid = bill.id and bd.tenantid {{operator}} :tenantId; ";

    private static final String PAGINATION_WRAPPER = "SELECT * FROM " +
            "(SELECT *, DENSE_RANK() OVER (ORDER BY py_id) offset_ FROM " +
            "({baseQuery})" +
            " result) result_offset " +
            "WHERE offset_ > :offset AND offset_ <= :limit";


    public static final String INSERT_PAYMENT_SQL = "INSERT INTO {schema}.egcl_payment(" +
            "            id, tenantid, totaldue, totalamountpaid, transactionnumber, transactiondate, " +
            "            paymentmode, instrumentdate, instrumentnumber,instrumentStatus, ifsccode, additionaldetails, " +
            "            paidby, mobilenumber, payername, payeraddress, payeremail, payerid, " +
            "            paymentstatus, createdby, createdtime, lastmodifiedby, lastmodifiedtime)" +
            "            VALUES (:id, :tenantid, :totaldue, :totalamountpaid, :transactionnumber, :transactiondate, " +
            "            :paymentmode, :instrumentdate, :instrumentnumber, :instrumentStatus, :ifsccode, :additionaldetails," +
            "            :paidby, :mobilenumber, :payername, :payeraddress, :payeremail, :payerid, " +
            "            :paymentstatus, :createdby, :createdtime, :lastmodifiedby, :lastmodifiedtime);";


    public static final String INSERT_PAYMENTDETAIL_SQL = "INSERT INTO {schema}.egcl_paymentdetail(" +
            "            id, tenantid, paymentid, due, amountpaid, receiptnumber, businessservice, " +
            "            billid, additionaldetails,receiptdate, receipttype, manualreceiptnumber, manualreceiptdate, createdby, createdtime, " +
            "            lastmodifiedby, lastmodifiedtime)" +
            "            VALUES (:id, :tenantid, :paymentid, :due, :amountpaid, :receiptnumber, :businessservice, " +
            "            :billid, :additionaldetails,:receiptdate, :receipttype, :manualreceiptnumber, :manualreceiptdate, :createdby, :createdtime," +
            "            :lastmodifiedby, :lastmodifiedtime);";


    public static final String INSERT_BILL_SQL = "INSERT INTO {schema}.egcl_bill(" +
            "            id, status, iscancelled, additionaldetails, tenantid, collectionmodesnotallowed," +
            "            partpaymentallowed, isadvanceallowed, minimumamounttobepaid, " +
            "            businessservice, totalamount, consumercode, billnumber, billdate," +
            "            createdby, createdtime, lastmodifiedby, lastmodifiedtime) " +
            "    VALUES (:id, :status, :iscancelled, :additionaldetails, :tenantid, :collectionmodesnotallowed," +
            "            :partpaymentallowed, :isadvanceallowed, :minimumamounttobepaid," +
            "            :businessservice, :totalamount, :consumercode, :billnumber, :billdate," +
            "            :createdby, :createdtime, :lastmodifiedby, :lastmodifiedtime);";


    public static final String INSERT_BILLDETAIL_SQL = "INSERT INTO {schema}.egcl_billdetial(" +
            "            id, tenantid, demandid, billid, amount, amountpaid, fromperiod," +
            "            toperiod, additionaldetails," +
            "            channel, voucherheader, boundary," +
            "            collectiontype," +
            "            billdescription, expirydate, displaymessage, callbackforapportioning," +
            "            cancellationremarks)" +
            "    VALUES (:id, :tenantid, :demandid, :billid, :amount, :amountpaid, :fromperiod," +
            "            :toperiod, :additionaldetails," +
            "            :channel, :voucherheader, :boundary," +
            "            :collectiontype," +
            "            :billdescription, :expirydate, :displaymessage, :callbackforapportioning," +
            "            :cancellationremarks);";


    public static final String INSERT_BILLACCOUNTDETAIL_SQL = "INSERT INTO {schema}.egcl_billaccountdetail(" +
            "            id, tenantid, billdetailid, demanddetailid, " +
            "            \"order\", amount, adjustedamount, isactualdemand, taxheadcode, additionaldetails)" +
            "            VALUES (:id, :tenantid, :billdetailid, :demanddetailid, " +
            "            :order, :amount, :adjustedamount, :isactualdemand, :taxheadcode, :additionaldetails);";


    // Payment Status update queries

    public static final String STATUS_UPDATE_PAYMENT_SQL = "UPDATE {schema}.egcl_payment SET instrumentstatus=:instrumentstatus,additionaldetails=:additionaldetails," +
            " paymentstatus=:paymentstatus, lastmodifiedby=:lastmodifiedby,lastmodifiedtime=:lastmodifiedtime" +
            " WHERE id=:id;";

    public static final String STATUS_UPDATE_PAYMENTDETAIL_SQL = "UPDATE {schema}.egcl_paymentdetail SET  additionaldetails=:additionaldetails, lastmodifiedby=:lastmodifiedby, lastmodifiedtime=:lastmodifiedtime " +
            " WHERE id=:id;";

    public static final String STATUS_UPDATE_BILL_SQL = "UPDATE {schema}.egcl_bill " +
            "   SET  status= :status, iscancelled= :iscancelled, additionaldetails= :additionaldetails, lastmodifiedby= :lastmodifiedby, lastmodifiedtime=:lastmodifiedtime" +
            "   WHERE id=:id;";

    public static final String COPY_PAYMENT_SQL = "INSERT INTO {schema}.egcl_payment_audit SELECT * FROM {schema}.egcl_payment WHERE id = :id;";

    public static final String COPY_PAYMENTDETAIL_SQL = "INSERT INTO {schema}.egcl_paymentdetail_audit SELECT id, tenantid, paymentid, due, amountpaid, receiptnumber, "
    		+ "businessservice, billid, additionaldetails,  createdby, createdtime, lastmodifiedby, lastmodifiedtime, manualreceiptnumber, "
    		+ "manualreceiptdate, receiptdate, receipttype FROM {schema}.egcl_paymentdetail WHERE id = :id ;";

    public static final String COPY_BILL_SQL = "INSERT INTO {schema}.egcl_bill_audit SELECT * FROM egcl_bill WHERE id = :id;";

    public static final String COPY_BILLDETAIL_SQL = "INSERT INTO {schema}.egcl_billdetial_audit SELECT * FROM egcl_billdetial WHERE id = :id;";

    public static final String FILESTOREID_UPDATE_PAYMENT_SQL = "UPDATE {schema}.egcl_payment SET filestoreid=:filestoreid WHERE id=:id;";



    // Payment update queries

    public static final String UPDATE_PAYMENT_SQL = "UPDATE {schema}.egcl_payment SET additionaldetails=:additionaldetails, paidby=:paidby, payername=:payername," +
            " payeraddress=:payeraddress, payeremail=:payeremail, payerid=:payerid,paymentstatus=:paymentstatus, createdby=:createdby, createdtime=:createdtime," +
            " lastmodifiedby=:lastmodifiedby, lastmodifiedtime=:lastmodifiedtime WHERE id=:id ";

    public static final String UPDATE_PAYMENTDETAIL_SQL ="UPDATE {schema}.egcl_paymentdetail SET additionaldetails=:additionaldetails, createdby=:createdby," +
            "createdtime=:createdtime, lastmodifiedby=:lastmodifiedby, lastmodifiedtime=:lastmodifiedtime" +
            "WHERE id=:id;";

    public static final String UPDATE_BILL_SQL = "UPDATE {schema}.egcl_bill SET additionaldetails=:additionaldetails,createdby=:createdby,createdtime=:createdtime, lastmodifiedby=:lastmodifiedby,\n" +
            "lastmodifiedtime=:lastmodifiedtime WHERE id=:id;";

    public static final String UPDATE_BILLDETAIL_SQL = "UPDATE {schema}.egcl_billdetial SET additionaldetails=:additionaldetails, voucherheader=:voucherheader," +
            " manualreceiptnumber=:manualreceiptnumber, manualreceiptdate=:manualreceiptdate, billdescription=:billdescription,displaymessage=:displaymessage," +
            "createdby=:createdby, createdtime=:createdtime, lastmodifiedby=:lastmodifiedby,lastmodifiedtime=:lastmodifiedtime WHERE id=:id ";
    
    
	public static final String BILL_BASE_QUERY = "SELECT b.id AS b_id, b.tenantid AS b_tenantid, b.iscancelled AS b_iscancelled, b.businessservice AS b_businessservice, "
			+ "b.billnumber AS b_billnumber, b.billdate AS b_billdate, b.consumercode AS b_consumercode, b.createdby AS b_createdby, b.status as b_status, b.minimumamounttobepaid AS b_minimumamounttobepaid, "
			+ "b.totalamount AS b_totalamount, b.partpaymentallowed AS b_partpaymentallowed, b.isadvanceallowed as b_isadvanceallowed, "
			+ "b.collectionmodesnotallowed AS b_collectionmodesnotallowed, b.createdtime AS b_createdtime, b.lastmodifiedby AS b_lastmodifiedby, "
			+ "b.lastmodifiedtime AS b_lastmodifiedtime, bd.id AS bd_id, bd.billid AS bd_billid, bd.tenantid AS bd_tenantid, bd.demandid, "
			+ "bd.fromperiod, bd.toperiod, bd.billdescription AS bd_billdescription, bd.displaymessage AS bd_displaymessage, bd.amount AS bd_amount, bd.amountpaid AS bd_amountpaid, "
			+ "bd.callbackforapportioning AS bd_callbackforapportioning, bd.expirydate AS bd_expirydate, ad.id AS ad_id, ad.tenantid AS ad_tenantid, "
			+ "ad.billdetailid AS ad_billdetailid, ad.order AS ad_order, ad.amount AS ad_amount, ad.adjustedamount AS ad_adjustedamount, "
			+ "ad.taxheadcode AS ad_taxheadcode, ad.demanddetailid as ad_demanddetailid, ad.isactualdemand AS ad_isactualdemand, b.additionaldetails as b_additionaldetails,  "
			+ "bd.additionaldetails as bd_additionaldetails,  ad.additionaldetails as ad_additionaldetails "
			+ "FROM {schema}.egcl_bill b LEFT OUTER JOIN {schema}.egcl_billdetial bd ON b.id = bd.billid AND b.tenantid = bd.tenantid "
			+ "LEFT OUTER JOIN {schema}.egcl_billaccountdetail ad ON bd.id = ad.billdetailid AND bd.tenantid = ad.tenantid "
			+ "WHERE b.id IN (:id);"; 


	public static final String UPDATE_PAYMENT_BANKDETAIL_SQL = "UPDATE {schema}.egcl_payment SET additionaldetails = jsonb_set(additionaldetails, '{bankDetails}', :additionaldetails, true) WHERE length(additionaldetails :: text) is not null and length(additionaldetails :: text) > 4  and jsonb_typeof( additionaldetails ::jsonb ) ='object' and ifsccode=:ifsccode ";
	public static final String UPDATE_PAYMENT_BANKDETAIL_EMPTYADDTL_SQL = "UPDATE {schema}.egcl_payment SET additionaldetails = :additionaldetails ::jsonb WHERE (length(additionaldetails :: text) is null or length(additionaldetails :: text) = 4) and ifsccode=:ifsccode ";
	public static final String UPDATE_PAYMENT_BANKDETAIL_ARRAYADDTL_SQL = "UPDATE {schema}.egcl_payment SET additionaldetails =  additionaldetails || :additionaldetails ::jsonb WHERE length(additionaldetails :: text) is not null and length(additionaldetails :: text) > 4  and jsonb_typeof(additionaldetails ::jsonb) ='array' and ifsccode=:ifsccode ";
	
	public static String getBillQuery() {
		return BILL_BASE_QUERY;
	}
	
	
    public static MapSqlParameterSource getParametersForPaymentCreate(Payment payment) {
        MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();

        sqlParameterSource.addValue("id", payment.getId());
        sqlParameterSource.addValue("tenantid", payment.getTenantId());
        sqlParameterSource.addValue("totaldue", payment.getTotalDue());
        sqlParameterSource.addValue("totalamountpaid", payment.getTotalAmountPaid());
        sqlParameterSource.addValue("transactionnumber", payment.getTransactionNumber());
        sqlParameterSource.addValue("transactiondate", payment.getTransactionDate());
        sqlParameterSource.addValue("paymentmode", payment.getPaymentMode().toString());
        sqlParameterSource.addValue("instrumentdate", payment.getInstrumentDate());
        sqlParameterSource.addValue("instrumentnumber", payment.getInstrumentNumber());
        sqlParameterSource.addValue("instrumentStatus", payment.getInstrumentStatus().toString());
        sqlParameterSource.addValue("ifsccode", payment.getIfscCode());
        sqlParameterSource.addValue("additionaldetails", getJsonb(payment.getAdditionalDetails()));
        sqlParameterSource.addValue("paidby", payment.getPaidBy());
        sqlParameterSource.addValue("mobilenumber", payment.getMobileNumber());
        sqlParameterSource.addValue("payername", payment.getPayerName());
        sqlParameterSource.addValue("payeraddress", payment.getPayerAddress());
        sqlParameterSource.addValue("payeremail", payment.getPayerEmail());
        sqlParameterSource.addValue("payerid", payment.getPayerId());
        sqlParameterSource.addValue("paymentstatus", payment.getPaymentStatus().toString());
        sqlParameterSource.addValue("createdby", payment.getAuditDetails().getCreatedBy());
        sqlParameterSource.addValue("createdtime", payment.getAuditDetails().getCreatedTime());
        sqlParameterSource.addValue("lastmodifiedby", payment.getAuditDetails().getLastModifiedBy());
        sqlParameterSource.addValue("lastmodifiedtime", payment.getAuditDetails().getLastModifiedTime());

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
        sqlParameterSource.addValue("additionaldetails", getJsonb(paymentDetail.getAdditionalDetails()));
        sqlParameterSource.addValue("receiptdate", paymentDetail.getReceiptDate());
        sqlParameterSource.addValue("receipttype", paymentDetail.getReceiptType());
        sqlParameterSource.addValue("manualreceiptnumber", paymentDetail.getManualReceiptNumber());
        sqlParameterSource.addValue("manualreceiptdate", paymentDetail.getManualReceiptDate());
        sqlParameterSource.addValue("createdby", paymentDetail.getAuditDetails().getCreatedBy());
        sqlParameterSource.addValue("createdtime", paymentDetail.getAuditDetails().getCreatedTime());
        sqlParameterSource.addValue("lastmodifiedby", paymentDetail.getAuditDetails().getLastModifiedBy());
        sqlParameterSource.addValue("lastmodifiedtime", paymentDetail.getAuditDetails().getLastModifiedTime());

        return sqlParameterSource;

    }



    public static MapSqlParameterSource getParamtersForBillCreate(Bill bill){

        MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();

        sqlParameterSource.addValue("id", bill.getId());
        sqlParameterSource.addValue("status", bill.getStatus().toString());
        sqlParameterSource.addValue("iscancelled", bill.getIsCancelled());
        sqlParameterSource.addValue("additionaldetails",getJsonb(bill.getAdditionalDetails()));
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
        sqlParameterSource.addValue("reasonforcancellation", bill.getReasonForCancellation());
        sqlParameterSource.addValue("createdby", bill.getAuditDetails().getCreatedBy());
        sqlParameterSource.addValue("createdtime", bill.getAuditDetails().getCreatedTime());
        sqlParameterSource.addValue("lastmodifiedby", bill.getAuditDetails().getLastModifiedBy());
        sqlParameterSource.addValue("lastmodifiedtime", bill.getAuditDetails().getLastModifiedTime());

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
        sqlParameterSource.addValue("additionaldetails", getJsonb(billDetail.getAdditionalDetails()));
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
        sqlParameterSource.addValue("adjustedamount", billAccountDetail.getAdjustedAmount());
        sqlParameterSource.addValue("isactualdemand", billAccountDetail.getIsActualDemand());
        sqlParameterSource.addValue("taxheadcode", billAccountDetail.getTaxHeadCode());
        sqlParameterSource.addValue("additionaldetails", getJsonb(billAccountDetail.getAdditionalDetails()));

        return sqlParameterSource;
    }
    
    public String getPaymentCountQuery (String tenantId, String businessService, Map<String, Object> preparedStatementValues) {
    	
    	  StringBuilder selectQuery = new StringBuilder(SELECT_COUNT_PAYMENT_SQL);
    	  preparedStatementValues.put("businessservice", businessService);
    	  preparedStatementValues.put("tenantid", tenantId);
    	  
    	return selectQuery.toString();
    }


    public String getPaymentSearchQuery(List<String> ids,
                                               Map<String, Object> preparedStatementValues) {
        StringBuilder selectQuery = new StringBuilder(SELECT_PAYMENT_SQL);
        addClauseIfRequired(preparedStatementValues, selectQuery);
        selectQuery.append(" py.id IN (:id)  ");
        preparedStatementValues.put("id", ids);
        return addOrderByClause(selectQuery);
    }


    public String getPaymentSearchQueryForPlainSearch(PaymentSearchCriteria searchCriteria,
                                                             Map<String, Object> preparedStatementValues) {
        StringBuilder selectQuery = new StringBuilder(SELECT_PAYMENT_SQL);

        addWhereClauseForPlainSearch(selectQuery, preparedStatementValues, searchCriteria);


        return addOrderByClause(selectQuery);

    }



    public String getIdQuery(PaymentSearchCriteria searchCriteria, Map<String, Object> preparedStatementValues){
        StringBuilder whereClause = new StringBuilder();
        addWhereClause(whereClause, preparedStatementValues, searchCriteria);
        whereClause.append(" ORDER BY py_inner.transactiondate DESC ").toString();
        addPagination(whereClause,preparedStatementValues,searchCriteria);
        String query = ID_QUERY.replace("{{WHERE_CLAUSE}}",whereClause.toString());
        if(searchCriteria.getTenantId().split("\\.").length > 1){
            query = query.replace("{{operator}}", "=");
        }
        else
            query = query.replace("{{operator}}", "LIKE");

        return query;
    }

    private StringBuilder addWrapperQuery(StringBuilder builder){
        String wrapper = "select id from ( {{PLACEHOLDER}} ) t ORDER BY date DESC";
        wrapper = wrapper.replace("{{PLACEHOLDER}}", builder.toString());

        return new StringBuilder(wrapper);

    }


    private void addWhereClause(StringBuilder selectQuery, Map<String, Object> preparedStatementValues,
                                       PaymentSearchCriteria searchCriteria) {

        if (StringUtils.isNotBlank(searchCriteria.getTenantId())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            if(searchCriteria.getTenantId().split("\\.").length > configs.getStateLevelTenantIdLength()) {
                selectQuery.append(" py_inner.tenantId =:tenantId");
                preparedStatementValues.put("tenantId", searchCriteria.getTenantId());
            }
            else {
                selectQuery.append(" py_inner.tenantId LIKE :tenantId");
                preparedStatementValues.put("tenantId", searchCriteria.getTenantId() + "%");
            }

        }

        if(!CollectionUtils.isEmpty(searchCriteria.getIds())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" py_inner.id IN (:id)  ");
            preparedStatementValues.put("id", searchCriteria.getIds());
        }

        if (!CollectionUtils.isEmpty(searchCriteria.getStatus())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" UPPER(py_inner.paymentstatus) in (:status)");
            preparedStatementValues.put("status",
                    searchCriteria.getStatus()
                            .stream()
                            .map(String::toUpperCase)
                            .collect(toSet())
            );
        }

        if (!CollectionUtils.isEmpty(searchCriteria.getInstrumentStatus())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" UPPER(py_inner.instrumentStatus) in (:instrumentStatus)");
            preparedStatementValues.put("instrumentStatus",
                    searchCriteria.getInstrumentStatus()
                            .stream()
                            .map(String::toUpperCase)
                            .collect(toSet())
            );
        }

        if (!CollectionUtils.isEmpty(searchCriteria.getPaymentModes())) {

            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" UPPER(py_inner.paymentMode) in (:paymentMode)");
            preparedStatementValues.put("paymentMode",
                    searchCriteria.getPaymentModes()
                            .stream()
                            .map(String::toUpperCase)
                            .collect(toSet())
            );
        }

        if (StringUtils.isNotBlank(searchCriteria.getMobileNumber())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" py_inner.mobileNumber = :mobileNumber");
            preparedStatementValues.put("mobileNumber", searchCriteria.getMobileNumber());
        }

        if (StringUtils.isNotBlank(searchCriteria.getTransactionNumber())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" py_inner.transactionNumber = :transactionNumber");
            preparedStatementValues.put("transactionNumber", searchCriteria.getTransactionNumber());
        }

        if (searchCriteria.getFromDate() != null) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" py_inner.transactionDate >= :fromDate");
            preparedStatementValues.put("fromDate", searchCriteria.getFromDate());
        }

        if (searchCriteria.getToDate() != null) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" py_inner.transactionDate <= :toDate");
            Calendar c = Calendar.getInstance();
            c.setTime(new Date(searchCriteria.getToDate()));
            c.add(Calendar.DATE, 1);
            searchCriteria.setToDate(c.getTime().getTime());

            preparedStatementValues.put("toDate", searchCriteria.getToDate());
        }

        if (!CollectionUtils.isEmpty(searchCriteria.getPayerIds())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" py_inner.payerid IN (:payerid)  ");
            preparedStatementValues.put("payerid", searchCriteria.getPayerIds());
        }

        addPaymentDetailWhereClause(selectQuery, preparedStatementValues, searchCriteria);
        addBillWhereCluase(selectQuery, preparedStatementValues, searchCriteria);


/*        if (searchCriteria.getReceiptNumbers() != null && !searchCriteria.getReceiptNumbers().isEmpty()) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" pyd.receiptNumber IN (:receiptnumber)  ");
            preparedStatementValues.put("receiptnumber", searchCriteria.getReceiptNumbers());
        }

        if (!CollectionUtils.isEmpty(searchCriteria.getBusinessServices())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" pyd.businessService IN (:businessService)  ");
            preparedStatementValues.put("businessService", searchCriteria.getBusinessServices());
        }

        if (!CollectionUtils.isEmpty(searchCriteria.getBillIds())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" pyd.billid in (:billid)");
            preparedStatementValues.put("billid", searchCriteria.getBillIds());
        }

        if (!CollectionUtils.isEmpty(searchCriteria.getConsumerCodes())) {

            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" bill.consumerCode in (:consumerCodes)");
            preparedStatementValues.put("consumerCodes", searchCriteria.getConsumerCodes());
        }*/


    }


    private static void addPaymentDetailWhereClause(StringBuilder selectQuery, Map<String, Object> preparedStatementValues,
                                                    PaymentSearchCriteria searchCriteria){

        StringBuilder paymentDetailQuery = new StringBuilder(" id in (select pyd.paymentid from {schema}.egcl_paymentdetail as pyd ");
        Map<String, Object> paymentDetailPreparedStatementValues = new HashMap<>();

        if (!CollectionUtils.isEmpty(searchCriteria.getBusinessServices())) {
            addClauseIfRequired(paymentDetailPreparedStatementValues, paymentDetailQuery);
            paymentDetailQuery.append(" pyd.businessService IN (:businessService)  ");
            preparedStatementValues.put("businessService", searchCriteria.getBusinessServices());
            paymentDetailPreparedStatementValues.put("businessService", searchCriteria.getBusinessServices());
        }

        if (!CollectionUtils.isEmpty(searchCriteria.getBillIds())) {
            addClauseIfRequired(paymentDetailPreparedStatementValues, paymentDetailQuery);
            paymentDetailQuery.append(" pyd.billid in (:billid)");
            preparedStatementValues.put("billid", searchCriteria.getBillIds());
            paymentDetailPreparedStatementValues.put("billid", searchCriteria.getBillIds());
        }

        if (searchCriteria.getReceiptNumbers() != null && !searchCriteria.getReceiptNumbers().isEmpty()) {
            addClauseIfRequired(paymentDetailPreparedStatementValues, paymentDetailQuery);
            paymentDetailQuery.append(" pyd.receiptNumber IN (:receiptnumber)  ");
            preparedStatementValues.put("receiptnumber", searchCriteria.getReceiptNumbers());
            paymentDetailPreparedStatementValues.put("receiptnumber", searchCriteria.getReceiptNumbers());
        }

        if (!paymentDetailPreparedStatementValues.isEmpty()){
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(paymentDetailQuery).append(") ");
        }

    }



    private static void addBillWhereCluase(StringBuilder selectQuery, Map<String, Object> preparedStatementValues,
                                           PaymentSearchCriteria searchCriteria){
        if (!CollectionUtils.isEmpty(searchCriteria.getConsumerCodes())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" id in (select paymentid from {schema}.egcl_paymentdetail as pyd where pyd.billid in ( select id from {schema}.egcl_bill as bill where bill.consumercode in (:consumerCodes)) )" );
            preparedStatementValues.put("consumerCodes", searchCriteria.getConsumerCodes());
        }
    }

    /*
     * Wraps pagination around the base query
     * @param query The query for which pagination has to be done
     * @param preparedStmtList The object list to send the params
     * @param criteria The object containg the search params
     * @return Query with pagination
     */
    private void addPagination(StringBuilder query,Map<String, Object> preparedStatementValues,PaymentSearchCriteria criteria){
        int limit = configs.getDefaultLimit();
        int offset = 0;
        query.append(" OFFSET :offset ");
        query.append(" LIMIT :limit ");

        if(criteria.getLimit()!=null && criteria.getLimit()<= configs.getMaxSearchLimit())
            limit = criteria.getLimit();

        if(criteria.getLimit()!=null && criteria.getLimit()> configs.getMaxSearchLimit())
            limit = configs.getMaxSearchLimit();

        if(criteria.getOffset()!=null)
            offset = criteria.getOffset();

        preparedStatementValues.put("offset", offset);
        preparedStatementValues.put("limit", limit);

    }

    private static String addOrderByClause(StringBuilder selectQuery) {
        return selectQuery.append(" ORDER BY py.transactiondate DESC ").toString();

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
        sqlParameterSource.addValue("additionaldetails", getJsonb(bill.getAdditionalDetails()));
        sqlParameterSource.addValue("status", bill.getStatus().toString());
        sqlParameterSource.addValue("reasonforcancellation", bill.getReasonForCancellation());
        sqlParameterSource.addValue("lastmodifiedby", bill.getAuditDetails().getLastModifiedBy());
        sqlParameterSource.addValue("lastmodifiedtime", bill.getAuditDetails().getLastModifiedTime());

        return sqlParameterSource;
    }


    public static MapSqlParameterSource getParametersForPaymentDetailStatusUpdate(PaymentDetail paymentDetail) {
        MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();

        sqlParameterSource.addValue("id", paymentDetail.getId());
        sqlParameterSource.addValue("additionaldetails",getJsonb(paymentDetail.getAdditionalDetails()));
        sqlParameterSource.addValue("lastmodifiedby", paymentDetail.getAuditDetails().getLastModifiedBy());
        sqlParameterSource.addValue("lastmodifiedtime", paymentDetail.getAuditDetails().getLastModifiedTime());

        return sqlParameterSource;

    }


    public static MapSqlParameterSource getParametersForPaymentStatusUpdate(Payment payment) {
        MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();

        sqlParameterSource.addValue("id", payment.getId());
        sqlParameterSource.addValue("instrumentstatus", payment.getInstrumentStatus().toString());
        sqlParameterSource.addValue("paymentstatus", payment.getPaymentStatus().toString());
        sqlParameterSource.addValue("additionaldetails", getJsonb(payment.getAdditionalDetails()));
        sqlParameterSource.addValue("lastmodifiedby", payment.getAuditDetails().getLastModifiedBy());
        sqlParameterSource.addValue("lastmodifiedtime", payment.getAuditDetails().getLastModifiedTime());
        
        return sqlParameterSource;

    }



    // Payment update

    public static MapSqlParameterSource getParametersForPaymentUpdate(Payment payment) {
        MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();

        sqlParameterSource.addValue("id", payment.getId());
        sqlParameterSource.addValue("paidby", payment.getPaidBy());
        sqlParameterSource.addValue("payeraddress", payment.getPayerAddress());
        sqlParameterSource.addValue("payeremail", payment.getPayerEmail());
        sqlParameterSource.addValue("payername", payment.getPayerName());
        sqlParameterSource.addValue("additionalDetails", getJsonb(payment.getAdditionalDetails()));
        sqlParameterSource.addValue("lastmodifiedby", payment.getAuditDetails().getLastModifiedBy());
        sqlParameterSource.addValue("lastmodifiedtime", payment.getAuditDetails().getLastModifiedTime());


        return sqlParameterSource;

    }


    public static MapSqlParameterSource getParametersForPaymentDetailUpdate(PaymentDetail paymentDetail) {
        MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();

        sqlParameterSource.addValue("id", paymentDetail.getId());
        sqlParameterSource.addValue("additionalDetails", getJsonb(paymentDetail.getAdditionalDetails()));
        sqlParameterSource.addValue("lastmodifiedby", paymentDetail.getAuditDetails().getLastModifiedBy());
        sqlParameterSource.addValue("lastmodifiedtime", paymentDetail.getAuditDetails().getLastModifiedTime());

        return sqlParameterSource;

    }


    public static MapSqlParameterSource getParamtersForBillUpdate(Bill bill){

        MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();

        sqlParameterSource.addValue("id", bill.getId());
        sqlParameterSource.addValue("additionaldetails", getJsonb(bill.getAdditionalDetails()) );
        sqlParameterSource.addValue("createdby", bill.getAuditDetails().getCreatedBy());
        sqlParameterSource.addValue("createdtime", bill.getAuditDetails().getCreatedTime());
        sqlParameterSource.addValue("lastmodifiedby", bill.getAuditDetails().getLastModifiedBy());
        sqlParameterSource.addValue("lastmodifiedtime", bill.getAuditDetails().getLastModifiedTime());

        return sqlParameterSource;
    }


    public static MapSqlParameterSource getParamtersForBillDetailUpdate(BillDetail billDetail) {

        MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();
        sqlParameterSource.addValue("id", billDetail.getId());
        sqlParameterSource.addValue("additionaldetails", getJsonb(billDetail.getAdditionalDetails()));
        sqlParameterSource.addValue("voucherheader", billDetail.getVoucherHeader());
        sqlParameterSource.addValue("manualreceiptnumber", billDetail.getManualReceiptNumber());
        sqlParameterSource.addValue("manualreceiptdate", billDetail.getManualReceiptDate());
        sqlParameterSource.addValue("billdescription", billDetail.getBillDescription());
        sqlParameterSource.addValue("displaymessage", billDetail.getDisplayMessage());
        sqlParameterSource.addValue("createdby", billDetail.getAuditDetails().getCreatedBy());
        sqlParameterSource.addValue("createdtime", billDetail.getAuditDetails().getCreatedTime());
        sqlParameterSource.addValue("lastmodifiedby", billDetail.getAuditDetails().getLastModifiedBy());
        sqlParameterSource.addValue("lastmodifiedtime", billDetail.getAuditDetails().getLastModifiedTime());

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

    private void addWhereClauseForPlainSearch(StringBuilder selectQuery, Map<String, Object> preparedStatementValues,
                                       PaymentSearchCriteria searchCriteria) {

        if (StringUtils.isNotBlank(searchCriteria.getTenantId())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            if(searchCriteria.getTenantId().split("\\.").length > configs.getStateLevelTenantIdLength()) {
                selectQuery.append(" py.tenantId =:tenantId");
                preparedStatementValues.put("tenantId", searchCriteria.getTenantId());
            }
            else {
                selectQuery.append(" py.tenantId LIKE :tenantId");
                preparedStatementValues.put("tenantId", searchCriteria.getTenantId() + "%");
            }

        }

        if(!CollectionUtils.isEmpty(searchCriteria.getIds())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" py.id IN (:id)  ");
            preparedStatementValues.put("id", searchCriteria.getIds());
        }

        if (!CollectionUtils.isEmpty(searchCriteria.getStatus())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" UPPER(py.paymentstatus) in (:status)");
            preparedStatementValues.put("status",
                    searchCriteria.getStatus()
                            .stream()
                            .map(String::toUpperCase)
                            .collect(toSet())
            );
        }

        if (!CollectionUtils.isEmpty(searchCriteria.getInstrumentStatus())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" UPPER(py.instrumentStatus) in (:instrumentStatus)");
            preparedStatementValues.put("instrumentStatus",
                    searchCriteria.getInstrumentStatus()
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

        if (!CollectionUtils.isEmpty(searchCriteria.getPayerIds())) {
            addClauseIfRequired(preparedStatementValues, selectQuery);
            selectQuery.append(" py.payerid IN (:payerid)  ");
            preparedStatementValues.put("payerid", searchCriteria.getPayerIds());
        }

        addPaymentDetailWhereClause(selectQuery, preparedStatementValues, searchCriteria);
        addBillWhereCluase(selectQuery, preparedStatementValues, searchCriteria);

    }


	public static MapSqlParameterSource getParametersForBankDetailUpdate(JsonNode additionalDetails, String ifsccode) {
		MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();
		sqlParameterSource.addValue("additionaldetails", getJsonb(additionalDetails));
		sqlParameterSource.addValue("ifsccode", ifsccode);
		return sqlParameterSource;

	}

	public static MapSqlParameterSource getParametersEmptyDtlBankDetailUpdate(JsonNode additionalDetails,
			String ifsccode) {
		MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();
		ObjectMapper mapper = new ObjectMapper();
		ObjectNode objectNode = mapper.createObjectNode();
		objectNode.set("bankDetails", additionalDetails);
		sqlParameterSource.addValue("additionaldetails", getJsonb(objectNode));
		sqlParameterSource.addValue("ifsccode", ifsccode);
		return sqlParameterSource;

	}







}