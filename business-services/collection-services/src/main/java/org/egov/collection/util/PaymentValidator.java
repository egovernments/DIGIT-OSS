package org.egov.collection.util;


import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentDetail;
import org.egov.collection.model.PaymentRequest;
import org.egov.collection.model.PaymentSearchCriteria;
import org.egov.collection.model.enums.InstrumentTypesEnum;
import org.egov.collection.model.enums.PaymentModeEnum;
import org.egov.collection.repository.PaymentRepository;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.joda.time.DateTime;
import org.joda.time.Days;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;

import static java.util.Objects.isNull;
import static org.egov.collection.config.CollectionServiceConstants.*;
import static org.egov.collection.config.CollectionServiceConstants.CHEQUE_DD_DATE_WITH_FUTURE_DATE_MESSAGE;
import static org.egov.collection.model.enums.ReceiptStatus.APPROVALPENDING;
import static org.egov.collection.model.enums.ReceiptStatus.APPROVED;
import static org.egov.collection.model.enums.ReceiptStatus.REMITTED;

@Slf4j
@Component
public class PaymentValidator {


    private PaymentRepository paymentRepository;


    @Autowired
    public PaymentValidator(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }


    public void validatePaymentForCreate(PaymentRequest paymentRequest) {

        Map<String, String> errorMap = new HashMap<>();
        Payment payment = paymentRequest.getPayment();
        List<PaymentDetail> paymentDetails = paymentRequest.getPayment().getPaymentDetails();

        validateUserInfo(paymentRequest.getRequestInfo(), errorMap);

        validateInstrument(paymentRequest.getPayment(),errorMap);

        Set<String> billIds = new HashSet<>();

        paymentDetails.forEach(paymentDetail -> {
            if (paymentDetail.getBill()==null)
                return;
            if (org.apache.commons.lang3.StringUtils.isEmpty(paymentDetail.getBill().getPaidBy()))
                errorMap.put(PAID_BY_MISSING_CODE, PAID_BY_MISSING_MESSAGE);

            if(billIds.contains(paymentDetail.getBillId()))
                errorMap.put("DUPLICATE_BILLID","The Bill id: "+paymentDetail.getBillId()+" is repeated for multiple payment details");
            else billIds.add(paymentDetail.getBillId());

        });



        PaymentSearchCriteria criteria = PaymentSearchCriteria.builder().tenantId(payment.getTenantId())
                .billIds(billIds).build();
        List<Payment> payments = paymentRepository.fetchPayments(criteria);


        if (!payments.isEmpty()) {
            validateIPaymentForBillPresent(payments,errorMap);
        }


        // Loop through all bill details [one for each service], and perform various
        // validations
        for (PaymentDetail paymentDetail : paymentDetails) {

            if (isNull(paymentDetail.getTotalDue()) || !Utils.isPositiveInteger(paymentDetail.getTotalDue())) {
                errorMap.put("INVALID_BILL_AMOUNT",
                        "Invalid bill amount! Amount should be  greater than or equal to 0 and " + "without fractions");
            }


            if (org.apache.commons.lang3.StringUtils.isEmpty(paymentDetail.getBusinessService())) {
                errorMap.put("INVALID_BUSINESS_DETAILS", "Business details code cannot be empty");
            }

        }

        // Validation to ensure, Sum of amount paid on all bill details should be equal
        // to the instrument amount
		/*Instrument instrument = receipt.getInstrument();
		if (instrument.getAmount().compareTo(totalAmountPaid) != 0)
			errorMap.put("INSTRUMENT_AMOUNT_MISMATCH",
					"Sum of amount paid of all bill details should be equal to " + "instrument amount");*/

        if (!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }


    public void validateUserInfo(RequestInfo requestInfo, Map<String, String> errorMap) {
        if (null == requestInfo) {
            errorMap.put("INVALID_REQUEST_INFO", "RequestInfo cannot be null");
        } else {
            if (null == requestInfo.getUserInfo()) {
                errorMap.put("INVALID_USER_INFO", "UserInfo within RequestInfo cannot be null");
            } else {
                if (StringUtils.isEmpty(requestInfo.getUserInfo().getUuid())) {
                    errorMap.put("INVALID_USER_ID", "UUID of the user within RequestInfo cannot be null");
                }
            }
        }
    }


    /**
     * Validations if no transaction exists for this bill No existing receipt should
     * be in approved or pending status
     * <p>
     * If not, proceed with validateIfReceiptForBillAbsent validations *
     *
     *  @param payments   List of payment Details
     * @param errorMap   Map of errors occurred during validations
     */
    private void validateIPaymentForBillPresent(List<Payment> payments, Map<String, String> errorMap) {
        log.info("receipt present");
        for (Payment payment : payments) {
            String paymentDetailStatus = payment.getPaymentStatus().toString();
            if (paymentDetailStatus.equalsIgnoreCase(APPROVED.toString())
                    || paymentDetailStatus.equalsIgnoreCase(APPROVALPENDING.toString())
                    || paymentDetailStatus.equalsIgnoreCase(REMITTED.toString())) {
                errorMap.put("BILL_ALREADY_PAID", "Bill has already been paid or is in pending state");
                return;
            }
        }
        // validateIfReceiptForBillAbsent(errorMap, billDetail);
    }


    private void validateInstrument(Payment payment, Map<String, String> errorMap) {

        String paymentMode = payment.getPaymentMode().toString();
        if (!PaymentModeEnum.contains(paymentMode)) {
            throw new CustomException("INVALID_PAYMENTMODE", "Invalid payment mode provided");
        }

        if (paymentMode.equalsIgnoreCase(InstrumentTypesEnum.CHEQUE.name())
                || paymentMode.equalsIgnoreCase(InstrumentTypesEnum.DD.name())) {

            if (isNull(payment.getTransactionDate()))
                errorMap.put("INVALID_TXN_DATE", "Transaction Date Input is mandatory for cheque and DD");

            if (isNull(payment.getTransactionNumber()) || payment.getTransactionNumber().isEmpty())
                errorMap.put("INVALID_TXN_NUMBER", "Transaction Number is mandatory for Cheque, DD, Card");

        }

        if (paymentMode.equalsIgnoreCase(InstrumentTypesEnum.CARD.name())) {
            if (org.apache.commons.lang3.StringUtils.isEmpty(payment.getTransactionNumber()))
                errorMap.put("INVALID_TXN_NUMBER", "Transaction Number is mandatory for Cheque, DD, Card");

            if (org.apache.commons.lang3.StringUtils.isEmpty(payment.getInstrumentNumber()))
                errorMap.put("INVALID_INSTRUMENT_NUMBER", "Instrument Number is mandatory for Card");

        }

        if (paymentMode.equalsIgnoreCase(InstrumentTypesEnum.CHEQUE.name())
                || paymentMode.equalsIgnoreCase(InstrumentTypesEnum.DD.name())) {
            validateChequeDD(payment, errorMap);
        }

    }


    private void validateChequeDD(Payment payment, Map<String, String> errorMap) {

        DateTime instrumentDate = new DateTime(payment.getInstrumentDate());

        if (payment.getTransactionDate()!=null) {
            if (instrumentDate.isAfter(payment.getTransactionDate())) {
                errorMap.put(RECEIPT_CHEQUE_OR_DD_DATE, RECEIPT_CHEQUE_OR_DD_DATE_MESSAGE);
            }

            Days daysDiff = Days.daysBetween(instrumentDate, new DateTime(payment.getTransactionDate()));
            if (daysDiff.getDays() > Integer.valueOf(INSTRUMENT_DATE_DAYS)) {
                errorMap.put("CHEQUE_DD_DATE_WITH_MANUAL_RECEIPT_DATE",
                        CHEQUE_DD_DATE_WITH_MANUAL_RECEIPT_DATE_MESSAGE);
            }

        } else {
            Days daysDiff = Days.daysBetween(instrumentDate, new DateTime());
            if (daysDiff.getDays() > Integer.valueOf(INSTRUMENT_DATE_DAYS)) {
                errorMap.put("CHEQUE_DD_DATE_WITH_RECEIPT_DATE", CHEQUE_DD_DATE_WITH_RECEIPT_DATE_MESSAGE);
            }
            if (instrumentDate.isAfter(new DateTime().getMillis())) {
                errorMap.put("CHEQUE_DD_DATE_WITH_FUTURE_DATE", CHEQUE_DD_DATE_WITH_FUTURE_DATE_MESSAGE);
            }
        }

    }






}
