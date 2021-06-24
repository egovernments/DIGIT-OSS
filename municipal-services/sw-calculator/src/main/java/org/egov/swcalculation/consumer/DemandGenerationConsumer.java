package org.egov.swcalculation.consumer;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.egov.swcalculation.config.SWCalculationConfiguration;
import org.egov.swcalculation.validator.SWCalculationWorkflowValidator;
import org.egov.swcalculation.web.models.CalculationCriteria;
import org.egov.swcalculation.web.models.CalculationReq;
import org.egov.swcalculation.producer.SWCalculationProducer;
import org.egov.swcalculation.service.MasterDataService;
import org.egov.swcalculation.service.SWCalculationServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.Message;
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
	private SWCalculationServiceImpl sWCalculationServiceImpl;

	@Autowired
	private SWCalculationProducer producer;

	@Autowired
	private MasterDataService mDataService;

	@Autowired
	private SWCalculationWorkflowValidator swCalculationWorkflowValidator;
	/**
	 * Listen the topic for processing the batch records.
	 * 
	 * @param records
	 *            would be calculation criteria.
	 */
	@KafkaListener(topics = {
			"${egov.seweragecalculatorservice.createdemand.topic}" }, containerFactory = "kafkaListenerContainerFactoryBatch")
	@SuppressWarnings("unchecked")
	public void listen(final List<Message<?>> records) {
		CalculationReq calculationReq = mapper.convertValue(records.get(0).getPayload(), CalculationReq.class);
		Map<String, Object> masterMap = mDataService.loadMasterData(calculationReq.getRequestInfo(),
				calculationReq.getCalculationCriteria().get(0).getTenantId());
		List<CalculationCriteria> calculationCriteria = new ArrayList<>();
		records.forEach(record -> {
			try {
				CalculationReq calcReq = mapper.convertValue(record.getPayload(), CalculationReq.class);
				calculationCriteria.addAll(calcReq.getCalculationCriteria());
				log.info("Consuming record: " + record);
			} catch (final Exception e) {
				StringBuilder builder = new StringBuilder();
				builder.append("Error while listening to value: ").append(record).append(" on topic: ").append(e);
				log.error(builder.toString());
			}
		});
		CalculationReq request = CalculationReq.builder().calculationCriteria(calculationCriteria)
				.requestInfo(calculationReq.getRequestInfo()).isconnectionCalculation(true).build();
		generateDemandInBatch(request, masterMap, config.getDeadLetterTopicBatch());
		log.info("Number of batch records:  " + records.size());
	}

	
	/**
	 * Listens on the dead letter topic of the bulk request and processes every
	 * record individually and pushes failed records on error topic
	 * 
	 * @param records
	 *            failed batch processing
	 */
	@KafkaListener(topics = {
			"${persister.demand.based.dead.letter.topic.batch}" }, containerFactory = "kafkaListenerContainerFactory")
	public void listenDeadLetterTopic(final List<Message<?>> records) {
		CalculationReq calculationReq = mapper.convertValue(records.get(0).getPayload(), CalculationReq.class);
		Map<String, Object> masterMap = mDataService.loadMasterData(calculationReq.getRequestInfo(),
				calculationReq.getCalculationCriteria().get(0).getTenantId());
		records.forEach(record -> {
			log.info("Consuming record on dead letter topic : " + record);
			try {
				CalculationReq calcReq = mapper.convertValue(record.getPayload(), CalculationReq.class);
				
				calcReq.getCalculationCriteria().forEach(calcCriteria -> {
					CalculationReq request = CalculationReq.builder().calculationCriteria(Arrays.asList(calcCriteria))
							.requestInfo(calculationReq.getRequestInfo()).isconnectionCalculation(true).build();
					try {
						log.info("Generating Demand for Criteria : " + calcCriteria);
						// processing single
						generateDemandInBatch(request, masterMap, config.getDeadLetterTopicSingle());
					} catch (final Exception e) {
						StringBuilder builder = new StringBuilder();
						builder.append("Error while generating Demand for Criteria: ").append(calcCriteria);
						log.error(builder.toString(), e);
					}
				});
			} catch (final Exception e) {
				StringBuilder builder = new StringBuilder();
				builder.append("Error while listening to value: ").append(record).append(" on dead letter topic.");
				log.error(builder.toString(), e);
			}
		});
	}

	/**
	 * Generate demand in bulk on given criteria
	 * 
	 * @param request
	 *            Calculation request
	 * @param masterMap
	 *            master data
	 * @param errorTopic
	 *            error topic
	 */
	private void generateDemandInBatch(CalculationReq request, Map<String, Object> masterMap, String errorTopic) {
		try {
			for(CalculationCriteria criteria : request.getCalculationCriteria()){
				Boolean genratedemand = true;
				swCalculationWorkflowValidator.nonMeterconnectionValidation(request.getRequestInfo(),criteria.getTenantId(),criteria.getConnectionNo(),genratedemand);
			}
			sWCalculationServiceImpl.bulkDemandGeneration(request, masterMap);
			StringBuilder str = new StringBuilder("Demand generated Successfully. For records : ").append(request.getCalculationCriteria());
			log.info(str.toString());
		} catch (Exception ex) {
			log.error("Demand generation error: ", ex);
			log.info("From Topic: " + errorTopic);
			producer.push(errorTopic, request);
		}

	}

}
