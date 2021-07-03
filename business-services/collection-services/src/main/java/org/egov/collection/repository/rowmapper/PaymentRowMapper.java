package org.egov.collection.repository.rowmapper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.collection.model.AuditDetails;
import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentDetail;
import org.egov.collection.model.enums.CollectionType;
import org.egov.collection.model.enums.InstrumentStatusEnum;
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

        Payment currentPayment;

        while (rs.next()){

            String id = rs.getString("py_id");

            if(idToPaymentMap.get(id) != null)
                currentPayment = idToPaymentMap.get(id);
            else{

                String tenantId = rs.getString("py_tenantId");
                BigDecimal totalDue = rs.getBigDecimal("totalDue");
                BigDecimal totalAmountPaid = rs.getBigDecimal("py_totalAmountPaid");
                String transactionNumber = rs.getString("transactionNumber");
                Long transactionDate = rs.getLong("transactionDate");
                String paymentMode = rs.getString("paymentMode");

                Long instrumentDate = rs.getLong("instrumentDate");
                if(rs.wasNull()){instrumentDate = null;}

                String instrumentNumber = rs.getString("instrumentNumber");
                String instrumentStatus = rs.getString("instrumentStatus");
                String ifscCode = rs.getString("ifscCode");
                String paidBy = rs.getString("paidBy");
                String mobileNumber = rs.getString("mobileNumber");
                String payerName = rs.getString("payerName");
                String payerAddress = rs.getString("payerAddress");
                String payerEmail = rs.getString("payerEmail");
                String payerId = rs.getString("payerId");
                String paymentStatus = rs.getString("paymentStatus");
                String filesoreId = rs.getString("filestoreid");
                String createdBy = rs.getString("py_createdBy");

                Long createdDate = rs.getLong("py_createdTime");
                if(rs.wasNull()){createdDate = null;}

                String lastModifiedBy = rs.getString("py_lastModifiedBy");

                Long lastModifiedTime = rs.getLong("py_lastModifiedTime");
                if(rs.wasNull()){lastModifiedTime = null;}


                AuditDetails auditDetails = AuditDetails.builder().createdBy(createdBy).createdTime(createdDate)
                        .lastModifiedBy(lastModifiedBy).lastModifiedTime(lastModifiedTime).build();

                currentPayment = Payment.builder()
                        .id(id)
                        .tenantId(tenantId)
                        .totalDue(totalDue)
                        .totalAmountPaid(totalAmountPaid)
                        .transactionNumber(transactionNumber)
                        .transactionDate(transactionDate)
                        .paymentMode(PaymentModeEnum.fromValue(paymentMode))
                        .instrumentDate(instrumentDate)
                        .instrumentNumber(instrumentNumber)
                        .instrumentStatus(InstrumentStatusEnum.fromValue(instrumentStatus))
                        .ifscCode(ifscCode)
                        .paidBy(paidBy)
                        .mobileNumber(mobileNumber)
                        .payerName(payerName)
                        .payerAddress(payerAddress)
                        .payerEmail(payerEmail)
                        .payerId(payerId)
                        .paymentStatus(PaymentStatusEnum.fromValue(paymentStatus))
                        .fileStoreId(filesoreId)
                        .auditDetails(auditDetails)
                        .build();


                PGobject obj = (PGobject) rs.getObject("py_additionalDetails");
                currentPayment.setAdditionalDetails(getJsonValue(obj));
                idToPaymentMap.put(currentPayment.getId(),currentPayment);
            }

            addChildrenToPayment(rs,currentPayment);

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

        if(paymentDetail == null){

            String id = rs.getString("pyd_id");
            String tenantId = rs.getString("pyd_tenantId");
            BigDecimal due  = rs.getBigDecimal("due");
            BigDecimal amountPaid = rs.getBigDecimal("amountPaid");
            String receiptNumber = rs.getString("receiptNumber");
            Long receiptDate = rs.getLong("receiptdate");
            String receiptType = rs.getString("receipttype");
            String businessService = rs.getString("businessService");
            String manualReceiptNo = rs.getString("manualreceiptnumber");
            Long manualReceiptDate = rs.getLong("manualreceiptdate");
            String billId = rs.getString("billId");
            PGobject obj = (PGobject) rs.getObject("pyd_additionalDetails");
            String createdBy = rs.getString("pyd_createdBy");
            Long createdTime =  rs.getLong("pyd_createdTime");
            String lastModifiedBy = rs.getString("pyd_lastModifiedBy");
            Long lastModifiedTime = rs.getLong("pyd_lastModifiedTime");

            AuditDetails auditDetails = AuditDetails.builder().createdBy(createdBy).createdTime(createdTime)
                    .lastModifiedBy(lastModifiedBy).lastModifiedTime(lastModifiedTime).build();

            paymentDetail = PaymentDetail.builder()
                    .id(id)
                    .tenantId(tenantId)
                    .totalDue(due)
                    .totalAmountPaid(amountPaid)
                    .receiptNumber(receiptNumber)
                    .businessService(businessService)
                    .billId(billId)
                    .receiptDate(receiptDate)
                    .manualReceiptDate(manualReceiptDate)
                    .manualReceiptNumber(manualReceiptNo)
                    .receiptType(receiptType)
                    .additionalDetails(getJsonValue(obj))

                    .auditDetails(auditDetails)
                    .build();

            /*Long billDate = rs.getLong("billdate");
            if(rs.wasNull()){billDate = null;}

            AuditDetails billAuditDetails = AuditDetails.builder().createdBy(rs.getString("bill_createdby"))
                    .createdTime(rs.getLong("bill_createdTime"))
                    .lastModifiedBy("bill_lastmodifiedby")
                    .lastModifiedTime(rs.getLong("bill_lastModifiedTime"))
                    .build();*/

            /*List<String> collectionModesAllowedList = new LinkedList<>();
            if(null != rs.getString("collectionmodesnotallowed")) {
                String[] collectionModesAllowed = rs.getString("collectionmodesnotallowed").split(",");
                if(collectionModesAllowed.length!=0)
                    collectionModesAllowedList = Arrays.asList(collectionModesAllowed);
            }*/

            // PGobject billAdditionalObj = (PGobject) rs.getObject("bill_additionalDetails");




            payment.addpaymentDetailsItem(paymentDetail);
        }

        /*PGobject billAccountDetailAdditionalObj = (PGobject) rs.getObject("bacdt_additionalDetails");

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
                .amount(rs.getBigDecimal("bacdt_amount"))
                .adjustedAmount(rs.getBigDecimal("bacdt_adjustedamount"))
                .additionalDetails(getJsonValue(billAccountDetailAdditionalObj))
                .build();


        PGobject billDetailAdditionalObj = (PGobject) rs.getObject("bd_additionalDetails");

        BillDetail billDetail = BillDetail.builder()
                .id(rs.getString("bd_id"))
                .tenantId(rs.getString("bd_tenantid"))
                .demandId(rs.getString("demandid"))
                .billId(rs.getString("billid"))
                .amount(rs.getBigDecimal("amount"))
                .amountPaid(rs.getBigDecimal("amountpaid"))
                .fromPeriod(rs.getLong("fromperiod"))
                .toPeriod(rs.getLong("toperiod"))
                .additionalDetails(getJsonValue(billDetailAdditionalObj))
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
                .build();

        // Adding to Bill
        billDetail.addBillAccountDetail(billAccountDetail);
        paymentDetail.getBill().addBillDetail(billDetail);*/


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
