package org.egov.collection.util;

import lombok.extern.slf4j.Slf4j;
import org.egov.collection.model.AuditDetails;
import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentDetail;
import org.egov.collection.model.PaymentRequest;
import org.egov.collection.model.enums.InstrumentStatusEnum;
import org.egov.collection.model.enums.PaymentStatusEnum;
import org.egov.collection.model.enums.Purpose;
import org.egov.collection.repository.BillingServiceRepository;
import org.egov.collection.repository.IdGenRepository;
import org.egov.collection.web.contract.Bill;
import org.egov.tracer.model.CustomException;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;
import static org.egov.collection.model.enums.InstrumentTypesEnum.CARD;
import static org.egov.collection.model.enums.InstrumentTypesEnum.CASH;
import static org.egov.collection.model.enums.InstrumentTypesEnum.ONLINE;

@Component
@Slf4j
public class PaymentEnricher {


    private BillingServiceRepository billingRepository;

    private IdGenRepository idGenRepository;










    public void enrichPaymentPreValidate(PaymentRequest paymentRequest) {

        Payment payment = paymentRequest.getPayment();
        List<String> billIds = payment.getPaymentDetails().stream().map(PaymentDetail::getBillId).collect(Collectors.toList());

        AuditDetails auditDetails = AuditDetails.builder().createdBy(paymentRequest.getRequestInfo().getUserInfo().getId
                ().toString()).createdDate(System.currentTimeMillis()).lastModifiedBy(paymentRequest.getRequestInfo().getUserInfo().getId
                ().toString()).lastModifiedDate(System.currentTimeMillis()).build();

        if (isNull(paymentRequest.getRequestInfo().getUserInfo()) || isNull(paymentRequest.getRequestInfo().getUserInfo()
                .getId())) {
            throw new CustomException("USER_INFO_INVALID", "Invalid user info in request info, user id is mandatory");
        }

        List<Bill> validatedBills = billingRepository.fetchBill(paymentRequest.getRequestInfo(), payment.getTenantId(), billIds);

        Map<String,Bill> billIdToBillMap = new HashMap<>();

        Map<String,String> errorMap = new HashMap<>();

        // If the bills is non-empty list payer info is added to the bil
        if(CollectionUtils.isEmpty(validatedBills))
            errorMap.put("INVALID_BILL_ID", "Bill ID provided does not exist or is in an invalid state");
        else
            validatedBills.forEach(bill -> {
                billIdToBillMap.put(bill.getId(), bill);
                if (CollectionUtils.isEmpty(bill.getBillDetails())) {
                    log.error("Bill ID provided does not exist or is in an invalid state " + bill.getId());
                    errorMap.put("INVALID_BILL_ID", "Bill ID provided does not exist or is in an invalid state");
                }
                else {
                    bill.setPaidBy(payment.getPaidBy());
                    bill.setPayerName(payment.getPayerName());
                    bill.setMobileNumber(payment.getMobileNumber());
                    bill.setPayerAddress(payment.getPayerAddress());
                }
            });

        // Assigns bill object to each paymentDetail if no  bill object is found the billId from paymentDetail is added in error map
        payment.getPaymentDetails().forEach(paymentDetail -> {
            if(billIdToBillMap.get(paymentDetail.getBillId())==null)
                errorMap.put("INVALID PAYMENTDETAIL","No bill found for the bill id: "+paymentDetail.getBillId());
            else {
                validatePaymentDetailAgainstBill(payment.getPaymentMode().toString(),billIdToBillMap.get(paymentDetail.getBillId()),paymentDetail,errorMap);
                paymentDetail.setBill(billIdToBillMap.get(paymentDetail.getBillId()));
                paymentDetail.setId(UUID.randomUUID().toString());
            }
        });

        if(!errorMap.isEmpty())
            throw new CustomException(errorMap);

        payment.setAuditDetails(auditDetails);

    }



    /**
     * Enrich instrument for financials
     * For each bill detail,
     * - Set status to approved by default for now, no workflow
     * - Set collection type to online or counter
     * - Set receipt date
     * - Generate and set receipt number
     *
     * @param paymentRequest paymentRequest to be enriched
     */
    public void enrichPaymentPostValidate(PaymentRequest paymentRequest) {
        Payment payment = paymentRequest.getPayment();
        List<PaymentDetail> paymentDetails = payment.getPaymentDetails();
        String paymentMode = payment.getPaymentMode().toString();

        if (paymentMode.equalsIgnoreCase(ONLINE.name()) || paymentMode.equalsIgnoreCase(CARD.name()))
            payment.setInstrumentStatus(InstrumentStatusEnum.REMITTED);
        else
            payment.setInstrumentStatus(InstrumentStatusEnum.APPROVED);

        for (PaymentDetail paymentDetail : paymentDetails) {
            paymentDetail.setId(UUID.randomUUID().toString());
            String receiptNumber = idGenRepository.generateReceiptNumber(paymentRequest.getRequestInfo(), paymentDetail.getBusinessService(),
                    paymentDetail.getTenantId());
            paymentDetail.setReceiptNumber(receiptNumber);

            /*for (BillAccountDetail billAccountDetail : billDetail.getBillAccountDetails()) {
                billAccountDetail.setId(UUID.randomUUID().toString());
            }*/
        }
        enrichInstrument(paymentRequest);
    }


    private void enrichInstrument(PaymentRequest paymentRequest) {
        Payment payment = paymentRequest.getPayment();
        String paymentMode = payment.getPaymentMode().toString();

        if (paymentMode.equalsIgnoreCase(CASH.name())) {
            String transactionId = idGenRepository.generateTransactionNumber(paymentRequest.getRequestInfo(),
                    payment.getTenantId());
            payment.setTransactionNumber(transactionId);
        }

        if (paymentMode.equalsIgnoreCase(CASH.name()) || paymentMode.equalsIgnoreCase(CARD.name())) {
            payment.setTransactionDate(new Date().getTime());
        } else {
            payment.setTransactionDate(new Date(payment.getInstrumentDate()).getTime());
        }

        if (paymentMode.equalsIgnoreCase(ONLINE.name()) || paymentMode.equalsIgnoreCase(CARD.name()))
            payment.setPaymentStatus(PaymentStatusEnum.DEPOSITED.DEPOSITED);
        else
            payment.setPaymentStatus(PaymentStatusEnum.NEW);
    }






    /**
     * Apportion adds another billAccDetail for Advance tax head when advance amt is paid, this method enriches that object
     *
     * @param bills
     */
    public void enrichAdvanceTaxHead(List<Bill> bills) {
        bills.forEach(bill -> {
            bill.getBillDetails().forEach(billDetail -> {
                billDetail.getBillAccountDetails().forEach(billAccountDetail -> {
                    if (StringUtils.isEmpty(billAccountDetail.getId()) && billAccountDetail.getPurpose().equals(Purpose.ADVANCE)) {
                        billAccountDetail.setId(UUID.randomUUID().toString());
                        billAccountDetail.setTenantId(bill.getTenantId());
                        billAccountDetail.setBillDetailId(billDetail.getId());
                    }
                });
            });
        });
    }









    /**
     * Validates the paymentDetail with the bill
     * @param paymentMode The payment mode
     * @param bill Bill against which payment is made
     * @param paymentDetail The payment detail for the bill
     * @param errorMap Error map to catch errors
     */
    private void validatePaymentDetailAgainstBill(String paymentMode, Bill bill, PaymentDetail paymentDetail, Map<String,String> errorMap){

        // Total amount to be paid should be same in bill and paymentDetail
        if(paymentDetail.getTotalDue().compareTo(bill.getTotalAmount())!=0)
            errorMap.put("INVALID_PAYMENTDETAIL","The amount to be paid is mismatching with bill for paymentDetial with bill id: "+bill.getId());

        // Amount to be paid should be greater than minimum collection amount
        if(bill.getMinimumAmountToBePaid() != null && paymentDetail.getTotalAmountPaid().compareTo(bill.getMinimumAmountToBePaid())==-1)
            errorMap.put("INVALID_PAYMENTDETAIL","The amount to be paid cannot be less than minimum amount to be paid");

        // In case of partial payment checks if it is allowed in bill
        if((bill.getPartPaymentAllowed()==null || !bill.getPartPaymentAllowed())
                && paymentDetail.getTotalAmountPaid().compareTo(bill.getTotalAmount())==-1)
            errorMap.put("INVALID_PAYMENTDETAIL","The amount to be paid is less than amount due");

        // In case of advance payment checks if it is allowed in bill
        if((bill.getIsAdvanceAllowed()==null || !bill.getIsAdvanceAllowed())
                && paymentDetail.getTotalAmountPaid().compareTo(bill.getTotalAmount())==1)
            errorMap.put("INVALID_PAYMENTDETAIL","The amount to be paid is more than amount due");

        // Checks if the payment mode is allowed by the bill
        if(!CollectionUtils.isEmpty(bill.getCollectionModesNotAllowed()) && bill.getCollectionModesNotAllowed().contains(paymentMode))
            errorMap.put("INVALID_PAYMENTDETAIL","The paymentMode: "+paymentMode+" is not allowed for the bill: "+bill.getId());

        // Checks if the amount paid is positive integer
        if(!Utils.isPositiveInteger(paymentDetail.getTotalAmountPaid()))
            errorMap.put("INVALID_PAYMENTDETAIL","The amount paid for the paymentDetail with bill number: "+paymentDetail.getBillId());

        // Zero amount payment is allowed only if bill amount is zero
        if(paymentDetail.getTotalAmountPaid().compareTo(BigDecimal.ZERO)==0 && bill.getTotalAmount().compareTo(BigDecimal.ZERO) > 0)
            errorMap.put("INVALID_PAYMENTDETAIL","The amount paid for the paymentDetail with bill number: "+paymentDetail.getBillId());

        // Checks if the amount to be paid is fractional
        if((bill.getTotalAmount().divide(BigDecimal.ONE)).doubleValue()!=0)
            errorMap.put("INVALID_BILL","The due amount cannot be fractional");

        // Checks if the amount paid is fractional
        if((paymentDetail.getTotalAmountPaid().divide(BigDecimal.ONE)).doubleValue()!=0)
            errorMap.put("INVALID_PAYMENTDETAIL","The amount paid cannot be fractional");

        // Checks if the bill is expired
        bill.getBillDetails().forEach(billDetail -> {
            if (isNull(billDetail.getExpiryDate()) || System.currentTimeMillis() >= billDetail.getExpiryDate()) {
                errorMap.put("BILL_EXPIRED", "Bill expired or invalid, regenerate bill!");
            }
        });

    }












}
