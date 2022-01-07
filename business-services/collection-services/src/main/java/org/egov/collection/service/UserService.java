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

	private String string1="RequestInfo";

	private String string2="userName";

	private String string3="CITIZEN";

	private String string4="tenantId";
	
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
		request.put(string1, requestInfo);
		request.put(string2, phoneNo);
		request.put("type", string3);
		request.put(string4, tenantId.split("\\.")[0]);
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
		role.put("code", string3);
		role.put("name", string3);
		role.put(string4, bill.getTenantId().split("\\.")[0]);
		roles.add(role);
		
		user.put("name", bill.getPaidBy());
		user.put("mobileNumber", bill.getMobileNumber());
		user.put(string2, bill.getMobileNumber());
		user.put("active", true);
		user.put("type", string3);
		user.put(string4, bill.getTenantId().split("\\.")[0]);
		user.put("permanentAddress", bill.getPayerAddress());
		user.put("roles", roles);

		request.put(string1, requestInfo);
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
		role.put("code", string3);
		role.put("name", string3);
		role.put(string4, payment.getTenantId().split("\\.")[0]);
		roles.add(role);

		user.put("name", payment.getPaidBy());
		user.put("mobileNumber", payment.getMobileNumber());
		user.put(string2, payment.getMobileNumber());
		user.put("active", true);
		user.put("type", string3);
		user.put(string4, payment.getTenantId().split("\\.")[0]);
		user.put("permanentAddress", payment.getPayerAddress());
		user.put("roles", roles);

		request.put(string1, requestInfo);
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
