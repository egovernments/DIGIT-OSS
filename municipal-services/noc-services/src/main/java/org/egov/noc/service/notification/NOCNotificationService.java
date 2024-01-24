package org.egov.noc.service.notification;

import lombok.extern.slf4j.Slf4j;
import org.egov.noc.config.NOCConfiguration;
import org.egov.noc.repository.ServiceRequestRepository;
import org.egov.noc.service.UserService;
import org.egov.noc.util.NotificationUtil;
import org.egov.noc.web.model.NocRequest;
import org.egov.noc.web.model.NocSearchCriteria;
import org.egov.noc.web.model.SMSRequest;
import org.egov.noc.web.model.UserResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;

@Slf4j
@Service
public class NOCNotificationService {

	private NOCConfiguration config;

	private NotificationUtil util;

	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private UserService userService;

	@Autowired
	public NOCNotificationService(NOCConfiguration config, NotificationUtil util,
			ServiceRequestRepository serviceRequestRepository) {
		this.config = config;
		this.util = util;
		this.serviceRequestRepository = serviceRequestRepository;
	}

	/**
	 * Creates and send the sms based on the NOCRequest
	 * 
	 * @param nocRequest
	 *            The NOCRequest listenend on the kafka topic
	 */
	public void process(NocRequest nocRequest) {
		List<SMSRequest> smsRequests = new LinkedList<>();
		if (null != config.getIsSMSEnabled()) {
			if (config.getIsSMSEnabled()) {
				enrichSMSRequest(nocRequest, smsRequests);
				if (!CollectionUtils.isEmpty(smsRequests))
					util.sendSMS(nocRequest.getNoc().getTenantId(),smsRequests, config.getIsSMSEnabled());
			}
		}
	}

	/**
	 * Enriches the smsRequest with the customized messages
	 * 
	 * @param nocRequest
	 *            The bpaRequest from kafka topic
	 * @param smsRequests
	 *            List of SMSRequets
	 */
	private void enrichSMSRequest(NocRequest nocRequest, List<SMSRequest> smsRequests) {
		String tenantId = nocRequest.getNoc().getTenantId();
		String localizationMessages = util.getLocalizationMessages(tenantId, nocRequest.getRequestInfo());
		String message = util.getCustomizedMsg(nocRequest.getRequestInfo(), nocRequest.getNoc(), localizationMessages);
		if(message != null){
			Map<String, String> mobileNumberToOwner = getUserList(nocRequest);
			smsRequests.addAll(util.createSMSRequest(message, mobileNumberToOwner));
		}
		
	}

	/**
	 * To get the Users to whom we need to send the sms notifications or event
	 * notifications.
	 * 
	 * @param nocRequest
	 * @return
	 */
	private Map<String, String> getUserList(NocRequest nocRequest) {
		Map<String, String> mobileNumberToOwner = new HashMap<>();
		String tenantId = nocRequest.getNoc().getTenantId();
		String stakeUUID = nocRequest.getNoc().getAccountId();
		List<String> ownerId = new ArrayList<String>();
		ownerId.add(stakeUUID);
		NocSearchCriteria nocSearchCriteria = new NocSearchCriteria();
		nocSearchCriteria.setOwnerIds(ownerId);
		nocSearchCriteria.setTenantId(tenantId);
		UserResponse userDetailResponse = userService.getUser(nocSearchCriteria, nocRequest.getRequestInfo());
		mobileNumberToOwner.put(userDetailResponse.getUser().get(0).getMobileNumber(),
				userDetailResponse.getUser().get(0).getName());
		return mobileNumberToOwner;
	}

}
