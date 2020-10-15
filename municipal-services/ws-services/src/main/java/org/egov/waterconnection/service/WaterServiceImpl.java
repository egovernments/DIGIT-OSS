package org.egov.waterconnection.service;


import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.egov.waterconnection.config.WSConfiguration;
import org.egov.waterconnection.constants.WCConstants;
import org.egov.waterconnection.repository.WaterDao;
import org.egov.waterconnection.repository.WaterDaoImpl;
import org.egov.waterconnection.util.WaterServicesUtil;
import org.egov.waterconnection.validator.ActionValidator;
import org.egov.waterconnection.validator.MDMSValidator;
import org.egov.waterconnection.validator.ValidateProperty;
import org.egov.waterconnection.validator.WaterConnectionValidator;
import org.egov.waterconnection.web.models.Property;
import org.egov.waterconnection.web.models.SearchCriteria;
import org.egov.waterconnection.web.models.WaterConnection;
import org.egov.waterconnection.web.models.WaterConnectionRequest;
import org.egov.waterconnection.web.models.workflow.BusinessService;
import org.egov.waterconnection.workflow.WorkflowIntegrator;
import org.egov.waterconnection.workflow.WorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import static org.egov.waterconnection.constants.WCConstants.APPROVE_CONNECTION;

@Component
public class WaterServiceImpl implements WaterService {

	@Autowired
	private WaterDao waterDao;

	@Autowired
	private WaterConnectionValidator waterConnectionValidator;

	@Autowired
	private ValidateProperty validateProperty;

	@Autowired
	private MDMSValidator mDMSValidator;

	@Autowired
	private EnrichmentService enrichmentService;

	@Autowired
	private WorkflowIntegrator wfIntegrator;

	@Autowired
	private WSConfiguration config;

	@Autowired
	private WorkflowService workflowService;

	@Autowired
	private ActionValidator actionValidator;

	@Autowired
	private WaterServicesUtil waterServiceUtil;

	@Autowired
	private CalculationService calculationService;

	@Autowired
	private WaterDaoImpl waterDaoImpl;

	@Autowired
	private UserService userService;

	@Autowired
	private WaterServicesUtil wsUtil;

	/**
	 * 
	 * @param waterConnectionRequest
	 *            WaterConnectionRequest contains water connection to be created
	 * @return List of WaterConnection after create
	 */
	@Override
	public List<WaterConnection> createWaterConnection(WaterConnectionRequest waterConnectionRequest) {
		int reqType = WCConstants.CREATE_APPLICATION;
		if (wsUtil.isModifyConnectionRequest(waterConnectionRequest)) {
			List<WaterConnection> previousConnectionsList = getAllWaterApplications(waterConnectionRequest);

			// Validate any process Instance exists with WF
			if (!CollectionUtils.isEmpty(previousConnectionsList)) {
				workflowService.validateInProgressWF(previousConnectionsList, waterConnectionRequest.getRequestInfo(),
						waterConnectionRequest.getWaterConnection().getTenantId());
			}
			reqType = WCConstants.MODIFY_CONNECTION;
		}
		waterConnectionValidator.validateWaterConnection(waterConnectionRequest, reqType);
		Property property = validateProperty.getOrValidateProperty(waterConnectionRequest);
		validateProperty.validatePropertyFields(property);
		mDMSValidator.validateMasterForCreateRequest(waterConnectionRequest);
		enrichmentService.enrichWaterConnection(waterConnectionRequest, reqType);
		userService.createUser(waterConnectionRequest);
		// call work-flow
		if (config.getIsExternalWorkFlowEnabled())
			wfIntegrator.callWorkFlow(waterConnectionRequest, property);
		waterDao.saveWaterConnection(waterConnectionRequest);
		return Arrays.asList(waterConnectionRequest.getWaterConnection());
	}

	/**
	 * 
	 * @param criteria
	 *            WaterConnectionSearchCriteria contains search criteria on water
	 *            connection
	 * @param requestInfo
	 * @return List of matching water connection
	 */
	public List<WaterConnection> search(SearchCriteria criteria, RequestInfo requestInfo) {
		List<WaterConnection> waterConnectionList;
		waterConnectionList = getWaterConnectionsList(criteria, requestInfo);
		if (!StringUtils.isEmpty(criteria.getSearchType()) &&
				criteria.getSearchType().equals(WCConstants.SEARCH_TYPE_CONNECTION)) {
			waterConnectionList = enrichmentService.filterConnections(waterConnectionList);
		}
		waterConnectionValidator.validatePropertyForConnection(waterConnectionList);
		enrichmentService.enrichConnectionHolderDeatils(waterConnectionList, criteria, requestInfo);
		return waterConnectionList;
	}

	/**
	 * 
	 * @param criteria
	 *            WaterConnectionSearchCriteria contains search criteria on water
	 *            connection
	 * @param requestInfo
	 * @return List of matching water connection
	 */
	public List<WaterConnection> getWaterConnectionsList(SearchCriteria criteria, RequestInfo requestInfo) {
		return waterDao.getWaterConnectionList(criteria, requestInfo);
	}

	/**
	 * 
	 * @param waterConnectionRequest
	 *            WaterConnectionRequest contains water connection to be updated
	 * @return List of WaterConnection after update
	 */
	@Override
	public List<WaterConnection> updateWaterConnection(WaterConnectionRequest waterConnectionRequest) {
		if(wsUtil.isModifyConnectionRequest(waterConnectionRequest)) {
			// Received request to update the connection for modifyConnection WF
			return updateWaterConnectionForModifyFlow(waterConnectionRequest);
		}
		waterConnectionValidator.validateWaterConnection(waterConnectionRequest, WCConstants.UPDATE_APPLICATION);
		mDMSValidator.validateMasterData(waterConnectionRequest,WCConstants.UPDATE_APPLICATION );
		Property property = validateProperty.getOrValidateProperty(waterConnectionRequest);
		validateProperty.validatePropertyFields(property);
		BusinessService businessService = workflowService.getBusinessService(waterConnectionRequest.getWaterConnection().getTenantId(), 
				waterConnectionRequest.getRequestInfo(), config.getBusinessServiceValue());
		WaterConnection searchResult = getConnectionForUpdateRequest(waterConnectionRequest.getWaterConnection().getId(), waterConnectionRequest.getRequestInfo());
		String previousApplicationStatus = workflowService.getApplicationStatus(waterConnectionRequest.getRequestInfo(),
				waterConnectionRequest.getWaterConnection().getApplicationNo(),
				waterConnectionRequest.getWaterConnection().getTenantId(),
				config.getBusinessServiceValue());
		enrichmentService.enrichUpdateWaterConnection(waterConnectionRequest);
		actionValidator.validateUpdateRequest(waterConnectionRequest, businessService, previousApplicationStatus);
		waterConnectionValidator.validateUpdate(waterConnectionRequest, searchResult, WCConstants.UPDATE_APPLICATION);
		userService.updateUser(waterConnectionRequest, searchResult);
		wfIntegrator.callWorkFlow(waterConnectionRequest, property);
		//call calculator service to generate the demand for one time fee
		calculationService.calculateFeeAndGenerateDemand(waterConnectionRequest, property);
		//check for edit and send edit notification
		waterDaoImpl.pushForEditNotification(waterConnectionRequest);
		//Enrich file store Id After payment
		enrichmentService.enrichFileStoreIds(waterConnectionRequest);
		userService.createUser(waterConnectionRequest);
		//Call workflow
		enrichmentService.postStatusEnrichment(waterConnectionRequest);
		boolean isStateUpdatable = waterServiceUtil.getStatusForUpdate(businessService, previousApplicationStatus);
		waterDao.updateWaterConnection(waterConnectionRequest, isStateUpdatable);
		enrichmentService.postForMeterReading(waterConnectionRequest,  WCConstants.UPDATE_APPLICATION);
		return Arrays.asList(waterConnectionRequest.getWaterConnection());
	}

	/**
	 * Search Water connection to be update
	 * 
	 * @param id
	 * @param requestInfo
	 * @return water connection
	 */
	public WaterConnection getConnectionForUpdateRequest(String id, RequestInfo requestInfo) {
		Set<String> ids = new HashSet<>(Arrays.asList(id));
		SearchCriteria criteria = new SearchCriteria();
		criteria.setIds(ids);
		List<WaterConnection> connections = getWaterConnectionsList(criteria, requestInfo);
		if (CollectionUtils.isEmpty(connections)) {
			StringBuilder builder = new StringBuilder();
			builder.append("WATER CONNECTION NOT FOUND FOR: ").append(id).append(" :ID");
			throw new CustomException("INVALID_WATERCONNECTION_SEARCH", builder.toString());
		}

		return connections.get(0);
	}

	private List<WaterConnection> getAllWaterApplications(WaterConnectionRequest waterConnectionRequest) {
		SearchCriteria criteria = SearchCriteria.builder()
				.connectionNumber(waterConnectionRequest.getWaterConnection().getConnectionNo()).build();
		return search(criteria, waterConnectionRequest.getRequestInfo());
	}

	private List<WaterConnection> updateWaterConnectionForModifyFlow(WaterConnectionRequest waterConnectionRequest) {
		waterConnectionValidator.validateWaterConnection(waterConnectionRequest, WCConstants.MODIFY_CONNECTION);
		mDMSValidator.validateMasterData(waterConnectionRequest, WCConstants.MODIFY_CONNECTION);
		BusinessService businessService = workflowService.getBusinessService(
				waterConnectionRequest.getWaterConnection().getTenantId(), waterConnectionRequest.getRequestInfo(),
				config.getModifyWSBusinessServiceName());
		WaterConnection searchResult = getConnectionForUpdateRequest(
				waterConnectionRequest.getWaterConnection().getId(), waterConnectionRequest.getRequestInfo());
		Property property = validateProperty.getOrValidateProperty(waterConnectionRequest);
		validateProperty.validatePropertyFields(property);
		String previousApplicationStatus = workflowService.getApplicationStatus(waterConnectionRequest.getRequestInfo(),
				waterConnectionRequest.getWaterConnection().getApplicationNo(),
				waterConnectionRequest.getWaterConnection().getTenantId(), config.getModifyWSBusinessServiceName());
		enrichmentService.enrichUpdateWaterConnection(waterConnectionRequest);
		actionValidator.validateUpdateRequest(waterConnectionRequest, businessService, previousApplicationStatus);
		userService.updateUser(waterConnectionRequest, searchResult);
		waterConnectionValidator.validateUpdate(waterConnectionRequest, searchResult, WCConstants.MODIFY_CONNECTION);
		wfIntegrator.callWorkFlow(waterConnectionRequest, property);
		boolean isStateUpdatable = waterServiceUtil.getStatusForUpdate(businessService, previousApplicationStatus);
		waterDao.updateWaterConnection(waterConnectionRequest, isStateUpdatable);
		// setting oldApplication Flag
		markOldApplication(waterConnectionRequest);
		//check for edit and send edit notification
		waterDaoImpl.pushForEditNotification(waterConnectionRequest);
		enrichmentService.postForMeterReading(waterConnectionRequest, WCConstants.MODIFY_CONNECTION);
		return Arrays.asList(waterConnectionRequest.getWaterConnection());
	}

	public void markOldApplication(WaterConnectionRequest waterConnectionRequest) {
		if (waterConnectionRequest.getWaterConnection().getProcessInstance().getAction().equalsIgnoreCase(APPROVE_CONNECTION)) {
			String currentModifiedApplicationNo = waterConnectionRequest.getWaterConnection().getApplicationNo();
			List<WaterConnection> previousConnectionsList = getAllWaterApplications(waterConnectionRequest);

			for(WaterConnection waterConnection:previousConnectionsList){
				if(!waterConnection.getOldApplication() && !(waterConnection.getApplicationNo().equalsIgnoreCase(currentModifiedApplicationNo))){
					waterConnection.setOldApplication(Boolean.TRUE);
					WaterConnectionRequest previousWaterConnectionRequest = WaterConnectionRequest.builder().requestInfo(waterConnectionRequest.getRequestInfo()).waterConnection(waterConnection).build();
					waterDao.updateWaterConnection(previousWaterConnectionRequest,Boolean.TRUE);
				}
			}
		}
	}
}
