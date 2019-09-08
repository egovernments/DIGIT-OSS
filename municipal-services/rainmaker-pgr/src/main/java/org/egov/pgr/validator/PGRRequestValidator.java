package org.egov.pgr.validator;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.pgr.contract.ReportRequest;
import org.egov.pgr.contract.ServiceReqSearchCriteria;
import org.egov.pgr.contract.ServiceRequest;
import org.egov.pgr.contract.ServiceResponse;
import org.egov.pgr.model.ActionHistory;
import org.egov.pgr.model.ActionInfo;
import org.egov.pgr.model.Service;
import org.egov.pgr.model.Service.StatusEnum;
import org.egov.pgr.service.GrievanceService;
import org.egov.pgr.service.ReportService;
import org.egov.pgr.utils.ErrorConstants;
import org.egov.pgr.utils.PGRConstants;
import org.egov.pgr.utils.PGRUtils;
import org.egov.pgr.utils.WorkFlowConfigs;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@org.springframework.stereotype.Service
@Slf4j
public class PGRRequestValidator {

	@Autowired
	private GrievanceService requestService;

	@Autowired
	private PGRUtils pgrUtils;
	
	@Autowired
	private ReportService reportService;

	@Value("${egov.mdms.host}")
	private String mdmsHost;

	@Value("${egov.mdms.search.endpoint}")
	private String mdmsEndpoint;
	
	@Value("${egov.user.host}")
	private String userBasePath;
	
	@Value("${egov.user.create.endpoint}")
	private String userCreateEndPoint;
	
	@Value("${egov.user.search.endpoint}")
	private String userSearchEndPoint;
	
	@Value("${egov.default.expiry.time.before.reopen.in.hours}")
	private Long defaultExpiryTimeBeforeReopen;
	
	@Value("${is.update.on.inactive.categories.enabled}")
	private Boolean isUpdateOnInactiveCategoriessEnabled;
	
	
	/**
	 * validates the create Request based on the following cirtera:
	 * 
	 * 1. Checks if the length of actionInfo and services are same.
	 * 2. Checks if all the complaints belong to the same tenant and are active.
	 * 3. Services codes mentioned in the request are validated against the mdms records.
	 * 
	 * @param serviceRequest
	 */
	public void validateCreate(ServiceRequest serviceRequest) {
		log.info("Validating create request");
		Map<String, String> errorMap = new HashMap<>();
		validateDataSanity(serviceRequest, errorMap, true);
		validateUserRBACProxy(errorMap, serviceRequest.getRequestInfo());
		validateIfArraysEqual(serviceRequest, errorMap);
		validateAddressDetail(serviceRequest, errorMap);
		vaidateServiceCodes(serviceRequest, errorMap);
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}

	/**
	 * validates the update Request based on the following criteria:
	 * 
	 * 1. Checks if the length of actionInfo and services are same.
	 * 2. Checks if the complaints being updated are all belonging to the same tenant and active.
	 * 3. Services codes mentioned in the request are validated against the mdms records.
	 * 4. Validates assignment of service requests based on various roles.
	 * 5. Validates the action performed on the service request based on the role.
	 * 6. Checks if the service being updated does exist.
	 *
	 * @param serviceRequest
	 */
	public void validateUpdate(ServiceRequest serviceRequest) {
		log.info("Validating update request");
		Map<String, String> errorMap = new HashMap<>();
		validateDataSanity(serviceRequest, errorMap, false);
		validateIfArraysEqual(serviceRequest, errorMap);
		if(!isUpdateOnInactiveCategoriessEnabled) {
			vaidateServiceCodes(serviceRequest, errorMap);
		}
		validateAssignments(serviceRequest, errorMap);
		validateAction(serviceRequest, errorMap);
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}
	
	/**
	 * It is a convention that all the complaints being filed/updated in one API call must belong to the same tenant.
	 * 1. This method checks if all complaints belong the same tenant.
	 * 2. Checks if the complaints being updated are all active.
	 * 
	 * TODO: Later, to the same API checking the validity of a tenantId can also be added.
	 * 
	 * @param serviceRequest
	 * @param errorMap
	 */
	public void validateDataSanity(ServiceRequest serviceRequest, Map<String, String> errorMap, Boolean isCreate) {
		Set<String> tenants = serviceRequest.getServices().stream().map(Service::getTenantId).collect(Collectors.toSet());
		if(tenants.size() > 1) {
			errorMap.put(ErrorConstants.INVALID_REQUESTS_ON_TENANT_CODE, ErrorConstants.INVALID_REQUESTS_ON_TENANT_MSG);
		}
		if(!isCreate) {
			Set<Boolean> activeComplaints = serviceRequest.getServices().stream().map(Service::getActive).collect(Collectors.toSet());
			if(activeComplaints.isEmpty() || activeComplaints.contains(false)) {
				errorMap.put(ErrorConstants.INACTIVE_COMPLAINTS_FOR_UPDATE_CODE, ErrorConstants.INACTIVE_COMPLAINTS_FOR_UPDATE_MSG);
			}
		}
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}
	
	public void validateAddressDetail(ServiceRequest serviceRequest, Map<String, String> errorMap) {
		for(Service service: serviceRequest.getServices()) {
			if(null == service.getAddressDetail()) {
				errorMap.put(ErrorConstants.INVALID_ADDRESS_DETAIL_CODE, ErrorConstants.INVALID_ADDRESS_DETAIL_MSG);
			}else {
				if(StringUtils.isEmpty(service.getAddressDetail().getMohalla()) || StringUtils.isEmpty(service.getAddressDetail().getCity())) {
					errorMap.put(ErrorConstants.INVALID_MOHALLA_CITY_CODE, ErrorConstants.INVALID_MOHALLA_CITY_MSG);
				}
			}
		}
	}

	/**
	 * checks the length of both service and actionInfo array to avoid mismatches in
	 * between them
	 * 
	 * @param serviceRequest
	 * @param errorMap
	 */
	private void validateIfArraysEqual(ServiceRequest serviceRequest, Map<String, String> errorMap) {
		if (null != serviceRequest.getActionInfo()
				&& serviceRequest.getServices().size() != serviceRequest.getActionInfo().size())
			errorMap.put(ErrorConstants.UNEQUAL_REQUEST_SIZE_KEY, ErrorConstants.UNEQUAL_REQUEST_SIZE_MSG);
	}

	/**
	 * validates if the given service codes in the request objects are admissible
	 * 
	 * @param serviceRequest
	 * @param errorMap
	 */
	private void vaidateServiceCodes(ServiceRequest serviceRequest, Map<String, String> errorMap) {
		String tenantId = serviceRequest.getServices().get(0).getTenantId();
		List<String> serviceCodes = pgrUtils.getServiceCodes(tenantId,
				serviceRequest.getServices().stream().map(Service::getServiceCode).collect(Collectors.toSet()),
				serviceRequest.getRequestInfo());
		List<String> errorList = new ArrayList<>();
		serviceRequest.getServices().forEach(a -> {
			if (!serviceCodes.contains(a.getServiceCode()))
				errorList.add(a.getServiceCode());
		});
		if (!errorList.isEmpty())
			errorMap.put(ErrorConstants.INVALID_SERVICECODE_CODE, ErrorConstants.INVALID_SERVICECODE_MSG + errorList);
	}


	/**
	 * validates if the assignee has been given for proper action and not provided
	 * for inappropriate actions
	 * 
	 * @param serviceRequest
	 * @param errorMap
	 */
	private void validateAssignments(ServiceRequest serviceRequest, Map<String, String> errorMap) {

		List<String> errorMsgForActionAssign = new ArrayList<>();
		List<Service> services = serviceRequest.getServices();
		List<ActionInfo> infos = serviceRequest.getActionInfo();

		if (null != infos)
			for (int i = 0; i <= infos.size() - 1; i++) {
				ActionInfo info = infos.get(i);
				if (null != info && null != info.getAction())
					if ((WorkFlowConfigs.ACTION_ASSIGN.equalsIgnoreCase(info.getAction())
							|| WorkFlowConfigs.ACTION_REASSIGN.equalsIgnoreCase(info.getAction()))) {
						if(StringUtils.isEmpty(info.getAssignee())) {
							errorMsgForActionAssign.add(services.get(i).getServiceRequestId());
						}else {
							ReportRequest request = ReportRequest.builder().requestInfo(serviceRequest.getRequestInfo())
									.tenantId(serviceRequest.getServices().get(0).getTenantId()).build();
							List<Long> employeeIds = new ArrayList<>();
							try {
								employeeIds.add(Long.valueOf(info.getAssignee()));
							}catch(Exception e) {
								errorMsgForActionAssign.add(services.get(i).getServiceRequestId());
							}
							Map<Long, String> result = reportService.getEmployeeDetails(request, employeeIds);
							if(CollectionUtils.isEmpty(result.keySet())) {
								errorMsgForActionAssign.add(services.get(i).getServiceRequestId());
							}
						}
					}
					else if (!WorkFlowConfigs.ACTION_ASSIGN.equalsIgnoreCase(info.getAction())
							&& !WorkFlowConfigs.ACTION_REASSIGN.equalsIgnoreCase(info.getAction())
							&& null != info.getAssignee())
						info.setAssignee(null);
			}

		if (!errorMsgForActionAssign.isEmpty())
			errorMap.put(ErrorConstants.ASSIGNEE_MISSING_FOR_ACTION_ASSIGN_REASSIGN_KEY,
					ErrorConstants.ASSIGNEE_MISSING_FOR_ACTION_ASSIGN_REASSIGN_MSG + errorMsgForActionAssign);
	}

	/**
	 * validates the legality of the search criteria given
	 * 
	 * @param criteria
	 * @param requestInfo
	 */
	public void validateSearch(ServiceReqSearchCriteria criteria, RequestInfo requestInfo) {
		Map<String, String> errorMap = new HashMap<>();
		validateUserRBACProxy(errorMap, requestInfo);
		if ((criteria.getStartDate() != null && criteria.getStartDate() > new Date().getTime())
				|| (criteria.getEndDate() != null && criteria.getEndDate() > new Date().getTime())) {
			errorMap.put(ErrorConstants.INVALID_START_END_DATE_CODE, ErrorConstants.INVALID_START_END_DATE_MSG);
		}
		if ((criteria.getStartDate() != null && criteria.getEndDate() != null)
				&& criteria.getStartDate().compareTo(criteria.getEndDate()) > 0) {
			errorMap.put(ErrorConstants.INVALID_START_DATE_CODE, ErrorConstants.INVALID_START_DATE_MSG);
		}
		if(!CollectionUtils.isEmpty(criteria.getServiceRequestId()) &&
				criteria.getServiceRequestId().size() == 1) {
			if(criteria.getServiceRequestId().get(0).length() < 6) {
				errorMap.put(ErrorConstants.INVALID_PARTIAL_SERVICEREQUESTID_CODE, ErrorConstants.INVALID_PARTIAL_SERVICEREQUESTID_MSG);
			}
		}

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}

	/**
	 * Checks the following in regard to role based authentication:
	 * 
	 * 1. Checks if the userInfo of the requester is present in the request
	 * 2. Checks if the details like id, role and tenant are available of the requester
	 * 3. Checks if the requester has a valid role to perform any action on the complaint.
	 * 
	 * NOTE: We go with an assumption that zuul always replaces this info, but sometimes when port forwarding or any such bypass is done,
	 * This information will be missing and application will not function.
	 * 
	 * @param errorMap
	 * @param requestInfo
	 */
	public void validateUserRBACProxy(Map<String, String> errorMap, RequestInfo requestInfo) {

		if (null != requestInfo.getUserInfo()) {
			if (null == requestInfo.getUserInfo().getType() || requestInfo.getUserInfo().getType().isEmpty()) {
				errorMap.put(ErrorConstants.MISSING_USERTYPE_CODE, ErrorConstants.MISSING_USERTYPE_MSG);
				return;
			}
			if ((null == requestInfo.getUserInfo().getId()) || 
					(CollectionUtils.isEmpty(requestInfo.getUserInfo().getRoles())) || (StringUtils.isEmpty(requestInfo.getUserInfo().getTenantId()))) {
				errorMap.put(ErrorConstants.MISSING_ROLE_USERID_CODE, ErrorConstants.MISSING_ROLE_USERID_MSG);
				return;
			}else {
				String role = pgrUtils.getPrecedentRole(requestInfo.getUserInfo()
						.getRoles().stream().map(Role::getCode).collect(Collectors.toList()));
				if(StringUtils.isEmpty(role)) {
					errorMap.put(ErrorConstants.INVALID_ROLE_CODE, ErrorConstants.INVALID_ROLE_MSG+ requestInfo.getUserInfo()
							.getRoles().stream().map(Role::getCode).collect(Collectors.toList()));
				}
			}
		} else {
			errorMap.put(ErrorConstants.MISSING_USERINFO_CODE, ErrorConstants.MISSING_USERINFO_MSG);
			return;
		}

	}

	/**
	 * Validates of the action as follows:
	 * 1. Does the user trying to perform the action have rights of that action.
	 * 2. Is the action being performed valid for the current status.
	 * 3. If a DGRO is trying to update the complaint then it checks if the complaint belongs to is department, if it doesn't then he isn't allowed to.
	 * 
	 * 4. This method also checks if the service requests being updated are available in the system. Since it is already a part of the action validation flow.
	 * 
	 * @param serviceRequest
	 * @param errorMap
	 */
	public void validateAction(ServiceRequest serviceRequest, Map<String, String> errorMap) {
		Map<String, List<String>> roleActionMap = WorkFlowConfigs.getRoleActionMap();
		List<String> roles = serviceRequest.getRequestInfo().getUserInfo().getRoles().stream()
				.map(Role::getCode).collect(Collectors.toList());
		List<String> actions = null;
		actions = roleActionMap.get(pgrUtils.getPrecedentRole(serviceRequest.getRequestInfo().getUserInfo()
				.getRoles().stream().map(Role::getCode).collect(Collectors.toList())));
		final List<String> actionsAllowedForTheRole = actions;
		String role = pgrUtils.getPrecedentRole(roles);
		List<String> serviceCodes = new ArrayList<>();
		if(role.equals(PGRConstants.ROLE_DGRO)) {
			if(!serviceRequest.getServices().get(0).getTenantId().equals(serviceRequest.getRequestInfo().getUserInfo().getTenantId())) {
				errorMap.put(ErrorConstants.INVALID_ACTION_FOR_GRO_CODE, ErrorConstants.INVALID_ACTION_FOR_GRO_MSG);
			}
			if (!errorMap.isEmpty())
				throw new CustomException(errorMap);
			ServiceReqSearchCriteria serviceReqSearchCriteria = ServiceReqSearchCriteria.builder()
					.tenantId(serviceRequest.getServices().get(0).getTenantId()).build();
			List<String> departmentCodes = requestService.getDepartmentCode(serviceReqSearchCriteria, serviceRequest.getRequestInfo());
			Object response = requestService.fetchServiceDefs(serviceRequest.getRequestInfo(), serviceRequest.getServices().get(0).getTenantId(), departmentCodes);
			try {
				serviceCodes = JsonPath.read(response, PGRConstants.JSONPATH_SERVICE_CODES);
				log.info("serviceCodes: "+serviceCodes);
				if(CollectionUtils.isEmpty(serviceCodes))
					errorMap.put(ErrorConstants.INVALID_ACTION_FOR_DGRO_CODE, ErrorConstants.INVALID_ACTION_FOR_DGRO_MSG);
			}catch(Exception e) {
				errorMap.put(ErrorConstants.INVALID_ACTION_FOR_DGRO_CODE, ErrorConstants.INVALID_ACTION_FOR_DGRO_MSG);
			}
			for(Service service: serviceRequest.getServices()) {
				if(!serviceCodes.contains(service.getServiceCode())) {
					errorMap.put(ErrorConstants.INVALID_ACTION_FOR_DGRO_CODE, ErrorConstants.INVALID_ACTION_FOR_DGRO_MSG+ " for serviceRequest: "+service.getServiceRequestId());
				}
			}
		}else if(role.equals(PGRConstants.ROLE_GRO)) {
			if(!serviceRequest.getServices().get(0).getTenantId().equals(serviceRequest.getRequestInfo().getUserInfo().getTenantId())) {
				errorMap.put(ErrorConstants.INVALID_ACTION_FOR_GRO_CODE, ErrorConstants.INVALID_ACTION_FOR_GRO_MSG);
			}
		}

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
		
		if (!CollectionUtils.isEmpty(actions)) {
			List<ActionInfo> infos = serviceRequest.getActionInfo();
			if (!CollectionUtils.isEmpty(infos)) {
				infos.stream().forEach(action -> {
					if(!StringUtils.isEmpty(action.getAction())) {
						if(!actionsAllowedForTheRole.contains(action.getAction())) {
							String errorMsg = ErrorConstants.INVALID_ACTION_FOR_ROLE_MSG;
							errorMsg = errorMsg.replace("$action", action.getAction()).replace("$role", serviceRequest.getRequestInfo().getUserInfo().getRoles().get(0).getName());
							errorMap.put(ErrorConstants.INVALID_ACTION_FOR_ROLE_CODE, errorMsg + " for serviceRequest: "+action.getBusinessKey());
						}else {
							validateActionsOnCurrentStatus(serviceRequest, errorMap) ;
						}
					}
				});
			}
		} else {
			errorMap.put(ErrorConstants.INVALID_ROLE_CODE, ErrorConstants.INVALID_ROLE_MSG
					+ serviceRequest.getRequestInfo().getUserInfo().getRoles().get(0).getName().toUpperCase());
		}
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}
	
	 /**
	  * This method valiates if the action being performed is valid on the current status of the sevice request.
	  * NOTE - It also checks if the service requests being validated are available in the system. As part of the action validation.
	  * 
	  * @param serviceRequest
	  * @param errorMap
	  */
	public void validateActionsOnCurrentStatus(ServiceRequest serviceRequest, Map<String, String> errorMap) {
		Map<String, List<String>> actioncurrentStatusMap = WorkFlowConfigs.getActionCurrentStatusMap();
		ServiceResponse serviceResponse = getServiceRequests(serviceRequest, errorMap);
		if (!errorMap.isEmpty())
			return;
		List<ActionHistory> historys = serviceResponse.getActionHistory();
		Map<String, ActionHistory> historyMap = new HashMap<>();
		historys.forEach(a -> historyMap.put(a.getActions().get(0).getBusinessKey(), a));
		for (int index = 0; index < serviceRequest.getServices().size(); index++) {
			Service service = serviceRequest.getServices().get(index);
			ActionHistory history = historyMap.get(service.getServiceRequestId());
			ActionInfo actionInfo = serviceRequest.getActionInfo().get(index);
			String currentStatus = pgrUtils.getCurrentStatus(history);
			List<String> validStatusList = actioncurrentStatusMap.get(actionInfo.getAction());
			/**
			 * if currenstatus isn't available in the validstatus list of that action, then the action is invalid.
			 */
			if (!StringUtils.isEmpty(currentStatus) && !validStatusList.contains(currentStatus)) {
				String errorMsg = ErrorConstants.INVALID_ACTION_ON_STATUS_MSG;
				errorMsg = errorMsg.replace("$action", actionInfo.getAction()).replace("$status", currentStatus);
				errorMap.put(ErrorConstants.INVALID_ACTION_ON_STATUS_CODE, errorMsg + "for serviceRequest: "+service.getServiceRequestId());
			}
			if (!WorkFlowConfigs.ACTION_CLOSE.equals(actionInfo.getAction())
					&& (!StringUtils.isEmpty(service.getFeedback()) || !StringUtils.isEmpty(service.getRating()))) {
				errorMap.put(ErrorConstants.UPDATE_FEEDBACK_ERROR_KEY, ErrorConstants.UPDATE_FEEDBACK_ERROR_MSG);
			}
			/**
			 * Code to check if the reopen happens within defaultExpiryTimeBeforeReopen no of days after resolve. 
			 */
			if(WorkFlowConfigs.ACTION_REOPEN.equals(actionInfo.getAction()) && currentStatus.equals(WorkFlowConfigs.STATUS_RESOLVED)) {
				if(null != getLastModifiedTime(service, history)) {
					Long timeDifference = new Date().getTime() - getLastModifiedTime(service, history);
					if(TimeUnit.MILLISECONDS.toHours(timeDifference) > defaultExpiryTimeBeforeReopen) {
						Long days = defaultExpiryTimeBeforeReopen / 24;
						String error = ErrorConstants.INVALID_ACTION_REOPEN_EXPIRED_MSG;
						error = error.replaceAll("$days", days.toString());
						errorMap.put(ErrorConstants.INVALID_ACTION_REOPEN_EXPIRED_CODE, error);
					}
					
				}
			}
			service.setStatus(StatusEnum.fromValue(currentStatus)); //This will be updated according to the action performed in service layer.
		}		

	}
	
	/**
	 * validates the services by fetching the service ids from the database
	 * 
	 * @param serviceRequest
	 * @param errorMap
	 */
	private ServiceResponse getServiceRequests(ServiceRequest serviceRequest, Map<String, String> errorMap) {
		log.info("Validating if servicerequests exist");
		ObjectMapper mapper = pgrUtils.getObjectMapper();
		ServiceReqSearchCriteria serviceReqSearchCriteria = ServiceReqSearchCriteria.builder()
				.tenantId(serviceRequest.getServices().get(0).getTenantId()).serviceRequestId(serviceRequest
						.getServices().stream().map(Service::getServiceRequestId).collect(Collectors.toList()))
				.build();
		ServiceResponse serviceResponse = mapper.convertValue(requestService
				.getServiceRequestDetails(serviceRequest.getRequestInfo(), serviceReqSearchCriteria), ServiceResponse.class);
		Map<String, Service> map = serviceResponse.getServices().stream().collect(Collectors.toMap(Service::getServiceRequestId, Function.identity()));
		List<String> errorList = new ArrayList<>();
		serviceRequest.getServices().forEach(a -> {
			if (map.get(a.getServiceRequestId()) == null)
				errorList.add(a.getServiceRequestId());
		});
		if (!errorList.isEmpty())
			errorMap.put(ErrorConstants.INVALID_SERVICEREQUESTID_CODE, ErrorConstants.INVALID_SERVICEREQUESTID_MSG + errorList);
		
		return serviceResponse;
	}
	
	private Long getLastModifiedTime(Service service, ActionHistory history) {
		Long lasModifiedTime = null;
		//Search will always return actions in the order of latest action - oldest action.
		if(null == service.getAuditDetails().getLastModifiedTime())
			lasModifiedTime = history.getActions().get(0).getWhen(); //time when the latest action was taken
		else
			lasModifiedTime = service.getAuditDetails().getLastModifiedTime();
		
		return lasModifiedTime;
		
	}
}
