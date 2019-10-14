package org.egov.collection.util;


import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentDetail;
import org.egov.collection.model.PaymentRequest;
import org.egov.collection.model.PaymentSearchCriteria;
import org.egov.collection.model.enums.InstrumentStatusEnum;
import org.egov.collection.model.enums.InstrumentTypesEnum;
import org.egov.collection.model.enums.PaymentModeEnum;
import org.egov.collection.model.enums.PaymentStatusEnum;
import org.egov.collection.repository.PaymentRepository;
import org.egov.collection.service.PaymentWorkflowService;
import org.egov.collection.web.contract.Bill;
import org.egov.collection.web.contract.BillDetail;
import org.egov.collection.web.contract.PaymentWorkflow;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.joda.time.DateTime;
import org.joda.time.Days;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static java.util.Objects.isNull;
import static org.egov.collection.config.CollectionServiceConstants.*;
import static org.egov.collection.config.CollectionServiceConstants.CHEQUE_DD_DATE_WITH_FUTURE_DATE_MESSAGE;
import static org.egov.collection.model.enums.InstrumentStatusEnum.APPROVALPENDING;
import static org.egov.collection.model.enums.InstrumentStatusEnum.APPROVED;
import static org.egov.collection.model.enums.InstrumentStatusEnum.REMITTED;
import static org.egov.collection.util.Utils.jsonMerge;
import static org.springframework.util.ObjectUtils.isEmpty;

@Slf4j
@Component
public class PaymentValidator {


    private PaymentRepository paymentRepository;

    private PaymentWorkflowService paymentWorkflowService;


    @Autowired
    public PaymentValidator(PaymentRepository paymentRepository, PaymentWorkflowService paymentWorkflowService) {
        this.paymentRepository = paymentRepository;
        this.paymentWorkflowService = paymentWorkflowService;
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
            String paymentStatus = payment.getInstrumentStatus().toString();
            if (paymentStatus.equalsIgnoreCase(APPROVED.toString())
                    || paymentStatus.equalsIgnoreCase(APPROVALPENDING.toString())
                    || paymentStatus.equalsIgnoreCase(REMITTED.toString())) {
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

    public List<Payment> validateAndEnrichPaymentsForUpdate(List<Payment> payments, RequestInfo requestInfo) {

        Map<String, String> errorMap = new HashMap<>();


        Set<String> paymentIds = payments.stream().map(Payment::getId).collect(Collectors.toSet());

        List<Payment> paymentsFromDb = paymentRepository.fetchPayments(PaymentSearchCriteria
                .builder()
                .ids(paymentIds)
                .instrumentStatus(InstrumentStatusEnum.statusesByCategory(InstrumentStatusEnum.Category.OPEN))
                .build());

        Map<String, Payment> paymentsById = paymentsFromDb.stream()
                .collect(Collectors.toMap(Payment::getId, Function.identity()));

        for (Payment payment : payments) {
            if (paymentsById.containsKey(payment.getId())) {

                Payment paymentFromDb =  paymentsById.get(payment.getId());

                Map<String,PaymentDetail> billIdToPaymentDetailDB = paymentFromDb.getPaymentDetails().stream().collect(Collectors.toMap(PaymentDetail::getBillId,Function.identity()));

                paymentFromDb.setAdditionalDetails(jsonMerge(paymentFromDb.getAdditionalDetails(),
                        payment.getAdditionalDetails()));

                if (paymentFromDb.getPaymentMode().toString().equalsIgnoreCase(InstrumentTypesEnum.CHEQUE.toString())
                        || paymentFromDb.getPaymentMode().toString().equalsIgnoreCase(InstrumentTypesEnum.DD.toString())){
                    validateChequeDD(payment, errorMap);
                }

                for(PaymentDetail paymentDetail : payment.getPaymentDetails()) {

                    Bill bill = paymentDetail.getBill();

                    Bill billFromDB = billIdToPaymentDetailDB.get(bill.getId()).getBill();

                    Map<String,BillDetail> idToBillDetailDBMap = billFromDB.getBillDetails().stream().collect(Collectors.toMap(BillDetail::getId,Function.identity()));

                    if (!isEmpty(bill.getPaidBy()))
                        billFromDB.setPaidBy(bill.getPaidBy());

                    if (!isEmpty(bill.getPayerAddress()))
                        billFromDB.setPayerAddress(bill.getPayerAddress());

                    if (!isEmpty(bill.getPayerEmail()))
                        billFromDB.setPayerEmail(bill.getPayerEmail());

                    if (!isEmpty(bill.getPayerName())) {
                        billFromDB.setPayerName(bill.getPayerName());
                    }

                    Map<String,BillDetail> idToBillDetailMap = billFromDB.getBillDetails().stream().collect(Collectors.toMap(BillDetail::getId,Function.identity()));


                    for(BillDetail billDetail : bill.getBillDetails()){

                        BillDetail billDetailFromDb = idToBillDetailDBMap.get(billDetail.getId());

                    if (!StringUtils.isEmpty(billDetail.getVoucherHeader()))
                        billDetailFromDb.setVoucherHeader(billDetail.getVoucherHeader());

                    billDetailFromDb.setAdditionalDetails(
                            jsonMerge(billDetailFromDb.getAdditionalDetails(), billDetail.getAdditionalDetails()));



                    // If change to manual receipt date or manual receipt number, and instrument is
                    // Cheque / DD revalidate

                    if (!isEmpty(billDetail.getManualReceiptNumber())
                            || (!isNull(billDetail.getManualReceiptDate()) && billDetail.getManualReceiptDate() != 0L)) {

                        if (!isEmpty(billDetail.getManualReceiptNumber()))
                            billDetailFromDb.setManualReceiptNumber(billDetail.getManualReceiptNumber());

                        if (!isNull(billDetail.getManualReceiptDate()) && billDetail.getManualReceiptDate() != 0L)
                            billDetailFromDb.setManualReceiptDate(billDetail.getManualReceiptDate());


                    }

                    // Temporary code block below, to enable backward compatibility with previous
                    // API

                    if (!isEmpty(payment.getInstrumentStatus())
                            && payment.getInstrumentStatus().toString().equalsIgnoreCase(REMITTED.toString())) {
                        InstrumentStatusEnum instrumentStatusInDB = paymentFromDb.getInstrumentStatus();
                        if (!isNull(instrumentStatusInDB) && !instrumentStatusInDB.equals(REMITTED)) {
                            if (instrumentStatusInDB.isCategory(InstrumentStatusEnum.Category.OPEN)) {
                                paymentFromDb.setInstrumentStatus(REMITTED);
                                billDetailFromDb.setVoucherHeader(billDetail.getVoucherHeader());
                                paymentFromDb.setPaymentStatus(PaymentStatusEnum.DEPOSITED);
                            } else {
                                errorMap.put("PAYMENT_WORKFLOW_INVALID_PAYMENT",
                                        "Payment not found in the system or not in editable state, "
                                                + payment.getId());
                            }
                        }
                    }
                }
            }
                paymentWorkflowService.updateAuditDetails(paymentFromDb, requestInfo);

            } else {
                log.error("Receipt not found with receipt number {} or not in editable status ",
                        payment.getId());
                errorMap.put("RECEIPT_UPDATE_NOT_FOUND",
                        "Receipt not found in the system or not in editable state, " + payment.getId());
            }
        }

        if (!errorMap.isEmpty())
            throw new CustomException(errorMap);
        else
            return paymentsFromDb;

    }







}
