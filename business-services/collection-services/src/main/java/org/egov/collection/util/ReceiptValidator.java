package org.egov.collection.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.collection.model.Instrument;
import org.egov.collection.model.LegacyReceiptHeader;
import org.egov.collection.model.ReceiptSearchCriteria;
import org.egov.collection.model.enums.InstrumentStatusEnum;
import org.egov.collection.model.enums.InstrumentTypesEnum;
import org.egov.collection.model.enums.ReceiptStatus;
import org.egov.collection.repository.BusinessDetailsRepository;
import org.egov.collection.repository.CollectionRepository;
import org.egov.collection.service.WorkflowService;
import org.egov.collection.web.contract.*;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.Error;
import org.egov.common.contract.response.ErrorField;
import org.egov.common.contract.response.ErrorResponse;
import org.egov.tracer.model.CustomException;
import org.joda.time.DateTime;
import org.joda.time.Days;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.Collections.singletonList;
import static java.util.Objects.isNull;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotEmpty;
import static org.egov.collection.config.CollectionServiceConstants.*;
import static org.egov.collection.model.enums.ReceiptStatus.APPROVALPENDING;
import static org.egov.collection.model.enums.ReceiptStatus.APPROVED;
import static org.egov.collection.model.enums.ReceiptStatus.REMITTED;
import static org.egov.collection.util.Utils.jsonMerge;
import static org.springframework.util.StringUtils.isEmpty;

@Slf4j
@Component
public class ReceiptValidator {

	private BusinessDetailsRepository businessDetailsRepository;
	private CollectionRepository collectionRepository;

	ReceiptValidator(BusinessDetailsRepository businessDetailsRepository, CollectionRepository collectionRepository) {
		this.businessDetailsRepository = businessDetailsRepository;
		this.collectionRepository = collectionRepository;
		
	}

	/**
	 * Validate to ensure, - Instrument type provided is valid - Amount Paid & total
	 * amount are not null and are integer values, no fractions allowed! - Allow
	 * zero amount ONLY IF the total bill amount is also equal to zero - Sum of
	 * amount paid on all bill details should be equal to the instrument amount -
	 * The bill is not being repaid, if a receipt is already created and is in
	 * completed / pending state do not allow creation of another receipt. -
	 * Business service code provided is valid, call is being made in a loop as the
	 * tenant id could be different for each bill detail - Bill account details are
	 * valid, checks for purpose and GL Codes - Cheque and DD dates are correct
	 *
	 * @param receiptRequest Receipt request to be validated
	 */
	public void validateReceiptForCreate(ReceiptReq receiptReq) {

		Map<String, String> errorMap = new HashMap<>();
		Receipt receipt = receiptReq.getReceipt().get(0);

		validateUserInfo(receiptReq, errorMap);

		if (receipt.getBill().isEmpty())
			return;

		if (org.apache.commons.lang3.StringUtils.isEmpty(receipt.getBill().get(0).getPaidBy()))
			errorMap.put(PAID_BY_MISSING_CODE, PAID_BY_MISSING_MESSAGE);

		validateInstrument(receipt.getInstrument(), errorMap);
		
        Map<String, BigDecimal> mapOfBusinessSvcAndAmtPaid = receipt.getBill().get(0).getTaxAndPayments().stream()
                .collect(Collectors.toMap(TaxAndPayment::getBusinessService, TaxAndPayment::getAmountPaid));
        
        mapOfBusinessSvcAndAmtPaid.entrySet().forEach( entryOfServiceAndAmtpaid -> {
        	
        	BigDecimal amtPaid = entryOfServiceAndAmtpaid.getValue();
        	if(!Utils.isPositiveInteger(amtPaid))
				errorMap.put("INVALID_PAID_AMOUNT",
						"Invalid paid amount! Amount paid should be greater than or Equal to 0 and " + "without fractions");
        });
        

		// Loop through all bill details [one for each service], and perform various
		// validations
		for (BillDetail billDetail : receipt.getBill().get(0).getBillDetails()) {

			ReceiptSearchCriteria criteria = ReceiptSearchCriteria.builder().tenantId(billDetail.getTenantId())
					.billIds(singletonList(billDetail.getBillNumber())).build();
			List<Receipt> receipts = collectionRepository.fetchReceipts(criteria);

			log.info("receipts: " + receipts);

			if (isNull(billDetail.getTotalAmount()) || !Utils.isPositiveInteger(billDetail.getTotalAmount())) {
				errorMap.put("INVALID_BILL_AMOUNT",
						"Invalid bill amount! Amount should be  greater than or equal to 0 and " + "without fractions");
			}
			
			if (!receipts.isEmpty()) {
				validateIfReceiptForBillPresent(errorMap, receipts, billDetail);
			}

			if (org.apache.commons.lang3.StringUtils.isEmpty(billDetail.getBusinessService())) {
				errorMap.put("INVALID_BUSINESS_DETAILS", "Business details code cannot be empty");
			}

			List<String> collectionModesNotAllowed = billDetail.getCollectionModesNotAllowed();
			if (collectionModesNotAllowed.contains(receipt.getInstrument().getInstrumentType())) {
				errorMap.put("INVALID_COLLECTIONMODE_CODE", "Collectionmode is not allowed");
			}

			String instrumentType = receipt.getInstrument().getInstrumentType().getName();
			if (instrumentType.equalsIgnoreCase(InstrumentTypesEnum.CHEQUE.name())
					|| instrumentType.equalsIgnoreCase(InstrumentTypesEnum.DD.name())) {
				validateChequeDD(billDetail, receipt.getInstrument(), errorMap);
			}
		}
		BigDecimal totalAmountPaid = BigDecimal.ZERO;
		for (TaxAndPayment entry : receipt.getBill().get(0).getTaxAndPayments()) {
			totalAmountPaid = totalAmountPaid.add(entry.getAmountPaid());
		}

		// Validation to ensure, Sum of amount paid on all bill details should be equal
		// to the instrument amount
		Instrument instrument = receipt.getInstrument();
		if (instrument.getAmount().compareTo(totalAmountPaid) != 0)
			errorMap.put("INSTRUMENT_AMOUNT_MISMATCH",
					"Sum of amount paid of all bill details should be equal to " + "instrument amount");

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);

		List<Receipt> receipts = new ArrayList<>();
		receipts.add(receipt);
		receiptReq.setReceipt(receipts);
	}

	public void validateUserInfo(ReceiptReq receiptReq, Map<String, String> errorMap) {
		if (null == receiptReq.getRequestInfo()) {
			errorMap.put("INVALID_REQUEST_INFO", "RequestInfo cannot be null");
		} else {
			if (null == receiptReq.getRequestInfo().getUserInfo()) {
				errorMap.put("INVALID_USER_INFO", "UserInfo within RequestInfo cannot be null");
			} else {
				if (StringUtils.isEmpty(receiptReq.getRequestInfo().getUserInfo().getUuid())) {
					errorMap.put("INVALID_USER_ID", "UUID of the user within RequestInfo cannot be null");
				}
			}
		}
	}

	public List<Receipt> validateAndEnrichReceiptsForUpdate(List<Receipt> receipts, RequestInfo requestInfo) {

		Map<String, String> errorMap = new HashMap<>();

		Set<String> receiptNumbers = new HashSet<>();

		/*
		 * Collecting receipt number from bill details since receipt create/update
		 * request doesn't not have receipt number directly
		 */
		for (Receipt receipt : receipts) {
			receipt.getBill().forEach(bill -> receiptNumbers.addAll(
					bill.getBillDetails().stream().map(BillDetail::getReceiptNumber).collect(Collectors.toSet())));
		}
		
		List<Receipt> receiptsFromDb = collectionRepository.fetchReceipts(ReceiptSearchCriteria
						.builder()
						.receiptNumbers(receiptNumbers)
						.status(ReceiptStatus.statusesByCategory(ReceiptStatus.Category.OPEN))
						.build());
		
		Map<String, List<Receipt>> receiptsByReceiptNumber = receiptsFromDb.stream()
				.collect(Collectors.groupingBy(Receipt::getReceiptNumber));

		for (Receipt receipt : receipts) {
			if (receiptsByReceiptNumber
					.containsKey(receipt.getBill().get(0).getBillDetails().get(0).getReceiptNumber())) {
				Bill bill = receipt.getBill().get(0);
				BillDetail billDetail = bill.getBillDetails().get(0);

				Receipt receiptFromDb = receiptsByReceiptNumber
						.get(receipt.getBill().get(0).getBillDetails().get(0).getReceiptNumber()).get(0);
				Bill billFromDb = receiptFromDb.getBill().get(0);
				BillDetail billDetailFromDb = billFromDb.getBillDetails().get(0);

				if (!isEmpty(bill.getPaidBy()))
					billFromDb.setPaidBy(bill.getPaidBy());

				if (!isEmpty(bill.getPayerAddress()))
					billFromDb.setPayerAddress(bill.getPayerAddress());

				if (!isEmpty(bill.getPayerEmail()))
					billFromDb.setPayerEmail(bill.getPayerEmail());

				if (!isEmpty(bill.getPayerName())) {
					billFromDb.setPayerName(bill.getPayerName());
					receiptFromDb.getInstrument().setPayee(bill.getPayerName());
				}

				if (!StringUtils.isEmpty(billDetail.getVoucherHeader()))
					billDetailFromDb.setVoucherHeader(billDetail.getVoucherHeader());

				billDetailFromDb.setAdditionalDetails(
						jsonMerge(billDetailFromDb.getAdditionalDetails(), billDetail.getAdditionalDetails()));

				receiptFromDb.getInstrument()
						.setAdditionalDetails(jsonMerge(receiptFromDb.getInstrument().getAdditionalDetails(),
								receipt.getInstrument().getAdditionalDetails()));

				// If change to manual receipt date or manual receipt number, and instrument is
				// Cheque / DD revalidate

				if (!isEmpty(billDetail.getManualReceiptNumber())
						|| (!isNull(billDetail.getManualReceiptDate()) && billDetail.getManualReceiptDate() != 0L)) {

					if (!isEmpty(billDetail.getManualReceiptNumber()))
						billDetailFromDb.setManualReceiptNumber(billDetail.getManualReceiptNumber());

					if (!isNull(billDetail.getManualReceiptDate()) && billDetail.getManualReceiptDate() != 0L)
						billDetailFromDb.setManualReceiptDate(billDetail.getManualReceiptDate());

					if (receiptFromDb.getInstrument().getInstrumentType().getName()
							.equalsIgnoreCase(InstrumentTypesEnum.CHEQUE.toString())
							|| receiptFromDb.getInstrument().getInstrumentType().getName()
									.equalsIgnoreCase(InstrumentTypesEnum.DD.toString()))
						validateChequeDD(billDetailFromDb, receiptFromDb.getInstrument(), errorMap);
				}

				// Temporary code block below, to enable backward compatibility with previous
				// API

				if (!isEmpty(billDetail.getStatus())
						&& billDetail.getStatus().equalsIgnoreCase(REMITTED.toString())) {
					ReceiptStatus receiptStatusInDb = ReceiptStatus.fromValue(billDetailFromDb.getStatus());
					if (!isNull(receiptStatusInDb) && !receiptStatusInDb.equals(REMITTED)) {
						if (receiptStatusInDb.isCategory(ReceiptStatus.Category.OPEN)) {
							billDetailFromDb.setStatus(REMITTED.toString());
							billDetailFromDb.setVoucherHeader(billDetail.getVoucherHeader());
							receiptFromDb.getInstrument().setInstrumentStatus(InstrumentStatusEnum.DEPOSITED);
						} else {
							log.error("Receipt not found with receipt number {} & consumer code {} or not in editable"
									+ " status ", receipt.getReceiptNumber(), receipt.getConsumerCode());
							errorMap.put("RECEIPT_WORKFLOW_INVALID_RECEIPT",
									"Receipt not found in the system or not in editable state, "
											+ receipt.getReceiptNumber());
						}
					}
				}

				WorkflowService.updateAuditDetails(receiptFromDb, requestInfo);

			} else {
				log.error("Receipt not found with receipt number {} or not in editable status ",
						receipt.getReceiptNumber());
				errorMap.put("RECEIPT_UPDATE_NOT_FOUND",
						"Receipt not found in the system or not in editable state, " + receipt.getReceiptNumber());
			}
		}

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
		else
			return receiptsFromDb;

	}

	private void validateInstrument(Instrument instrument, Map<String, String> errorMap) {

		String instrumentType = instrument.getInstrumentType().getName();
		if (!InstrumentTypesEnum.contains(instrumentType)) {
			throw new CustomException("INVALID_INSTRUMENT_TYPE", "Invalid instrument type provided");
		}

		if (instrumentType.equalsIgnoreCase(InstrumentTypesEnum.CHEQUE.name())
				|| instrumentType.equalsIgnoreCase(InstrumentTypesEnum.DD.name())) {

			if (isNull(instrument.getTransactionDateInput()))
				errorMap.put("INVALID_TXN_DATE", "Transaction Date Input is mandatory for cheque and DD");

			if (isNull(instrument.getTransactionNumber()) || instrument.getTransactionNumber().isEmpty())
				errorMap.put("INVALID_TXN_NUMBER", "Transaction Number is mandatory for Cheque, DD, Card");

		}

		if (instrumentType.equalsIgnoreCase(InstrumentTypesEnum.CARD.name())) {
			if (org.apache.commons.lang3.StringUtils.isEmpty(instrument.getTransactionNumber()))
				errorMap.put("INVALID_TXN_NUMBER", "Transaction Number is mandatory for Cheque, DD, Card");

			if (org.apache.commons.lang3.StringUtils.isEmpty(instrument.getInstrumentNumber()))
				errorMap.put("INVALID_INSTRUMENT_NUMBER", "Instrument Number is mandatory for Card");

		}

	}

	private void validateChequeDD(BillDetail billDetails, Instrument instrument, Map<String, String> errorMap) {

		DateTime instrumentDate = new DateTime(instrument.getTransactionDateInput());

		if (!isNull(billDetails.getReceiptDate()) && isNotEmpty(billDetails.getManualReceiptNumber())) {
			if (instrumentDate.isAfter(billDetails.getReceiptDate())) {
				errorMap.put(RECEIPT_CHEQUE_OR_DD_DATE, RECEIPT_CHEQUE_OR_DD_DATE_MESSAGE);
			}

			Days daysDiff = Days.daysBetween(instrumentDate, new DateTime(billDetails.getReceiptDate()));
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

	private void validateBillAccountDetails(List<BillAccountDetail> billAccountDetails, Map<String, String> errorMap) {
		for (BillAccountDetail billAccountDetail : billAccountDetails) {
			if (isNull(billAccountDetail.getPurpose())) {
				throw new CustomException("PURPOSE_MISSING", PURPOSE_MISSING_MESSAGE);
			}
			if (org.apache.commons.lang3.StringUtils.isEmpty(billAccountDetail.getGlcode())) {
				throw new CustomException("COA_MISSING", COA_MISSING_MESSAGE);
			}
		}

	}

	/**
	 * Validations if no receipts exists for this bill - If part payment is allowed,
	 * - Amount being paid should not be lower than minimum payable amount - Amount
	 * being paid should not be greater than bill value
	 * <p>
	 * - If part payment is not allowed, - Amount being paid should be equal to bill
	 * value
	 *
	 * @param errorMap   Map of errors occurred during validations
	 * @param billDetail Bill detail for which payment is being made
	 */

	private void validateIfReceiptForBillAbsent(Map<String, String> errorMap, BillDetail billDetail) {
		BigDecimal totalAmount = billDetail.getTotalAmount();
		BigDecimal amountPaid = billDetail.getAmountPaid();

		if (billDetail.getPartPaymentAllowed()) {
			if (!(totalAmount.compareTo(amountPaid) == 0)) {
				if (amountPaid.compareTo(BigDecimal.ZERO) != 0
						&& amountPaid.compareTo(billDetail.getMinimumAmount()) < 0) {
					log.error("Amount paid of {} cannot be lesser than minimum payable amount of {} for bill detail "
							+ "{}", amountPaid, billDetail.getMinimumAmount(), billDetail.getId());
					errorMap.put("AMOUNT_MISMATCH_LOW", "Amount paid cannot be lesser than minimum payable amount");
				}

				if (amountPaid.compareTo(totalAmount) > 0) {
					log.error("Amount paid of {} cannot be greater than bill amount of {} for bill detail {}",
							billDetail.getAmountPaid(), totalAmount, billDetail.getId());
					errorMap.put("AMOUNT_MISMATCH_HIGH", "Amount paid cannot be greater than bill amount");
				}
			}

		} else {
			if (!(totalAmount.compareTo(amountPaid) == 0)) {
				log.error("Transaction Amount of {} has to be equal to bill amount of {} for bill detail {}",
						amountPaid, totalAmount, billDetail.getId());
				errorMap.put("AMOUNT_MISMATCH", "Amount paid has to be equal to bill amount");
			}
		}
	}

	/**
	 * Validations if no transaction exists for this bill No existing receipt should
	 * be in approved or pending status
	 * <p>
	 * If not, proceed with validateIfReceiptForBillAbsent validations *
	 *
	 * @param errorMap   Map of errors occurred during validations
	 * @param receipts   List of receipt headers
	 * @param billDetail Bill detail for which payment is being made
	 */
	private void validateIfReceiptForBillPresent(Map<String, String> errorMap, List<Receipt> receipts,
			BillDetail billDetail) {
		log.info("receipt present");
		for (Receipt receipt : receipts) {
			String receiptStatus = receipt.getBill().get(0).getBillDetails().get(0).getStatus();
			if (receiptStatus.equalsIgnoreCase(APPROVED.toString())
					|| receiptStatus.equalsIgnoreCase(APPROVALPENDING.toString())
					|| receiptStatus.equalsIgnoreCase(REMITTED.toString())) {
				errorMap.put("BILL_ALREADY_PAID", "Bill has already been paid or is in pending state");
				return;
			}
		}
		// validateIfReceiptForBillAbsent(errorMap, billDetail);

	}

	/**
	 * @param billDetail
	 * @param errorMap
	 */
	private void validateBusinessServiceCode(RequestInfo requestInfo, BillDetail billDetail,
			Map<String, String> errorMap) {
		BusinessDetailsResponse businessDetailsResponse = businessDetailsRepository.getBusinessDetails(
				singletonList(billDetail.getBusinessService()), billDetail.getTenantId(), requestInfo);

		if (isNull(businessDetailsResponse.getBusinessDetails())
				|| businessDetailsResponse.getBusinessDetails().isEmpty()) {
			log.error("Business detail not found for {} and tenant {}", billDetail.getBusinessService(),
					billDetail.getTenantId());
			errorMap.put(BUSINESSDETAILS_EXCEPTION_MSG, BUSINESSDETAILS_EXCEPTION_DESC);
		}
	}

	public void validateSearchReceiptRequest(final ReceiptSearchCriteria receiptSearchCriteria) {

		Map<String, String> errorMap = new HashMap<>();

		if (isBlank(receiptSearchCriteria.getTenantId())) {
			errorMap.put(TENANT_ID_REQUIRED_CODE, TENANT_ID_REQUIRED_MESSAGE);
		}

		if (!isNull(receiptSearchCriteria.getFromDate()) && !isNull(receiptSearchCriteria.getToDate())
				&& receiptSearchCriteria.getFromDate() > receiptSearchCriteria.getToDate()) {
			errorMap.put(FROM_DATE_GREATER_CODE, FROM_DATE_GREATER_MESSAGE);
		}

		if (!isNull(receiptSearchCriteria.getBillIds()) && !receiptSearchCriteria.getBillIds().isEmpty()
				&& isBlank(receiptSearchCriteria.getBusinessCode())) {
			errorMap.put(BUSINESS_CODE_REQUIRED_CODE, BUSINESS_CODE_REQUIRED_MESSAGE);
		}

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}

	public List<ErrorResponse> validateCreateLegacyReceiptRequest(LegacyReceiptReq legacyReceiptRequest) {
		List<ErrorResponse> errorResponses = null;
		final Error error = getError(legacyReceiptRequest);
		if (error != null) {
			ErrorResponse errorResponse = new ErrorResponse();
			errorResponses = new ArrayList<>();
			errorResponse.setError(error);
			errorResponses.add(errorResponse);
		}
		return errorResponses;
	}

	private Error getError(LegacyReceiptReq legacyReceiptRequest) {
		final List<ErrorField> errorFields = getErrorFields(legacyReceiptRequest);
		Error error = null;
		if (null != errorFields && !errorFields.isEmpty())
			error = Error.builder().code(HttpStatus.BAD_REQUEST.value()).message(INVALID_LEGACY_RECEIPT_REQUEST)
					.fields(errorFields).build();
		return error;
	}

	private List<ErrorField> getErrorFields(LegacyReceiptReq legacyReceiptRequest) {
		final List<ErrorField> errorFields = null;
		addLegacyReceiptValidationErrors(legacyReceiptRequest, errorFields);
		return errorFields;
	}

	private void addLegacyReceiptValidationErrors(LegacyReceiptReq legacyReceiptRequest, List<ErrorField> errorFields) {
		for (LegacyReceiptHeader legacyReceiptHeader : legacyReceiptRequest.getLegacyReceipts()) {
			if (legacyReceiptHeader.getReceiptNo() == null || legacyReceiptHeader.getReceiptNo().isEmpty()) {
				ErrorField errorField = ErrorField.builder().code(RCPTNO_MISSING_CODE).message(RCPTNO_MISSING_MESSAGE)
						.field(RCPTNO_FIELD_NAME).build();
				errorFields.add(errorField);
			} else if (legacyReceiptHeader.getReceiptDate() == null) {
				ErrorField.builder().code(RCPTDATE_MISSING_CODE).message(RCPTDATE_MISSING_MESSAGE)
						.field(RCPTDATE_FIELD_NAME).build();
			}
		}
	}
}
