package org.egov.collection.repository.querybuilder;

import org.apache.commons.lang3.StringUtils;
import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentDetail;
import org.egov.collection.web.contract.Bill;
import org.egov.collection.web.contract.BillAccountDetail;
import org.egov.collection.web.contract.BillDetail;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Service;

@Service
public class PaymentQueryBuilder {


    public static final String INSERT_PAYMENT_SQL = "INSERT INTO egcl_payment(" +
            "            id, tenantid, totaldue, totalamountpaid, transactionnumber, transactiondate, " +
            "            paymentmode, instrumentdate, instrumentnumber, ifsccode, additionaldetails, " +
            "            paidby, mobilenumber, payername, payeraddress, payeremail, payerid, " +
            "            paymentstatus, createdby, createddate, lastmodifiedby, lastmodifieddate)" +
            "            VALUES (:id, :tenantid, :totaldue, :totalamountpaid, :transactionnumber, :transactiondate, " +
            "            :paymentmode, :instrumentdate, :instrumentnumber, :ifsccode, :additionaldetails," +
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
            "            createdby, createddate, lastmodifiedby, lastmodifieddate)" +
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
        sqlParameterSource.addValue("paymentdetailstatus", paymentDetail.getPaymentDetailStatus());
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
        sqlParameterSource.addValue("reasonforcancellation", billDetail.getReasonForCancellation());
        sqlParameterSource.addValue("manualreceiptnumber", billDetail.getManualReceiptNumber());
        sqlParameterSource.addValue("manualreceiptdate", billDetail.getManualReceiptDate());
        sqlParameterSource.addValue("status", billDetail.getStatus());
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










}
