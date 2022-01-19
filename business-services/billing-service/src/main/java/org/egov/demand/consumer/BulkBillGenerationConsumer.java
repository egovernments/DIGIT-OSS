package org.egov.demand.consumer;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.egov.demand.model.BulkBillGenerator;
import org.egov.demand.model.Demand;
import org.egov.demand.model.GenerateBillCriteria;
import org.egov.demand.service.BillServicev2;
import org.egov.demand.service.DemandService;
import org.egov.demand.web.contract.DemandRequest;
import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

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
	
	@Value("${kafka.topics.bulk.bill.generation.audit}")
	private String bulkBillGenAuditTopic;

	@KafkaListener(topics = { "${kafka.topics.bulk.bill.generation}" })
	public void processMessage(Map<String, Object> consumerRecord, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {

		log.debug("key:" + topic + ":" + "value:" + consumerRecord);
		
		BulkBillGenerator billGenerator = objectMapper.convertValue(consumerRecord, BulkBillGenerator.class);
		DemandRequest request = DemandRequest.builder()
				.requestInfo(billGenerator.getRequestInfo())
				.demands(billGenerator.getCreateDemands())
				.build();
		
		try {
			demandService.create(request);
		} catch (Exception e) {
			logError("demand creation", e.getMessage());
		}
		
		request.setDemands(billGenerator.getUpdateDemands());
		try {
			demandService.updateAsync(request, null);
		} catch (Exception e) {
			logError("demand update", e.getMessage());
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
			logError("", e.getMessage());
		}
		
		kafkaTemplate.send(bulkBillGenAuditTopic, billGenerator.getMigrationCount());
		
		log.info("Bill generation ran suc");
	}
	
	private void logError(String process, String message) {
		
		throw new CustomException("EG_BS_BULKBILL_ERROR","Bulk Bill generation failed during "+ process + " with error : " + message);
	}

}