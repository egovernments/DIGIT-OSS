package org.egov.collection.util;


import static java.util.Objects.isNull;
import static org.egov.collection.config.CollectionServiceConstants.CHEQUE_DD_DATE_WITH_FUTURE_DATE_MESSAGE;
import static org.egov.collection.config.CollectionServiceConstants.CHEQUE_DD_DATE_WITH_MANUAL_RECEIPT_DATE_MESSAGE;
import static org.egov.collection.config.CollectionServiceConstants.CHEQUE_DD_DATE_WITH_RECEIPT_DATE_MESSAGE;
import static org.egov.collection.config.CollectionServiceConstants.INSTRUMENT_DATE_DAYS;
import static org.egov.collection.config.CollectionServiceConstants.RECEIPT_CHEQUE_OR_DD_DATE;
import static org.egov.collection.config.CollectionServiceConstants.RECEIPT_CHEQUE_OR_DD_DATE_MESSAGE;
import static org.egov.collection.config.CollectionServiceConstants.RECEIPT_NEFT_OR_RTGS_DATE;
import static org.egov.collection.config.CollectionServiceConstants.RECEIPT_NEFT_OR_RTGS_DATE_MESSAGE;
import static org.egov.collection.model.enums.InstrumentStatusEnum.APPROVAL_PENDING;
import static org.egov.collection.model.enums.InstrumentStatusEnum.APPROVED;
import static org.egov.collection.model.enums.InstrumentStatusEnum.REMITTED;
import static org.egov.collection.model.enums.PaymentModeEnum.ONLINE_NEFT;
import static org.egov.collection.model.enums.PaymentModeEnum.ONLINE_RTGS;
import static org.egov.collection.util.Utils.jsonMerge;
import static org.springframework.util.ObjectUtils.isEmpty;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;
import org.egov.collection.config.ApplicationProperties;
import org.egov.collection.config.CollectionServiceConstants;
import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentDetail;
import org.egov.collection.model.PaymentRequest;
import org.egov.collection.model.PaymentSearchCriteria;
import org.egov.collection.model.enums.InstrumentStatusEnum;
import org.egov.collection.model.enums.InstrumentTypesEnum;
import org.egov.collection.model.enums.PaymentModeEnum;
import org.egov.collection.model.enums.PaymentStatusEnum;
import org.egov.collection.repository.PaymentRepository;
import org.egov.collection.repository.ServiceRequestRepository;
import org.egov.collection.service.PaymentWorkflowService;
import org.egov.collection.web.contract.Bill;
import org.egov.collection.web.contract.BillDetail;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.joda.time.DateTime;
import org.joda.time.Days;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class PaymentValidator {


    private PaymentRepository paymentRepository;

    private PaymentWorkflowService paymentWorkflowService;

    private ApplicationProperties applicationProperties;
    
    private ServiceRequestRepository serviceRequestRepository;


    @Autowired
    public PaymentValidator(PaymentRepository paymentRepository, PaymentWorkflowService paymentWorkflowService,
                            ApplicationProperties applicationProperties,ServiceRequestRepository serviceRequestRepository) {
        this.paymentRepository = paymentRepository;
        this.paymentWorkflowService = paymentWorkflowService;
        this.applicationProperties = applicationProperties;
        this.serviceRequestRepository=serviceRequestRepository;
    }


    public Payment validatePaymentForCreate(PaymentRequest paymentRequest) {
        Map<String, String> errorMap = new HashMap<>();
        Payment payment = paymentRequest.getPayment();
        List<PaymentDetail> paymentDetails = paymentRequest.getPayment().getPaymentDetails();
        validateUserInfo(paymentRequest.getRequestInfo(), errorMap);
        validateInstrument(paymentRequest.getPayment(),errorMap);
        Set<String> billIds = payment.getPaymentDetails().stream().map(PaymentDetail :: getBillId).collect(Collectors.toSet());
        
        PaymentSearchCriteria criteria = PaymentSearchCriteria.builder().tenantId(payment.getTenantId())
                .offset(0).limit(applicationProperties.getReceiptsSearchDefaultLimit()).billIds(billIds).build();

        List<Payment> payments = paymentRepository.fetchPayments(criteria);
        if (!payments.isEmpty()) {
            validateIPaymentForBillPresent(payments,errorMap);
        }

        validateIFSCCode(paymentRequest);
        // Loop through all bill details [one for each service], and perform various
        // validations
        for (PaymentDetail paymentDetail : paymentDetails) {

            if (StringUtils.isEmpty(paymentDetail.getBusinessService())) {
                errorMap.put("INVALID_BUSINESS_DETAILS", "Business details code cannot be empty");
            }

            validatePaymentDetailAgainstBill(payment.getPaymentMode().toString(),paymentDetail,errorMap);
        }

        if (!errorMap.isEmpty())
            throw new CustomException(errorMap);

        return paymentRequest.getPayment();
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
                    || paymentStatus.equalsIgnoreCase(APPROVAL_PENDING.toString())
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
                || paymentMode.equalsIgnoreCase(InstrumentTypesEnum.DD.name())
                || paymentMode.equalsIgnoreCase(InstrumentTypesEnum.OFFLINE_NEFT.name())
                || paymentMode.equalsIgnoreCase(InstrumentTypesEnum.OFFLINE_RTGS.name())
                || paymentMode.equalsIgnoreCase(InstrumentTypesEnum.POSTAL_ORDER.name())) {

            if (isNull(payment.getInstrumentDate()))
                errorMap.put("INVALID_INST_DATE", "Instrument Date Input is mandatory for cheque and DD");

            if (StringUtils.isEmpty(payment.getInstrumentNumber()))
                errorMap.put("INVALID_INST_NUMBER", "Instrument Number is mandatory for Cheque, DD, Card");

            if (paymentMode.equalsIgnoreCase(InstrumentTypesEnum.CHEQUE.name())
                    || paymentMode.equalsIgnoreCase(InstrumentTypesEnum.DD.name()))
                validateChequeDD(payment, errorMap);

            if (paymentMode.equalsIgnoreCase(InstrumentTypesEnum.OFFLINE_NEFT.name())
                    || paymentMode.equalsIgnoreCase(InstrumentTypesEnum.OFFLINE_RTGS.name())
                    || paymentMode.equalsIgnoreCase(InstrumentTypesEnum.POSTAL_ORDER.name()))
                validateNEFTAndRTGS(payment, errorMap);

        }

        if (paymentMode.equalsIgnoreCase(InstrumentTypesEnum.CARD.name()) || paymentMode.equalsIgnoreCase(InstrumentTypesEnum.ONLINE.name())
                || paymentMode.equalsIgnoreCase(ONLINE_NEFT.name()) || paymentMode.equalsIgnoreCase(ONLINE_RTGS.name())) {
            if (org.apache.commons.lang3.StringUtils.isEmpty(payment.getTransactionNumber()))
                errorMap.put("INVALID_TXN_NUMBER", "Transaction Number is mandatory for Card and online payment");

            if (org.apache.commons.lang3.StringUtils.isEmpty(payment.getInstrumentNumber()))
                errorMap.put("INVALID_INSTRUMENT_NUMBER", "Instrument Number is mandatory for Card");

        }

    }


    private void validateNEFTAndRTGS(Payment payment, Map<String, String> errorMap){

        DateTime instrumentDate = new DateTime(payment.getInstrumentDate());
        if (instrumentDate.isAfter(System.currentTimeMillis())) {
            errorMap.put(RECEIPT_NEFT_OR_RTGS_DATE, RECEIPT_NEFT_OR_RTGS_DATE_MESSAGE);
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
                .offset(0).limit(applicationProperties.getReceiptsSearchDefaultLimit())
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
                    
                    if (!isEmpty(billDetail.getManualReceiptNumber()))
                        billDetailFromDb.setManualReceiptNumber(billDetail.getManualReceiptNumber());

                    if (!isNull(billDetail.getManualReceiptDate()) && billDetail.getManualReceiptDate() != 0L)
                        billDetailFromDb.setManualReceiptDate(billDetail.getManualReceiptDate());

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


    /**
     * Validates the paymentDetail with the bill
     *
     * @param paymentMode
     *            The payment mode
     * @param paymentDetail
     *            The payment detail for the bill
     * @param errorMap
     *            Error map to catch errors
     */
    private void validatePaymentDetailAgainstBill(String paymentMode, PaymentDetail paymentDetail,
                                                  Map<String, String> errorMap) {

        Bill bill = paymentDetail.getBill();

        // If IsAdvanceAllowed is null it is interpretated as not allowed
        Boolean isAdvanceAllowed = !(bill.getIsAdvanceAllowed() == null || !bill.getIsAdvanceAllowed());

        // Total amount to be paid should be same in bill and paymentDetail
        if (paymentDetail.getTotalDue().compareTo(bill.getTotalAmount()) != 0)
            errorMap.put("INVALID_PAYMENTDETAIL",
                    "The amount to be paid is mismatching with bill for paymentDetial with bill id: " + bill.getId());


        // If advance is not allowed bill total amount should be positive integer
        if(!isAdvanceAllowed && !Utils.isPositiveInteger(paymentDetail.getBill().getTotalAmount()))
            errorMap.put("INVALID_BILL_AMOUNT","The bill amount of bill: "+paymentDetail.getBill().getId()+" is fractional or less than zero");

        // Amount to be paid should be greater than minimum collection amount
        if (bill.getMinimumAmountToBePaid() != null
                && paymentDetail.getTotalAmountPaid().compareTo(bill.getMinimumAmountToBePaid()) == -1)
            errorMap.put("INVALID_PAYMENTDETAIL",
                    "The amount to be paid cannot be less than minimum amount to be paid");

        // In case of partial payment checks if it is allowed in bill
        if ((bill.getPartPaymentAllowed() == null || !bill.getPartPaymentAllowed())
                && paymentDetail.getTotalAmountPaid().compareTo(bill.getTotalAmount()) == -1)
            errorMap.put("INVALID_PAYMENTDETAIL", "The amount to be paid is less than amount due");

        // In case of advance payment checks if it is allowed in bill
        if ((bill.getIsAdvanceAllowed() == null || !bill.getIsAdvanceAllowed())
                && paymentDetail.getTotalAmountPaid().compareTo(bill.getTotalAmount()) == 1)
            errorMap.put("INVALID_PAYMENTDETAIL", "The amount to be paid is more than amount due");

        // Checks if the payment mode is allowed by the bill
        if (!CollectionUtils.isEmpty(bill.getCollectionModesNotAllowed())
                && bill.getCollectionModesNotAllowed().contains(paymentMode))
            errorMap.put("INVALID_PAYMENTDETAIL",
                    "The paymentMode: " + paymentMode + " is not allowed for the bill: " + bill.getId());

        // Checks if the amount paid is positive integer
        if (!Utils.isPositiveInteger(paymentDetail.getTotalAmountPaid()))
            errorMap.put("INVALID_PAYMENTDETAIL",
                    "The amount paid for the paymentDetail with bill number: " + paymentDetail.getBillId());

        // Zero amount payment is allowed only if bill amount is not positive
        if (paymentDetail.getTotalAmountPaid().compareTo(BigDecimal.ZERO) == 0
                && bill.getTotalAmount().compareTo(BigDecimal.ZERO) > 0)
            errorMap.put("INVALID_PAYMENTDETAIL",
                    "The amount paid for the paymentDetail with bill number: " + paymentDetail.getBillId());

        // Checks if the amount to be paid is fractional
        if ((bill.getTotalAmount().remainder(BigDecimal.ONE)).doubleValue() != 0)
            errorMap.put("INVALID_BILL", "The due amount cannot be fractional");

        // Checks if the amount paid is fractional
        if ((paymentDetail.getTotalAmountPaid().remainder(BigDecimal.ONE)).doubleValue() != 0)
            errorMap.put("INVALID_PAYMENTDETAIL", "The amount paid cannot be fractional");

        // Checks if the bill is expired
        bill.getBillDetails().forEach(billDetail -> {
            if (isNull(billDetail.getExpiryDate()) || System.currentTimeMillis() >= billDetail.getExpiryDate()) {
                errorMap.put("BILL_EXPIRED", "Bill expired or invalid, regenerate bill!");
            }
        });

    }

    /**
     * method to validate and update search request information based on APP configs
     * checks for requestInfo
     * verifies if requester is citizen and validates the module-name path for employee
     * adds default status and module-name to criteria if applicable
     * 
     * @param paymentSearchCriteria
     * @param requestInfo
     * @param moduleName
     */
    public void validateAndUpdateSearchRequestFromConfig(PaymentSearchCriteria paymentSearchCriteria, RequestInfo requestInfo, String moduleName) {
    	
    	Map<String, String> errorMap = new HashMap<>();
    	validateUserInfo(requestInfo, errorMap);
        if (!errorMap.isEmpty())
            throw new CustomException(errorMap);
    	
		Boolean isRequesterEmployee = requestInfo.getUserInfo().getType()
				.equalsIgnoreCase(CollectionServiceConstants.EMPLOYEE_TYPE);
		if (isRequesterEmployee && applicationProperties.getIsModuleNameMandatoryInSearchUriForEmployee()
				&& null == moduleName)
			throw new CustomException("EGCL_URI_EXCEPTION", "Path variable module name is mandatory for employees");

		/*
		 * Only Applicable if there is no receipt number search
		 * Only Applicable when search ignore status has been defined in application properties
		 * Only Applicable when status has not been already provided for the search
		 */
		if ((CollectionUtils.isEmpty(paymentSearchCriteria.getReceiptNumbers()))
				&& !applicationProperties.getSearchIgnoreStatus().isEmpty()
				&& (CollectionUtils.isEmpty(paymentSearchCriteria.getStatus()))) {

			// Do not return ignored status for receipts by default
			Set<String> defaultStatus = new HashSet<>();
			for (PaymentStatusEnum paymentStatus : PaymentStatusEnum.values()) {

				if (!applicationProperties.getSearchIgnoreStatus().contains(paymentStatus.toString())) {
					defaultStatus.add(paymentStatus.toString());
				}
			}
			paymentSearchCriteria.setStatus(defaultStatus);
		}
        
		if (null != moduleName) {

			if (CollectionUtils.isEmpty(paymentSearchCriteria.getBusinessServices())) {
				paymentSearchCriteria.setBusinessServices(Stream.of(moduleName).collect(Collectors.toSet()));
			} else {
				paymentSearchCriteria.getBusinessServices().add(moduleName);
			}
		}
    }
    
    /***
	 * This method will validate the ifsc code and fetch the bank details and add
	 * those details in payment additionaldetails
	 * 
	 * @param payments
	 * @param errorMap
	 */

	private void validateIFSCCode(PaymentRequest paymentRequest) {
		// TODO Auto-generated method stub
		JsonNode razorPayIfscSearchResponse = null;
		if (paymentRequest.getPayment().getIfscCode() != null) {

			String response = serviceRequestRepository
					.fetchGetResult(applicationProperties.getRazorPayUrl() + paymentRequest.getPayment().getIfscCode());
			ObjectNode objectNode = (ObjectNode) paymentRequest.getPayment().getAdditionalDetails();
			if (objectNode == null) {
				ObjectMapper mapper = new ObjectMapper();
				objectNode = mapper.createObjectNode();
				
					try {
						razorPayIfscSearchResponse = mapper.readTree(response);
					} catch (JsonProcessingException e) {
						throw new CustomException("INVALID_PROCESS_EXCEPTION", e.getMessage());

				} 
				objectNode.set("bankDetails", razorPayIfscSearchResponse);
				paymentRequest.getPayment().setAdditionalDetails(objectNode);
			}

		}

	}

}
