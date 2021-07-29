package org.egov.swcalculation.repository;

import java.util.HashMap;
import java.util.Map;

import org.egov.tracer.model.CustomException;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.ResourceAccessException;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

@org.springframework.stereotype.Repository
@Slf4j
public class Repository {

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private ObjectMapper mapper;

	/**
	 * Fetches results from external services through rest call.
	 *
	 * @param uri - URI to send the request
	 * @param request - Request Object
	 *
	 * @return Object
	 */
	public Object fetchResult(StringBuilder uri, Object request) {

		Object response = null;
		log.debug("URI: " + uri.toString());
		try {
			log.debug(mapper.writeValueAsString(request));
			response = restTemplate.postForObject(uri.toString(), request, Map.class);
		} catch (ResourceAccessException e) {
			Map<String, String> map = new HashMap<>();
			map.put("PARSING_ERROR", e.getMessage());
			throw new CustomException(map);
		} catch (HttpClientErrorException e) {
			log.info("the error is : " + e.getResponseBodyAsString());
			throw new ServiceCallException(e.getResponseBodyAsString());
		} catch (Exception e) {
			log.error("Exception while fetching from searcher: ", e);
		}
		return response;
	}
}
