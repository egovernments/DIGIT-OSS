package org.egov.wscalculation.consumer;

import java.util.Map;

import org.egov.wscalculation.config.WSCalculationConfiguration;
import org.egov.wscalculation.producer.WSCalculationProducer;
import org.egov.wscalculation.service.BulkDemandAndBillGenService;
import org.egov.wscalculation.web.models.CalculationReq;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
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
	private WSCalculationConfiguration config;

	@Autowired
	private BulkDemandAndBillGenService bulkDemandAndBillGenService;

	@Autowired
	private WSCalculationProducer producer;

	/**
	 * Listen the topic for processing the batch records.
	 * 
	 * @param records
	 *            would be calculation criteria.
	 */
	@KafkaListener(topics = { "${egov.watercalculatorservice.createdemand.topic}" })
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
	 * @param request    Calculation request
	 *
	 */
	private void generateDemandInBatch(CalculationReq request) {
		
		try {
			bulkDemandAndBillGenService.bulkDemandGeneration(request);
		} catch (Exception ex) {
			log.error("Demand generation error: ", ex);
			log.info(" Bulk bill Errorbatch records log for batch :  " + request.getMigrationCount().getOffset()
					+ "Count is : " + request.getMigrationCount().getLimit());
			producer.push(config.getDeadLetterTopicBatch(), request.getMigrationCount());
		}
	}
}
