package org.egov.swservice.service;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.PlainAccessRequest;
import org.egov.common.contract.request.RequestInfo;
import org.egov.swservice.config.SWConfiguration;
import org.egov.swservice.repository.SewerageDao;
import org.egov.swservice.repository.SewerageDaoImpl;
import org.egov.swservice.util.EncryptionDecryptionUtil;
import org.egov.swservice.util.SWConstants;
import org.egov.swservice.util.SewerageServicesUtil;
import org.egov.swservice.validator.ActionValidator;
import org.egov.swservice.validator.MDMSValidator;
import org.egov.swservice.validator.SewerageConnectionValidator;
import org.egov.swservice.validator.ValidateProperty;
import org.egov.swservice.web.models.*;
import org.egov.swservice.web.models.workflow.BusinessService;
import org.egov.swservice.workflow.WorkflowIntegrator;
import org.egov.swservice.workflow.WorkflowService;
import org.egov.tracer.model.CustomException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import static org.egov.swservice.util.SWConstants.APPROVE_CONNECTION;

@Slf4j
@Component
public class SewerageServiceImpl implements SewerageService {

	Logger logger = LoggerFactory.getLogger(SewerageServiceImpl.class);

	@Autowired
	SewerageServicesUtil sewerageServicesUtil;

	@Autowired
	SewerageConnectionValidator sewerageConnectionValidator;

	@Autowired
	ValidateProperty validateProperty;

	@Autowired
	MDMSValidator mDMSValidator;

	@Autowired
	private WorkflowIntegrator wfIntegrator;

	@Autowired
	private SWConfiguration config;

	@Autowired
	EnrichmentService enrichmentService;

	@Autowired
	SewerageDao sewerageDao;

	@Autowired
	private ActionValidator actionValidator;

	@Autowired
	private WorkflowService workflowService;
    
	@Autowired
	private SewerageDaoImpl sewerageDaoImpl;
    

	@Autowired
	private CalculationService calculationService;
	
	@Autowired
	private UserService userService;

	@Autowired
	EncryptionDecryptionUtil encryptionDecryptionUtil;

	@Value("${encryption.batch.value}")
	private Integer batchSize;

	@Value("${encryption.offset.value}")
	private Integer batchOffset;

	private Integer count2=0;
	
	/**
	 * @param sewerageConnectionRequest
	 *            SewerageConnectionRequest contains sewerage connection to be
	 *            created
	 * @return List of WaterConnection after create
	 */

	@Override
	public List<SewerageConnection> createSewerageConnection(SewerageConnectionRequest sewerageConnectionRequest) {
		int reqType = SWConstants.CREATE_APPLICATION;
		
		if (sewerageConnectionRequest.isDisconnectRequest()) {
			reqType = SWConstants.DISCONNECT_CONNECTION;
			validateDisconnectionRequest(sewerageConnectionRequest);
		}
		
		else if (sewerageServicesUtil.isModifyConnectionRequest(sewerageConnectionRequest)) {
			List<SewerageConnection> sewerageConnectionList = getAllSewerageApplications(sewerageConnectionRequest);
			if (!CollectionUtils.isEmpty(sewerageConnectionList)) {
				workflowService.validateInProgressWF(sewerageConnectionList, sewerageConnectionRequest.getRequestInfo(),
						sewerageConnectionRequest.getSewerageConnection().getTenantId());
			}
			reqType = SWConstants.MODIFY_CONNECTION;
		}
		sewerageConnectionValidator.validateSewerageConnection(sewerageConnectionRequest, reqType);
		Property property = validateProperty.getOrValidateProperty(sewerageConnectionRequest);
		validateProperty.validatePropertyFields(property,sewerageConnectionRequest.getRequestInfo());
		mDMSValidator.validateMasterForCreateRequest(sewerageConnectionRequest);
		enrichmentService.enrichSewerageConnection(sewerageConnectionRequest, reqType);
		userService.createUser(sewerageConnectionRequest);
		// call work-flow
		if (config.getIsExternalWorkFlowEnabled())
			wfIntegrator.callWorkFlow(sewerageConnectionRequest, property);

		/* encrypt here */
		sewerageConnectionRequest.setSewerageConnection(encryptionDecryptionUtil.encryptObject(sewerageConnectionRequest.getSewerageConnection(), "WaterConnection", SewerageConnection.class));

		sewerageDao.saveSewerageConnection(sewerageConnectionRequest);

		/* decrypt here */
		sewerageConnectionRequest.setSewerageConnection(encryptionDecryptionUtil.decryptObject(sewerageConnectionRequest.getSewerageConnection(), "WaterConnection", SewerageConnection.class, sewerageConnectionRequest.getRequestInfo()));

		return Arrays.asList(sewerageConnectionRequest.getSewerageConnection());
	}

	private void validateDisconnectionRequest(SewerageConnectionRequest sewerageConnectionRequest) {
		if (!sewerageConnectionRequest.getSewerageConnection().getStatus().toString().equalsIgnoreCase(SWConstants.ACTIVE)) {
			throw new CustomException("INVALID_REQUEST",
					"Sewerage connection must be active for disconnection request");
		}
		
		List<SewerageConnection> previousConnectionsList = getAllSewerageApplications(sewerageConnectionRequest);
		
		for(SewerageConnection connection : previousConnectionsList) {
			if(!(connection.getApplicationStatus().equalsIgnoreCase(SWConstants.STATUS_APPROVED) || connection.getApplicationStatus().equalsIgnoreCase(SWConstants.MODIFIED_FINAL_STATE))) {
				throw new CustomException("INVALID_REQUEST",
						"No application should be in progress while applying for disconnection");
			}
		}
		
	}

	/**
	 * 
	 * @param criteria
	 *            SewerageConnectionSearchCriteria contains search criteria on
	 *            sewerage connection
	 * @param requestInfo - Request Info
	 * @return List of matching sewerage connection
	 */
	public List<SewerageConnection> search(SearchCriteria criteria, RequestInfo requestInfo) {

		/* encrypt here */
		criteria = encryptionDecryptionUtil.encryptObject(criteria, "WaterConnection", SearchCriteria.class);

		List<SewerageConnection> sewerageConnectionList = getSewerageConnectionsList(criteria, requestInfo);
		if(!StringUtils.isEmpty(criteria.getSearchType()) &&
				criteria.getSearchType().equals(SWConstants.SEARCH_TYPE_CONNECTION)){
			sewerageConnectionList = enrichmentService.filterConnections(sewerageConnectionList);
			/*if(criteria.getIsPropertyDetailsRequired()){
				sewerageConnectionList = enrichmentService.enrichPropertyDetails(sewerageConnectionList, criteria, requestInfo);

			}*/
		}
		if ((criteria.getIsPropertyDetailsRequired() != null) && criteria.getIsPropertyDetailsRequired()) {
			sewerageConnectionList = enrichmentService.enrichPropertyDetails(sewerageConnectionList, criteria, requestInfo);
		}
		validateProperty.validatePropertyForConnection(sewerageConnectionList);
		enrichmentService.enrichConnectionHolderDeatils(sewerageConnectionList, criteria, requestInfo);
		enrichmentService.enrichProcessInstance(sewerageConnectionList, criteria, requestInfo);

		/*if(isUpdateCall) {
			PlainAccessRequest apiPlainAccessRequest=requestInfo.getPlainAccessRequest();
			List<String> plainRequestFieldsList = new ArrayList<String>() {{
				add("mobileNumber");
				add("correspondenceAddress");
				add("fatherOrHusbandName");
				add("ownerType");
				add("plumberInfoMobileNumber");
				add("connectionHoldersMobileNumber");
				add("fatherOrHusbandName");
				add("gender");
				add("assigneeMobileNumber");
			}};
			PlainAccessRequest plainAccessRequest = PlainAccessRequest.builder().recordId(sewerageConnectionList.get(0).getApplicationNo())
					.plainRequestFields(plainRequestFieldsList).build();

			requestInfo.setPlainAccessRequest(plainAccessRequest);
			*//* decrypt here *//*
			sewerageConnectionList = encryptionDecryptionUtil.decryptObject(sewerageConnectionList, "WnSConnectionUpdateModel", SewerageConnection.class, requestInfo);
			requestInfo.setPlainAccessRequest(apiPlainAccessRequest);
			return sewerageConnectionList;
		}
		else {*/
			/* decrypt here */
			return encryptionDecryptionUtil.decryptObject(sewerageConnectionList, "WaterConnection", SewerageConnection.class, requestInfo);
//		}
//		return sewerageConnectionList;
	}

	/**
	 * 
	 * @param criteria
	 *            SewerageConnectionSearchCriteria contains search criteria on
	 *            sewerage connection
	 * @param requestInfo - Request Info Object
	 * @return List of matching sewerage connection
	 */

	public List<SewerageConnection> getSewerageConnectionsList(SearchCriteria criteria, RequestInfo requestInfo) {
		return sewerageDao.getSewerageConnectionList(criteria, requestInfo);
	}

	/**
	 * 
	 * @param criteria
	 *            SewerageConnectionSearchCriteria contains search criteria on
	 *            sewerage connection
	 * @param requestInfo - Request Info
	 * @return Count of List of matching sewerage connection
	 */
	public Integer countAllSewerageApplications(SearchCriteria criteria, RequestInfo requestInfo) {
		criteria.setIsCountCall(Boolean.TRUE);
		return getSewerageConnectionsCount(criteria, requestInfo);
	}

	/**
	 * 
	 * @param criteria    SewerageConnectionSearchCriteria contains search criteria
	 *                    on sewerage connection
	 * @param requestInfo - Request Info Object
	 * @return Count of List of matching sewerage connection
	 */

	public Integer getSewerageConnectionsCount(SearchCriteria criteria, RequestInfo requestInfo) {
		return sewerageDao.getSewerageConnectionsCount(criteria, requestInfo);
	}
	
	/**
	 * 
	 * @param sewerageConnectionRequest
	 *            SewerageConnectionRequest contains sewerage connection to be
	 *            updated
	 * @return List of SewerageConnection after update
	 */
	@Override
	public List<SewerageConnection> updateSewerageConnection(SewerageConnectionRequest sewerageConnectionRequest) {

		if(sewerageConnectionRequest.isDisconnectRequest()) {
			return updateSewerageConnectionForDisconnectFlow(sewerageConnectionRequest);
		}
		
		SearchCriteria criteria = new SearchCriteria();
//		criteria.setIsUpdateCall(Boolean.TRUE);
		if(sewerageServicesUtil.isModifyConnectionRequest(sewerageConnectionRequest)){
			return modifySewerageConnection(sewerageConnectionRequest);
		}
		sewerageConnectionValidator.validateSewerageConnection(sewerageConnectionRequest, SWConstants.UPDATE_APPLICATION);
		mDMSValidator.validateMasterData(sewerageConnectionRequest, SWConstants.UPDATE_APPLICATION);
		Property property = validateProperty.getOrValidateProperty(sewerageConnectionRequest);
		validateProperty.validatePropertyFields(property,sewerageConnectionRequest.getRequestInfo());
		String previousApplicationStatus = workflowService.getApplicationStatus(
				sewerageConnectionRequest.getRequestInfo(),
				sewerageConnectionRequest.getSewerageConnection().getApplicationNo(),
				sewerageConnectionRequest.getSewerageConnection().getTenantId(), config.getBusinessServiceValue());
		BusinessService businessService = workflowService.getBusinessService(config.getBusinessServiceValue(),
				sewerageConnectionRequest.getSewerageConnection().getTenantId(),
				sewerageConnectionRequest.getRequestInfo());
		SewerageConnection searchResult = getConnectionForUpdateRequest(
				sewerageConnectionRequest.getSewerageConnection().getId(), sewerageConnectionRequest.getRequestInfo());
		enrichmentService.enrichUpdateSewerageConnection(sewerageConnectionRequest);
		actionValidator.validateUpdateRequest(sewerageConnectionRequest, businessService, previousApplicationStatus);
		sewerageConnectionValidator.validateUpdate(sewerageConnectionRequest, searchResult);
		calculationService.calculateFeeAndGenerateDemand(sewerageConnectionRequest, property);
		sewerageDaoImpl.pushForEditNotification(sewerageConnectionRequest);
		userService.updateUser(sewerageConnectionRequest, searchResult);
		// Call workflow
		wfIntegrator.callWorkFlow(sewerageConnectionRequest, property);
		// Enrich file store Id After payment
		enrichmentService.enrichFileStoreIds(sewerageConnectionRequest);
		enrichmentService.postStatusEnrichment(sewerageConnectionRequest);

		/* encrypt here */
		sewerageConnectionRequest.setSewerageConnection(encryptionDecryptionUtil.encryptObject(sewerageConnectionRequest.getSewerageConnection(), "WaterConnection", SewerageConnection.class));
		sewerageConnectionRequest.getSewerageConnection().getConnectionHolders().set(0, encryptionDecryptionUtil.encryptObject(sewerageConnectionRequest.getSewerageConnection().getConnectionHolders().get(0), "WaterConnectionOwner", OwnerInfo.class));

		sewerageDao.updateSewerageConnection(sewerageConnectionRequest,
				sewerageServicesUtil.getStatusForUpdate(businessService, previousApplicationStatus));
		if (!StringUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getTenantId()))
			criteria.setTenantId(sewerageConnectionRequest.getSewerageConnection().getTenantId());
		enrichmentService.enrichProcessInstance(Arrays.asList(sewerageConnectionRequest.getSewerageConnection()), criteria, sewerageConnectionRequest.getRequestInfo());

		/* decrypt here */
		sewerageConnectionRequest.setSewerageConnection(encryptionDecryptionUtil.decryptObject(sewerageConnectionRequest.getSewerageConnection(), "WaterConnection", SewerageConnection.class, sewerageConnectionRequest.getRequestInfo()));
		sewerageConnectionRequest.getSewerageConnection().getConnectionHolders().set(0, encryptionDecryptionUtil.decryptObject(sewerageConnectionRequest.getSewerageConnection().getConnectionHolders().get(0), "WaterConnectionOwner", OwnerInfo.class, sewerageConnectionRequest.getRequestInfo()));

		return Arrays.asList(sewerageConnectionRequest.getSewerageConnection());
	}

	private List<SewerageConnection> updateSewerageConnectionForDisconnectFlow(SewerageConnectionRequest sewerageConnectionRequest) {
		SearchCriteria criteria = new SearchCriteria();
		
		sewerageConnectionValidator.validateSewerageConnection(sewerageConnectionRequest, SWConstants.DISCONNECT_CONNECTION);
		mDMSValidator.validateMasterData(sewerageConnectionRequest, SWConstants.DISCONNECT_CONNECTION);
		Property property = validateProperty.getOrValidateProperty(sewerageConnectionRequest);
		validateProperty.validatePropertyFields(property,sewerageConnectionRequest.getRequestInfo());
		String previousApplicationStatus = workflowService.getApplicationStatus(
				sewerageConnectionRequest.getRequestInfo(),
				sewerageConnectionRequest.getSewerageConnection().getApplicationNo(),
				sewerageConnectionRequest.getSewerageConnection().getTenantId(),config.getDisconnectBusinessServiceName() );
		BusinessService businessService = workflowService.getBusinessService(config.getDisconnectBusinessServiceName(),
				sewerageConnectionRequest.getSewerageConnection().getTenantId(),
				sewerageConnectionRequest.getRequestInfo());
		SewerageConnection searchResult = getConnectionForUpdateRequest(
				sewerageConnectionRequest.getSewerageConnection().getId(), sewerageConnectionRequest.getRequestInfo());
		enrichmentService.enrichUpdateSewerageConnection(sewerageConnectionRequest);
		actionValidator.validateUpdateRequest(sewerageConnectionRequest, businessService, previousApplicationStatus);
		sewerageConnectionValidator.validateUpdate(sewerageConnectionRequest, searchResult);
		sewerageDaoImpl.pushForEditNotification(sewerageConnectionRequest);
		userService.updateUser(sewerageConnectionRequest, searchResult);
		// Call workflow
		wfIntegrator.callWorkFlow(sewerageConnectionRequest, property);
		calculationService.calculateFeeAndGenerateDemand(sewerageConnectionRequest, property);
		// Enrich file store Id After payment
		enrichmentService.enrichFileStoreIds(sewerageConnectionRequest);
		enrichmentService.postStatusEnrichment(sewerageConnectionRequest);
		sewerageDao.updateSewerageConnection(sewerageConnectionRequest,
				sewerageServicesUtil.getStatusForUpdate(businessService, previousApplicationStatus));
		if (!StringUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getTenantId()))
			criteria.setTenantId(sewerageConnectionRequest.getSewerageConnection().getTenantId());
		enrichmentService.enrichProcessInstance(Arrays.asList(sewerageConnectionRequest.getSewerageConnection()), criteria, sewerageConnectionRequest.getRequestInfo());
		return Arrays.asList(sewerageConnectionRequest.getSewerageConnection());
		
	}

	/**
	 * Search Sewerage connection to be update
	 * 
	 * @param id - Sewerage Connection Id
	 * @param requestInfo - Request Info Object
	 * @return sewerage connection
	 */
	public SewerageConnection getConnectionForUpdateRequest(String id, RequestInfo requestInfo) {
		SearchCriteria criteria = new SearchCriteria();
		Set<String> ids = new HashSet<>(Arrays.asList(id));
		criteria.setIds(ids);
		List<SewerageConnection> connections = getSewerageConnectionsList(criteria, requestInfo);
		if (CollectionUtils.isEmpty(connections)) {
			StringBuilder builder = new StringBuilder();
			builder.append("Sewerage Connection not found for Id - ").append(id);
			throw new CustomException("INVALID_SEWERAGE_CONNECTION_SEARCH", builder.toString());
		}
		return connections.get(0);
	}

	/**
	 *
	 * @param sewerageConnectionRequest
	 * @return list of sewerage connection list
	 */
	private List<SewerageConnection> getAllSewerageApplications(SewerageConnectionRequest sewerageConnectionRequest) {
		SearchCriteria criteria = SearchCriteria.builder()
				.connectionNumber(Stream.of(sewerageConnectionRequest.getSewerageConnection().getConnectionNo().toString()).collect(Collectors.toSet())).isCountCall(false)
				.build();
		return search(criteria, sewerageConnectionRequest.getRequestInfo());
	}

	/**
	 *
	 * @param sewerageConnectionRequest
	 * @return list of sewerage connection
	 */
	private List<SewerageConnection> modifySewerageConnection(SewerageConnectionRequest sewerageConnectionRequest) {
		sewerageConnectionValidator.validateSewerageConnection(sewerageConnectionRequest, SWConstants.MODIFY_CONNECTION);
		mDMSValidator.validateMasterData(sewerageConnectionRequest, SWConstants.MODIFY_CONNECTION);
		Property property = validateProperty.getOrValidateProperty(sewerageConnectionRequest);
		validateProperty.validatePropertyFields(property,sewerageConnectionRequest.getRequestInfo());
		String previousApplicationStatus = workflowService.getApplicationStatus(
				sewerageConnectionRequest.getRequestInfo(),
				sewerageConnectionRequest.getSewerageConnection().getApplicationNo(),
				sewerageConnectionRequest.getSewerageConnection().getTenantId(), config.getModifySWBusinessServiceName());
		BusinessService businessService = workflowService.getBusinessService(config.getModifySWBusinessServiceName(),
				sewerageConnectionRequest.getSewerageConnection().getTenantId(),
				sewerageConnectionRequest.getRequestInfo());
		SewerageConnection searchResult = getConnectionForUpdateRequest(
				sewerageConnectionRequest.getSewerageConnection().getId(), sewerageConnectionRequest.getRequestInfo());
		enrichmentService.enrichUpdateSewerageConnection(sewerageConnectionRequest);
		actionValidator.validateUpdateRequest(sewerageConnectionRequest, businessService, previousApplicationStatus);
		sewerageConnectionValidator.validateUpdate(sewerageConnectionRequest, searchResult);
		userService.updateUser(sewerageConnectionRequest, searchResult);
		sewerageDaoImpl.pushForEditNotification(sewerageConnectionRequest);
		// Call workflow
		wfIntegrator.callWorkFlow(sewerageConnectionRequest, property);
		sewerageDaoImpl.updateSewerageConnection(sewerageConnectionRequest, sewerageServicesUtil.getStatusForUpdate(businessService, previousApplicationStatus));
		// setting oldApplication Flag
		markOldApplication(sewerageConnectionRequest);
		return Arrays.asList(sewerageConnectionRequest.getSewerageConnection());
	}

	public void markOldApplication(SewerageConnectionRequest sewerageConnectionRequest) {
		if (sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction().equalsIgnoreCase(APPROVE_CONNECTION)) {
			String currentModifiedApplicationNo = sewerageConnectionRequest.getSewerageConnection().getApplicationNo();
			List<SewerageConnection> sewerageConnectionList = getAllSewerageApplications(sewerageConnectionRequest);

			for(SewerageConnection sewerageConnection:sewerageConnectionList){
				if(!sewerageConnection.getOldApplication() && !(sewerageConnection.getApplicationNo().equalsIgnoreCase(currentModifiedApplicationNo))){
					sewerageConnection.setOldApplication(Boolean.TRUE);
					SewerageConnectionRequest previousSewerageConnectionRequest = SewerageConnectionRequest.builder().requestInfo(sewerageConnectionRequest.getRequestInfo())
							.sewerageConnection(sewerageConnection).build();
					sewerageDaoImpl.updateSewerageConnection(previousSewerageConnectionRequest,Boolean.TRUE);
				}
			}
		}
	}
	
	public List<SewerageConnection> plainSearch(SearchCriteria criteria, RequestInfo requestInfo) {
		List<SewerageConnection> sewerageConnectionList = getSewerageConnectionsPlainSearchList(criteria, requestInfo);
		if(!StringUtils.isEmpty(criteria.getSearchType()) &&
				criteria.getSearchType().equals(SWConstants.SEARCH_TYPE_CONNECTION)){
			sewerageConnectionList = enrichmentService.filterConnections(sewerageConnectionList);
			if(criteria.getIsPropertyDetailsRequired()){
				sewerageConnectionList = enrichmentService.enrichPropertyDetails(sewerageConnectionList, criteria, requestInfo);

			}
		}
		validateProperty.validatePropertyForConnection(sewerageConnectionList);
		enrichmentService.enrichConnectionHolderDeatils(sewerageConnectionList, criteria, requestInfo);
		return sewerageConnectionList;
	}
	
	public List<SewerageConnection> getSewerageConnectionsPlainSearchList(SearchCriteria criteria, RequestInfo requestInfo) {
		return sewerageDao.getSewerageConnectionPlainSearchList(criteria, requestInfo);
	}


	public List<SewerageConnection> updateOldData(SearchCriteria criteria, RequestInfo requestInfo){
		SewerageConnectionResponse sewerageConnectionResponse = encryptOldWaterData(requestInfo, criteria);
		return sewerageConnectionResponse.getSewerageConnections();
	}

	public SewerageConnectionResponse encryptOldWaterData(RequestInfo requestInfo, SearchCriteria criteria) {
		List<SewerageConnection> sewerageConnectionList = new ArrayList<>();
		SewerageConnectionResponse sewerageConnectionResponse;
		Map<String, String> resultMap = null;

		if(StringUtils.isEmpty(criteria.getLimit()))
			criteria.setLimit(Integer.valueOf(batchSize));

		if(StringUtils.isEmpty(criteria.getOffset()))
			criteria.setOffset(Integer.valueOf(batchOffset));

		sewerageConnectionList = initiateEncryption(requestInfo, criteria);
		sewerageConnectionResponse = SewerageConnectionResponse.builder().sewerageConnections(sewerageConnectionList)
				.build();
		return sewerageConnectionResponse;
	}

	public List<SewerageConnection> initiateEncryption(RequestInfo requestInfo,SearchCriteria criteria) {
		List<SewerageConnection> finalSewerageList = new LinkedList<>();
		Map<String, String> responseMap = new HashMap<>();

		SewerageConnectionResponse sewerageConnectionResponse;

		Integer startBatch = Math.toIntExact(criteria.getOffset());
		Integer batchSizeInput = Math.toIntExact(criteria.getLimit());

		Integer count = sewerageDao.getTotalApplications(criteria);

		log.info("Count: "+count);
		log.info("startbatch: "+startBatch);

		while(startBatch<count) {
			long startTime = System.nanoTime();
			List<SewerageConnection> sewerageConnectionList = new LinkedList<>();
			sewerageConnectionList = plainSearch(criteria, requestInfo);
			try {
				for (SewerageConnection sewerageConnection : sewerageConnectionList) {
					/* encrypt here */
					sewerageConnection = encryptionDecryptionUtil.encryptObject(sewerageConnection, "WaterConnection", SewerageConnection.class);

					SewerageConnectionRequest sewerageConnectionRequest= SewerageConnectionRequest.builder()
							.requestInfo(requestInfo)
							.sewerageConnection(sewerageConnection)
							.build();

					sewerageDao.updateOldSewerageConnections(sewerageConnectionRequest);

					/* decrypt here */
					sewerageConnection = encryptionDecryptionUtil.decryptObject(sewerageConnection, "WaterConnection", SewerageConnection.class, requestInfo);
				}
			} catch (Exception e) {

				log.error("Encryption failed at batch count of : " + startBatch);
				responseMap.put( "Encryption failed at batch count : " + startBatch, e.getMessage());
				return null;
			}

			log.info(" count completed for batch : " + startBatch);
			long endtime = System.nanoTime();
			long elapsetime = endtime - startTime;
			log.info("\n\nBatch elapsed time: "+elapsetime+"\n\n");

			startBatch = startBatch+batchSizeInput;
			criteria.setOffset(Integer.valueOf(startBatch));
			System.out.println("SewerageConnections Count which pushed into kafka topic:"+count2);
			finalSewerageList = Stream.concat(finalSewerageList.stream(), sewerageConnectionList.stream())
					.collect(Collectors.toList());
		}
		criteria.setOffset(Integer.valueOf(batchOffset));

		return finalSewerageList;

	}
}
