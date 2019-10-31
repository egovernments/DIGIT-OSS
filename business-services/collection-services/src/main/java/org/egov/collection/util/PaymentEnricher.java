package org.egov.collection.util;

import lombok.extern.slf4j.Slf4j;
import org.egov.collection.model.AuditDetails;
import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentDetail;
import org.egov.collection.model.PaymentRequest;
import org.egov.collection.model.enums.*;
import org.egov.collection.repository.BillingServiceRepository;
import org.egov.collection.repository.IdGenRepository;
import org.egov.collection.web.contract.Bill;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
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

	@Autowired
	private BillingServiceRepository billingRepository;

	@Autowired
	private IdGenRepository idGenRepository;

	public void enrichPaymentPreValidate(PaymentRequest paymentRequest) {

		Payment payment = paymentRequest.getPayment();
		List<String> billIds = payment.getPaymentDetails().stream().map(PaymentDetail::getBillId)
				.collect(Collectors.toList());
		if (isNull(paymentRequest.getRequestInfo().getUserInfo())
				|| isNull(paymentRequest.getRequestInfo().getUserInfo().getId())) {
			throw new CustomException("USER_INFO_INVALID", "Invalid user info in request info, user id is mandatory");
		}
		Set<String> billIdSet = payment.getPaymentDetails().stream().map(PaymentDetail::getBillId)
				.collect(Collectors.toSet());
		if (billIdSet.size() < payment.getPaymentDetails().size())
			throw new CustomException("DUPLICATE_BILLID",
					"The Bill ids have been repeated for multiple payment details");

		List<Bill> validatedBills = billingRepository.fetchBill(paymentRequest.getRequestInfo(), payment.getTenantId(),
				billIds);
		Map<String, Bill> billIdToBillMap = new HashMap<>();
		Map<String, String> errorMap = new HashMap<>();

		// If the bills is non-empty list payer info is added to the bil
		if (CollectionUtils.isEmpty(validatedBills))
			throw new CustomException("INVALID_BILL_ID", "Bill IDs provided does not exist or is in an invalid state");
		else
			validatedBills.forEach(bill -> {
				if (CollectionUtils.isEmpty(bill.getBillDetails())) {
					log.error("Bill ID provided does not exist or is in an invalid state " + bill.getId());
					errorMap.put("INVALID_BILL_ID", "Bill ID provided does not exist or is in an invalid state");
				} else {
					bill.setPaidBy(payment.getPaidBy());
					bill.setPayerName(payment.getPayerName());
					bill.setMobileNumber(payment.getMobileNumber());
					bill.setPayerAddress(payment.getPayerAddress());
				}
				billIdToBillMap.put(bill.getId(), bill);
			});

		AuditDetails auditDetails = AuditDetails.builder()
				.createdBy(paymentRequest.getRequestInfo().getUserInfo().getId().toString())
				.createdTime(System.currentTimeMillis())
				.lastModifiedBy(paymentRequest.getRequestInfo().getUserInfo().getId().toString())
				.lastModifiedTime(System.currentTimeMillis()).build();

		// Assigns bill object to each paymentDetail if no bill object is found the
		// billId from paymentDetail is added in error map
		payment.getPaymentDetails().forEach(paymentDetail -> {
			paymentDetail.setBill(billIdToBillMap.get(paymentDetail.getBillId()));
			paymentDetail.setId(UUID.randomUUID().toString());
			paymentDetail.setTenantId(payment.getTenantId());
			paymentDetail.setAuditDetails(auditDetails);
			paymentDetail.setReceiptType(ReceiptType.BILLBASED.toString());
			paymentDetail.setReceiptDate(System.currentTimeMillis());
		});

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);

		payment.setId(UUID.randomUUID().toString());
		payment.setAuditDetails(auditDetails);

	}

	/**
	 * Enrich instrument for financials For each bill detail, - Set status to
	 * approved by default for now, no workflow - Set collection type to online or
	 * counter - Set receipt date - Generate and set receipt number
	 *
	 * @param paymentRequest
	 *            paymentRequest to be enriched
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
			String receiptNumber = idGenRepository.generateReceiptNumber(paymentRequest.getRequestInfo(),
					paymentDetail.getBusinessService(), paymentDetail.getTenantId());
			paymentDetail.setReceiptNumber(receiptNumber);
			paymentDetail.getBill().setAmountPaid(paymentDetail.getTotalAmountPaid());

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
			payment.setPaymentStatus(PaymentStatusEnum.DEPOSITED);
		else
			payment.setPaymentStatus(PaymentStatusEnum.NEW);
	}

	/**
	 * Apportion adds another billAccDetail for Advance tax head when advance amt is
	 * paid, this method enriches that object
	 *
	 * @param bills
	 */
	public void enrichAdvanceTaxHead(List<Bill> bills) {
		bills.forEach(bill -> {
			bill.getBillDetails().forEach(billDetail -> {
				billDetail.getBillAccountDetails().forEach(billAccountDetail -> {
					if (StringUtils.isEmpty(billAccountDetail.getId())
							&& billAccountDetail.getPurpose().equals(Purpose.ADVANCE)) {
						billAccountDetail.setId(UUID.randomUUID().toString());
						billAccountDetail.setTenantId(bill.getTenantId());
						billAccountDetail.setBillDetailId(billDetail.getId());
					}
				});
			});
		});
	}



}
