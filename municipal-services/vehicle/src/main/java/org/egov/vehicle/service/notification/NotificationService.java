package org.egov.vehicle.service.notification;

import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.egov.vehicle.config.VehicleConfiguration;
import org.egov.vehicle.service.UserService;
import org.egov.vehicle.trip.web.model.VehicleTripRequest;
import org.egov.vehicle.util.Constants;
import org.egov.vehicle.util.NotificationUtil;
import org.egov.vehicle.web.model.notification.SMSRequest;
import org.egov.vehicle.web.model.user.UserDetailResponse;
import org.egov.vehicle.web.model.user.UserSearchRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class NotificationService {

	@Autowired
	private VehicleConfiguration config;

	@Autowired
	private NotificationUtil util;

	@Autowired
	private UserService userService;
	
	@Autowired
	public NotificationService(VehicleConfiguration config) {
		this.config = config;

	}

	
	/**
	 * @param vehicleTripRequest
	 */
	public void process(VehicleTripRequest vehicleTripRequest) {
		List<SMSRequest> smsRequests = new LinkedList<>();
		if (null != config.getIsSMSEnabled()) {
			if (config.getIsSMSEnabled()) {
				enrichSMSRequest(vehicleTripRequest, smsRequests);
				if (!CollectionUtils.isEmpty(smsRequests))
					util.sendSMS(smsRequests, config.getIsSMSEnabled());
			}
		}
		
	}


	
	/**
	 * @param tripRequest
	 * @param smsRequests
	 */
	private void enrichSMSRequest(VehicleTripRequest tripRequest, List<SMSRequest> smsRequests) {
		String tenantId = tripRequest.getVehicleTrip().get(0).getTenantId();
		String localizationMessages = util.getLocalizationMessages(tenantId, tripRequest.getRequestInfo());
		String message = util.getCustomizedMsg(tripRequest, localizationMessages,Constants.FSM_SMS_FSTPO_TRIP_DECLINED);
		Map<String, String> mobileNumberToOwner = getUserList(tripRequest);
			
		smsRequests.addAll(util.createSMSRequest(message, mobileNumberToOwner));
		
	}

	
	/**
	 * @param tripRequest
	 * @return
	 */
	private Map<String, String> getUserList(VehicleTripRequest tripRequest) {
		Map<String, String> mobileNumberToOwner = new HashMap<>();
		String tenantId = tripRequest.getVehicleTrip().get(0).getTenantId();
		UserSearchRequest userSearchRequest  = new UserSearchRequest();
		userSearchRequest.setRequestInfo(tripRequest.getRequestInfo());
		userSearchRequest.setTenantId(tenantId);
		userSearchRequest.setActive(true);
		List<String> rolesCodes = Arrays.asList(config.getUserRoleCodes().split(","));
		userSearchRequest.setRoleCodes(rolesCodes);
		
		UserDetailResponse userDetailResponse=userService.searchUsersByCriteria(userSearchRequest);
		 
		if(null!=userDetailResponse && !CollectionUtils.isEmpty(userDetailResponse.getUser()))
			userDetailResponse.getUser().forEach(user -> {
				mobileNumberToOwner.put(user.getMobileNumber(), user.getName());
             });
		 
		return mobileNumberToOwner;
	}
}