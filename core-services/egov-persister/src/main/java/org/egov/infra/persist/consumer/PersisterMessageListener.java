package org.egov.infra.persist.consumer;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.egov.infra.persist.service.PersistService;
import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.MessageListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class PersisterMessageListener implements MessageListener<String, Object> {
	
	@Autowired
	private PersistService persistService;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private CustomKafkaTemplate kafkaTemplate;

	@Value("${audit.persist.kafka.topic}")
	private String persistAuditKafkaTopic;

	@Value("${audit.generate.kafka.topic}")
	private String auditGenerateKafkaTopic;

	@Override
	public void onMessage(ConsumerRecord<String, Object> data) {
		String rcvData = null;
		
		try {
			rcvData = objectMapper.writeValueAsString(data.value());
		} catch (JsonProcessingException e) {
			log.error("Failed to serialize incoming message", e);
		}
		persistService.persist(data.topic(),rcvData);

		if(!data.topic().equalsIgnoreCase(persistAuditKafkaTopic)){
			Map<String, Object> producerRecord = new HashMap<>();
			producerRecord.put("topic", data.topic());
			producerRecord.put("value", data.value());
			kafkaTemplate.send(auditGenerateKafkaTopic, producerRecord);
		}
	}

}
