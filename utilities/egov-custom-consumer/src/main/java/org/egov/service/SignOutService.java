package org.egov.service;

import java.util.*;

import org.egov.models.RequestInfo;
import org.egov.models.RequestInfoWrapper;
import org.egov.utils.JsonPathConstant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class SignOutService {

	@Autowired
	private RestTemplate restTemplate;

	@Value("${egov.coexistence.hostname}")
	private String coexistencehost;

	@Value("${egov.coexistence.singout.uri}")
	private String coexistencelogoutUri;
	
	@Autowired
	private RedisTemplate<String, Object> redisTemplate;

	public void callFinanceForSignOut(DocumentContext documentContext) {
		ResponseEntity<?> response = null;
		String accessToken = documentContext.read(JsonPathConstant.signOutAccessToken);
		documentContext = documentContext.delete(JsonPathConstant.userInfo);
		documentContext = documentContext.put(JsonPathConstant.requestInfo, "authToken", accessToken);
		String correlationId = documentContext.read(JsonPathConstant.correlationId);
		LinkedHashMap<String, Object> jsonRequest = documentContext.read(JsonPathConstant.request);
		log.info(coexistencehost + coexistencelogoutUri + accessToken);
		RequestInfoWrapper reqInfoWrapper = new RequestInfoWrapper();
		RequestInfo requestInfo = new RequestInfo();
		requestInfo.setAuthToken(accessToken);
		requestInfo.setCorrelationId(correlationId);
		reqInfoWrapper.setRequestInfo(requestInfo);
		log.info("Call signout API");
		log.info(reqInfoWrapper.toString());
		String authStr = "auth:" + accessToken;

		Set<String> redisKeys = redisTemplate.keys("*");
// Store the keys in a List
		Iterator<String> it = redisKeys.iterator();
		while (it.hasNext()) {
			String data = it.next();
			log.info("Keys in redis: "+data);
		}

		if (Boolean.TRUE.equals(redisTemplate.hasKey(authStr))) {
			log.info("Reading session from Redis");
            Object sessionIdFromRedis = redisTemplate.opsForValue().get(authStr);
            if(sessionIdFromRedis != null)
            	log.info(sessionIdFromRedis.toString());
            ObjectMapper oMapper = new ObjectMapper();
            Map<String, String> map = oMapper.convertValue(sessionIdFromRedis, Map.class);
            log.info(map.toString());
            for(Map.Entry<String, String> entries : map.entrySet()) {
            	log.info("Redis-->Auth Token--->>> Keys::"+entries.getKey()+"::Values"+entries.getValue());
            	redisTemplate.delete(entries.getKey());
            }
            redisTemplate.delete(accessToken);
        }
		
		response = restTemplate.postForEntity(coexistencehost + coexistencelogoutUri, reqInfoWrapper, ResponseEntity.class);
		log.info("SignOutService response :" + response.getStatusCode());
	}

}
