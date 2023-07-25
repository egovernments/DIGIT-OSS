package org.egov.vendor.repository;

import java.util.Map;

import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Repository
@Slf4j
public class ServiceRequestRepository {

	private ObjectMapper mapper;
	private RestTemplate restTemplate;

	@Autowired
	public ServiceRequestRepository(ObjectMapper mapper, RestTemplate restTemplate) {
		this.mapper = mapper;
		this.restTemplate = restTemplate;
	}

	/**
	 * fetchResult form the different services based on the url and request object
	 * 
	 * @param uri
	 * @param request
	 * @return
	 */
	public Object fetchResult(StringBuilder uri, Object request) {
		Object response = null;
		// log.debug("URI: " + uri.toString());
		try {
			// log.debug("Request: " + mapper.writeValueAsString(request));
			response = restTemplate.postForObject(uri.toString(), request, Map.class);
		} catch (HttpClientErrorException e) {
			// log.error("External Service threw an Exception: ", e);
			throw new ServiceCallException(e.getResponseBodyAsString());
		} catch (Exception e) {
			// log.error("Exception while fetching from searcher: ", e);
			throw new ServiceCallException(e.getMessage());
		}

		return response;
	}
}
