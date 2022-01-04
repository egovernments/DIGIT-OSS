package org.egov.commons.consumers;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.commons.model.AuthenticatedUser;
import org.egov.commons.service.BusinessCategoryService;
import org.egov.commons.web.contract.BusinessCategory;
import org.egov.commons.web.contract.BusinessCategoryRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;
import org.egov.tracer.model.CustomException;

import java.util.List;
import java.util.Map;
@Service
@Slf4j
public class BusinessCategoryConsumer {

	public static final Logger LOGGER = LoggerFactory.getLogger(BusinessCategoryConsumer.class);
	   @Autowired
	    private ObjectMapper objectMapper;
	

	@Autowired
	BusinessCategoryService businessCategoryService;

	@KafkaListener(topics = { "egov-common-business-category-create","egov-common-business-category-update" })
	public void processMessage(Map<String, Object> consumerRecord, @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
		log.debug("key:" + topic + ":" + "value:" + consumerRecord);
		try {
            BusinessCategoryRequest businessCategoryRequest = objectMapper.convertValue(consumerRecord, BusinessCategoryRequest.class);
            User user = objectMapper.convertValue(consumerRecord.get("RequestInfo"), RequestInfo.class).getUserInfo();
            List<org.egov.commons.model.BusinessCategory> businessCategoryList = new org.egov.commons.model.BusinessCategory().
                    getDomainList(businessCategoryRequest.getBusinessCategory(), user);
			if (topic.equals("egov-common-business-category-create")) {
                businessCategoryService.create(businessCategoryList);

            }
			else if(topic.equals("egov-common-business-category-update"))
				businessCategoryService.update(businessCategoryList);
		} catch (Exception exception) {
			log.debug("processMessage:" + exception);
			throw new CustomException("RECORD_PROCESSING_ERROR", exception.getMessage());
		}
	}

	private User getUserInfo(RequestInfo requestInfo) {
        return requestInfo.getUserInfo();
		//User user = requestInfo.getUserInfo();
		//return AuthenticatedUser.builder().id(user.getId()).anonymousUser(false).emailId(user.getEmailId())
			//	.mobileNumber(user.getMobileNumber()).name(user.getName()).build();
	}
}
