package org.egov.demand.repository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.egov.common.contract.response.ErrorResponse;
import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.web.contract.User;
import org.egov.demand.web.contract.UserResponse;
import org.egov.demand.web.contract.UserSearchRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
@Deprecated
public class PayerRepository {

	private static final Logger logger = LoggerFactory.getLogger(PayerRepository.class);

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private ApplicationProperties applicationProperties;
	
	@Autowired
	private ObjectMapper  objectMapper;

	public List<User> getPayers(UserSearchRequest userSearchRequest) {
		

		String url = applicationProperties.getUserServiceHostName() + applicationProperties.getUserServiceSearchPath();
		UserResponse userResponse = null;
		try {
			logger.info("OwnerRepository URL ---->> "+url+" \n userSearchRequest ---->> "+userSearchRequest);
			userResponse = restTemplate.postForObject(url, userSearchRequest, UserResponse.class);
		} catch (HttpClientErrorException e) {
			String errorResponseBody = e.getResponseBodyAsString();
			log.error("Following exception occurred: " + e.getResponseBodyAsString());
			ErrorResponse userErrorResponse = null;
			try {
				userErrorResponse = objectMapper.readValue(errorResponseBody, ErrorResponse.class);
			} catch (JsonMappingException jme) {
				log.error("Following Exception Occurred While Mapping JSON Response From User Service : "
						+ jme.getMessage());
				throw new RuntimeException(jme);
			} catch (JsonProcessingException jpe) {
				log.error("Following Exception Occurred While Processing JSON Response From User Service : "
						+ jpe.getMessage());
				throw new RuntimeException(jpe);
			} catch (IOException ioe) {
				log.error("Following Exception Occurred Calling User Service : " + ioe.getMessage());
				throw new RuntimeException(ioe);
			}
				log.debug("the exception from user module inside first catch block ::"+userErrorResponse.getError().toString());
				throw new RuntimeException(e);
		} catch (Exception e) {
			log.error("Following Exception Occurred While Calling User Service : " + e.getMessage());
			throw new RuntimeException(e);
		}
	
		return userResponse.getUser();
	}
}
