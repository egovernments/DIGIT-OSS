package org.egov.demand.consumer;

import java.util.List;
import java.util.Map;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.helper.CollectionReceiptRequest;
import org.egov.demand.model.BillDetail.StatusEnum;
import org.egov.demand.repository.BillRepository;
import org.egov.demand.service.DemandService;
import org.egov.demand.service.ReceiptService;
import org.egov.demand.web.contract.BillRequest;
import org.egov.demand.web.contract.DemandRequest;
import org.egov.demand.web.contract.Receipt;
import org.egov.demand.web.contract.ReceiptRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

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
	}
}