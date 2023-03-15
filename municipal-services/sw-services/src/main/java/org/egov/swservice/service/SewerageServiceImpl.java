package org.egov.swservice.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.PlainAccessRequest;
import org.egov.common.contract.request.RequestInfo;
import org.egov.swservice.config.SWConfiguration;
import org.egov.swservice.repository.SewerageDao;
import org.egov.swservice.repository.SewerageDaoImpl;
import org.egov.swservice.util.EncryptionDecryptionUtil;
import org.egov.swservice.util.SWConstants;
import org.egov.swservice.util.SewerageServicesUtil;
import org.egov.swservice.util.UnmaskingUtil;
import org.egov.swservice.validator.ActionValidator;
import org.egov.swservice.validator.MDMSValidator;
import org.egov.swservice.validator.SewerageConnectionValidator;
import org.egov.swservice.validator.ValidateProperty;
import org.egov.swservice.web.models.*;
import org.egov.swservice.web.models.workflow.BusinessService;
import org.egov.swservice.web.models.workflow.ProcessInstance;
import org.egov.swservice.workflow.WorkflowIntegrator;
import org.egov.swservice.workflow.WorkflowService;
import org.egov.tracer.model.CustomException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.egov.swservice.util.SWConstants.*;

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

	@Autowired
	private	PaymentUpdateService paymentUpdateService;

	@Autowired
	private UnmaskingUtil unmaskingUtil;
	
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
			swapConnHolders(sewerageConnectionRequest,sewerageConnectionList);

			//Swap masked Plumber info with unmasked plumberInfo from previous applications
			if(!ObjectUtils.isEmpty(sewerageConnectionList.get(0).getPlumberInfo()))
				unmaskingUtil.getUnmaskedPlumberInfo(sewerageConnectionRequest.getSewerageConnection().getPlumberInfo(), sewerageConnectionList.get(0).getPlumberInfo());

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
		sewerageConnectionRequest.setSewerageConnection(encryptConnectionDetails(sewerageConnectionRequest.getSewerageConnection()));
		/* encrypt here for connection holder details */
		sewerageConnectionRequest.setSewerageConnection(encryptConnectionHolderDetails(sewerageConnectionRequest.getSewerageConnection()));

		sewerageDao.saveSewerageConnection(sewerageConnectionRequest);

		/* decrypt here */
		sewerageConnectionRequest.setSewerageConnection(encryptionDecryptionUtil.decryptObject(sewerageConnectionRequest.getSewerageConnection(), WNS_ENCRYPTION_MODEL, SewerageConnection.class, sewerageConnectionRequest.getRequestInfo()));
		//PlumberInfo masked during Create call of New Application
		if (reqType == 0)
			sewerageConnectionRequest.setSewerageConnection(encryptionDecryptionUtil.decryptObject(sewerageConnectionRequest.getSewerageConnection(), WNS_PLUMBER_ENCRYPTION_MODEL, SewerageConnection.class, sewerageConnectionRequest.getRequestInfo()));
		//PlumberInfo unmasked during create call of Disconnect/Modify Applications
		else
			sewerageConnectionRequest.setSewerageConnection(encryptionDecryptionUtil.decryptObject(sewerageConnectionRequest.getSewerageConnection(), "WnSConnectionPlumberDecrypDisabled", SewerageConnection.class, sewerageConnectionRequest.getRequestInfo()));

		List<OwnerInfo> connectionHolders = sewerageConnectionRequest.getSewerageConnection().getConnectionHolders();
		if (!CollectionUtils.isEmpty(connectionHolders))
			sewerageConnectionRequest.getSewerageConnection().setConnectionHolders(encryptionDecryptionUtil.decryptObject(connectionHolders, WNS_OWNER_ENCRYPTION_MODEL, OwnerInfo.class, sewerageConnectionRequest.getRequestInfo()));

		return Arrays.asList(sewerageConnectionRequest.getSewerageConnection());
	}

	private void validateDisconnectionRequest(SewerageConnectionRequest sewerageConnectionRequest) {
		if (!sewerageConnectionRequest.getSewerageConnection().getStatus().toString().equalsIgnoreCase(SWConstants.ACTIVE)) {
			throw new CustomException("INVALID_REQUEST",
					"Sewerage connection must be active for disconnection request");
		}
		
		List<SewerageConnection> previousConnectionsList = getAllSewerageApplications(sewerageConnectionRequest);
		swapConnHolders(sewerageConnectionRequest,previousConnectionsList);

		//Swap masked Plumber info with unmasked plumberInfo from previous applications
		if(!ObjectUtils.isEmpty(previousConnectionsList.get(0).getPlumberInfo()))
			unmaskingUtil.getUnmaskedPlumberInfo(sewerageConnectionRequest.getSewerageConnection().getPlumberInfo(), previousConnectionsList.get(0).getPlumberInfo());

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
		//Creating copies of apiPlainAcessRequests for decryption process
		//Any decryption process returns the  requestInfo with only the already used plain Access Request fields
		PlainAccessRequest apiPlainAccessRequest = null, apiPlainAccessRequestCopy = null;
		if (!ObjectUtils.isEmpty(requestInfo.getPlainAccessRequest())) {
			PlainAccessRequest plainAccessRequest = requestInfo.getPlainAccessRequest();
			if (!StringUtils.isEmpty(plainAccessRequest.getRecordId()) && !ObjectUtils.isEmpty(plainAccessRequest.getPlainRequestFields())) {
				apiPlainAccessRequest = new PlainAccessRequest(plainAccessRequest.getRecordId(), plainAccessRequest.getPlainRequestFields());
				apiPlainAccessRequestCopy = new PlainAccessRequest(plainAccessRequest.getRecordId(), plainAccessRequest.getPlainRequestFields());
			}
		}
		/* encrypt here */
		criteria = encryptionDecryptionUtil.encryptObject(criteria, WNS_ENCRYPTION_MODEL, SearchCriteria.class);
		criteria = encryptionDecryptionUtil.encryptObject(criteria, WNS_PLUMBER_ENCRYPTION_MODEL, SearchCriteria.class);

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
//		enrichmentService.enrichDocumentDetails(sewerageConnectionList, criteria, requestInfo);
		requestInfo.setPlainAccessRequest(apiPlainAccessRequest);
		/* decrypt here */
		if (criteria.getIsInternalCall()) {
			sewerageConnectionList = encryptionDecryptionUtil.decryptObject(sewerageConnectionList, "WnSConnectionPlumberDecrypDisabled", SewerageConnection.class, requestInfo);
			requestInfo.setPlainAccessRequest(apiPlainAccessRequestCopy);
			return encryptionDecryptionUtil.decryptObject(sewerageConnectionList, "WnSConnectionDecrypDisabled", SewerageConnection.class, requestInfo);
		}
		sewerageConnectionList = encryptionDecryptionUtil.decryptObject(sewerageConnectionList, WNS_PLUMBER_ENCRYPTION_MODEL, SewerageConnection.class, requestInfo);
		requestInfo.setPlainAccessRequest(apiPlainAccessRequestCopy);
		return encryptionDecryptionUtil.decryptObject(sewerageConnectionList, WNS_ENCRYPTION_MODEL, SewerageConnection.class, requestInfo);
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

		Boolean isStateUpdatable = sewerageServicesUtil.getStatusForUpdate(businessService, previousApplicationStatus);

		boolean isPlumberSwapped = unmaskingUtil.getUnmaskedPlumberInfo(sewerageConnectionRequest.getSewerageConnection().getPlumberInfo(), searchResult.getPlumberInfo());
		if (isPlumberSwapped)
			sewerageConnectionRequest.setSewerageConnection(encryptionDecryptionUtil.decryptObject(sewerageConnectionRequest.getSewerageConnection(), "WnSConnectionPlumberDecrypDisabled", SewerageConnection.class, sewerageConnectionRequest.getRequestInfo()));

		enrichmentService.enrichUpdateSewerageConnection(sewerageConnectionRequest);
		actionValidator.validateUpdateRequest(sewerageConnectionRequest, businessService, previousApplicationStatus);
		sewerageConnectionValidator.validateUpdate(sewerageConnectionRequest, searchResult);
		calculationService.calculateFeeAndGenerateDemand(sewerageConnectionRequest, property);
		sewerageDaoImpl.pushForEditNotification(sewerageConnectionRequest, isStateUpdatable);
		userService.updateUser(sewerageConnectionRequest, searchResult);
		//Enriching the property details
		List<SewerageConnection> sewerageConnectionList = new ArrayList<>();
		sewerageConnectionList.add(sewerageConnectionRequest.getSewerageConnection());
		criteria.setTenantId(sewerageConnectionRequest.getSewerageConnection().getTenantId());
		sewerageConnectionRequest.setSewerageConnection(enrichmentService.enrichPropertyDetails(sewerageConnectionList, criteria, sewerageConnectionRequest.getRequestInfo()).get(0));

		// Call workflow
		wfIntegrator.callWorkFlow(sewerageConnectionRequest, property);
		// Enrich file store Id After payment
		enrichmentService.enrichFileStoreIds(sewerageConnectionRequest);
		enrichmentService.postStatusEnrichment(sewerageConnectionRequest);

		/* encrypt here */
		sewerageConnectionRequest.setSewerageConnection(encryptConnectionDetails(sewerageConnectionRequest.getSewerageConnection()));
		/* encrypt here for connection holder details */
		sewerageConnectionRequest.setSewerageConnection(encryptConnectionHolderDetails(sewerageConnectionRequest.getSewerageConnection()));

		sewerageDao.updateSewerageConnection(sewerageConnectionRequest, isStateUpdatable);

		if (!StringUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getTenantId()))
			criteria.setTenantId(sewerageConnectionRequest.getSewerageConnection().getTenantId());
		enrichmentService.enrichProcessInstance(Arrays.asList(sewerageConnectionRequest.getSewerageConnection()), criteria, sewerageConnectionRequest.getRequestInfo());

		/* decrypt here */
		sewerageConnectionRequest.setSewerageConnection(decryptConnectionDetails(sewerageConnectionRequest.getSewerageConnection(), sewerageConnectionRequest.getRequestInfo()));

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

		Boolean isStateUpdatable = sewerageServicesUtil.getStatusForUpdate(businessService, previousApplicationStatus);

		boolean isPlumberSwapped = unmaskingUtil.getUnmaskedPlumberInfo(sewerageConnectionRequest.getSewerageConnection().getPlumberInfo(), searchResult.getPlumberInfo());
		if (isPlumberSwapped)
			sewerageConnectionRequest.setSewerageConnection(encryptionDecryptionUtil.decryptObject(sewerageConnectionRequest.getSewerageConnection(), "WnSConnectionPlumberDecrypDisabled", SewerageConnection.class, sewerageConnectionRequest.getRequestInfo()));

		enrichmentService.enrichUpdateSewerageConnection(sewerageConnectionRequest);
		actionValidator.validateUpdateRequest(sewerageConnectionRequest, businessService, previousApplicationStatus);
		sewerageConnectionValidator.validateUpdate(sewerageConnectionRequest, searchResult);
		sewerageDaoImpl.pushForEditNotification(sewerageConnectionRequest, isStateUpdatable);
		userService.updateUser(sewerageConnectionRequest, searchResult);
		calculationService.calculateFeeAndGenerateDemand(sewerageConnectionRequest, property);
		//check whether amount is due
		boolean isNoPayment = false;
		SewerageConnection sewerageConnection = sewerageConnectionRequest.getSewerageConnection();
		ProcessInstance processInstance = sewerageConnection.getProcessInstance();
		if (SWConstants.APPROVE_DISCONNECTION_CONST.equalsIgnoreCase(processInstance.getAction())) {
			isNoPayment = calculationService.fetchBill(sewerageConnection.getTenantId(), sewerageConnection.getConnectionNo(), sewerageConnectionRequest.getRequestInfo());
			if (isNoPayment) {
				processInstance.setComment(WORKFLOW_NO_PAYMENT_CODE);
			}
		}
		// Call workflow
		wfIntegrator.callWorkFlow(sewerageConnectionRequest, property);

		/* encrypt here */
		sewerageConnectionRequest.setSewerageConnection(encryptConnectionDetails(sewerageConnectionRequest.getSewerageConnection()));
		/* encrypt here for connection holder details */
		sewerageConnectionRequest.setSewerageConnection(encryptConnectionHolderDetails(sewerageConnectionRequest.getSewerageConnection()));

		sewerageDao.updateSewerageConnection(sewerageConnectionRequest, isStateUpdatable);

		// setting oldApplication Flag
		markOldApplication(sewerageConnectionRequest);

		if (!StringUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getTenantId()))
			criteria.setTenantId(sewerageConnectionRequest.getSewerageConnection().getTenantId());
		enrichmentService.enrichProcessInstance(Arrays.asList(sewerageConnectionRequest.getSewerageConnection()), criteria, sewerageConnectionRequest.getRequestInfo());

		//Updating the workflow from approve for disconnection to pending for disconnection execution when there are no dues
		if(SWConstants.APPROVE_DISCONNECTION_CONST.equalsIgnoreCase(processInstance.getAction()) && isNoPayment){
			paymentUpdateService.noPaymentWorkflow(sewerageConnectionRequest, property, sewerageConnectionRequest.getRequestInfo());
		}

		/* decrypt here */
		sewerageConnectionRequest.setSewerageConnection(decryptConnectionDetails(sewerageConnectionRequest.getSewerageConnection(), sewerageConnectionRequest.getRequestInfo()));

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
		SewerageConnection sewerageConnection = sewerageConnectionRequest.getSewerageConnection();
		SearchCriteria criteria = SearchCriteria.builder()
				.connectionNumber(Stream.of(sewerageConnection.getConnectionNo().toString()).collect(Collectors.toSet())).isCountCall(false)
				.build();
		if(sewerageConnectionRequest.isDisconnectRequest() ||
				!StringUtils.isEmpty(sewerageConnection.getConnectionNo()))
			criteria.setIsInternalCall(true);
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

		Boolean isStateUpdatable = sewerageServicesUtil.getStatusForUpdate(businessService, previousApplicationStatus);
		boolean isPlumberSwapped = unmaskingUtil.getUnmaskedPlumberInfo(sewerageConnectionRequest.getSewerageConnection().getPlumberInfo(), searchResult.getPlumberInfo());
		if (isPlumberSwapped)
			sewerageConnectionRequest.setSewerageConnection(encryptionDecryptionUtil.decryptObject(sewerageConnectionRequest.getSewerageConnection(), "WnSConnectionPlumberDecrypDisabled", SewerageConnection.class, sewerageConnectionRequest.getRequestInfo()));

		enrichmentService.enrichUpdateSewerageConnection(sewerageConnectionRequest);
		actionValidator.validateUpdateRequest(sewerageConnectionRequest, businessService, previousApplicationStatus);
		sewerageConnectionValidator.validateUpdate(sewerageConnectionRequest, searchResult);
		userService.updateUser(sewerageConnectionRequest, searchResult);
		sewerageDaoImpl.pushForEditNotification(sewerageConnectionRequest, isStateUpdatable);
		// Call workflow
		wfIntegrator.callWorkFlow(sewerageConnectionRequest, property);

		/* encrypt here */
		sewerageConnectionRequest.setSewerageConnection(encryptConnectionDetails(sewerageConnectionRequest.getSewerageConnection()));
		/* encrypt here for connection holder details */
		sewerageConnectionRequest.setSewerageConnection(encryptConnectionHolderDetails(sewerageConnectionRequest.getSewerageConnection()));

		sewerageDaoImpl.updateSewerageConnection(sewerageConnectionRequest, isStateUpdatable);

		// setting oldApplication Flag
		markOldApplication(sewerageConnectionRequest);

		/* decrypt here */
		sewerageConnectionRequest.setSewerageConnection(decryptConnectionDetails(sewerageConnectionRequest.getSewerageConnection(), sewerageConnectionRequest.getRequestInfo()));

		return Arrays.asList(sewerageConnectionRequest.getSewerageConnection());
	}

	public void markOldApplication(SewerageConnectionRequest sewerageConnectionRequest) {
		if (sewerageConnectionRequest.getSewerageConnection().getProcessInstance().getAction().equalsIgnoreCase(APPROVE_CONNECTION)) {
			String currentModifiedApplicationNo = sewerageConnectionRequest.getSewerageConnection().getApplicationNo();
			List<SewerageConnection> sewerageConnectionList = getAllSewerageApplications(sewerageConnectionRequest);

			for(SewerageConnection sewerageConnection:sewerageConnectionList){
				if(!sewerageConnection.getOldApplication() && !(sewerageConnection.getApplicationNo().equalsIgnoreCase(currentModifiedApplicationNo))){
					sewerageConnection.setOldApplication(Boolean.TRUE);
					sewerageConnection = encryptConnectionDetails(sewerageConnection);
					SewerageConnectionRequest previousSewerageConnectionRequest = SewerageConnectionRequest.builder().requestInfo(sewerageConnectionRequest.getRequestInfo())
							.sewerageConnection(sewerageConnection).build();
					sewerageDaoImpl.updateSewerageConnection(previousSewerageConnectionRequest,Boolean.TRUE);
				}
			}
		}
	}
	
	public List<SewerageConnection> plainSearch(SearchCriteria criteria, RequestInfo requestInfo) {
		criteria.setIsSkipLevelSearch(Boolean.TRUE);
		List<SewerageConnection> sewerageConnectionList = getSewerageConnectionsPlainSearchList(criteria, requestInfo);
		sewerageConnectionList = enrichmentService.enrichPropertyDetails(sewerageConnectionList, criteria, requestInfo);
		validateProperty.validatePropertyForConnection(sewerageConnectionList);
		enrichmentService.enrichConnectionHolderDeatils(sewerageConnectionList, criteria, requestInfo);
		return sewerageConnectionList;
	}
	
	public List<SewerageConnection> getSewerageConnectionsPlainSearchList(SearchCriteria criteria, RequestInfo requestInfo) {
		return sewerageDao.getSewerageConnectionPlainSearchList(criteria, requestInfo);
	}

	/**
	 * Replace the requestBody data and data from dB for those fields that come as masked (data containing "*" is
	 * identified as masked) in requestBody
	 *
	 * @param sewerageConnectionRequest contains requestBody of sewerageConnection
	 * @param previousConnectionsList contains unmasked data from the search result of sewerageConnection
	 *
	 */
	private void swapConnHolders(SewerageConnectionRequest sewerageConnectionRequest, List<SewerageConnection> previousConnectionsList) {

		if (!ObjectUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getConnectionHolders()) &&
				!ObjectUtils.isEmpty(previousConnectionsList.get(0).getConnectionHolders())) {

			List<OwnerInfo> connHolders = sewerageConnectionRequest.getSewerageConnection().getConnectionHolders();
			List<OwnerInfo> searchedConnHolders = previousConnectionsList.get(0).getConnectionHolders();

			if (!ObjectUtils.isEmpty(connHolders.get(0).getOwnerType()) &&
					!ObjectUtils.isEmpty(searchedConnHolders.get(0).getOwnerType())) {

				int k = 0;
				for (OwnerInfo holderInfo : connHolders) {
					if (holderInfo.getOwnerType().contains("*"))
						holderInfo.setOwnerType(searchedConnHolders.get(k).getOwnerType());
					if (holderInfo.getRelationship().contains("*"))
						holderInfo.setRelationship(searchedConnHolders.get(k).getRelationship());
					k++;

				}
			}
		}
	}

	/**
	 * Encrypts sewerageConnection details
	 *
	 * @param sewerageConnection contains  sewerageConnection object
	 *
	 */
	private SewerageConnection encryptConnectionDetails(SewerageConnection sewerageConnection) {
		/* encrypt here */
		sewerageConnection = encryptionDecryptionUtil.encryptObject(sewerageConnection, WNS_ENCRYPTION_MODEL, SewerageConnection.class);
		sewerageConnection = encryptionDecryptionUtil.encryptObject(sewerageConnection, WNS_PLUMBER_ENCRYPTION_MODEL, SewerageConnection.class);

		return sewerageConnection;
	}

	/**
	 * Encrypts connectionOwner details coming from user service
	 *
	 * @param sewerageConnection contains  sewerageConnection object
	 *
	 */
	private SewerageConnection encryptConnectionHolderDetails(SewerageConnection sewerageConnection) {
		/* encrypt here */
		List<OwnerInfo> connectionHolders = sewerageConnection.getConnectionHolders();
		if (!CollectionUtils.isEmpty(connectionHolders)) {
			int k = 0;
			for (OwnerInfo holderInfo : connectionHolders) {
				sewerageConnection.getConnectionHolders().set(k, encryptionDecryptionUtil.encryptObject(holderInfo, WNS_OWNER_ENCRYPTION_MODEL, OwnerInfo.class));
				k++;
			}
		}
		return sewerageConnection;
	}

	/**
	 * Decrypts sewerageConnection details
	 *
	 * @param sewerageConnection contains  sewerageConnection object
	 */
	private SewerageConnection decryptConnectionDetails(SewerageConnection sewerageConnection, RequestInfo requestInfo) {
		/* decrypt here */
		sewerageConnection = encryptionDecryptionUtil.decryptObject(sewerageConnection, WNS_ENCRYPTION_MODEL, SewerageConnection.class, requestInfo);
		sewerageConnection = encryptionDecryptionUtil.decryptObject(sewerageConnection, WNS_PLUMBER_ENCRYPTION_MODEL, SewerageConnection.class, requestInfo);
		List<OwnerInfo> connectionHolders = sewerageConnection.getConnectionHolders();
		if (!CollectionUtils.isEmpty(connectionHolders))
			sewerageConnection.setConnectionHolders(encryptionDecryptionUtil.decryptObject(connectionHolders, WNS_OWNER_ENCRYPTION_MODEL, OwnerInfo.class, requestInfo));

		return sewerageConnection;
	}
}
