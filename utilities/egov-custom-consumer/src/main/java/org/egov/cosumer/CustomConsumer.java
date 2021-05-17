package org.egov.cosumer;

import java.util.Map;

import org.egov.service.SignOutService;
import org.egov.utils.JsonPathConstant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class CustomConsumer {

	@Autowired
	private SignOutService signOutService;

	@KafkaListener(topics = { "${egov.custom.async.filter.topic}" })
	public void listen(final Map<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {

		log.info("CustomConsumer received request from topic: " + topic);
		log.info("data: " + record);
		log.info(record.keySet().toString());

		DocumentContext documentContext = JsonPath.parse(record);
		String sourceUri = documentContext.read(JsonPathConstant.signOutUriJsonPath);

		if (sourceUri.equals(JsonPathConstant.signOutUri))
			signOutService.callFinanceForSignOut(documentContext);

	}

}
