package org.egov.waterconnection.service;


import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import org.apache.commons.lang3.ObjectUtils;
import org.egov.common.contract.request.PlainAccessRequest;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.tracer.model.CustomException;
import org.egov.waterconnection.config.WSConfiguration;
import org.egov.waterconnection.constants.WCConstants;
import org.egov.waterconnection.producer.WaterConnectionProducer;
import org.egov.waterconnection.repository.IdGenRepository;
import org.egov.waterconnection.repository.ServiceRequestRepository;
import org.egov.waterconnection.repository.WaterDaoImpl;
import org.egov.waterconnection.util.EncryptionDecryptionUtil;
import org.egov.waterconnection.util.UnmaskingUtil;
import org.egov.waterconnection.util.WaterServicesUtil;
import org.egov.waterconnection.web.models.*;
import org.egov.waterconnection.web.models.Connection.StatusEnum;
import org.egov.waterconnection.web.models.Idgen.IdResponse;
import org.egov.waterconnection.web.models.users.User;
import org.egov.waterconnection.web.models.users.UserDetailResponse;
import org.egov.waterconnection.web.models.users.UserSearchRequest;
import org.egov.waterconnection.web.models.workflow.ProcessInstance;
import org.egov.waterconnection.workflow.WorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.egov.waterconnection.constants.WCConstants.DOCUMENT_ACCESS_AUDIT_MSG;
import static org.egov.waterconnection.constants.WCConstants.WNS_OWNER_ENCRYPTION_MODEL;
import static org.egov.waterconnection.constants.WCConstants.MODIFY_WATER_CONNECTION;
import static org.egov.waterconnection.constants.WCConstants.DISCONNECT_WATER_CONNECTION;

@Service
@Slf4j
public class EnrichmentService {

	@Autowired
	private WaterServicesUtil waterServicesUtil;

	@Autowired
	private IdGenRepository idGenRepository;

	@Autowired
	private WSConfiguration config;

	@Autowired
	private ObjectMapper mapper;
	
	@Lazy
	@Autowired
	private WaterDaoImpl waterDao;
	
	@Autowired
	private UserService userService;

	@Lazy
	@Autowired
	private WaterServiceImpl waterService;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private WorkflowService wfService;

	@Autowired
	private WaterConnectionProducer producer;

	@Autowired
	EncryptionDecryptionUtil encryptionDecryptionUtil;

	@Autowired
	private UnmaskingUtil unmaskingUtil;


	/**
	 * Enrich water connection
	 * 
	 * @param waterConnectionRequest WaterConnection Object
	 */
	@SuppressWarnings("unchecked")
	public void enrichWaterConnection(WaterConnectionRequest waterConnectionRequest, int reqType) {
		AuditDetails auditDetails = waterServicesUtil
				.getAuditDetails(waterConnectionRequest.getRequestInfo().getUserInfo().getUuid(), true);
		waterConnectionRequest.getWaterConnection().setAuditDetails(auditDetails);
		waterConnectionRequest.getWaterConnection().setId(UUID.randomUUID().toString());
		waterConnectionRequest.getWaterConnection().setStatus(StatusEnum.ACTIVE);

		if(waterConnectionRequest.getWaterConnection().getChannel() == null){
			if(waterConnectionRequest.getRequestInfo().getUserInfo().getType().equalsIgnoreCase("EMPLOYEE") )
				waterConnectionRequest.getWaterConnection().setChannel("CFC_COUNTER");
			if(waterConnectionRequest.getRequestInfo().getUserInfo().getType().equalsIgnoreCase("CITIZEN") )
				waterConnectionRequest.getWaterConnection().setChannel("CITIZEN");
			if(waterConnectionRequest.getRequestInfo().getUserInfo().getType().equalsIgnoreCase("SYSTEM") )
				waterConnectionRequest.getWaterConnection().setChannel("SYSTEM");
		}

		//Application creation date
		HashMap<String, Object> additionalDetail = new HashMap<>();
		if (waterConnectionRequest.getWaterConnection().getAdditionalDetails() == null) {
			for (String constValue : WCConstants.ADDITIONAL_OBJ_CONSTANT) {
				additionalDetail.put(constValue, null);
			}
		} else {
			additionalDetail = mapper
					.convertValue(waterConnectionRequest.getWaterConnection().getAdditionalDetails(), HashMap.class);
		}
		additionalDetail.put(WCConstants.APP_CREATED_DATE, BigDecimal.valueOf(System.currentTimeMillis()));
		waterConnectionRequest.getWaterConnection().setAdditionalDetails(additionalDetail);
	    //Setting ApplicationType
		String applicationType=null;
		
		
		if(reqType==WCConstants.CREATE_APPLICATION) {
			applicationType=WCConstants.NEW_WATER_CONNECTION;
		}
		else if(reqType==WCConstants.DISCONNECT_CONNECTION) {
			applicationType=WCConstants.DISCONNECT_WATER_CONNECTION;
		}
		else {
			applicationType=WCConstants.MODIFY_WATER_CONNECTION;
		}
		
		waterConnectionRequest.getWaterConnection().setApplicationType(applicationType);
		
		setApplicationIdGenIds(waterConnectionRequest);
		setStatusForCreate(waterConnectionRequest);

		WaterConnection connection = waterConnectionRequest.getWaterConnection();

		if (!CollectionUtils.isEmpty(connection.getRoadCuttingInfo())) {
			connection.getRoadCuttingInfo().forEach(roadCuttingInfo -> {
				roadCuttingInfo.setId(UUID.randomUUID().toString());
				roadCuttingInfo.setStatus(Status.ACTIVE);
				roadCuttingInfo.setAuditDetails(auditDetails);
			});
		}

		if (applicationType.equalsIgnoreCase(MODIFY_WATER_CONNECTION) || applicationType.equalsIgnoreCase(DISCONNECT_WATER_CONNECTION)) {
			if (!CollectionUtils.isEmpty(connection.getPlumberInfo())) {
				connection.getPlumberInfo().forEach(plumberInfo -> {
					plumberInfo.setId(null);
					plumberInfo.setAuditDetails(auditDetails);
				});
			}
		}

	}

	@SuppressWarnings("unchecked")
	public void enrichingAdditionalDetails(WaterConnectionRequest waterConnectionRequest) {
		HashMap<String, Object> additionalDetail = new HashMap<>();
		if (waterConnectionRequest.getWaterConnection().getAdditionalDetails() == null) {
			WCConstants.ADDITIONAL_OBJ_CONSTANT.forEach(key -> {
				additionalDetail.put(key, null);
			});
		} else {
			HashMap<String, Object> addDetail = mapper
					.convertValue(waterConnectionRequest.getWaterConnection().getAdditionalDetails(), HashMap.class);
			List<String> numberConstants = Arrays.asList(WCConstants.ADHOC_PENALTY, WCConstants.ADHOC_REBATE,
					WCConstants.INITIAL_METER_READING_CONST, WCConstants.APP_CREATED_DATE,
					WCConstants.ESTIMATION_DATE_CONST);
			for (String constKey : WCConstants.ADDITIONAL_OBJ_CONSTANT) {
				if (addDetail.getOrDefault(constKey, null) != null && numberConstants.contains(constKey)) {
					BigDecimal big = new BigDecimal(String.valueOf(addDetail.get(constKey)));
					additionalDetail.put(constKey, big);
				} else {
					additionalDetail.put(constKey, addDetail.get(constKey));
				}
			}
			if (waterConnectionRequest.getWaterConnection().getProcessInstance().getAction()
					.equalsIgnoreCase(WCConstants.APPROVE_CONNECTION_CONST)) {
				additionalDetail.put(WCConstants.ESTIMATION_DATE_CONST, System.currentTimeMillis());
			}
			additionalDetail.put(WCConstants.LOCALITY, addDetail.get(WCConstants.LOCALITY).toString());

			for (Map.Entry<String, Object> entry : addDetail.entrySet()) {
				if (additionalDetail.getOrDefault(entry.getKey(), null) == null) {
					additionalDetail.put(entry.getKey(), addDetail.get(entry.getKey()));
				}
			}
		}
		waterConnectionRequest.getWaterConnection().setAdditionalDetails(additionalDetail);
	}
	

	/**
	 * Sets the WaterConnectionId for given WaterConnectionRequest
	 *
	 * @param request
	 *            WaterConnectionRequest which is to be created
	 */
	private void setApplicationIdGenIds(WaterConnectionRequest request) {
		WaterConnection waterConnection = request.getWaterConnection();
		List<String> applicationNumbers = new ArrayList<>();
		if (request.getWaterConnection().getApplicationStatus() != null && request.isDisconnectRequest()) {
			applicationNumbers = getIdList(request.getRequestInfo(),
					request.getWaterConnection().getTenantId(), config.getWaterDisconnectionIdGenName(),
					config.getWaterDisconnectionIdGenFormat());
		} else {
			applicationNumbers = getIdList(request.getRequestInfo(),
					request.getWaterConnection().getTenantId(), config.getWaterApplicationIdGenName(),
					config.getWaterApplicationIdGenFormat());
		}
		if (applicationNumbers.size() != 1) {
			Map<String, String> errorMap = new HashMap<>();
			errorMap.put("IDGEN_ERROR",
					"The Id of WaterConnection returned by IdGen is not equal to number of WaterConnection");
			throw new CustomException(errorMap);
		}
		waterConnection.setApplicationNo(applicationNumbers.get(0));
	}

	private List<String> getIdList(RequestInfo requestInfo, String tenantId, String idKey, String idFormat) {
		List<IdResponse> idResponses = idGenRepository.getId(requestInfo, tenantId, idKey, idFormat, 1)
				.getIdResponses();

		if (CollectionUtils.isEmpty(idResponses))
			throw new CustomException(WCConstants.IDGEN_ERROR_CONST, "No ids returned from idgen Service");

		return idResponses.stream().map(IdResponse::getId).collect(Collectors.toList());
	}
	
	
	/**
	 * Enrich update water connection
	 * 
	 * @param waterConnectionRequest WaterConnectionRequest Object
	 */
	public void enrichUpdateWaterConnection(WaterConnectionRequest waterConnectionRequest) {
		AuditDetails auditDetails = waterServicesUtil
				.getAuditDetails(waterConnectionRequest.getRequestInfo().getUserInfo().getUuid(), false);
		waterConnectionRequest.getWaterConnection().setAuditDetails(auditDetails);
		WaterConnection connection = waterConnectionRequest.getWaterConnection();
		if (!CollectionUtils.isEmpty(connection.getDocuments())) {
			connection.getDocuments().forEach(document -> {
				if (document.getId() == null) {
					document.setId(UUID.randomUUID().toString());
					document.setDocumentUid(UUID.randomUUID().toString());
					document.setStatus(Status.ACTIVE);
				}
				document.setAuditDetails(auditDetails);
			});
		}
		if (!CollectionUtils.isEmpty(connection.getPlumberInfo())) {
			connection.getPlumberInfo().forEach(plumberInfo -> {
				if (plumberInfo.getId() == null) {
					plumberInfo.setId(UUID.randomUUID().toString());
				}
				plumberInfo.setAuditDetails(auditDetails);
			});
		}
		if (!CollectionUtils.isEmpty(connection.getRoadCuttingInfo())) {
			connection.getRoadCuttingInfo().forEach(roadCuttingInfo -> {
				if (roadCuttingInfo.getId() == null) {
					roadCuttingInfo.setId(UUID.randomUUID().toString());
					roadCuttingInfo.setStatus(Status.ACTIVE);
				}
				roadCuttingInfo.setAuditDetails(auditDetails);
			});
		}
		enrichingAdditionalDetails(waterConnectionRequest);
	}
	
	/**
	 * Enrich water connection request and add connection no if status is approved
	 * 
	 * @param waterConnectionRequest WaterConnectionRequest Object
	 */
	public void postStatusEnrichment(WaterConnectionRequest waterConnectionRequest) {
		if (WCConstants.ACTIVATE_CONNECTION
				.equalsIgnoreCase(waterConnectionRequest.getWaterConnection().getProcessInstance().getAction())) {
			setConnectionNO(waterConnectionRequest);
		}
	}

	/**
	 * Create meter reading for meter connection
	 *
	 * @param waterConnectionrequest
	 */
	public void postForMeterReading(WaterConnectionRequest waterConnectionrequest, int reqType) {
		if (!StringUtils.isEmpty(waterConnectionrequest.getWaterConnection().getConnectionType())
				&& WCConstants.METERED_CONNECTION
				.equalsIgnoreCase(waterConnectionrequest.getWaterConnection().getConnectionType())) {
			if (reqType == WCConstants.UPDATE_APPLICATION && WCConstants.ACTIVATE_CONNECTION
					.equalsIgnoreCase(waterConnectionrequest.getWaterConnection().getProcessInstance().getAction())) {
				waterDao.postForMeterReading(waterConnectionrequest);
			} else if (WCConstants.MODIFY_CONNECTION == reqType && WCConstants.APPROVE_CONNECTION.
					equals(waterConnectionrequest.getWaterConnection().getProcessInstance().getAction())) {
				SearchCriteria criteria = SearchCriteria.builder()
						.tenantId(waterConnectionrequest.getWaterConnection().getTenantId())
						.connectionNumber(Stream.of(waterConnectionrequest.getWaterConnection().getConnectionNo().toString()).collect(Collectors.toSet())).isCountCall(false)
						.build();
				List<WaterConnection> connections = waterService.search(criteria, waterConnectionrequest.getRequestInfo());
				if (!CollectionUtils.isEmpty(connections)) {
					WaterConnection connection = connections.get(connections.size() - 1);
					if (!connection.getConnectionType().equals(WCConstants.METERED_CONNECTION)) {
						waterDao.postForMeterReading(waterConnectionrequest);
					}
				}
			}
		}
	}
    
    
    /**
     * Enrich water connection request and set water connection no
     * @param request WaterConnectionRequest Object
     */
	private void setConnectionNO(WaterConnectionRequest request) {
		List<String> connectionNumbers = getIdList(request.getRequestInfo(), request.getWaterConnection().getTenantId(),
				config.getWaterConnectionIdGenName(), config.getWaterConnectionIdGenFormat());
		if (connectionNumbers.size() != 1) {
			throw new CustomException("IDGEN_ERROR",
					"The Id of WaterConnection returned by IdGen is not equal to number of WaterConnection");
		}
		request.getWaterConnection().setConnectionNo(connectionNumbers.get(0));
	}

	/**
	 * Enrich fileStoreIds
	 *
	 * @param waterConnectionRequest WaterConnectionRequest Object
	 */
	public void enrichFileStoreIds(WaterConnectionRequest waterConnectionRequest) {
		try {
			log.info("ACTION " + waterConnectionRequest.getWaterConnection().getProcessInstance().getAction());
			log.info("ApplicationStatus " + waterConnectionRequest.getWaterConnection().getApplicationStatus());
			if (waterConnectionRequest.getWaterConnection().getApplicationStatus()
					.equalsIgnoreCase(WCConstants.PENDING_APPROVAL_FOR_CONNECTION_CODE)
					|| waterConnectionRequest.getWaterConnection().getProcessInstance().getAction()
					.equalsIgnoreCase(WCConstants.ACTION_PAY)) {
				waterDao.enrichFileStoreIds(waterConnectionRequest);
			}
		} catch (Exception ex) {
			log.debug(ex.toString());
		}
	}

	/**
	 * Sets status for create request
	 *
	 * @param waterConnectionRequest The create request
	 */
	private void setStatusForCreate(WaterConnectionRequest waterConnectionRequest) {
		if (waterConnectionRequest.getWaterConnection().getProcessInstance().getAction()
				.equalsIgnoreCase(WCConstants.ACTION_INITIATE)) {
			waterConnectionRequest.getWaterConnection().setApplicationStatus(WCConstants.STATUS_INITIATED);
		}
	}

	/**
	 * Enrich
	 *
	 * @param waterConnectionList - List Of WaterConnectionObject
	 * @param criteria            - Search Criteria
	 * @param requestInfo         - RequestInfo Object
	 */
	public void enrichConnectionHolderDeatils(List<WaterConnection> waterConnectionList, SearchCriteria criteria,
											  RequestInfo requestInfo) {
		if (CollectionUtils.isEmpty(waterConnectionList))
			return;
		Set<String> connectionHolderIds = new HashSet<>();
		for (WaterConnection waterConnection : waterConnectionList) {
			if (!CollectionUtils.isEmpty(waterConnection.getConnectionHolders())) {
				connectionHolderIds.addAll(waterConnection.getConnectionHolders().stream()
						.map(OwnerInfo::getUuid).collect(Collectors.toSet()));
			}
		}
		if (CollectionUtils.isEmpty(connectionHolderIds))
			return;
		UserSearchRequest userSearchRequest = userService.getBaseUserSearchRequest(criteria.getTenantId(), requestInfo);
		userSearchRequest.setUuid(connectionHolderIds);

		PlainAccessRequest apiPlainAccessRequest = userSearchRequest.getRequestInfo().getPlainAccessRequest();
		/* Creating a PlainAccessRequest object to get unmasked data from user service */
		List<String> plainRequestFieldsList = new ArrayList<String>() {{
			add("userName");
			add("mobileNumber");
			add("correspondenceAddress");
			add("guardian");
			add("fatherOrHusbandName");
			add("name");
		}};
		PlainAccessRequest plainAccessRequest = PlainAccessRequest.builder().recordId(connectionHolderIds.iterator().next())
				.plainRequestFields(plainRequestFieldsList).build();

		userSearchRequest.getRequestInfo().setPlainAccessRequest(plainAccessRequest);

		UserDetailResponse userDetailResponse = userService.getUser(userSearchRequest);

		//Re-setting the original PlainAccessRequest object that came from api request
		requestInfo.setPlainAccessRequest(apiPlainAccessRequest);

		// Encrypting and decrypting the data as per ws-service requirement
		/* encrypt here */
		if (!criteria.getIsInternalCall()) {
			userDetailResponse.setUser((List<OwnerInfo>) encryptionDecryptionUtil.encryptObject(userDetailResponse.getUser(), WNS_OWNER_ENCRYPTION_MODEL, OwnerInfo.class));

			/* decrypt here */
			if (!criteria.getIsSkipLevelSearch()) {
				userDetailResponse.setUser(encryptionDecryptionUtil.decryptObject(userDetailResponse.getUser(), WNS_OWNER_ENCRYPTION_MODEL, OwnerInfo.class, requestInfo));
			}
		}
		enrichConnectionHolderInfo(userDetailResponse, waterConnectionList, requestInfo);
	}

	/**
	 * Populates the owner fields inside of the water connection objects from the response got from calling user api
	 * @param userDetailResponse
	 * @param waterConnectionList List of water connection whose owner's are to be populated from userDetailsResponse
	 */
	public void enrichConnectionHolderInfo(UserDetailResponse userDetailResponse, List<WaterConnection> waterConnectionList, RequestInfo requestInfo) {
		List<OwnerInfo> connectionHolderInfos = userDetailResponse.getUser();
		Map<String, OwnerInfo> userIdToConnectionHolderMap = new HashMap<>();
		connectionHolderInfos.forEach(user -> userIdToConnectionHolderMap.put(user.getUuid(), user));
		waterConnectionList.forEach(waterConnection -> {
			if (!CollectionUtils.isEmpty(waterConnection.getConnectionHolders())) {
				waterConnection.getConnectionHolders().forEach(holderInfo -> {
					if (userIdToConnectionHolderMap.get(holderInfo.getUuid()) == null)
						throw new CustomException("OWNER SEARCH ERROR", "The owner of the water application"
								+ waterConnection.getApplicationNo() + " is not coming in user search");
					else {
						Boolean isOpenSearch = isSearchOpen(requestInfo.getUserInfo());
						if (isOpenSearch)
							holderInfo.addUserDetail(getMaskedOwnerInfo(userIdToConnectionHolderMap.get(holderInfo.getUuid())));
						else
							holderInfo.addUserDetail(userIdToConnectionHolderMap.get(holderInfo.getUuid()));

					}

				});
			}
		});
	}

	public Boolean isSearchOpen(org.egov.common.contract.request.User userInfo) {

		return userInfo.getType().equalsIgnoreCase("SYSTEM")
				&& userInfo.getRoles().stream().map(Role::getCode).collect(Collectors.toSet()).contains("ANONYMOUS");
	}

	private User getMaskedOwnerInfo(OwnerInfo info) {

		info.setMobileNumber(null);
		info.setUuid(null);
		info.setUserName(null);
		info.setGender(null);
		info.setAltContactNumber(null);
		info.setPwdExpiryDate(null);

		return info;
	}


	/**
	 * Filter the connection from connection activated or modified state
	 *
	 * @param connectionList
	 * @return
	 */
	public List<WaterConnection> filterConnections(List<WaterConnection> connectionList) {
		HashMap<String, Connection> connectionHashMap = new LinkedHashMap<>();
		connectionList.forEach(connection -> {
			if (!StringUtils.isEmpty(connection.getConnectionNo())) {
				if (connectionHashMap.get(connection.getConnectionNo()) == null
						&& WCConstants.FINAL_CONNECTION_STATES.contains(connection.getApplicationStatus())) {
					connectionHashMap.put(connection.getConnectionNo(), connection);
				} else if (connectionHashMap.get(connection.getConnectionNo()) != null
						&& WCConstants.FINAL_CONNECTION_STATES.contains(connection.getApplicationStatus())) {
					if (connectionHashMap.get(connection.getConnectionNo()).getApplicationStatus()
							.equals(connection.getApplicationStatus())) {
						HashMap additionalDetail1 = new HashMap<>();
						HashMap additionalDetail2 = new HashMap<>();
						additionalDetail1 = mapper.convertValue(
								connectionHashMap.get(connection.getConnectionNo()).getAdditionalDetails(),
								HashMap.class);
						additionalDetail2 = mapper.convertValue(connection.getAdditionalDetails(), HashMap.class);
						BigDecimal creationDate1 = (BigDecimal) additionalDetail1.get(WCConstants.APP_CREATED_DATE);
						BigDecimal creationDate2 = (BigDecimal) additionalDetail2.get(WCConstants.APP_CREATED_DATE);
						if (creationDate1.compareTo(creationDate2) == -1) {
							connectionHashMap.put(connection.getConnectionNo(), connection);
						}
					} else if (connection.getApplicationStatus().equals(WCConstants.MODIFIED_FINAL_STATE)) {
							connectionHashMap.put(connection.getConnectionNo(), connection);
					} else {
						if (connection.getApplicationStatus().equals(WCConstants
								.DISCONNECTION_FINAL_STATE)) {
							connectionHashMap.put(connection.getConnectionNo(), connection);
						}
					}
				}
			}
		});
		return new ArrayList(connectionHashMap.values());
	}

	public List<WaterConnection> enrichPropertyDetails(List<WaterConnection> waterConnectionList, SearchCriteria criteria, RequestInfo requestInfo) {
		List<WaterConnection> finalConnectionList = new ArrayList<>();
		if (CollectionUtils.isEmpty(waterConnectionList))
			return finalConnectionList;

		Set<String> propertyIds = new HashSet<>();
		Map<String, List<OwnerInfo>> propertyToOwner = new HashMap<>();
		for (WaterConnection waterConnection : waterConnectionList) {
			if (!StringUtils.isEmpty(waterConnection.getPropertyId()))
				propertyIds.add(waterConnection.getPropertyId());
		}
		if (!CollectionUtils.isEmpty(propertyIds)) {
			PropertyCriteria propertyCriteria = new PropertyCriteria();
			if (!StringUtils.isEmpty(criteria.getTenantId())) {
				propertyCriteria.setTenantId(criteria.getTenantId());
			}
			propertyCriteria.setPropertyIds(propertyIds);
			List<Property> propertyList = waterServicesUtil.getPropertyDetails(serviceRequestRepository.fetchResult(waterServicesUtil.getPropertyURL(propertyCriteria),
					RequestInfoWrapper.builder().requestInfo(requestInfo).build()));

			if (!CollectionUtils.isEmpty(propertyList)) {
				for (Property property : propertyList) {
					propertyToOwner.put(property.getPropertyId(), property.getOwners());
				}
			}

			for (WaterConnection waterConnection : waterConnectionList) {
				HashMap<String, Object> additionalDetail = new HashMap<>();
				HashMap<String, Object> addDetail = mapper
						.convertValue(waterConnection.getAdditionalDetails(), HashMap.class);

				for (Map.Entry<String, Object> entry : addDetail.entrySet()) {
					if (additionalDetail.getOrDefault(entry.getKey(), null) == null) {
						additionalDetail.put(entry.getKey(), addDetail.get(entry.getKey()));
					}
				}
				List<OwnerInfo> ownerInfoList = propertyToOwner.get(waterConnection.getPropertyId());
				if (!CollectionUtils.isEmpty(ownerInfoList)) {
					additionalDetail.put("ownerName", ownerInfoList.get(0).getName());
				}
				waterConnection.setAdditionalDetails(additionalDetail);
				finalConnectionList.add(waterConnection);
			}


		}
		return finalConnectionList;
	}

	public void enrichProcessInstance(List<WaterConnection> waterConnectionList, SearchCriteria criteria,
									  RequestInfo requestInfo) {
		if (CollectionUtils.isEmpty(waterConnectionList))
			return;

		PlainAccessRequest apiPlainAccessRequest = requestInfo.getPlainAccessRequest();

		Map<String, ProcessInstance> processInstances = null;
		Set<String> applicationNumbers = waterConnectionList.stream().map(WaterConnection::getApplicationNo).collect(Collectors.toSet());

		if (criteria.getTenantId() != null)
			processInstances = wfService.getProcessInstances(requestInfo, applicationNumbers,
					criteria.getTenantId(), null);
		else
			processInstances = wfService.getProcessInstances(requestInfo, applicationNumbers,
					requestInfo.getUserInfo().getTenantId(), null);

		for (WaterConnection waterConnection : waterConnectionList) {
			if (!ObjectUtils.isEmpty(processInstances.get(waterConnection.getApplicationNo()))) {
				ProcessInstance processInstance = processInstances.get(waterConnection.getApplicationNo());
				waterConnection.getProcessInstance().setBusinessService(processInstance.getBusinessService());
				waterConnection.getProcessInstance().setModuleName(processInstance.getModuleName());
				if (!ObjectUtils.isEmpty(processInstance.getAssignes()))
					waterConnection.getProcessInstance().setAssignes(processInstance.getAssignes());
			}
		}
		requestInfo.setPlainAccessRequest(apiPlainAccessRequest);
	}

	public void enrichDocumentDetails(List<WaterConnection> waterConnectionList, SearchCriteria criteria,
									  RequestInfo requestInfo) {
		if (CollectionUtils.isEmpty(waterConnectionList))
			return;

		if(!criteria.getIsFilestoreIdRequire() || waterConnectionList.size()>1){
			for(int i= 0; i<waterConnectionList.size();i++){
				List<Document> documentList = waterConnectionList.get(i).getDocuments();
				for(int j =0; (documentList !=null && j<documentList.size()); j++){
					documentList.get(j).setFileStoreId(null);
				}
				waterConnectionList.get(i).setDocuments(documentList);
			}

		}
		else{
			List<String> uuids = new ArrayList<>();
			if(waterConnectionList.get(0).getConnectionHolders() != null){
				for(OwnerInfo connectionHolder : waterConnectionList.get(0).getConnectionHolders()){
					uuids.add(connectionHolder.getUuid());
				}
			}

			PropertyCriteria propertyCriteria = new PropertyCriteria();
			propertyCriteria.setPropertyIds(Collections.singleton(waterConnectionList.get(0).getPropertyId()));
			propertyCriteria.setTenantId(waterConnectionList.get(0).getTenantId());

			List<Property> propertyList = waterServicesUtil.getPropertyDetails(serviceRequestRepository.fetchResult(waterServicesUtil.getPropertyURL(propertyCriteria),
					RequestInfoWrapper.builder().requestInfo(requestInfo).build()));
			if(propertyList != null && propertyList.size()==1){
				List<OwnerInfo> ownerInfoList = propertyList.get(0).getOwners();
				for(OwnerInfo ownerInfo: ownerInfoList)
					uuids.add(ownerInfo.getUuid());
			}

			for(String uuid : uuids){
				Map<String, Object> auditObject = new HashMap<>();
				auditObject.put("id",UUID.randomUUID().toString());
				auditObject.put("timestamp",System.currentTimeMillis());
				auditObject.put("userId",uuid);
				auditObject.put("accessBy", requestInfo.getUserInfo().getUuid());
				auditObject.put("purpose",DOCUMENT_ACCESS_AUDIT_MSG);

				producer.push(config.getDocumentAuditTopic(), auditObject);
			}


		}


	}

	/**
	 * Method to take un-mask the connectionHolder details coming in from _update api
	 *
	 * @param waterConnection WaterConnection
	 * @param requestInfo RequestInfo
	 * @return unmasked ConnectionHolder details
	 */
	public OwnerInfo getConnectionHolderDetailsForUpdateCall(WaterConnection waterConnection, RequestInfo requestInfo) {
		if (ObjectUtils.isEmpty(waterConnection))
			return null;
		Set<String> connectionHolderIds = new HashSet<>();
		if (!CollectionUtils.isEmpty(waterConnection.getConnectionHolders())) {
			connectionHolderIds.addAll(waterConnection.getConnectionHolders().stream()
					.map(OwnerInfo::getUuid).collect(Collectors.toSet()));
		}
		if (CollectionUtils.isEmpty(connectionHolderIds))
			return null;

		unmaskingUtil.getOwnerDetailsUnmasked(waterConnection, requestInfo);
		UserDetailResponse userDetailResponse = new UserDetailResponse();

		List<WaterConnection> waterConnectionList = new ArrayList<>();
		waterConnectionList.add(waterConnection);
		userDetailResponse.setUser(waterConnection.getConnectionHolders());
		enrichConnectionHolderInfo(userDetailResponse, waterConnectionList, requestInfo);
		return userDetailResponse.getUser().get(0);
	}

}

