package org.egov.collection.repository.querybuilder;

import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentDetail;
import org.egov.collection.web.contract.BillAccountDetail;
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


    public static final String INSERT_PAYMENT_TAXHEAD_SQL = "INSERT INTO egcl_payment_taxhead(" +
            "            id, tenantid, paymentdetailid, billdetailid, demanddetailid, " +
            "            \"order\", amount, isactualdemand, taxheadcode, additionaldetails, " +
            "            createdby, createddate, lastmodifiedby, lastmodifieddate)" +
            "            VALUES (:id, :tenantid, :paymentdetailid, :billdetailid, :demanddetailid, " +
            "            :order, :amount, :isactualdemand, :taxheadcode, :additionaldetails," +
            "            :createdby, :createddate, :lastmodifiedby, :lastmodifieddate);";



    public static MapSqlParameterSource getParametersForPaymentTaxHeadCreate(String paymentDetailId, BillAccountDetail billAccountDetail) {
        MapSqlParameterSource sqlParameterSource = new MapSqlParameterSource();

        sqlParameterSource.addValue("id", billAccountDetail.getId());
        sqlParameterSource.addValue("tenantid", billAccountDetail.getTenantId());
        sqlParameterSource.addValue("paymentdetailid", paymentDetailId);
        sqlParameterSource.addValue("billdetailid", billAccountDetail.getBillDetail());
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







    }
