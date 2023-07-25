package org.egov.fsm.validator;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import org.apache.commons.lang3.math.NumberUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.fsm.config.FSMConfiguration;
import org.egov.fsm.service.BoundaryService;
import org.egov.fsm.service.DSOService;
import org.egov.fsm.util.FSMAuditUtil;
import org.egov.fsm.util.FSMConstants;
import org.egov.fsm.util.FSMErrorConstants;
import org.egov.fsm.util.FSMToFSMAuditUtilConverter;
import org.egov.fsm.web.model.FSM;
import org.egov.fsm.web.model.FSMAuditSearchCriteria;
import org.egov.fsm.web.model.FSMRequest;
import org.egov.fsm.web.model.FSMSearchCriteria;
import org.egov.fsm.web.model.dso.Vendor;
import org.egov.fsm.web.model.dso.VendorSearchCriteria;
import org.egov.fsm.web.model.user.User;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.cedarsoftware.util.GraphComparator;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;
@Component
@Slf4j
public class FSMValidator {

	@Autowired
	private MDMSValidator mdmsValidator;
	

	@Autowired
	private BoundaryService boundaryService ;

	@Autowired
	private FSMConfiguration config;
	
	@Autowired
	private DSOService dsoService;
	
	@Autowired
	private FSMToFSMAuditUtilConverter converter;

	@SuppressWarnings("deprecation")
	public void validateCreate(FSMRequest fsmRequest, Object mdmsData) {
		mdmsValidator.validateMdmsData(fsmRequest, mdmsData);
		FSM fsm = fsmRequest.getFsm();
		if( fsmRequest.getRequestInfo().getUserInfo().getType().equalsIgnoreCase(FSMConstants.CITIZEN)) {
			
			// when user is created for the citizen but name is mepty
			if (fsm.getCitizen() != null && StringUtils.isEmpty(fsm.getCitizen().getName())
					&& StringUtils.isEmpty(fsmRequest.getRequestInfo().getUserInfo().getName())) {
				throw new CustomException(FSMErrorConstants.INVALID_APPLICANT_ERROR,
						"Applicant Name and mobile number mandatory");
			}
			// ui does not pass citizen in fsm but userInfo in the request is citizen
			if (fsm.getCitizen() == null || StringUtils.isEmpty(fsm.getCitizen().getName())
					|| StringUtils.isEmpty(fsm.getCitizen().getMobileNumber())) {
				User citizen = new User();
				BeanUtils.copyProperties(fsmRequest.getRequestInfo().getUserInfo(), citizen);
				if(fsmRequest.getFsm().getCitizen()!=null)
					citizen.setGender(fsmRequest.getFsm().getCitizen().getGender());
					fsm.setCitizen(citizen);
			}
			
			if(!StringUtils.isEmpty(fsm.getSource())) {
				mdmsValidator.validateApplicationChannel(fsm.getSource());
				
			}else {
				fsm.setSource(FSMConstants.APPLICATION_CHANNEL_SOURCE);
			}
			if(!StringUtils.isEmpty(fsm.getSanitationtype())) {
				mdmsValidator.validateOnSiteSanitationType(fsm.getSanitationtype(),fsm.getPitDetail());

			}
			
		} else if (fsmRequest.getRequestInfo().getUserInfo().getType().equalsIgnoreCase(FSMConstants.EMPLOYEE)) {
			User applicant = fsm.getCitizen();
			if (applicant == null || StringUtils.isEmpty(applicant.getName())
					|| StringUtils.isEmpty(applicant.getMobileNumber())) {
				throw new CustomException(FSMErrorConstants.INVALID_APPLICANT_ERROR,
						"Applicant Name and mobile number mandatory");
			}
			
			//validateVehicleType(fsmRequest);
			validateVehicleCapacity(fsmRequest);
			mdmsValidator.validateApplicationChannel(fsm.getSource());
			if(!StringUtils.isEmpty(fsm.getSanitationtype())) {
				mdmsValidator.validateOnSiteSanitationType(fsm.getSanitationtype(),fsm.getPitDetail());

			}
			validateTripAmount(fsmRequest, mdmsData);
		}else {
			// incase of anonymous user, citizen is mandatory
			if (fsm.getCitizen() == null || StringUtils.isEmpty(fsm.getCitizen().getName())
					|| StringUtils.isEmpty(fsm.getCitizen().getMobileNumber())) {
				throw new CustomException(FSMErrorConstants.INVALID_APPLICANT_ERROR,
						"Applicant Name and mobile number mandatory");
			}
			
			if(!StringUtils.isEmpty(fsm.getSource())) {
				mdmsValidator.validateApplicationChannel(fsm.getSource());
				
			}
			if(!StringUtils.isEmpty(fsm.getSanitationtype())) {
				mdmsValidator.validateOnSiteSanitationType(fsm.getSanitationtype() ,fsm.getPitDetail());
			}
		}
		mdmsValidator.validatePropertyType(fsmRequest.getFsm().getPropertyUsage());
		validateNoOfTrips(fsmRequest, mdmsData);
		validateSlum(fsmRequest, mdmsData);
	}
	
		
	/**
	 * validate the vehicle capacity by using Capacity to check if vendor exists for the given vehicle capacity
	 */
	private void validateVehicleCapacity(FSMRequest fsmRequest) {
		FSM fsm = fsmRequest.getFsm();
		
		VendorSearchCriteria vendorSearchCriteria=new VendorSearchCriteria();
		vendorSearchCriteria = VendorSearchCriteria.builder()
				.vehicleCapacity(fsm.getVehicleCapacity())
				.tenantId(fsm.getTenantId()).build();
		
		Vendor vendor = dsoService.getVendor(vendorSearchCriteria,fsmRequest.getRequestInfo());
		/*
		 * Vendor vendor = dsoService.getVendor(null, fsm.getTenantId(), null, null,
		 * null,fsm.getVehicleCapacity(), fsmRequest.getRequestInfo());
		 */
		
		if (vendor == null) {
			throw new CustomException(FSMErrorConstants.NO_VEHICLE_VEHICLE_TYPE,
					"DSO Does not exists in the ULB with vehicle of capacity " + fsm.getVehicleCapacity());
		}
	}

	/**
	 * Validates if the search parameters are valid
	 * 
	 * @param requestInfo
	 *            The requestInfo of the incoming request
	 * @param criteria
	 *            The FSMSearch Criteria
	 */
//TODO need to make the changes in the data
	public void validateSearch(RequestInfo requestInfo, FSMSearchCriteria criteria) {
		
		if (requestInfo.getUserInfo().getType().equalsIgnoreCase(FSMConstants.EMPLOYEE) && criteria.getTenantId().split("\\.").length == 1) {
			throw new CustomException(FSMErrorConstants.EMPLOYEE_INVALID_SEARCH, "Employee cannot search at state level");
		}
		if (!requestInfo.getUserInfo().getType().equalsIgnoreCase(FSMConstants.CITIZEN) && criteria.isEmpty())
			throw new CustomException(FSMErrorConstants.INVALID_SEARCH, "Search without any paramters is not allowed");

		if (!requestInfo.getUserInfo().getType().equalsIgnoreCase(FSMConstants.CITIZEN) && !criteria.tenantIdOnly()
				&& criteria.getTenantId() == null)
			throw new CustomException(FSMErrorConstants.INVALID_SEARCH, "TenantId is mandatory in search");

		if (requestInfo.getUserInfo().getType().equalsIgnoreCase(FSMConstants.CITIZEN) && !criteria.isEmpty()
				&& !criteria.tenantIdOnly() && criteria.getTenantId() == null) 
			throw new CustomException(FSMErrorConstants.INVALID_SEARCH, "TenantId is mandatory in search");
		if(criteria.getTenantId() == null)
			throw new CustomException(FSMErrorConstants.INVALID_SEARCH, "TenantId is mandatory in search");
			
		String allowedParamStr = null;

		if (requestInfo.getUserInfo().getType().equalsIgnoreCase(FSMConstants.CITIZEN))
			allowedParamStr = config.getAllowedCitizenSearchParameters();
		else if (requestInfo.getUserInfo().getType().equalsIgnoreCase(FSMConstants.EMPLOYEE))
			allowedParamStr = config.getAllowedEmployeeSearchParameters();
		
		else if (requestInfo.getUserInfo().getType().equalsIgnoreCase(FSMConstants.SYSTEM))
			allowedParamStr = config.getAllowedEmployeeSearchParameters();
		
		else
		{
			
			throw new CustomException(FSMErrorConstants.INVALID_SEARCH,
					"The userType: " + requestInfo.getUserInfo().getType() + " does not have any search config");
		}
		if (StringUtils.isEmpty(allowedParamStr) && !criteria.isEmpty())
			throw new CustomException(FSMErrorConstants.INVALID_SEARCH, "No search parameters are expected");
		else {
			List<String> allowedParams = Arrays.asList(allowedParamStr.split(","));
			validateSearchParams(criteria, allowedParams);
		}
	}

	/**
	 * Validates if the paramters coming in search are allowed
	 * 
	 * @param criteria
	 *            fsm search criteria
	 * @param allowedParams
	 *            Allowed Params for search
	 */
	private void validateSearchParams(FSMSearchCriteria criteria, List<String> allowedParams) {

		if (criteria.getMobileNumber() != null && !allowedParams.contains("mobileNumber"))
			throw new CustomException(FSMErrorConstants.INVALID_SEARCH, "Search on mobileNumber is not allowed");

		if (criteria.getOffset() != null && !allowedParams.contains("offset"))
			throw new CustomException(FSMErrorConstants.INVALID_SEARCH, "Search on offset is not allowed");

		if (criteria.getLimit() != null && !allowedParams.contains("limit"))
			throw new CustomException(FSMErrorConstants.INVALID_SEARCH, "Search on limit is not allowed");

		if (criteria.getApplicationNos() != null && !allowedParams.contains("applicationNos")) {
			System.out.println("app..... " + criteria.getApplicationNos());
			throw new CustomException(FSMErrorConstants.INVALID_SEARCH, "Search on applicationNo is not allowed");
		}
		if (criteria.getFromDate() != null && !allowedParams.contains("fromDate") && criteria.getToDate() != null
				&& !allowedParams.contains("toDate")) {
			throw new CustomException(FSMErrorConstants.INVALID_SEARCH, "Search on fromDate and toDate is not allowed");
		} else if( criteria.getFromDate() != null && criteria.getToDate() != null ){

			if ((criteria.getFromDate() != null && criteria.getToDate() == null)
					|| criteria.getFromDate() == null && criteria.getToDate() != null) {
				throw new CustomException(FSMErrorConstants.INVALID_SEARCH, "Search only "
						+ ((criteria.getFromDate() == null) ? "fromDate" : "toDate") + " is not allowed");
			}

			Calendar fromDate = Calendar.getInstance(TimeZone.getDefault());
			fromDate.setTimeInMillis(criteria.getFromDate());
			fromDate.set(Calendar.HOUR_OF_DAY, 0);
			fromDate.set(Calendar.MINUTE, 0);
			fromDate.set(Calendar.SECOND, 0);

			Calendar toDate =  Calendar.getInstance(TimeZone.getDefault());
			toDate.setTimeInMillis(criteria.getToDate());
			toDate.set(Calendar.HOUR_OF_DAY, 23);
			toDate.set(Calendar.MINUTE, 59);
			toDate.set(Calendar.SECOND, 59);
			toDate.set(Calendar.MILLISECOND, 0);


			if (fromDate.getTimeInMillis() > toDate.getTimeInMillis() ) {
				throw new CustomException(FSMErrorConstants.INVALID_SEARCH, "fromdate cannot be greater than todate.");

			}
		}

		if (CollectionUtils.isEmpty(criteria.getApplicationStatus()) && !allowedParams.contains("applicationStatus")) {
			throw new CustomException(FSMErrorConstants.INVALID_SEARCH, "Search on applicationStatus is not allowed");
		}

		if (CollectionUtils.isEmpty(criteria.getLocality()) && !allowedParams.contains("locality")) {
			throw new CustomException(FSMErrorConstants.INVALID_SEARCH, "Search on applicationStatus is not allowed");
		}

		if (CollectionUtils.isEmpty(criteria.getOwnerIds()) && !allowedParams.contains("ownerIds")) {
			throw new CustomException(FSMErrorConstants.INVALID_SEARCH, "Search on applicationStatus is not allowed");
		}

	}

	public void validateUpdate(FSMRequest fsmRequest, List<FSM> searchResult, Object mdmsData,boolean isDsoRole) {
		boundaryService.getAreaType(fsmRequest, config.getHierarchyTypeCode());
		FSM fsm = fsmRequest.getFsm();
		
		if(searchResult.size() <= 0 ) {
			throw new CustomException(FSMErrorConstants.UPDATE_ERROR, "Application Not found in the System" + fsm);
		} 
		if(searchResult.size() > 1) {
			throw new CustomException(FSMErrorConstants.UPDATE_ERROR, "Found multiple application(s)" + fsm);
		}
		
		if(fsmRequest.getWorkflow() == null || StringUtils.isEmpty(fsmRequest.getWorkflow().getAction() )) {
			throw new CustomException(FSMErrorConstants.INVALID_ACTION," Workflow Action is mandatory!");
		}
		
		if(fsmRequest.getFsm() !=null && !StringUtils.hasLength(fsmRequest.getFsm().getPaymentPreference())) {
			throw new CustomException(FSMErrorConstants.INVALID_ACTION," Payment preference is mandatory!");
		}
		
		mdmsValidator.validateMdmsData(fsmRequest, mdmsData);
		// SAN-889: Added validation for recevied payment
		if (null != fsmRequest.getWorkflow() && null != fsmRequest.getWorkflow().getAction()
				&& fsmRequest.getWorkflow().getAction().equalsIgnoreCase(FSMConstants.WF_ACTION_COMPLETE)
				&& isDsoRole) {
			Map<String, String> additionalDetails = null;
			try {
				additionalDetails = fsmRequest.getFsm().getAdditionalDetails() != null
						? (Map<String, String>) fsmRequest.getFsm().getAdditionalDetails()
						: new HashMap<String, String>();
			} catch (Exception e) {
				throw new CustomException(FSMErrorConstants.INVALID_ACTION, " Received payment type is mandatory!");
			}
			if (null != additionalDetails && additionalDetails.get("receivedPayment") == null)
				throw new CustomException(FSMErrorConstants.INVALID_ACTION, " Received payment type is mandatory!");
			log.info("additionalDetails.get(\"receivedPayment\"):: " + additionalDetails.get("receivedPayment"));
			mdmsValidator.validateReceivedPaymentType(additionalDetails.get("receivedPayment"));
		}
		
		validateUpdatableParams(fsmRequest, searchResult, mdmsData);
		validateAllIds(searchResult, fsm);
		
		
		validateVehicleCapacity(fsmRequest);
		
		if(!StringUtils.isEmpty(fsm.getSource())) {
			mdmsValidator.validateApplicationChannel(fsm.getSource());
			
		}
		if(!StringUtils.isEmpty(fsm.getSanitationtype())) {
			mdmsValidator.validateOnSiteSanitationType(fsm.getSanitationtype(),fsm.getPitDetail());
		}
		
		mdmsValidator.validatePropertyType(fsmRequest.getFsm().getPropertyUsage());
		validateSlum(fsmRequest, mdmsData);
		validateNoOfTrips(fsmRequest, mdmsData);
		validateTripAmount(fsmRequest, mdmsData);
		
		mdmsValidator.validatePaymentPreference(fsm.getPaymentPreference());

	}
	
	/**
	 * @param collection the Collection to check
	 * @param element the element to look for
	 * @return {@code true} if found atleast partial content, {@code false} otherwise
	 */
	public boolean contains(@Nullable Collection<String> collection, String element) {
		if (collection != null) {
			for (String candidate : collection) {
				if (candidate.contains(element)) {
					return true;
				}
			}
		}
		return false;
	}
	
	public void validateUpdatableParams(FSMRequest fsmRequest, List<FSM> searchResult, Object mdmsData) {
		List<String> listOfAllowedUpdatableParams = JsonPath.read(mdmsData,
				String.format(FSMConstants.MDMS_FSM_CONFIG_ALLOW_MODIFY, fsmRequest.getFsm().getApplicationStatus()));
		
		FSMAuditUtil newFsm = converter.convert(fsmRequest.getFsm());
		FSMAuditUtil oldFsm = converter.convert(searchResult.get(NumberUtils.INTEGER_ZERO));
		

		if (!CollectionUtils.isEmpty(listOfAllowedUpdatableParams)) {
			List<String> listOfUpdatedParams = getDelta(oldFsm, newFsm);
			if (listOfAllowedUpdatableParams.contains(FSMConstants.PIT_DETAIL)) {
				FSMConstants.pitDetailList.forEach(property -> {
					listOfUpdatedParams.remove(property);
				});
			}
			
			
			if (listOfUpdatedParams.contains(FSMConstants.APPLICATION_STATUS)) {
				listOfAllowedUpdatableParams.add(FSMConstants.APPLICATION_STATUS);
			}
			if (listOfUpdatedParams.contains(FSMConstants.NO_OF_TRIPS)) {
				listOfAllowedUpdatableParams.add(FSMConstants.NO_OF_TRIPS);
			}
			if (listOfUpdatedParams.contains(FSMConstants.VEHICLE_CAPACITY)) {
				listOfAllowedUpdatableParams.add(FSMConstants.VEHICLE_CAPACITY);
			}
			
			for(String updatedParam : listOfUpdatedParams) {
				if (!contains(listOfAllowedUpdatableParams, updatedParam)) {
					throw new CustomException(FSMErrorConstants.UPDATE_ERROR,
							String.format("Cannot update the field:%s", updatedParam));
				}
			}
		}

	}
	
	public List<String> getDelta(FSMAuditUtil source, FSMAuditUtil target) {
		List<GraphComparator.Delta> deltas = GraphComparator.compare(source, target, new GraphComparator.ID() {
			@Override
			public Object getId(Object o) {
				return "id";
			}
		});
		List<String> updatedFields= new ArrayList<>();
		deltas.forEach(delta -> {
			updatedFields.add(delta.getFieldName());
		});
		return updatedFields;
	}
	
	private void validateTripAmount(FSMRequest fsmRequest, Object mdmsData) {
		FSM fsm = fsmRequest.getFsm();
		List<Map<String,Object>> tripAountAllowed = JsonPath.read(mdmsData, FSMConstants.FSM_TRIP_AMOUNT_OVERRIDE_ALLOWED);
		Map<String, String> additionalDetails=null;
		try {
		
			additionalDetails = fsm.getAdditionalDetails() != null ? (Map<String, String>) fsm.getAdditionalDetails()
					: new HashMap<String, String>();
		}catch (Exception e) {
		log.info("format is wrong", e.getMessage());
		}
		if(!CollectionUtils.isEmpty(tripAountAllowed) &&  additionalDetails.get("tripAmount") == null   ) {
			throw new CustomException(FSMErrorConstants.INVALID_TRIP_AMOUNT," tripAmount is invalid");
		}else if(!CollectionUtils.isEmpty(tripAountAllowed)){
			try {
				BigDecimal tripAmt = BigDecimal.valueOf(Double.valueOf((String)additionalDetails.get("tripAmount")));
			}catch(Exception e) {
				throw new CustomException(FSMErrorConstants.INVALID_TRIP_AMOUNT," tripAmount is invalid");
			}
		}
	}
	
	/**
	 * @param fsmRequest
	 * @param mdmsData
	 */
	private void validateNoOfTrips(FSMRequest fsmRequest, Object mdmsData) {
		FSM fsm = fsmRequest.getFsm();
		Integer noOfTrips  = fsm.getNoOfTrips();
		List<Map<String,String>> noOftripsAllowed = JsonPath.read(mdmsData, FSMConstants.FSM_NO_OF_TRIPS_AMOUNT_OVERRIDE_ALLOWED);
		
		if(CollectionUtils.isEmpty(noOftripsAllowed) ) {
			if(noOfTrips == null || noOfTrips.intValue() !=1) {
				fsmRequest.getFsm().setNoOfTrips(1);
			}
		}
	}
	/**
	 * @param fsmRequest
	 * @param mdmsData
	 */
	private void validateSlum(FSMRequest fsmRequest, Object mdmsData) {
		FSM fsm = fsmRequest.getFsm();
		
		String locality = fsm.getAddress().getLocality().getCode();
		List<Map<String,Object>> slumNameAllowed = JsonPath.read(mdmsData, FSMConstants.FSM_SLUM_OVERRIDE_ALLOWED);

		
		if(!CollectionUtils.isEmpty(slumNameAllowed) && !StringUtils.isEmpty(fsm.getAddress().getSlumName())) {
//			List<Map<String,Object>> slumNameMapping = JsonPath.read(mdmsData, FSMConstants.SLUM_CODE_PATH.replace("{1}", locality).replace("{2}", fsm.getAddress().getSlumName().trim()));
//			if(CollectionUtils.isEmpty(slumNameMapping)) {
//				 throw new CustomException(FSMErrorConstants.INVALID_SLUM, "Slum Name is Invalid!");
//			}
		}
		
	}
	private void validateAllIds(List<FSM> searchResult, FSM fsm) {

		Map<String, FSM> idTofsmFromSearch = new HashMap<>();
		searchResult.forEach(fsms -> {
			idTofsmFromSearch.put(fsms.getId(), fsms);
		});

		Map<String, String> errorMap = new HashMap<>();
		FSM searchedfsm = idTofsmFromSearch.get(fsm.getId());

		if (!searchedfsm.getApplicationNo().equalsIgnoreCase(fsm.getApplicationNo()))
			errorMap.put("INVALID UPDATE", "The application number from search: " + searchedfsm.getApplicationNo()
					+ " and from update: " + fsm.getApplicationNo() + " does not match");

		if (!searchedfsm.getId().equalsIgnoreCase(fsm.getId()))
			errorMap.put("INVALID UPDATE", "The id " + fsm.getId() + " does not exist");


		// validate the pit id


		if (!CollectionUtils.isEmpty(errorMap))
			throw new CustomException(errorMap);
	}
	

	private void setFieldsFromSearch(FSMRequest fsmRequest, List<FSM> searchResult, Object mdmsData) {
		Map<String, FSM> idToFsmFromSearch = new HashMap<>();

		searchResult.forEach(fsm -> {
			idToFsmFromSearch.put(fsm.getId(), fsm);
		});

		fsmRequest.getFsm().getAuditDetails()
				.setCreatedBy(idToFsmFromSearch.get(fsmRequest.getFsm().getId()).getAuditDetails().getCreatedBy());
		fsmRequest.getFsm().getAuditDetails()
				.setCreatedTime(idToFsmFromSearch.get(fsmRequest.getFsm().getId()).getAuditDetails().getCreatedTime());
		fsmRequest.getFsm().setStatus(idToFsmFromSearch.get(fsmRequest.getFsm().getId()).getStatus());
	}
	
	public void validateWorkflowActions(FSMRequest fsmRequest) {
		FSM fsm = fsmRequest.getFsm();
		// TODO Validate the the current workflow action is valid according to business
	}
	
	public void validateAudit(FSMAuditSearchCriteria criteria) {
		if(criteria.getTenantId()==null) {
			throw new CustomException(FSMErrorConstants.INVALID_SEARCH, "TenantId is mandatory in search");
		}
		else {
			 if(StringUtils.isEmpty(criteria.getApplicationNo()) && StringUtils.isEmpty(criteria.getId())) {
				 throw new CustomException(FSMErrorConstants.INVALID_SEARCH, "applicationNo or id is mandatory in search");
			 }
		}
	}
	
	/**
	 * @param fsmRequest
	 * @param mdmsData
	 */
	public void validateCheckList(FSMRequest fsmRequest, Object mdmsData) {
		Map<String, String> errorMap = new HashMap<>();
		FSM fsm = fsmRequest.getFsm();
		Map additonalDetails = (Map)fsm.getAdditionalDetails();
		List<Map<String,String>> requestCheckList = (List<Map<String, String>>) additonalDetails.get(FSMConstants.MDMS_CHECKLIST);
		List<Map<String,Object>> mdmsCheckList = JsonPath.read(mdmsData, FSMConstants.REQ_CHECKLIST_PATH);
		if(mdmsCheckList.size() > 0 && (requestCheckList == null || requestCheckList.size() ==0)) {
			errorMap.put(FSMErrorConstants.INVALID_CHECKLIST, " Mandatory checlist is not provided!");
		}
		mdmsCheckList.forEach(mdmsClItem->{
			Map<String,String> reqClItem = null;
			for( int j=0;j<requestCheckList.size();j++) {
				if(requestCheckList.get(j).get("code").equalsIgnoreCase((String) mdmsClItem.get("code") )) {
					reqClItem = requestCheckList.get(j);
				}
			}
			if(reqClItem != null) {
				String[] reqOptions =reqClItem.get("value").split(",");
				List<String> mdmsClOptions =(List<String>) mdmsClItem.get("options");
				if(((String) mdmsClItem.get("type")).equalsIgnoreCase(FSMConstants.CHECK_LIST_SINGLE_SELECT) ) {
					if(reqOptions.length > 1) {
						errorMap.put(FSMErrorConstants.INVALID_CHECKLIST, "Checklist "+ mdmsClItem.get("code")+" is SINGLE SELECT, cannot select multiple options.");
					}else if(!mdmsClOptions.contains(reqOptions[0])){
						errorMap.put(FSMErrorConstants.INVALID_CHECKLIST, " Value provided is not checklist options.");
					}
				}else if(((String) mdmsClItem.get("type")).equalsIgnoreCase(FSMConstants.CHECK_LIST_MULTI_SELECT)) {
					for( int h=0;h<reqOptions.length;h++) {
						if(!mdmsClOptions.contains(reqOptions[h])) {
							errorMap.put(FSMErrorConstants.INVALID_CHECKLIST, "Checklist "+mdmsClItem.get("code")+" does not allow option "+reqOptions[h]);
						}
					}
					
				}else if(((String) mdmsClItem.get("type")).equalsIgnoreCase(FSMConstants.CHECK_LIST_DROP_DOWN)) {
					log.info("CHECK_LIST_DROP_DOWN ");
					for( int h=0;h<reqOptions.length;h++) {
						log.info("reqOptions :: "+reqOptions[h]);
						if(!mdmsClOptions.contains(reqOptions[h])) {
							errorMap.put(FSMErrorConstants.INVALID_CHECKLIST, "Checklist "+mdmsClItem.get("code")+" does not allow option "+reqOptions[h]);
						}
					}
					
				}
				else {
					errorMap.put(FSMErrorConstants.INVALID_CHECKLIST, " Value provided is not checklist options.");
				}
			}else{
				errorMap.put(FSMErrorConstants.INVALID_CHECKLIST, " Required CheckList "+mdmsClItem.get("code")+ " is not answered ");
			}
		});
		
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}
	

}