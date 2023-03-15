package org.egov.swcalculation.consumer;

import java.util.*;

import org.egov.swcalculation.validator.SWCalculationWorkflowValidator;
import org.egov.swcalculation.web.models.CalculationCriteria;
import org.egov.swcalculation.web.models.CalculationReq;
import org.egov.swcalculation.producer.SWCalculationProducer;
import org.egov.swcalculation.service.BulkDemandAndBillGenService;
import org.egov.swcalculation.service.MasterDataService;
import org.egov.swcalculation.service.SWCalculationServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import org.springframework.kafka.support.KafkaHeaders;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class DemandGenerationConsumer {

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private BulkDemandAndBillGenService bulkDemandAndBillGenService;

	@Autowired
	private SWCalculationProducer producer;

	@Autowired
	private MasterDataService mDataService;

	@Autowired
	private SWCalculationWorkflowValidator swCalculationWorkflowValidator;
	
	@Value("${kafka.topics.bulk.bill.generation.audit}")
	private String bulkBillGenAuditTopic;
	
	/**
	 * Listen the topic for processing the batch records.
	 * 
	 * @param consumerRecord would be calculation criteria.
	 */
	@KafkaListener(topics = { "${egov.seweragecalculatorservice.createdemand.topic}" })
	public void processMessage(Map<String, Object> consumerRecord, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
		try{
			CalculationReq calculationReq = mapper.convertValue(consumerRecord, CalculationReq.class);
			log.info(" Bulk bill Consumerbatch records log for batch :  "
					+ calculationReq.getMigrationCount().getOffset() + " Count is : "
					+ calculationReq.getMigrationCount().getLimit());
			generateDemandInBatch(calculationReq);
		}catch (final Exception e){
			log.error("KAFKA_PROCESS_ERROR", e);
		}
	}

	
	/**
	 * Generate demand in bulk on given criteria
	 * 
	 * @param request
	 *            Calculation request
	 */
	private void generateDemandInBatch(CalculationReq request) {
		/*
		 * this topic will be used by billing service to post message
		 */
		request.getMigrationCount().setAuditTopic(bulkBillGenAuditTopic);
		request.getMigrationCount().setAuditTime(System.currentTimeMillis());
		try {
			bulkDemandAndBillGenService.bulkDemandGeneration(request);
		} catch (Exception ex) {
			/*
			 * Error with message goes to audit topic
			 */
			log.error("Failed in DemandGenerationConsumer with error : " + ex.getMessage());
			log.info("Bulk bill Errorbatch records log for batch : " + request.getMigrationCount().getOffset()
					+ "Count is : " + request.getMigrationCount().getRecordCount());
			request.getMigrationCount().setMessage("Failed in DemandGenerationConsumer with error : " + ex.getMessage());
			producer.push(bulkBillGenAuditTopic, request.getMigrationCount());
		}

	}

}
