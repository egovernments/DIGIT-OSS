package org.egov.swservice.service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

import org.apache.commons.lang3.ObjectUtils;
import org.egov.common.contract.request.PlainAccessRequest;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.swservice.config.SWConfiguration;
import org.egov.swservice.producer.SewarageConnectionProducer;
import org.egov.swservice.repository.IdGenRepository;
import org.egov.swservice.repository.ServiceRequestRepository;
import org.egov.swservice.repository.SewerageDaoImpl;
import org.egov.swservice.util.EncryptionDecryptionUtil;
import org.egov.swservice.util.SWConstants;
import org.egov.swservice.util.SewerageServicesUtil;
import org.egov.swservice.util.UnmaskingUtil;
import org.egov.swservice.web.models.*;
import org.egov.swservice.web.models.Connection.StatusEnum;
import org.egov.swservice.web.models.Idgen.IdResponse;
import org.egov.swservice.web.models.users.User;
import org.egov.swservice.web.models.users.UserDetailResponse;
import org.egov.swservice.web.models.users.UserSearchRequest;
import org.egov.swservice.web.models.workflow.ProcessInstance;
import org.egov.swservice.workflow.WorkflowService;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

import static org.egov.swservice.util.SWConstants.DOCUMENT_ACCESS_AUDIT_MSG;
import static org.egov.swservice.util.SWConstants.WNS_OWNER_ENCRYPTION_MODEL;
import static org.egov.swservice.util.SWConstants.MODIFY_SEWERAGE_CONNECTION;
import static org.egov.swservice.util.SWConstants.DISCONNECT_SEWERAGE_CONNECTION;

@Service
@Slf4j
public class EnrichmentService {

	@Autowired
	private SewerageServicesUtil sewerageServicesUtil;

	@Autowired
	private IdGenRepository idGenRepository;

	@Autowired
	private SWConfiguration config;

	@Autowired
	private ObjectMapper mapper;

	@Lazy
	@Autowired
	private SewerageDaoImpl sewerageDao;

	@Autowired
	private UserService userService;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private WorkflowService wfService;

	@Autowired
	private SewarageConnectionProducer producer;

	@Autowired
	EncryptionDecryptionUtil encryptionDecryptionUtil;

	@Autowired
	private UnmaskingUtil unmaskingUtil;

	/**
	 * 
	 * @param sewerageConnectionRequest
	 *            - Sewerage Connection Requst Object
	 */
	@SuppressWarnings("unchecked")
	public void enrichSewerageConnection(SewerageConnectionRequest sewerageConnectionRequest, int reqType) {
		AuditDetails auditDetails = sewerageServicesUtil
				.getAuditDetails(sewerageConnectionRequest.getRequestInfo().getUserInfo().getUuid(), true);
		sewerageConnectionRequest.getSewerageConnection().setAuditDetails(auditDetails);
		sewerageConnectionRequest.getSewerageConnection().setId(UUID.randomUUID().toString());
		sewerageConnectionRequest.getSewerageConnection().setStatus(StatusEnum.ACTIVE);

		if(sewerageConnectionRequest.getSewerageConnection().getChannel() == null){
			if(sewerageConnectionRequest.getRequestInfo().getUserInfo().getType().equalsIgnoreCase("EMPLOYEE") )
				sewerageConnectionRequest.getSewerageConnection().setChannel("CFC_COUNTER");
			if(sewerageConnectionRequest.getRequestInfo().getUserInfo().getType().equalsIgnoreCase("CITIZEN") )
				sewerageConnectionRequest.getSewerageConnection().setChannel("CITIZEN");
			if(sewerageConnectionRequest.getRequestInfo().getUserInfo().getType().equalsIgnoreCase("SYSTEM") )
				sewerageConnectionRequest.getSewerageConnection().setChannel("SYSTEM");
		}


		HashMap<String, Object> additionalDetail = new HashMap<>();
		if (sewerageConnectionRequest.getSewerageConnection().getAdditionalDetails() == null) {
			for (String constValue : SWConstants.ADDITIONAL_OBJECT) {
				additionalDetail.put(constValue, null);
			}
		} else {
			additionalDetail = mapper.convertValue(
					sewerageConnectionRequest.getSewerageConnection().getAdditionalDetails(), HashMap.class);
		}
		// Application created date
		additionalDetail.put(SWConstants.APP_CREATED_DATE, BigDecimal.valueOf(System.currentTimeMillis()));
		sewerageConnectionRequest.getSewerageConnection().setAdditionalDetails(additionalDetail);
		// Setting ApplicationType
		String applicationType=null;
		
		
		if(reqType==SWConstants.CREATE_APPLICATION) {
			applicationType=SWConstants.NEW_SEWERAGE_CONNECTION;
		}
		else if(reqType==SWConstants.DISCONNECT_CONNECTION) {
			applicationType=SWConstants.DISCONNECT_SEWERAGE_CONNECTION;
		}
		else {
			applicationType=SWConstants.MODIFY_SEWERAGE_CONNECTION;
		}
		
		sewerageConnectionRequest.getSewerageConnection().setApplicationType(applicationType);
		
		setSewarageApplicationIdgenIds(sewerageConnectionRequest);
		setStatusForCreate(sewerageConnectionRequest);

		SewerageConnection connection = sewerageConnectionRequest.getSewerageConnection();

		if (!CollectionUtils.isEmpty(connection.getRoadCuttingInfo())) {
			connection.getRoadCuttingInfo().forEach(roadCuttingInfo -> {
				roadCuttingInfo.setId(UUID.randomUUID().toString());
				roadCuttingInfo.setStatus(Status.ACTIVE);
				roadCuttingInfo.setAuditDetails(auditDetails);
			});
		}

		if (applicationType.equalsIgnoreCase(MODIFY_SEWERAGE_CONNECTION) || applicationType.equalsIgnoreCase(DISCONNECT_SEWERAGE_CONNECTION)) {
			if (!CollectionUtils.isEmpty(connection.getPlumberInfo())) {
				connection.getPlumberInfo().forEach(plumberInfo -> {
					plumberInfo.setId(null);
					plumberInfo.setAuditDetails(auditDetails);
				});
			}
		}

	}

	@SuppressWarnings("unchecked")
	public void enrichingAdditionalDetails(SewerageConnectionRequest sewerageConnectionRequest) {
		HashMap<String, Object> additionalDetail = new HashMap<>();
		if (sewerageConnectionRequest.getSewerageConnection().getAdditionalDetails() == null) {
			SWConstants.ADDITIONAL_OBJECT.forEach(key -> additionalDetail.put(key, null));
		} else {
			HashMap<String, Object> addDetail = mapper.convertValue(
					sewerageConnectionRequest.getSewerageConnection().getAdditionalDetails(), HashMap.class);
			List<String> adhocPenalityAndRebateConst = Arrays.asList(SWConstants.ADHOC_PENALTY,
					SWConstants.ADHOC_REBATE, SWConstants.APP_CREATED_DATE, SWConstants.ESTIMATION_DATE_CONST);
			for (String constKey : SWConstants.ADDITIONAL_OBJECT) {
				if (addDetail.getOrDefault(constKey, null) != null && adhocPenalityAndRebateConst.contains(constKey)) {
					BigDecimal big = new BigDecimal(String.valueOf(addDetail.get(constKey)));
					additionalDetail.put(constKey, big);
				} else {
					additionalDetail.put(constKey, addDetail.get(constKey));
				}
			}
			if (sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction()
					.equalsIgnoreCase(SWConstants.APPROVE_CONNECTION_CONST)) {
				additionalDetail.put(SWConstants.ESTIMATION_DATE_CONST, System.currentTimeMillis());
			}
			additionalDetail.put(SWConstants.LOCALITY,addDetail.get(SWConstants.LOCALITY).toString());

			for (Map.Entry<String, Object> entry: addDetail.entrySet()) {
				if (additionalDetail.getOrDefault(entry.getKey(), null) == null) {
					additionalDetail.put(entry.getKey(), addDetail.get(entry.getKey()));
				}
			}
		}
		sewerageConnectionRequest.getSewerageConnection().setAdditionalDetails(additionalDetail);
	}

	/**
	 * Sets status for create request
	 * 
	 * @param sewerageConnectionRequest
	 *            Sewerage connection request
	 *
	 */
	private void setStatusForCreate(SewerageConnectionRequest sewerageConnectionRequest) {
		if (sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction()
				.equalsIgnoreCase(SWConstants.ACTION_INITIATE)) {
			sewerageConnectionRequest.getSewerageConnection().setApplicationStatus(SWConstants.STATUS_INITIATED);
		}
	}

	/**
	 * Sets the SewarageConnectionId for given SewerageConnectionRequest
	 *
	 * @param request
	 *            SewerageConnectionRequest which is to be created
	 */
	private void setSewarageApplicationIdgenIds(SewerageConnectionRequest request) {
		List<String> applicationNumbers = new ArrayList<>();
		if (request.getSewerageConnection().getApplicationStatus() != null && request.isDisconnectRequest()) {
			applicationNumbers = getIdList(request.getRequestInfo(),
					request.getSewerageConnection().getTenantId(), config.getSewerageDisconnectionIdGenName(),
					config.getSewerageDisconnectionIdGenFormat(), 1);
		} else {
			applicationNumbers = getIdList(request.getRequestInfo(),
					request.getSewerageConnection().getTenantId(), config.getSewerageApplicationIdGenName(),
					config.getSewerageApplicationIdGenFormat(), 1);
		}
		if (CollectionUtils.isEmpty(applicationNumbers) || applicationNumbers.size() != 1) {
			Map<String, String> errorMap = new HashMap<>();
			errorMap.put("IDGEN ERROR ",
					"The Id of SewerageConnection returned by idgen is not equal to number of SewerageConnection");
			throw new CustomException(errorMap);
		}
		request.getSewerageConnection().setApplicationNo(applicationNumbers.listIterator().next());
	}

	private List<String> getIdList(RequestInfo requestInfo, String tenantId, String idKey, String idFormat, int count) {
		List<IdResponse> idResponses = idGenRepository.getId(requestInfo, tenantId, idKey, idFormat, count)
				.getIdResponses();

		if (CollectionUtils.isEmpty(idResponses))
			throw new CustomException("IDGEN_ERROR", "No ids returned from IdGen Service");

		return idResponses.stream().map(IdResponse::getId).collect(Collectors.toList());
	}

	/**
	 * Enrich update sewarage connection
	 * 
	 * @param sewerageConnectionRequest
	 *            - Sewerage Connection Request Object
	 */
	public void enrichUpdateSewerageConnection(SewerageConnectionRequest sewerageConnectionRequest) {
		AuditDetails auditDetails = sewerageServicesUtil
				.getAuditDetails(sewerageConnectionRequest.getRequestInfo().getUserInfo().getUuid(), false);
		sewerageConnectionRequest.getSewerageConnection().setAuditDetails(auditDetails);
		SewerageConnection connection = sewerageConnectionRequest.getSewerageConnection();
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

		enrichingAdditionalDetails(sewerageConnectionRequest);
	}

	/**
	 * Enrich sewerage connection request and add connection no if status is
	 * approved
	 * 
	 * @param sewerageConnectionRequest
	 *            - Sewerage connection request object
	 */
	public void postStatusEnrichment(SewerageConnectionRequest sewerageConnectionRequest) {
		if (SWConstants.ACTIVATE_CONNECTION
				.equalsIgnoreCase(sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction())) {
			setConnectionNO(sewerageConnectionRequest);
		}
	}

	/**
	 * Enrich sewerage connection request and set sewerage connection no
	 * 
	 * @param request
	 *            Sewerage Connection Request Object
	 */
	private void setConnectionNO(SewerageConnectionRequest request) {
		List<String> connectionNumbers = getIdList(request.getRequestInfo(),
				request.getSewerageConnection().getTenantId(), config.getSewerageIdGenName(),
				config.getSewerageIdGenFormat(), 1);

		if (CollectionUtils.isEmpty(connectionNumbers) || connectionNumbers.size() != 1) {
			Map<String, String> errorMap = new HashMap<>();
			errorMap.put("IDGEN_ERROR",
					"The Id of Sewerage Connection returned by idgen is not equal to number of Sewerage Connection");
			throw new CustomException(errorMap);
		}

		request.getSewerageConnection().setConnectionNo(connectionNumbers.listIterator().next());
	}

	/**
	 * Enrich fileStoreIds
	 * 
	 * @param sewerageConnectionRequest
	 *            - Sewerage Connection Request Object
	 */
	public void enrichFileStoreIds(SewerageConnectionRequest sewerageConnectionRequest) {
		try {
			log.info("ACTION "+sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction());
			log.info("ApplicationStatus "+sewerageConnectionRequest.getSewerageConnection().getApplicationStatus());
			if (sewerageConnectionRequest.getSewerageConnection().getApplicationStatus()
					.equalsIgnoreCase(SWConstants.PENDING_APPROVAL_FOR_CONNECTION_CODE)
					|| sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction()
							.equalsIgnoreCase(SWConstants.ACTION_PAY)) {
				sewerageDao.enrichFileStoreIds(sewerageConnectionRequest);
			}
		} catch (Exception ex) {
			log.debug(ex.toString());
		}
	}

	/**
	 * Enrich sewerage connection list
	 *
	 * @param sewerageConnectionList
	 * @param requestInfo
	 */
	public void enrichConnectionHolderDeatils(List<SewerageConnection> sewerageConnectionList, SearchCriteria criteria,
			RequestInfo requestInfo) {
		if (CollectionUtils.isEmpty(sewerageConnectionList))
			return;
		Set<String> connectionHolderIds = new HashSet<>();
		for (SewerageConnection sewerageConnection : sewerageConnectionList) {
			if (!CollectionUtils.isEmpty(sewerageConnection.getConnectionHolders())) {
				connectionHolderIds.addAll(sewerageConnection.getConnectionHolders().stream()
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

		// Encrypting and decrypting the data as per sw-service requirement
		/* encrypt here */
		if (!criteria.getIsInternalCall()) {
			userDetailResponse.setUser((List<OwnerInfo>) encryptionDecryptionUtil.encryptObject(userDetailResponse.getUser(), WNS_OWNER_ENCRYPTION_MODEL, OwnerInfo.class));

			/* decrypt here */
			if (!criteria.getIsSkipLevelSearch()) {
				userDetailResponse.setUser(encryptionDecryptionUtil.decryptObject(userDetailResponse.getUser(), WNS_OWNER_ENCRYPTION_MODEL, OwnerInfo.class, requestInfo));
			}
		}
		enrichConnectionHolderInfo(userDetailResponse, sewerageConnectionList,requestInfo);
	}

	/**
	 * Populates the owner fields inside of the sewerage connection objects from the
	 * response got from calling user api
	 * 
	 * @param userDetailResponse
	 * @param sewerageConnectionList
	 *            List of Sewerage connection whose owner's are to be populated from
	 *            userDetailsResponse
	 */
	public void enrichConnectionHolderInfo(UserDetailResponse userDetailResponse,
			List<SewerageConnection> sewerageConnectionList,RequestInfo requestInfo) {
		List<OwnerInfo> connectionHolderInfos = userDetailResponse.getUser();
		Map<String, OwnerInfo> userIdToConnectionHolderMap = new HashMap<>();
		connectionHolderInfos.forEach(user -> userIdToConnectionHolderMap.put(user.getUuid(), user));
		sewerageConnectionList.forEach(sewerageConnection -> {
			if (!CollectionUtils.isEmpty(sewerageConnection.getConnectionHolders())) {
				sewerageConnection.getConnectionHolders().forEach(holderInfo -> {
					if (userIdToConnectionHolderMap.get(holderInfo.getUuid()) == null)
						throw new CustomException("OWNER_SEARCH_ERROR", "The owner of the sewerage application"
								+ sewerageConnection.getApplicationNo() + " is not coming in user search");
					else{
						Boolean isOpenSearch = isSearchOpen(requestInfo.getUserInfo());
						if(isOpenSearch)
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
	public List<SewerageConnection> filterConnections(List<SewerageConnection> connectionList) {
		HashMap<String, Connection> connectionHashMap = new LinkedHashMap<>();
		connectionList.forEach(connection -> {
			if (!StringUtils.isEmpty(connection.getConnectionNo())) {
				if (connectionHashMap.get(connection.getConnectionNo()) == null &&
						SWConstants.FINAL_CONNECTION_STATES.contains(connection.getApplicationStatus())) {
					connectionHashMap.put(connection.getConnectionNo(), connection);
				} else if (connectionHashMap.get(connection.getConnectionNo()) != null &&
						SWConstants.FINAL_CONNECTION_STATES.contains(connection.getApplicationStatus())) {
					if (connectionHashMap.get(connection.getConnectionNo()).getApplicationStatus().
							equals(connection.getApplicationStatus())) {
						HashMap additionalDetail1 = new HashMap<>();
						HashMap additionalDetail2 = new HashMap<>();
						additionalDetail1 = mapper
								.convertValue(connectionHashMap.get(connection.getConnectionNo()).getAdditionalDetails(), HashMap.class);
						additionalDetail2 = mapper
								.convertValue(connection.getAdditionalDetails(), HashMap.class);
						BigDecimal creationDate1 = (BigDecimal) additionalDetail1.get(SWConstants.APP_CREATED_DATE);
						BigDecimal creationDate2 = (BigDecimal) additionalDetail2.get(SWConstants.APP_CREATED_DATE);
						if (creationDate1.compareTo(creationDate2) == -1) {
							connectionHashMap.put(connection.getConnectionNo(), connection);
						}
					} else if (connection.getApplicationStatus().equals(SWConstants.MODIFIED_FINAL_STATE)) {
						connectionHashMap.put(connection.getConnectionNo(), connection);
					} else {
						if(connection.getApplicationStatus().equals(SWConstants
								.DISCONNECTION_FINAL_STATE)) {
							connectionHashMap.put(connection.getConnectionNo(), connection);
						}
					}
				}
			}
		});
		return  new ArrayList(connectionHashMap.values());
	}

	public List<SewerageConnection> enrichPropertyDetails(List<SewerageConnection> sewerageConnectionList, SearchCriteria criteria, RequestInfo requestInfo){
		List<SewerageConnection> finalConnectionList = new ArrayList<>();
		if (CollectionUtils.isEmpty(sewerageConnectionList))
			return finalConnectionList;

		Set<String> propertyIds = new HashSet<>();
		Map<String,List<OwnerInfo>> propertyToOwner = new HashMap<>();
		for(SewerageConnection sewerageConnection : sewerageConnectionList){
			if(!StringUtils.isEmpty(sewerageConnection.getPropertyId()))
				propertyIds.add(sewerageConnection.getPropertyId());
		}
		if(!CollectionUtils.isEmpty(propertyIds)){
			PropertyCriteria propertyCriteria = new PropertyCriteria();
			if (!StringUtils.isEmpty(criteria.getTenantId())) {
				propertyCriteria.setTenantId(criteria.getTenantId());
			}
			propertyCriteria.setPropertyIds(propertyIds);
			List<Property> propertyList = sewerageServicesUtil.getPropertyDetails(serviceRequestRepository.fetchResult(sewerageServicesUtil.getPropertyURL(propertyCriteria),
					RequestInfoWrapper.builder().requestInfo(requestInfo).build()));

			if(!CollectionUtils.isEmpty(propertyList)){
				for(Property property: propertyList){
					propertyToOwner.put(property.getPropertyId(),property.getOwners());
				}
			}

			for(SewerageConnection sewerageConnection : sewerageConnectionList){
				HashMap<String, Object> additionalDetail = new HashMap<>();
				HashMap<String, Object> addDetail = mapper
						.convertValue(sewerageConnection.getAdditionalDetails(), HashMap.class);

				for (Map.Entry<String, Object> entry: addDetail.entrySet()) {
					if (additionalDetail.getOrDefault(entry.getKey(), null) == null) {
						additionalDetail.put(entry.getKey(), addDetail.get(entry.getKey()));
					}
				}
				List<OwnerInfo> ownerInfoList = propertyToOwner.get(sewerageConnection.getPropertyId());
				if(!CollectionUtils.isEmpty(ownerInfoList)){
					additionalDetail.put("ownerName",ownerInfoList.get(0).getName());
				}
				sewerageConnection.setAdditionalDetails(additionalDetail);
				finalConnectionList.add(sewerageConnection);
			}


		}
		return finalConnectionList;
	}

	public void enrichProcessInstance(List<SewerageConnection> sewerageConnectionList, SearchCriteria criteria,
			RequestInfo requestInfo) {
		if (CollectionUtils.isEmpty(sewerageConnectionList))
			return;

		PlainAccessRequest apiPlainAccessRequest = requestInfo.getPlainAccessRequest();

		Map<String, ProcessInstance> processInstances = null;
		Set<String> applicationNumbers = sewerageConnectionList.stream().map(SewerageConnection::getApplicationNo).collect(Collectors.toSet());

		if (criteria.getTenantId() != null)
			processInstances = wfService.getProcessInstances(requestInfo, applicationNumbers,
					criteria.getTenantId(), null);
		else
			processInstances = wfService.getProcessInstances(requestInfo, applicationNumbers,
					requestInfo.getUserInfo().getTenantId(), null);
		for (SewerageConnection sewerageConnection : sewerageConnectionList) {
			if (!ObjectUtils.isEmpty(processInstances.get(sewerageConnection.getApplicationNo()))) {
				ProcessInstance processInstance = processInstances.get(sewerageConnection.getApplicationNo());
				sewerageConnection.getProcessInstance().setBusinessService(processInstance.getBusinessService());
				sewerageConnection.getProcessInstance().setModuleName(processInstance.getModuleName());
				if (!ObjectUtils.isEmpty(processInstance.getAssignes()))
					sewerageConnection.getProcessInstance().setAssignes(processInstance.getAssignes());
			}
		}
		requestInfo.setPlainAccessRequest(apiPlainAccessRequest);
	}

	/**
	 * Show the filestoreid for the respective document list based on the flag isFilestoreIdRequire
	 * If the flag is false in search criteria, the filestoreId is set as null
	 * and if it is true then filestore id is visible and details is log
	 *
	 * @param sewerageConnectionList
	 * @param criteria
	 * @param requestInfo
	 *
	 * @return
	 */
	public void enrichDocumentDetails(List<SewerageConnection> sewerageConnectionList, SearchCriteria criteria,
									  RequestInfo requestInfo) {
		if (CollectionUtils.isEmpty(sewerageConnectionList))
			return;

		if(!criteria.getIsFilestoreIdRequire() || sewerageConnectionList.size()>1){
			for(int i= 0; i<sewerageConnectionList.size();i++){
				List<Document> documentList = sewerageConnectionList.get(i).getDocuments();
				for(int j =0; (documentList !=null && j<documentList.size()); j++){
					documentList.get(j).setFileStoreId(null);
				}
				sewerageConnectionList.get(i).setDocuments(documentList);
			}

		}
		else{
			List<String> uuids = new ArrayList<>();
			if(sewerageConnectionList.get(0).getConnectionHolders() != null){
				for(OwnerInfo connectionHolder : sewerageConnectionList.get(0).getConnectionHolders()){
					uuids.add(connectionHolder.getUuid());
				}
			}

			PropertyCriteria propertyCriteria = new PropertyCriteria();
			propertyCriteria.setPropertyIds(Collections.singleton(sewerageConnectionList.get(0).getPropertyId()));
			propertyCriteria.setTenantId(sewerageConnectionList.get(0).getTenantId());

			List<Property> propertyList = sewerageServicesUtil.getPropertyDetails(serviceRequestRepository.fetchResult(sewerageServicesUtil.getPropertyURL(propertyCriteria),
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
	 * @param sewerageConnection SewerageConnection
	 * @param requestInfo RequestInfo
	 * @return unmasked ConnectionHolder details
	 */
	public OwnerInfo getConnectionHolderDetailsForUpdateCall(SewerageConnection sewerageConnection, RequestInfo requestInfo) {
		if (ObjectUtils.isEmpty(sewerageConnection))
			return null;
		Set<String> connectionHolderIds = new HashSet<>();
		if (!CollectionUtils.isEmpty(sewerageConnection.getConnectionHolders())) {
			connectionHolderIds.addAll(sewerageConnection.getConnectionHolders().stream()
					.map(OwnerInfo::getUuid).collect(Collectors.toSet()));
		}
		if (CollectionUtils.isEmpty(connectionHolderIds))
			return null;

		unmaskingUtil.getOwnerDetailsUnmasked(sewerageConnection, requestInfo);
		UserDetailResponse userDetailResponse = new UserDetailResponse();

		List<SewerageConnection> sewerageConnectionList = new ArrayList<>();
		sewerageConnectionList.add(sewerageConnection);
		userDetailResponse.setUser(sewerageConnection.getConnectionHolders());
		enrichConnectionHolderInfo(userDetailResponse, sewerageConnectionList, requestInfo);
		return userDetailResponse.getUser().get(0);
	}
	
}
