package org.egov.demoutility.consumer;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

import org.apache.commons.lang3.RandomStringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.demoutility.config.PropertyManager;
import org.egov.demoutility.model.Address;
import org.egov.demoutility.model.Assignment;
import org.egov.demoutility.model.Boundary;
import org.egov.demoutility.model.CreateUserRequest;
import org.egov.demoutility.model.DemoUtilityRequest;
import org.egov.demoutility.model.Email;
import org.egov.demoutility.model.Employee;
import org.egov.demoutility.model.EmployeeRequest;
import org.egov.demoutility.model.EmployeeResponse;
import org.egov.demoutility.model.Gender;
import org.egov.demoutility.model.GeoLocation;
import org.egov.demoutility.model.GuardianRelation;
import org.egov.demoutility.model.Jurisdiction;
import org.egov.demoutility.model.NonLoggedInUserUpdatePasswordRequest;
import org.egov.demoutility.model.Role;
import org.egov.demoutility.model.User;
import org.egov.demoutility.model.UserRequest;
import org.egov.demoutility.model.UserType;
import org.egov.demoutility.model.Vehicle;
import org.egov.demoutility.model.Vendor;
import org.egov.demoutility.model.VendorRequest;
import org.egov.demoutility.model.VendorResponse;
import org.egov.demoutility.producer.Producer;
import org.egov.demoutility.querybuilder.DemoQueryBuilder;
import org.egov.demoutility.repository.ServiceCallRepository;
import org.egov.demoutility.service.DemoUtilityService;
import org.egov.demoutility.utils.UtilityConstants;
import org.egov.demoutility.model.EmailRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerConfigurationFactoryBean;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ObjectNode;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Configuration
public class DemoUtilityConsumer {

	@Autowired
	DemoUtilityService demoUtilityService;

	@KafkaListener(topics = { "${kafka.demoutility.topic}" })
	public void listen(final HashMap<String, Object> record, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic)
			throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		DemoUtilityRequest demoRequest = null;
		try {
			log.debug("Consuming record: " + record);
			demoRequest = mapper.convertValue(record, DemoUtilityRequest.class);
			demoUtilityService.createEmployee(demoRequest);
		} catch (final Exception e) {
			log.error("Error while listening to value: " + record + " on topic: " + topic + ": " + e);
		}
		// TODO enable after implementation
	}
}