package org.egov.receipt.consumer.service;

import java.io.IOException;
import java.util.Map;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.egov.receipt.consumer.model.InstrumentContract;
import org.egov.receipt.consumer.model.InstrumentRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class InstrumentUpdateConsumer {
	@Autowired
    private ObjectMapper objectMapper;
	@Autowired
	private InstrumentService instrumentService;

	public static final Logger LOGGER = LoggerFactory.getLogger(InstrumentUpdateConsumer.class);
	
	@KafkaListener(topics = {"${kafka.topics.egf.instrument.completed.topic}"})
	public void process(ConsumerRecord<String, String> record){
		Map mastersMap;
		try {
			mastersMap = objectMapper.readValue(record.value(), Map.class);
			if(mastersMap.get("instrument_persisted") != null){
				InstrumentRequest request = objectMapper.convertValue(mastersMap.get("instrument_persisted"), InstrumentRequest.class);
				InstrumentContract contract = request.getInstruments().get(0);
				if(request.getRequestInfo().getAction().equals("update") && 
						contract.getFinancialStatus().getCode().equals("Dishonored") && 
						contract.getDishonor() != null && 
						contract.getDishonor().getReversalVoucherId() == null){
						LOGGER.error("instrument with id {} is got requested to dishonored", contract.getId());
						instrumentService.processDishonorIntruments(request);
				}
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			LOGGER.error("Exception occurred while listening to record: " + e.getMessage());
		}
	}
}
