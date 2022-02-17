package org.egov.demand.consumer;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.helper.CollectionReceiptRequest;
import org.egov.demand.model.BillDetail.StatusEnum;
import org.egov.demand.model.BillV2;
import org.egov.demand.model.PaymentBackUpdateAudit;
import org.egov.demand.repository.BillRepository;
import org.egov.demand.repository.DemandRepository;
import org.egov.demand.service.DemandService;
import org.egov.demand.service.ReceiptService;
import org.egov.demand.service.ReceiptServiceV2;
import org.egov.demand.util.Constants;
import org.egov.demand.util.Util;
import org.egov.demand.web.contract.BillRequest;
import org.egov.demand.web.contract.BillRequestV2;
import org.egov.demand.web.contract.DemandRequest;
import org.egov.demand.web.contract.Receipt;
import org.egov.demand.web.contract.ReceiptRequest;
import org.egov.tracer.model.CustomException;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class BillingServiceConsumer {

	@Autowired
	private ApplicationProperties applicationProperties;

	@Autowired
	private DemandService demandService;
	
	@Autowired
	private DemandRepository demandRepository;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private BillRepository billRepository;

	@Autowired
	private ReceiptService receiptService;
	
	@Autowired
	private ReceiptServiceV2 receiptServiceV2;
	
	@Autowired
	private Util util;


	@KafkaListener(topics = { "${kafka.topics.receipt.update.collecteReceipt}", "${kafka.topics.save.bill}",
			"${kafka.topics.save.demand}", "${kafka.topics.update.demand}", "${kafka.topics.receipt.update.demand}",
			"${kafka.topics.receipt.cancel.name}" })
	public void processMessage(Map<String, Object> consumerRecord, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {

		log.debug("key:" + topic + ":" + "value:" + consumerRecord);

		/*
		 * save demand topic
		 */
		if (applicationProperties.getCreateDemandTopic().equals(topic))
			demandService.save(objectMapper.convertValue(consumerRecord, DemandRequest.class));
		
		/*
		 * update demand topic
		 */
		else if (applicationProperties.getUpdateDemandTopic().equals(topic))
			demandService.update(objectMapper.convertValue(consumerRecord, DemandRequest.class), null);
		
		/*
		 * save bill
		 */
		else if (topic.equals(applicationProperties.getCreateBillTopic()))
			billRepository.saveBill(objectMapper.convertValue(consumerRecord, BillRequest.class));

		/*
		 * update demand from receipt
		 */
		else if (applicationProperties.getUpdateDemandFromReceipt().equals(topic)) {

			CollectionReceiptRequest collectionReceiptRequest = objectMapper.convertValue(consumerRecord,
					CollectionReceiptRequest.class);
			RequestInfo requestInfo = collectionReceiptRequest.getRequestInfo();
			List<Receipt> receipts = collectionReceiptRequest.getReceipt();

			ReceiptRequest receiptRequest = ReceiptRequest.builder().receipt(receipts).requestInfo(requestInfo)
					.tenantId(collectionReceiptRequest.getTenantId()).build();
			log.debug("the receipt request is -------------------" + receiptRequest);

			receiptService.updateDemandFromReceipt(receiptRequest, StatusEnum.CREATED, false);
		}

		/*
		 * update demand for receipt cancellation
		 */
		else if (applicationProperties.getReceiptCancellationTopic().equals(topic)) {
			receiptService.updateDemandFromReceipt(objectMapper.convertValue(consumerRecord, ReceiptRequest.class),
					StatusEnum.CANCELLED, true);
		}

		/*
		 * update demand from receipt
		 *//*
		else if (applicationProperties.getPaymentCreateTopic().equals(topic)) {

			Boolean isReceiptCancellation = false;
			updateDemandsFromPayment(consumerRecord, isReceiptCancellation);
		}*/

		/*
		 * update demand for receipt cancellation
		 */
		/*else if (applicationProperties.getPaymentCancelTopic().equals(topic)) {

			Boolean isReceiptCancellation = true;
			updateDemandsFromPayment(consumerRecord, isReceiptCancellation);
		}*/
	}




	@KafkaListener(topicPattern = "${kafka.topics.receipt.topic.pattern}")
	public void processPayment(Map<String, Object> consumerRecord, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {

		/*
		 * update demand from receipt
		 */

			Boolean isReceiptCancellation = false;
			updateDemandsFromPayment(consumerRecord, isReceiptCancellation);


	}

	@KafkaListener(topicPattern = "${kafka.topics.receipt.cancel.topic.pattern}")
	public void processPaymentCancel(Map<String, Object> consumerRecord, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {

		/*
		 * update demand from receipt
		 */

		Boolean isReceiptCancellation = true;
		updateDemandsFromPayment(consumerRecord, isReceiptCancellation);


	}



	private void updateDemandsFromPayment(Map<String, Object> consumerRecord, Boolean isReceiptCancellation) {

		BillRequestV2 billReq = BillRequestV2.builder().build();
		String tenantId = "";

		try {

			setBillRequestFromPayment(consumerRecord, billReq, isReceiptCancellation);
			/*
			 * setting tenantid value in mdc for tracer to read while making http calls
			 */
			tenantId = billReq.getBills().get(0).getTenantId();
			MDC.put(Constants.TENANTID_MDC_STRING, billReq.getBills().get(0).getTenantId());
			receiptServiceV2.updateDemandFromReceipt(billReq, isReceiptCancellation);

		} catch (JsonProcessingException | IllegalArgumentException e) {

			/*
			 * Adding random uuid in primary when jsonmapping exception occurs
			 */
			updatePaymentBackUpdateForFailure(tenantId, consumerRecord.toString(), UUID.randomUUID().toString() + " : " + e.getClass().getName(), isReceiptCancellation);
			log.info("EGBS_PAYMENT_SERIALIZE_ERROR",e.getClass().getName() + " : " + e.getMessage());

		} catch (Exception e ) {

			String paymentId = util.getValueFromAdditionalDetailsForKey(
					billReq.getBills().get(0).getAdditionalDetails(), Constants.PAYMENT_ID_KEY);
			updatePaymentBackUpdateForFailure(tenantId, e.getMessage(), paymentId, isReceiptCancellation);
			log.info("EGBS_PAYMENT_BACKUPDATE_ERROR",e.getClass().getName() + " : " + e.getMessage());

		}
	}


	/**
	 * @param consumerRecord
	 * @throws JsonProcessingException 
	 */
	private void setBillRequestFromPayment(Map<String, Object> consumerRecord, BillRequestV2 billReq, boolean isReceiptCancelled) throws JsonProcessingException {
		
		DocumentContext context = null;
		
		context = JsonPath.parse(objectMapper.writeValueAsString(consumerRecord));

		String paymentId = objectMapper.convertValue(context.read("$.Payment.id"), String.class);
		List<BigDecimal> amtPaidList = Arrays.asList(objectMapper.convertValue(context.read("$.Payment.paymentDetails.*.totalAmountPaid"), BigDecimal[].class));
		List<BillV2> bills = Arrays.asList(objectMapper.convertValue(context.read("$.Payment.paymentDetails.*.bill"), BillV2[].class));
		
		RequestInfo requestInfo = objectMapper.convertValue(context.read("$.RequestInfo"), RequestInfo.class);
		billReq.setBills(bills);
		billReq.setRequestInfo(requestInfo);
		
		/* payment value is set in zeroth index of bills
		 * 
		 * additionaldetail info from bill is not needed, so setting new value
		 */
		bills.get(0).setAdditionalDetails(util.setValuesAndGetAdditionalDetails(null, Constants.PAYMENT_ID_KEY, paymentId));
		validatePaymentForDuplicateUpdates(bills.get(0).getTenantId(), isReceiptCancelled, paymentId);

		for (int i = 0; i < bills.size(); i++) {
			
			BillV2 bill = bills.get(i);

			BigDecimal amtPaid = null != amtPaidList.get(i) ? amtPaidList.get(i) : BigDecimal.ZERO; 

			if (isReceiptCancelled) {
				bill.setStatus(org.egov.demand.model.BillV2.BillStatus.CANCELLED);

			} else if (bill.getTotalAmount().compareTo(amtPaid) > 0) {
				bill.setStatus(org.egov.demand.model.BillV2.BillStatus.PARTIALLY_PAID);

			} else {
				bill.setStatus(org.egov.demand.model.BillV2.BillStatus.PAID);
			}
		}
	}

	/**
	 * validation to prevent multiple back updates for same payment
	 * 
	 * @param isReceiptCancelled
	 * @param paymentId
	 */
	private void validatePaymentForDuplicateUpdates(String tenantId, boolean isReceiptCancelled, String paymentId) {

		PaymentBackUpdateAudit backUpdateAuditCriteria = PaymentBackUpdateAudit.builder()
				.isReceiptCancellation(isReceiptCancelled)
				.paymentId(paymentId)
				.isBackUpdateSucces(true)
				.tenantId(tenantId)
				.build();

		String paymentIdFromDb = demandRepository
				.searchPaymentBackUpdateAudit(backUpdateAuditCriteria);
		
		if (null != paymentIdFromDb && paymentIdFromDb.equalsIgnoreCase(paymentId))
			throw new CustomException("EGBS_PAYMENT_BACKUPDATE_ERROR",
					"Duplicate Payment object received for back update with payment-id : " + paymentId
							+ ", payment already updated to demands");
	}
	
	/**
	 * Update payment-back-update object based on whether error occurred in validation or not
	 * 
	 * 
	 * @param execptionDuringUpdateValidation
	 * @param paymentBackUpdateAudit
	 * @throws Exception 
	 */
	private void updatePaymentBackUpdateForFailure (String tenantId, String errorMsg, String paymentId, Boolean isReceiptCancellation) {

		PaymentBackUpdateAudit paymentBackUpdateAudit = PaymentBackUpdateAudit.builder()
				.isReceiptCancellation(isReceiptCancellation)
				.isBackUpdateSucces(false)
				.errorMessage(errorMsg)
				.paymentId(paymentId)
				.tenantId(tenantId)
				.build();

		demandRepository.insertBackUpdateForPayment(paymentBackUpdateAudit);
	}
}
