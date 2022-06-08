package org.egov.demand.consumer;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.egov.demand.model.BulkBillGenerator;
import org.egov.demand.model.Demand;
import org.egov.demand.model.GenerateBillCriteria;
import org.egov.demand.model.MigrationCount;
import org.egov.demand.service.BillServicev2;
import org.egov.demand.service.DemandService;
import org.egov.demand.web.contract.DemandRequest;
import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class BulkBillGenerationConsumer {

	@Autowired
	private DemandService demandService;
	
	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private BillServicev2 billService;
	
	@Autowired
	private CustomKafkaTemplate<String, Object> kafkaTemplate;
	
	@KafkaListener(topics = { "${kafka.topics.bulk.bill.generation}" })
	public void processMessage(Map<String, Object> consumerRecord, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {

		log.debug("key:" + topic + ":" + "value:" + consumerRecord);
		
		BulkBillGenerator billGenerator = objectMapper.convertValue(consumerRecord, BulkBillGenerator.class);
		DemandRequest request = DemandRequest.builder()
				.requestInfo(billGenerator.getRequestInfo())
				.demands(billGenerator.getCreateDemands())
				.build();
		
		log.info(" Billing-bulkbill-consumer-batch log for batch : " + billGenerator.getMigrationCount().getOffset()
				+ " with no of records " + billGenerator.getCreateDemands().size());
		
		try {
			demandService.create(request);
		} catch (Exception e) {
			logError(" Demand creation ", e.getMessage(), billGenerator.getMigrationCount());
		}
		
		request.setDemands(billGenerator.getUpdateDemands());
		try {
			if (!CollectionUtils.isEmpty(billGenerator.getUpdateDemands()))
				demandService.updateAsync(request, null);
		} catch (Exception e) {
			logError(" Demand update ", e.getMessage(), billGenerator.getMigrationCount());
		}

		Set<String> consumerCodes = billGenerator.getCreateDemands()
				.stream()
				.map(Demand::getConsumerCode)
				.collect(Collectors.toSet());
		String tenantId = billGenerator.getCreateDemands().get(0).getTenantId();
		String businessService = billGenerator.getCreateDemands().get(0).getBusinessService();
		
		GenerateBillCriteria genBillCriteria = GenerateBillCriteria.builder()
				.consumerCode(consumerCodes)
				.businessService(businessService)
				.tenantId(tenantId)
				.build();
		
		try {
			billService.generateBill(genBillCriteria, billGenerator.getRequestInfo());
		} catch (Exception e) {
			logError(" Bill Gen ", e.getMessage(), billGenerator.getMigrationCount());
		}
		
		MigrationCount migrationCount = billGenerator.getMigrationCount();
		migrationCount.setAuditTime(System.currentTimeMillis());
		migrationCount.setMessage("prcoess succeded in billing service");
		kafkaTemplate.send(migrationCount.getAuditTopic(), billGenerator.getMigrationCount());
	}
	
	private void logError(String process, String message, MigrationCount bulkBillCount) {
		bulkBillCount.setAuditTime(System.currentTimeMillis());
		bulkBillCount.setMessage("prcoess failed in billing service during "+ process + " with error message : " + message);
		kafkaTemplate.send(bulkBillCount.getAuditTopic(), bulkBillCount);
	}

}