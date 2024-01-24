package org.egov.echallan.consumer;

import static org.egov.echallan.util.ChallanConstants.TENANTID_MDC_STRING;

import java.util.HashMap;

import org.egov.echallan.config.ChallanConfiguration;
import org.egov.echallan.repository.ChallanRepository;
import org.egov.echallan.util.ChallanConstants;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class CancelReceiptConsumer {
	
	@Value("${state.level.tenant.id}")
	private String stateLevelTenantID;
	
	@Autowired
    private ChallanRepository challanRepository;

	@Autowired
	private ChallanConfiguration config;
 
	@KafkaListener(topicPattern = "${kafka.topics.receipt.cancel.pattern}")
    public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
		try {
			if (topic.contains(config.getReceiptCancelTopic())) {
				log.info("received cancel receipt request--");
				
				// Adding in MDC so that tracer can add it in header
		        MDC.put(ChallanConstants.TENANTID_MDC_STRING, stateLevelTenantID);
		        
				challanRepository.updateChallanOnCancelReceipt(record);
			}
		} catch (final Exception e) {
			log.error("Error while listening to value: " + record + " on topic: " + topic + ": ", e.getMessage());
		}
    }
}
