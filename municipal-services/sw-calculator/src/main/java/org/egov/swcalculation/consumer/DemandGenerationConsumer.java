package org.egov.swcalculation.consumer;

import java.util.*;

import org.egov.swcalculation.config.SWCalculationConfiguration;
import org.egov.swcalculation.service.BulkDemandAndBillGenService;
import org.egov.swcalculation.validator.SWCalculationWorkflowValidator;
import org.egov.swcalculation.web.models.CalculationCriteria;
import org.egov.swcalculation.web.models.CalculationReq;
import org.egov.swcalculation.producer.SWCalculationProducer;
import org.egov.swcalculation.service.MasterDataService;
import org.egov.swcalculation.service.SWCalculationServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.Message;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class DemandGenerationConsumer {

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private SWCalculationConfiguration config;

	@Autowired
	private BulkDemandAndBillGenService bulkDemandAndBillGenService;

	@Autowired
	private SWCalculationProducer producer;

	@Autowired
	private MasterDataService mDataService;

	@Autowired
	private SWCalculationWorkflowValidator swCalculationWorkflowValidator;
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
					+ calculationReq.getMigrationCount().getOffset() + "Count is : "
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
		try {
			bulkDemandAndBillGenService.bulkDemandGeneration(request);
		} catch (Exception ex) {
			log.error("Demand generation error: ", ex);
			log.info(" Bulk bill Errorbatch records log for batch :  " + request.getMigrationCount().getOffset()
					+ "Count is : " + request.getMigrationCount().getLimit());
			producer.push(config.getDeadLetterTopicBatch(), request);
		}

	}

}
