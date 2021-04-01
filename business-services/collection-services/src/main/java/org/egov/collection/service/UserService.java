package org.egov.collection.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egov.collection.config.ApplicationProperties;
import org.egov.collection.model.Payment;
import org.egov.collection.model.PaymentRequest;
import org.egov.collection.web.contract.Bill;
import org.egov.collection.web.contract.UserResponse;
import org.egov.common.contract.request.RequestInfo;
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
	public Map<String, String> getUser(RequestInfo requestInfo, String phoneNo, String tenantId){
		Map<String, Object> request = new HashMap<>();
		UserResponse userResponse = null;
		Map<String, String> response = new HashMap<>();
		request.put("RequestInfo", requestInfo);
		request.put("userName", phoneNo);
		request.put("type", "CITIZEN");
		request.put("tenantid", tenantId.split("\\.")[0]);
		StringBuilder url = new StringBuilder();
		url.append(properties.getUserHost()).append(properties.getUserSearchEnpoint());
		try {
			userResponse = restTemplate.postForObject(url.toString(), request, UserResponse.class);
			if(null != userResponse) {
				if(!CollectionUtils.isEmpty(userResponse.getReceiptCreators()))
					response.put("id", userResponse.getReceiptCreators().get(0).getUuid());
			}
		}catch(Exception e) {
			log.error("Exception while fetching user: ", e);
		}
		
		return response;
	}
	
	/**
	 * Creates user using the details given in Bill. We're not using the entire user object because:
	 * 1. User contract is old
	 * 2. Lot of unnecessary fields.
	 * 
	 * @param requestInfo
	 * @param bill
	 * @return
	 */
	public String createUser(RequestInfo requestInfo, Bill bill){
		Map<String, Object> request = new HashMap<>();
		Map<String, Object> user = new HashMap<>();
		Map<String, Object> role = new HashMap<>();
		List<Map> roles = new ArrayList<>();
		role.put("code", "CITIZEN");
		role.put("name", "Citizen");
		role.put("tenantId", bill.getTenantId().split("\\.")[0]);
		roles.add(role);
		
		user.put("name", bill.getPaidBy());
		user.put("mobileNumber", bill.getMobileNumber());
		user.put("userName", bill.getMobileNumber());
		user.put("active", true);
		user.put("type", "CITIZEN");
		user.put("tenantId", bill.getTenantId().split("\\.")[0]);
		user.put("permanentAddress", bill.getPayerAddress());
		user.put("roles", roles);

		request.put("RequestInfo", requestInfo);
		request.put("user", user);

		UserResponse response = null;
		StringBuilder url = new StringBuilder();
		url.append(properties.getUserHost()).append(properties.getUserCreateEnpoint());
		try {
			response = restTemplate.postForObject(url.toString(), request, UserResponse.class);
		}catch(Exception e) {
			log.error("Exception while creating user: ", e);
			return null;
		}
		
		return response.getReceiptCreators().get(0).getUuid();
	}

	public String createUser(PaymentRequest paymentRequest){
		RequestInfo requestInfo = paymentRequest.getRequestInfo();
		Payment payment = paymentRequest.getPayment();
		Map<String, Object> request = new HashMap<>();
		Map<String, Object> user = new HashMap<>();
		Map<String, Object> role = new HashMap<>();
		List<Map> roles = new ArrayList<>();
		role.put("code", "CITIZEN");
		role.put("name", "Citizen");
		role.put("tenantId", payment.getTenantId().split("\\.")[0]);
		roles.add(role);

		user.put("name", payment.getPaidBy());
		user.put("mobileNumber", payment.getMobileNumber());
		user.put("userName", payment.getMobileNumber());
		user.put("active", true);
		user.put("type", "CITIZEN");
		user.put("tenantId", payment.getTenantId().split("\\.")[0]);
		user.put("permanentAddress", payment.getPayerAddress());
		user.put("roles", roles);

		request.put("RequestInfo", requestInfo);
		request.put("user", user);

		UserResponse response = null;
		StringBuilder url = new StringBuilder();
		url.append(properties.getUserHost()).append(properties.getUserCreateEnpoint());
		try {
			response = restTemplate.postForObject(url.toString(), request, UserResponse.class);
		}catch(Exception e) {
			log.error("Exception while creating user: ", e);
			return null;
		}

		return response.getReceiptCreators().get(0).getUuid();
	}

}
