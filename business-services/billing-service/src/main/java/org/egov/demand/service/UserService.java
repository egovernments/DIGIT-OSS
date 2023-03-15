package org.egov.demand.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.model.Demand;
import org.egov.demand.web.contract.User;
import org.egov.demand.web.contract.UserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserService {
	
    @Autowired
    private RestTemplate restTemplate; 
    
    @Autowired
    private ApplicationProperties properties;
	
    /**
     * Fetched user based on phone number.
     * Note: Currently all CITIZEN are state-level and hence the phone no (which is set as username) is unique across state. 
     * 
     * @param requestInfo
     * @param phoneNo
     * @return
     */
	public Map<String, String> getUser(RequestInfo requestInfo, String phoneNo, String name, String tenantId) {
		
		Map<String, Object> request = new HashMap<>();
		UserResponse userResponse = null;
		Map<String, String> response = new HashMap<>();
		request.put("RequestInfo", requestInfo);
		request.put("userName", phoneNo);
		request.put("type", "CITIZEN");
		request.put("name", name);
		request.put("tenantId", tenantId.split("\\.")[0]);
		
		StringBuilder url = new StringBuilder();
		url.append(properties.getUserServiceHostName()).append(properties.getUserServiceSearchPath());
		
		try {
			
			userResponse = restTemplate.postForObject(url.toString(), request, UserResponse.class);
			if (null != userResponse) {
				if (!CollectionUtils.isEmpty(userResponse.getUser())) {

					response.put("id", userResponse.getUser().get(0).getUuid());
				}
			}
		} catch (Exception e) {
			log.error("Exception while fetching user: ", e);
		}
		
		return response;
	}
	
	public String createUser(Demand demand, RequestInfo requestInfo) {
		
		User payer = demand.getPayer();
		
		Map<String, Object> request = new HashMap<>();
		Map<String, Object> user = new HashMap<>();
		Map<String, String> role = new HashMap<>();
		
		List<Map<String, String>> roles = new ArrayList<>();
		role.put("code", "CITIZEN");
		role.put("name", "Citizen");
		role.put("tenantId", demand.getTenantId().split("\\.")[0]);
		roles.add(role);

		user.put("name", payer.getName());
		user.put("mobileNumber", payer.getMobileNumber());
		user.put("userName", UUID.randomUUID().toString());
		user.put("active", true);
		user.put("type", "CITIZEN");
		user.put("tenantId", demand.getTenantId().split("\\.")[0]);
		user.put("roles", roles);

		request.put("RequestInfo", requestInfo);
		request.put("user", user);

		UserResponse response = null;
		StringBuilder url = new StringBuilder();
		url.append(properties.getUserServiceHostName()).append(properties.getUserCreateEnpoint());
		
		try {
			
			response = restTemplate.postForObject(url.toString(), request, UserResponse.class);
		}catch(Exception e) {
			log.error("Exception while creating user: ", e);
			return null;
		}

		return response.getUser().get(0).getUuid();
	}

}

