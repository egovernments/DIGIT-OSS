package org.egov.bpa.service.notification;

import com.jayway.jsonpath.Filter;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.bpa.config.BPAConfiguration;
import org.egov.bpa.repository.ServiceRequestRepository;
import org.egov.bpa.service.BPALandService;
import org.egov.bpa.service.EDCRService;
import org.egov.bpa.service.UserService;
import org.egov.bpa.util.BPAConstants;
import org.egov.bpa.util.BPAUtil;
import org.egov.bpa.util.NotificationUtil;
import org.egov.bpa.web.model.*;
import org.egov.bpa.web.model.landInfo.LandInfo;
import org.egov.bpa.web.model.landInfo.LandSearchCriteria;
import org.egov.bpa.web.model.landInfo.Source;
import org.egov.bpa.web.model.user.UserDetailResponse;
import org.egov.common.contract.request.RequestInfo;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

import static com.jayway.jsonpath.Criteria.where;
import static com.jayway.jsonpath.Filter.filter;
import static org.egov.bpa.util.BPAConstants.*;

@Slf4j
@Service
public class BPANotificationService {

	private BPAConfiguration config;

	private ServiceRequestRepository serviceRequestRepository;

	private NotificationUtil util;
	
	private BPAUtil bpaUtil;

	@Autowired
	private UserService userService;
	
	@Autowired
	private BPALandService bpalandService;

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private EDCRService edcrService;

	@Value("${egov.mdms.host}")
	private String mdmsHost;

	@Value("${egov.mdms.search.endpoint}")
	private String mdmsUrl;

	@Autowired
	public BPANotificationService(BPAConfiguration config, ServiceRequestRepository serviceRequestRepository,
			NotificationUtil util, BPAUtil bpaUtil) {
		this.config = config;
		this.serviceRequestRepository = serviceRequestRepository;
		this.util = util;
		this.bpaUtil = bpaUtil;
	}

	/**
	 * Creates and send the sms based on the bpaRequest
	 * 
	 * @param bpaRequest
	 *            The bpaRequest consumed on the kafka topic
	 */
	public void process(BPARequest bpaRequest) {
		RequestInfo requestInfo = bpaRequest.getRequestInfo();
		Map<String, String> mobileNumberToOwner = new HashMap<>();
		String tenantId = bpaRequest.getBPA().getTenantId();
		String action = bpaRequest.getBPA().getWorkflow().getAction();
		List<String> configuredChannelNames =  fetchChannelList(new RequestInfo(), tenantId, BPA_BUSINESSSERVICE, action);
		Set<String> mobileNumbers = new HashSet<>();
		mobileNumberToOwner = getUserList(bpaRequest);

		for (Map.Entry<String, String> entryset : mobileNumberToOwner.entrySet()) {
			mobileNumbers.add(entryset.getKey());
		}

			if(configuredChannelNames.contains(CHANNEL_NAME_SMS)){
		List<SMSRequest> smsRequests = new LinkedList<>();
		if (null != config.getIsSMSEnabled()) {
			if (config.getIsSMSEnabled()) {
				enrichSMSRequest(bpaRequest, smsRequests);
				if (!CollectionUtils.isEmpty(smsRequests))
					util.sendSMS(smsRequests, config.getIsSMSEnabled());
			}
		}
		}

		if(configuredChannelNames.contains(CHANNEL_NAME_EVENT)){
			if (null != config.getIsUserEventsNotificationEnabled()) {
				if (config.getIsUserEventsNotificationEnabled()) {
				EventRequest eventRequest = getEvents(bpaRequest);
				if (null != eventRequest)
					util.sendEventNotification(eventRequest);
			    }
		    }
		}

		if(configuredChannelNames.contains(CHANNEL_NAME_EMAIL)){
//			EMAIL block TBD
			if (null != config.getIsEmailNotificationEnabled()) {
				if (config.getIsEmailNotificationEnabled()) {
					Map<String, String> mapOfPhnoAndEmail = util.fetchUserEmailIds(mobileNumbers, requestInfo, tenantId);
					String localizationMessages = util.getLocalizationMessages(tenantId, bpaRequest.getRequestInfo());
					String message = util.getEmailCustomizedMsg(bpaRequest.getRequestInfo(), bpaRequest.getBPA(), localizationMessages);
					List<EmailRequest> emailRequests = util.createEmailRequest(bpaRequest, message, mapOfPhnoAndEmail,mobileNumberToOwner);
					util.sendEmail(emailRequests);
				}
			}
		}
	}

	/**
	 * Creates and registers an event at the egov-user-event service at defined
	 * trigger points as that of sms notifs.
	 * 
	 * Assumption - The bpaRequest received will always contain only one BPA.
	 * 
	 * @param bpaRequest
	 * @return
	 */
	public EventRequest getEvents(BPARequest bpaRequest) {

		List<Event> events = new ArrayList<>();
		String tenantId = bpaRequest.getBPA().getTenantId();
		String localizationMessages = util.getLocalizationMessages(tenantId, bpaRequest.getRequestInfo()); // --need
		Map<String, String> edcrResponse = edcrService.getEDCRDetails(bpaRequest.getRequestInfo(), bpaRequest.getBPA());
		String applicationType = edcrResponse.get(BPAConstants.APPLICATIONTYPE);
																											// changes.
		String message = util.getEventsCustomizedMsg(bpaRequest.getRequestInfo(), bpaRequest.getBPA(), edcrResponse, localizationMessages); // --need localization service changes.
		BPA bpaApplication = bpaRequest.getBPA();
		Map<String, String> mobileNumberToOwner = getUserList(bpaRequest);

		List<SMSRequest> smsRequests = util.createSMSRequest(bpaRequest,message, mobileNumberToOwner);
		Set<String> mobileNumbers = smsRequests.stream().map(SMSRequest::getMobileNumber).collect(Collectors.toSet());
		Map<String, String> mapOfPhnoAndUUIDs = fetchUserUUIDs(mobileNumbers, bpaRequest.getRequestInfo(),
				bpaRequest.getBPA().getTenantId());

		Map<String, String> mobileNumberToMsg = smsRequests.stream()
				.collect(Collectors.toMap(SMSRequest::getMobileNumber, SMSRequest::getMessage));
		for (String mobile : mobileNumbers) {
			if (null == mapOfPhnoAndUUIDs.get(mobile) || null == mobileNumberToMsg.get(mobile)) {
				log.error("No UUID/SMS for mobile {} skipping event", mobile);
				continue;
			}
			List<String> toUsers = new ArrayList<>();
			toUsers.add(mapOfPhnoAndUUIDs.get(mobile));
			Recepient recepient = Recepient.builder().toUsers(toUsers).toRoles(null).build();
			List<String> payTriggerList = Arrays.asList(config.getPayTriggers().split("[,]"));
			Action action = null;
			String actionStatus = bpaApplication.getWorkflow().getAction()+"_"+bpaApplication.getStatus();
			String status = bpaApplication.getStatus();;
			if (payTriggerList.contains(bpaApplication.getStatus())) {
				List<ActionItem> items = new ArrayList<>();
				String busineService = bpaUtil.getFeeBusinessSrvCode(bpaApplication);
				String actionLink = config.getPayLink().replace("$mobile", mobile)
						.replace("$applicationNo", bpaApplication.getApplicationNo())
						.replace("$tenantId", bpaApplication.getTenantId()).replace("$businessService", busineService);
				actionLink = config.getUiAppHost() + actionLink;
				ActionItem item = ActionItem.builder().actionUrl(actionLink).code(config.getPayCode()).build();
				items.add(item);
				action = Action.builder().actionUrls(items).build();
			}
			if(actionStatus.equals(ACTION_STATUS_DOC_VERIFICATION))
			{
				List<ActionItem> items = new ArrayList<>();
				String actionLink = util.getApplicationDetailsPageLink(bpaRequest, mobile);
				ActionItem item = ActionItem.builder().actionUrl(actionLink).code(USREVENTS_EVENT_DOWNLOAD_RECEIPT_CODE).build();
				items.add(item);
				action = Action.builder().actionUrls(items).build();
			}
			if(status.equals(APPROVED_STATE) && applicationType.equals(BUILDING_PLAN))
			{
				List<ActionItem> items = new ArrayList<>();
				String actionLink = config.getUiAppHost() + config.getDownloadPermitOrderLink();
				actionLink = actionLink.replace("$applicationNo", bpaRequest.getBPA().getApplicationNo());
				ActionItem item = ActionItem.builder().actionUrl(actionLink).code(USREVENTS_EVENT_DOWNLOAD_PERMIT_ORDER_CODE).build();
				items.add(item);
				action = Action.builder().actionUrls(items).build();
			}
			if(status.equals(APPROVED_STATE) && applicationType.equals(BUILDING_PLAN_OC))
			{
				List<ActionItem> items = new ArrayList<>();
				String actionLink = config.getUiAppHost() + config.getDownloadOccupancyCertificateLink();
				actionLink = actionLink.replace("$applicationNo", bpaRequest.getBPA().getApplicationNo());
				ActionItem item = ActionItem.builder().actionUrl(actionLink).code(USREVENTS_EVENT_DOWNLOAD_OCCUPANCY_CERTIFICATE_CODE).build();
				items.add(item);
				action = Action.builder().actionUrls(items).build();
			}

			events.add(Event.builder().tenantId(bpaApplication.getTenantId()).description(mobileNumberToMsg.get(mobile))
					.eventType(BPAConstants.USREVENTS_EVENT_TYPE).name(BPAConstants.USREVENTS_EVENT_NAME)
					.postedBy(BPAConstants.USREVENTS_EVENT_POSTEDBY)
					.source(Source.WEBAPP)
					.recepient(recepient)
					.eventDetails(null).actions(action).build());
		}

		if (!CollectionUtils.isEmpty(events)) {
			return EventRequest.builder().requestInfo(bpaRequest.getRequestInfo()).events(events).build();
		} else {
			return null;
		}

	}

	/**
	 * Fetches UUIDs of CITIZENs based on the phone number.
	 * 
	 * @param mobileNumbers
	 * @param requestInfo
	 * @param tenantId
	 * @return
	 */
	private Map<String, String> fetchUserUUIDs(Set<String> mobileNumbers, RequestInfo requestInfo, String tenantId) {

		Map<String, String> mapOfPhnoAndUUIDs = new HashMap<>();
		StringBuilder uri = new StringBuilder();
		uri.append(config.getUserHost()).append(config.getUserSearchEndpoint());
		Map<String, Object> userSearchRequest = new HashMap<>();
		userSearchRequest.put("RequestInfo", requestInfo);
		userSearchRequest.put("tenantId", tenantId);
		userSearchRequest.put("userType", "CITIZEN");
		for (String mobileNo : mobileNumbers) {
			userSearchRequest.put("userName", mobileNo);
			try {
				Object user = serviceRequestRepository.fetchResult(uri, userSearchRequest);
				if (null != user) {
					String uuid = JsonPath.read(user, "$.user[0].uuid");
					mapOfPhnoAndUUIDs.put(mobileNo, uuid);
				} else {
					log.error("Service returned null while fetching user for username - " + mobileNo);
				}
			} catch (Exception e) {
				log.error("Exception while fetching user for username - " + mobileNo);
				log.error("Exception trace: ", e);
				continue;
			}
		}
		return mapOfPhnoAndUUIDs;
	}

	/**
	 * Enriches the smsRequest with the customized messages
	 * 
	 * @param bpaRequest
	 *            The bpaRequest from kafka topic
	 * @param smsRequests
	 *            List of SMSRequets
	 */
	private void enrichSMSRequest(BPARequest bpaRequest, List<SMSRequest> smsRequests) {
		String tenantId = bpaRequest.getBPA().getTenantId();
		String localizationMessages = util.getLocalizationMessages(tenantId, bpaRequest.getRequestInfo());
		String message = util.getCustomizedMsg(bpaRequest.getRequestInfo(), bpaRequest.getBPA(), localizationMessages);
		Map<String, String> mobileNumberToOwner = getUserList(bpaRequest);
		smsRequests.addAll(util.createSMSRequest(bpaRequest,message, mobileNumberToOwner));

	}

	/**
	 * To get the Users to whom we need to send the sms notifications or event
	 * notifications.
	 * 
	 * @param bpaRequest
	 * @return
	 */
	private Map<String, String> getUserList(BPARequest bpaRequest) {
		Map<String, String> mobileNumberToOwner = new HashMap<>();
		String tenantId = bpaRequest.getBPA().getTenantId();
		String stakeUUID = bpaRequest.getBPA().getAuditDetails().getCreatedBy();
		List<String> ownerId = new ArrayList<String>();
		ownerId.add(stakeUUID);
		BPASearchCriteria bpaSearchCriteria = new BPASearchCriteria();
		bpaSearchCriteria.setOwnerIds(ownerId);
		bpaSearchCriteria.setTenantId(tenantId);
		UserDetailResponse userDetailResponse = userService.getUser(bpaSearchCriteria, bpaRequest.getRequestInfo());

		LandSearchCriteria landcriteria = new LandSearchCriteria();
		landcriteria.setTenantId(bpaSearchCriteria.getTenantId());
		landcriteria.setIds(Arrays.asList(bpaRequest.getBPA().getLandId()));
		List<LandInfo> landInfo = bpalandService.searchLandInfoToBPA(bpaRequest.getRequestInfo(), landcriteria);

		mobileNumberToOwner.put(userDetailResponse.getUser().get(0).getUserName(),
				userDetailResponse.getUser().get(0).getName());
		

		if (bpaRequest.getBPA().getLandInfo() == null) {
			for (int j = 0; j < landInfo.size(); j++)
				bpaRequest.getBPA().setLandInfo(landInfo.get(j));
		}
		
		if (!(bpaRequest.getBPA().getWorkflow().getAction().equals(config.getActionsendtocitizen())
				&& bpaRequest.getBPA().getStatus().equals("INITIATED"))
				&& !(bpaRequest.getBPA().getWorkflow().getAction().equals(config.getActionapprove())
						&& bpaRequest.getBPA().getStatus().equals("INPROGRESS"))) {
			
			bpaRequest.getBPA().getLandInfo().getOwners().forEach(owner -> {
					if (owner.getMobileNumber() != null && owner.getIsPrimaryOwner()) {
						mobileNumberToOwner.put(owner.getMobileNumber(), owner.getName());
					}
			});
			
		}
		return mobileNumberToOwner;
	}

	public List<String> fetchChannelList(RequestInfo requestInfo, String tenantId, String moduleName, String action){
		List<String> masterData = new ArrayList<>();
		StringBuilder uri = new StringBuilder();
		uri.append(mdmsHost).append(mdmsUrl);
		if(StringUtils.isEmpty(tenantId))
			return masterData;
		MdmsCriteriaReq mdmsCriteriaReq = getMdmsRequestForChannelList(requestInfo, tenantId.split("\\.")[0]);

		Filter masterDataFilter = filter(
				where(MODULE).is(moduleName).and(ACTION).is(action)
		);

		try {
			Object response = restTemplate.postForObject(uri.toString(), mdmsCriteriaReq, Map.class);
			masterData = JsonPath.parse(response).read("$.MdmsRes.Channel.channelList[?].channelNames[*]", masterDataFilter);
		}catch(Exception e) {
			log.error("Exception while fetching workflow states to ignore: ",e);
		}
		return masterData;
	}

	private MdmsCriteriaReq getMdmsRequestForChannelList(RequestInfo requestInfo, String tenantId){
		MasterDetail masterDetail = new MasterDetail();
		masterDetail.setName(CHANNEL_LIST);
		List<MasterDetail> masterDetailList = new ArrayList<>();
		masterDetailList.add(masterDetail);

		ModuleDetail moduleDetail = new ModuleDetail();
		moduleDetail.setMasterDetails(masterDetailList);
		moduleDetail.setModuleName(CHANNEL);
		List<ModuleDetail> moduleDetailList = new ArrayList<>();
		moduleDetailList.add(moduleDetail);

		MdmsCriteria mdmsCriteria = new MdmsCriteria();
		mdmsCriteria.setTenantId(tenantId);
		mdmsCriteria.setModuleDetails(moduleDetailList);

		MdmsCriteriaReq mdmsCriteriaReq = new MdmsCriteriaReq();
		mdmsCriteriaReq.setMdmsCriteria(mdmsCriteria);
		mdmsCriteriaReq.setRequestInfo(requestInfo);

		return mdmsCriteriaReq;
	}

}
