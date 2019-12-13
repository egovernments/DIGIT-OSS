package org.egov.demand.consumer;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.helper.CollectionReceiptRequest;
import org.egov.demand.model.BillDetail.StatusEnum;
import org.egov.demand.model.BillV2;
import org.egov.demand.repository.BillRepository;
import org.egov.demand.service.DemandService;
import org.egov.demand.service.ReceiptService;
import org.egov.demand.service.ReceiptServiceV2;
import org.egov.demand.web.contract.BillRequest;
import org.egov.demand.web.contract.BillRequestV2;
import org.egov.demand.web.contract.DemandRequest;
import org.egov.demand.web.contract.Receipt;
import org.egov.demand.web.contract.ReceiptRequest;
import org.egov.tracer.model.CustomException;
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
	private ObjectMapper objectMapper;

	@Autowired
	private BillRepository billRepository;

	@Autowired
	private ReceiptService receiptService;
	
	@Autowired
	private ReceiptServiceV2 receiptServiceV2;


	@KafkaListener(topics = { "${kafka.topics.receipt.update.collecteReceipt}", "${kafka.topics.save.bill}",
			"${kafka.topics.save.demand}", "${kafka.topics.update.demand}", "${kafka.topics.receipt.update.demand}",
			"${kafka.topics.receipt.cancel.name}", "${kafka.topics.receipt.update.demand.v2}",
			"${kafka.topics.receipt.cancel.name.v2}" })
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
			demandService.update(objectMapper.convertValue(consumerRecord, DemandRequest.class));
		
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
		 */
		else if (applicationProperties.getUpdateDemandFromReceiptV2().equals(topic)) {

			BillRequestV2 billReq = getBillsFromPayment(consumerRecord, false);
			receiptServiceV2.updateDemandFromReceipt(billReq, false);
		}

		/*
		 * update demand for receipt cancellation
		 */
		else if (applicationProperties.getReceiptCancellationTopicV2().equals(topic)) {

			BillRequestV2 billReq = getBillsFromPayment(consumerRecord, true);
			receiptServiceV2.updateDemandFromReceipt(billReq, true);
		}
	}


	/**
	 * @param consumerRecord
	 */
	private BillRequestV2 getBillsFromPayment(Map<String, Object> consumerRecord, boolean isReceiptCancelled) {
		
		DocumentContext context = null;
		
		try {
			context = JsonPath.parse(objectMapper.writeValueAsString(consumerRecord));
		} catch (JsonProcessingException e) {
			log.error("Parsing of data failed in back update for data : {}" + consumerRecord);
			throw new CustomException("Parsing of data failed in back update", e.getMessage());
		}
		
		List<BigDecimal> amtPaidList = Arrays.asList(objectMapper.convertValue(context.read("$.Payment.paymentDetails.*.totalAmountPaid"), BigDecimal[].class));
		List<BillV2> bills = Arrays.asList(objectMapper.convertValue(context.read("$.Payment.paymentDetails.*.bill"), BillV2[].class));
		
		for (int i = 0; i < bills.size(); i++) {
			
			BillV2 bill = bills.get(i);
			BigDecimal amtPaid = null != amtPaidList.get(i) ? amtPaidList.get(i) : BigDecimal.ZERO; 

			if (isReceiptCancelled) {
				bill.setStatus(org.egov.demand.model.BillV2.StatusEnum.CANCELLED);

			} else if (bill.getTotalAmount().compareTo(amtPaid) > 0) {
				bill.setStatus(org.egov.demand.model.BillV2.StatusEnum.PARTIALLY_PAID);

			} else {
				bill.setStatus(org.egov.demand.model.BillV2.StatusEnum.PAID);
		}
	}
		
		RequestInfo requestInfo = objectMapper.convertValue(context.read("$.RequestInfo"), RequestInfo.class);
		return BillRequestV2.builder().bills(bills).requestInfo(requestInfo).build();
	}
}