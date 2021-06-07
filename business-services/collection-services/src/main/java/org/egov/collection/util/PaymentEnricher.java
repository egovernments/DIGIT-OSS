package org.egov.collection.util;

import static java.util.Objects.isNull;
import static org.egov.collection.config.CollectionServiceConstants.MASTER_BUSINESSSERVICE_KEY;
import static org.egov.collection.config.CollectionServiceConstants.MASTER_COLLECTIONMODESNOTALLOWED_KEY;
import static org.egov.collection.config.CollectionServiceConstants.MASTER_ISADVANCEALLOWED_KEY;
import static org.egov.collection.config.CollectionServiceConstants.MASTER_PARTPAYMENTALLOWED_KEY;
import static org.egov.collection.config.CollectionServiceConstants.MDMS_BUSINESSSERVICE_PATH;
import static org.egov.collection.model.enums.InstrumentTypesEnum.CARD;
import static org.egov.collection.model.enums.InstrumentTypesEnum.CASH;
import static org.egov.collection.model.enums.InstrumentTypesEnum.ONLINE;
import static org.egov.collection.model.enums.PaymentModeEnum.ONLINE_NEFT;
import static org.egov.collection.model.enums.PaymentModeEnum.ONLINE_RTGS;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.egov.collection.model.AuditDetails;
import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentDetail;
import org.egov.collection.model.PaymentRequest;
import org.egov.collection.model.enums.InstrumentStatusEnum;
import org.egov.collection.model.enums.PaymentStatusEnum;
import org.egov.collection.model.enums.Purpose;
import org.egov.collection.model.enums.ReceiptType;
import org.egov.collection.repository.BillingServiceRepository;
import org.egov.collection.repository.IdGenRepository;
import org.egov.collection.service.MDMSService;
import org.egov.collection.web.contract.Bill;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class PaymentEnricher {

	@Autowired
	private BillingServiceRepository billingRepository;

	@Autowired
	private IdGenRepository idGenRepository;

	@Autowired
	private MDMSService mdmsService;

	public void enrichPaymentPreValidate(PaymentRequest paymentRequest) {

		Payment payment = paymentRequest.getPayment();
		String tenantId = payment.getTenantId();
		List<String> billIds = payment.getPaymentDetails().stream().map(PaymentDetail::getBillId).collect(Collectors.toList());
		Set<String> billIdSet = payment.getPaymentDetails().stream().map(PaymentDetail::getBillId)
				.collect(Collectors.toSet());
		
		if (isNull(paymentRequest.getRequestInfo().getUserInfo()) || isNull(paymentRequest.getRequestInfo().getUserInfo().getUuid())) {
			throw new CustomException("USER_INFO_INVALID", "Invalid user info in request info, user id is mandatory");
		}
		
		if (billIdSet.size() < payment.getPaymentDetails().size())
			throw new CustomException("DUPLICATE_BILLID", "The Bill ids have been repeated for multiple payment details");

		Object mdmsData = mdmsService.mDMSCall(paymentRequest.getRequestInfo(),tenantId);

		List<Map> businessServices = JsonPath.read(mdmsData,MDMS_BUSINESSSERVICE_PATH);

		Map<String,Map> codeToBusinessService = new HashMap<>();

		businessServices.forEach(businessService -> {
			codeToBusinessService.put(businessService.get(MASTER_BUSINESSSERVICE_KEY).toString(),businessService);
		});

		List<Bill> validatedBills = billingRepository.fetchBill(paymentRequest.getRequestInfo(), payment.getTenantId(),
				billIds);
		Map<String, Bill> billIdToBillMap = new HashMap<>();
		Map<String, String> errorMap = new HashMap<>();

		// If the bills is non-empty list payer info is added to the bil
		if (CollectionUtils.isEmpty(validatedBills))
			throw new CustomException("INVALID_BILL_ID", "Bill IDs provided does not exist or is in an invalid state");
		else
			validatedBills.forEach(bill -> {
				Map billingServiceMaster = codeToBusinessService.get(bill.getBusinessService());
				if (CollectionUtils.isEmpty(bill.getBillDetails())) {
					log.error("Bill ID provided does not exist or is in an invalid state " + bill.getId());
					errorMap.put("INVALID_BILL_ID", "Bill ID provided does not exist or is in an invalid state: " + bill.getId());
				}
				else if(billingServiceMaster==null){
					log.error("BusinessService not found for bill with business service: " + bill.getBusinessService());
					errorMap.put("INVALID_BILL_BUSINESSSERVICE", "Business service provided does not exist for bill: " + bill.getId());
				}
				else {
					bill.setPaidBy(payment.getPaidBy());
					//payment.setPayerName(bill.getPayerName());
					//payment.setPayerAddress(bill.getPayerAddress());
					//payment.setMobileNumber(bill.getMobileNumber());
					try{
						List<String> collectionsModeNotAllowed = (List<String>)billingServiceMaster.get(MASTER_COLLECTIONMODESNOTALLOWED_KEY);
						bill.setIsAdvanceAllowed(((Boolean)billingServiceMaster.get(MASTER_ISADVANCEALLOWED_KEY)));
						bill.setPartPaymentAllowed((Boolean)billingServiceMaster.get(MASTER_PARTPAYMENTALLOWED_KEY));
						bill.setCollectionModesNotAllowed(collectionsModeNotAllowed);
					}
					catch (Exception e){
						errorMap.put("INVALID_BILL_BUSINESSSERVICE","Failed to parse the master data");
					}
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
			paymentDetail.setBusinessService(billIdToBillMap.get(paymentDetail.getBillId()).getBusinessService());
			paymentDetail.setBill(billIdToBillMap.get(paymentDetail.getBillId()));
			paymentDetail.setId(UUID.randomUUID().toString());
			paymentDetail.setTenantId(payment.getTenantId());
			paymentDetail.setAuditDetails(auditDetails);
			paymentDetail.setReceiptType(ReceiptType.BILLBASED.toString());
			paymentDetail.setReceiptDate(System.currentTimeMillis());
			paymentDetail.setTotalDue(billIdToBillMap.get(paymentDetail.getBillId()).getTotalAmount());
		});
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
		BigDecimal result = payment.getPaymentDetails().stream().map(PaymentDetail :: getTotalDue).collect(Collectors.toList())
										.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
		payment.setTotalDue(result);
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

		if (paymentMode.equalsIgnoreCase(ONLINE.name()) || paymentMode.equalsIgnoreCase(CARD.name()) ||
			paymentMode.equalsIgnoreCase(ONLINE_NEFT.name()) || paymentMode.equalsIgnoreCase(ONLINE_RTGS.name()))
			payment.setPaymentStatus(PaymentStatusEnum.DEPOSITED);
		else
			payment.setPaymentStatus(PaymentStatusEnum.NEW);

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
		if (paymentMode.equalsIgnoreCase(ONLINE.name()) || paymentMode.equalsIgnoreCase(CARD.name()) ||
				paymentMode.equalsIgnoreCase(ONLINE_NEFT.name()) || paymentMode.equalsIgnoreCase(ONLINE_RTGS.name()))
			payment.setInstrumentStatus(InstrumentStatusEnum.REMITTED);
		else
			payment.setInstrumentStatus(InstrumentStatusEnum.APPROVED);

		payment.setTransactionDate(new Date().getTime());
		if(paymentMode.equalsIgnoreCase(CASH.name()) || paymentMode.equalsIgnoreCase(CARD.name()) || paymentMode.equalsIgnoreCase(ONLINE.name())
				|| paymentMode.equalsIgnoreCase(ONLINE_NEFT.name()) || paymentMode.equalsIgnoreCase(ONLINE_RTGS.name())) {
			payment.setInstrumentDate(payment.getTransactionDate());
		}

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
						billAccountDetail.setDemandDetailId("advance_tax");
						billAccountDetail.setAdjustedAmount(BigDecimal.ZERO);
						billAccountDetail.setOrder(-1);
					}
				});
			});
		});
	}



}
