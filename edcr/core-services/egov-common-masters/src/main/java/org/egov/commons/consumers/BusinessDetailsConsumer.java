package org.egov.commons.consumers;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.commons.model.*;
import org.egov.commons.model.BusinessDetails;
import org.egov.commons.service.BusinessCategoryService;
import org.egov.commons.service.BusinessDetailsService;
import org.egov.commons.web.contract.*;
import org.egov.commons.web.contract.BusinessAccountDetails;
import org.egov.tracer.model.CustomException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class BusinessDetailsConsumer {

	public static final Logger LOGGER = LoggerFactory.getLogger(BusinessDetailsConsumer.class);
	   @Autowired
	    private ObjectMapper objectMapper;
	   @Autowired
		BusinessCategoryService businessCategoryService;
	

	@Autowired
	BusinessDetailsService businessDetailsService;

	@KafkaListener(topics = { "egov-common-business-details-create","egov-common-business-details-update" })
	public void processMessage(Map<String, Object> consumerRecord, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
		log.debug("key:" + topic + ":" + "value:" + consumerRecord);
		try {
            User user = objectMapper.convertValue(consumerRecord.get("RequestInfo"), RequestInfo.class).getUserInfo();
            BusinessDetailsRequest businessDetailsRequest = objectMapper.convertValue(consumerRecord, BusinessDetailsRequest.class);
            List<org.egov.commons.model.BusinessDetails> businessDetails = new BusinessDetails().getDomainList(businessDetailsRequest.getBusinessDetails(),user);
			if (topic.equals("egov-common-business-details-create")) {
			   businessDetailsService.createBusinessDetails(businessDetails);
			} else
                businessDetailsService.updateBusinessDetails(businessDetails);

		} catch (Exception exception) {
			log.debug("processMessage:" + exception);
			throw new CustomException("ERROR_PROCESSING_RECORD", exception.getMessage());
		}
	}

	private AuthenticatedUser getUserInfo(RequestInfo requestInfo) {
		User user = requestInfo.getUserInfo();
		return AuthenticatedUser.builder().id(user.getId()).anonymousUser(false).emailId(user.getEmailId())
				.mobileNumber(user.getMobileNumber()).name(user.getName()).build();
	}
}

