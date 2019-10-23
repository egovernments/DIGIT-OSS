package org.egov.collection.repository.rowmapper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.collection.model.AuditDetails;
import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentDetail;
import org.egov.collection.model.enums.CollectionType;
import org.egov.collection.model.enums.PaymentModeEnum;
import org.egov.collection.model.enums.PaymentStatusEnum;
import org.egov.collection.web.contract.Bill;
import org.egov.collection.web.contract.BillAccountDetail;
import org.egov.collection.web.contract.BillDetail;
import org.egov.tracer.model.CustomException;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

@Service
public class PaymentRowMapper implements ResultSetExtractor<List<Payment>> {


    @Autowired
    private ObjectMapper mapper;

    @Override
    public List<Payment> extractData(ResultSet rs) throws SQLException, DataAccessException {


        Map<String,Payment> idToPaymentMap = new HashMap<>();

        while (rs.next()){

            String id = rs.getString("py_id");

            if(idToPaymentMap.get(id)==null){

                String tenantId = rs.getString("py_tenantId");
                BigDecimal totalDue = rs.getBigDecimal("totalDue");
                BigDecimal totalAmountPaid = rs.getBigDecimal("py_totalAmountPaid");
                String transactionNumber = rs.getString("transactionNumber");
                Long transactionDate = rs.getLong("transactionDate");
                String paymentMode = rs.getString("paymentMode");

                Long instrumentDate = rs.getLong("instrumentDate");
                if(rs.wasNull()){instrumentDate = null;}

                String instrumentNumber = rs.getString("instrumentNumber");
                String ifscCode = rs.getString("ifscCode");
                String paidBy = rs.getString("paidBy");
                String mobileNumber = rs.getString("mobileNumber");
                String payerName = rs.getString("payerName");
                String payerAddress = rs.getString("payerAddress");
                String payerEmail = rs.getString("payerEmail");
                String payerId = rs.getString("payerId");
                String paymentStatus = rs.getString("paymentStatus");
                String createdBy = rs.getString("py_createdBy");

                Long createdDate = rs.getLong("py_createdDate");
                if(rs.wasNull()){createdDate = null;}

                String lastModifiedBy = rs.getString("py_lastModifiedBy");

                Long lastModifiedDate = rs.getLong("py_lastModifiedDate");
                if(rs.wasNull()){lastModifiedDate = null;}


                AuditDetails auditDetails = AuditDetails.builder().createdBy(createdBy).createdDate(createdDate)
                        .lastModifiedBy(lastModifiedBy).lastModifiedDate(lastModifiedDate).build();

                Payment currentPayment = Payment.builder()
                        .id(id)
                        .tenantId(tenantId)
                        .totalDue(totalDue)
                        .totalAmountPaid(totalAmountPaid)
                        .transactionNumber(transactionNumber)
                        .transactionDate(transactionDate)
                        .paymentMode(PaymentModeEnum.fromValue(paymentMode))
                        .instrumentDate(instrumentDate)
                        .instrumentNumber(instrumentNumber)
                        .ifscCode(ifscCode)
                        .paidBy(paidBy)
                        .mobileNumber(mobileNumber)
                        .payerName(payerName)
                        .payerAddress(payerAddress)
                        .payerEmail(payerEmail)
                        .payerId(payerId)
                        .paymentStatus(PaymentStatusEnum.fromValue(paymentStatus))
                        .auditDetails(auditDetails)
                        .build();


                PGobject obj = (PGobject) rs.getObject("py_additionalDetails");
                currentPayment.setAdditionalDetails(getJsonValue(obj));
            }

        }

        return new ArrayList<>(idToPaymentMap.values());
    }




    private void addChildrenToPayment(ResultSet rs, Payment payment) throws SQLException{

        PaymentDetail paymentDetail = null;

        String paymentDetailId = rs.getString("pyd_id");

        if(!CollectionUtils.isEmpty(payment.getPaymentDetails())){
            for(PaymentDetail detail : payment.getPaymentDetails()){
                if(detail.getId().equalsIgnoreCase(paymentDetailId)){
                    paymentDetail = detail;
                    break;
                }
            }
        }

        if(paymentDetail==null){

            String id = rs.getString("pyd_id");
            String tenantId = rs.getString("pyd_tenantId");
            BigDecimal due  = rs.getBigDecimal("due");
            BigDecimal amountPaid = rs.getBigDecimal("amountPaid");
            String receiptNumber = rs.getString("receiptNumber");
            String businessService = rs.getString("businessService");
            String billId = rs.getString("billId");
            String paymentDetailStatus = rs.getString("paymentDetailStatus");
            PGobject obj = (PGobject) rs.getObject("pyd_additionalDetails");
            String createdBy = rs.getString("pyd_createdBy");
            Long createdDate =  rs.getLong("pyd_createdDate");
            String lastModifiedBy = rs.getString("pyd_lastModifiedBy");
            Long lastModifiedDate = rs.getLong("pyd_lastModifiedDate");

            AuditDetails auditDetails = AuditDetails.builder().createdBy(createdBy).createdDate(createdDate)
                    .lastModifiedBy(lastModifiedBy).lastModifiedDate(lastModifiedDate).build();

            paymentDetail = PaymentDetail.builder()
                    .id(id)
                    .tenantId(tenantId)
                    .totalDue(due)
                    .totalAmountPaid(amountPaid)
                    .receiptNumber(receiptNumber)
                    .businessService(businessService)
                    .billId(billId)
                    .additionalDetails(getJsonValue(obj))
                    .auditDetails(auditDetails)
                    .build();

            Long billDate = rs.getLong("billdate");
            if(rs.wasNull()){billDate = null;}

            AuditDetails billAuditDetails = AuditDetails.builder().createdBy(rs.getString("bill_createdby"))
                    .createdDate(rs.getLong("bill_createddate"))
                    .lastModifiedBy("bill_lastmodifiedby")
                    .lastModifiedDate(rs.getLong("bill_lastmodifieddate"))
                    .build();

            String[] collectionModesAllowed = rs.getString("collectionmodesnotallowed").split(",");
            List<String> collectionModesAllowedList = new LinkedList<>();
            if(collectionModesAllowed.length!=0)
                collectionModesAllowedList = Arrays.asList(collectionModesAllowed);

            PGobject billAdditionalObj = (PGobject) rs.getObject("bill_additionalDetails");


            Bill bill = Bill.builder().id(rs.getString("bill_id"))
            .status(Bill.StatusEnum.fromValue(rs.getString("bill_status")))
            .isCancelled(rs.getBoolean("iscancelled"))
            .tenantId(rs.getString("bill_tenantid"))
            .collectionModesNotAllowed(collectionModesAllowedList)
            .partPaymentAllowed(rs.getBoolean("partpaymentallowed"))
            .isAdvanceAllowed(rs.getBoolean("isadvanceallowed"))
            .minimumAmountToBePaid(rs.getBigDecimal("minimumamounttobepaid"))
            .reasonForCancellation(rs.getString("reasonforcancellation"))
            .businessService(rs.getString("businessservice"))
            .totalAmount(rs.getBigDecimal("bill_totalamount"))
            .consumerCode(rs.getString("consumercode"))
            .billNumber(rs.getString("billnumber"))
            .billDate(billDate)
            .auditDetails(billAuditDetails)
            .additionalDetails(getJsonValue(billAdditionalObj))
            .build();

            paymentDetail.setBill(bill);
            payment.addpaymentDetailsItem(paymentDetail);
        }


        // BillAccountDetail
        AuditDetails billAccountDetailAudit = AuditDetails.builder()
                .createdBy(rs.getString("bacdt_createdby")).createdDate(rs.getLong("bacdt_createddate"))
                .lastModifiedBy(rs.getString("bacdt_lastmodifiedby")).lastModifiedDate(rs.getLong("bacdt_lastmodifieddate")).build();

        PGobject billAccountDetailAdditionalObj = (PGobject) rs.getObject("bacdt_additionalDetails");

        Integer order = rs.getInt("order");
        if(rs.wasNull()){order = null;}

        BillAccountDetail billAccountDetail = BillAccountDetail.builder()
                .id(rs.getString("bacdt_id"))
                .tenantId(rs.getString("bacdt_tenantid"))
                .billDetailId(rs.getString("billdetailid"))
                .demandDetailId(rs.getString("demanddetailid"))
                .order(order)
                .isActualDemand(rs.getBoolean("isactualdemand"))
                .taxHeadCode(rs.getString("taxheadcode"))
                .additionalDetails(getJsonValue(billAccountDetailAdditionalObj))
                .auditDetails(billAccountDetailAudit)
                .build();



        // BillDetail
        AuditDetails billDetailAuditDetials = AuditDetails.builder()
                .createdBy(rs.getString("bd_createdby")).createdDate(rs.getLong("bd_createddate"))
                .lastModifiedBy(rs.getString("bd_lastmodifiedby")).lastModifiedDate(rs.getLong("bd_lastmodifieddate"))
                .build();

        PGobject billDetailAdditionalObj = (PGobject) rs.getObject("billdetail_additionalDetails");

        BillDetail billDetail = BillDetail.builder()
                .id(rs.getString("bd_id"))
                .tenantId(rs.getString("bd_tenantid"))
                .demandId(rs.getString("demandid"))
                .billId(rs.getString("billid"))
                .amount(rs.getBigDecimal("amount"))
                .amountPaid(rs.getBigDecimal("amountpaid"))
                .fromPeriod(rs.getLong("fromperiod"))
                .toPeriod(rs.getLong("toperiod"))
                .collectedAmount(rs.getBigDecimal("collectedamount"))
                .additionalDetails(getJsonValue(billDetailAdditionalObj))
                .receiptDate(rs.getLong("receiptdate"))
                .receiptType(rs.getString("receipttype"))
                .channel(rs.getString("channel"))
                .voucherHeader(rs.getString("voucherheader"))
                .boundary(rs.getString("boundary"))
                .manualReceiptNumber(rs.getString("manualreceiptnumber"))
                .manualReceiptDate(rs.getLong("manualreceiptdate"))
                .collectionType(CollectionType.fromValue(rs.getString("collectiontype")))
                .billDescription(rs.getString("billdescription"))
                .expiryDate(rs.getLong("expirydate"))
                .displayMessage(rs.getString("displaymessage"))
                .callBackForApportioning(rs.getBoolean("callbackforapportioning"))
                .cancellationRemarks(rs.getString("cancellationremarks"))
                .auditDetails(billDetailAuditDetials)
                .build();

        // Adding to Bill
        billDetail.addBillAccountDetail(billAccountDetail);
        paymentDetail.getBill().addBillDetail(billDetail);


    }






    private JsonNode getJsonValue(PGobject pGobject){
        try {
            if(Objects.isNull(pGobject) || Objects.isNull(pGobject.getValue()))
                return null;
            else
                return mapper.readTree( pGobject.getValue());
        } catch (IOException e) {
            throw new CustomException("SERVER_ERROR","Exception occurred while parsing the additionalDetail json : "+ e
                    .getMessage());
        }
    }







    }
