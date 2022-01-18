package org.egov.wscalculation.consumer;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.egov.wscalculation.config.WSCalculationConfiguration;
import org.egov.wscalculation.producer.WSCalculationProducer;
import org.egov.wscalculation.service.BulkDemandAndBillGenService;
import org.egov.wscalculation.web.models.CalculationCriteria;
import org.egov.wscalculation.web.models.CalculationReq;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
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
	@KafkaListener(topics = {
			"${egov.watercalculatorservice.createdemand.topic}" }, containerFactory = "kafkaListenerContainerFactoryBatch")
	public void listen(final HashMap<String, Object> records) {

		/*List<CalculationCriteria> calculationCriteria = new ArrayList<>();
		records.forEach(record -> {
			try {
				CalculationReq calcReq = mapper.convertValue(record.getPayload(), CalculationReq.class);
				calculationCriteria.addAll(calcReq.getCalculationCriteria());
			} catch (final Exception e) {
				StringBuilder builder = new StringBuilder();
				try {
					builder.append("Error while listening to value: ").append(mapper.writeValueAsString(record))
							.append(" on topic: ").append(e);
				} catch (JsonProcessingException e1) {
					log.error("KAFKA_PROCESS_ERROR", e1);
				}
				log.error(builder.toString());
			}
		});
		CalculationReq request = CalculationReq.builder().calculationCriteria(calculationCriteria)
				.requestInfo(calculationReq.getRequestInfo()).isconnectionCalculation(true).build();*/

		try{
			CalculationReq calculationReq = mapper.convertValue(records, CalculationReq.class);
			generateDemandInBatch(calculationReq);
		}catch (final Exception e){
			log.error("KAFKA_PROCESS_ERROR", e);
		}
		log.info("Number of batch records:  " + records.size());
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
			producer.push(config.getDeadLetterTopicBatch(), request.getMigrationCount());
		}
	}
}
