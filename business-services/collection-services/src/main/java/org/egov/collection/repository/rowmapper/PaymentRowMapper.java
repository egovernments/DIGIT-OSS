package org.egov.collection.repository.rowmapper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.collection.model.AuditDetails;
import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentDetail;
import org.egov.collection.model.enums.PaymentDetailStatusEnum;
import org.egov.collection.model.enums.PaymentModeEnum;
import org.egov.collection.model.enums.PaymentStatusEnum;
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

                String tenantId = rs.getString("tenantId");
                BigDecimal totalDue = rs.getBigDecimal("totalDue");
                BigDecimal totalAmountPaid = rs.getBigDecimal("totalAmountPaid");
                String transactionNumber = rs.getString("transactionNumber");
                Long transactionDate = rs.getLong("transactionDate");
                String paymentMode = rs.getString("paymentMode");

                Long instrumentDate = rs.getLong("instrumentDate");
                if(rs.wasNull()){instrumentDate = null;}

                String instrumentNumber = rs.getString("instrumentNumber");
                String ifscCode = rs.getString("");
                String paidBy = rs.getString("paidBy");
                String mobileNumber = rs.getString("mobileNumber");
                String payerName = rs.getString("payerName");
                String payerAddress = rs.getString("payerAddress");
                String payerEmail = rs.getString("payerEmail");
                String payerId = rs.getString("payerId");
                String paymentStatus = rs.getString("paymentStatus");
                String createdBy = rs.getString("createdBy");

                Long createdDate = rs.getLong("createdDate");
                if(rs.wasNull()){createdDate = null;}

                String lastModifiedBy = rs.getString("lastModifiedBy");

                Long lastModifiedDate = rs.getLong("lastModifiedDate");
                if(rs.wasNull()){lastModifiedDate = null;}


                AuditDetails auditDetails = AuditDetails.builder().createdBy(createdBy).createdDate(createdDate)
                        .lastModifiedBy(lastModifiedBy).lastModifiedDate(lastModifiedDate).build();

                Payment currentPayment = Payment.builder().id(id)
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
            String createdBy = rs.getString("createdBy");
            Long createdDate =  rs.getLong("createdDate");
            String lastModifiedBy = rs.getString("lastModifiedBy");
            Long lastModifiedDate = rs.getLong("lastModifiedDate");

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
                    .additionalDetails(obj)
                    .paymentDetailStatus(PaymentDetailStatusEnum.fromValue(paymentDetailStatus))
                    .auditDetails(auditDetails)
                    .build();

            payment.addpaymentDetailsItem(paymentDetail);
        }




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
