package org.egov.rb.consumer;

import java.util.HashMap;

import org.egov.rb.config.PropertyConfiguration;
import org.egov.rb.pgrmodels.Service.SourceEnum;
import org.egov.rb.pgrmodels.ServiceRequest;
import org.egov.rb.service.TransformService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class PGRConsumer {

	@Autowired
	PropertyConfiguration propertyConfiguration;
	
	@Autowired
	TransformService transformService;
	
	@KafkaListener(topics = { "${kafka.topics.update.pgr}"})
	public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		ServiceRequest serviceRequest=null;
		try {
			log.debug("Consuming record: " + record);
			serviceRequest = mapper.convertValue(record, ServiceRequest.class);
		} catch (final Exception e) {
			log.error("Error while listening to value: " + record + " on topic: " + topic + ": " + e);
		}
		log.debug("PGR data Received: " + serviceRequest.getServices().get(0).getServiceRequestId());
		if(serviceRequest.getServices().get(0).getSource().equals(SourceEnum.RBBOT)) {
			transformService.sendServiceRequestStatusMessage(serviceRequest);
		}
		 //TODO enable after implementation
	}
}