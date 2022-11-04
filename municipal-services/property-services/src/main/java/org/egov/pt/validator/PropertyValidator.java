package org.egov.pt.validator;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.ConstructionDetail;
import org.egov.pt.models.GeoLocation;
import org.egov.pt.models.Institution;
import org.egov.pt.models.OwnerInfo;
import org.egov.pt.models.Property;
import org.egov.pt.models.PropertyCriteria;
import org.egov.pt.models.Unit;
import org.egov.pt.models.enums.CreationReason;
import org.egov.pt.models.enums.Status;
import org.egov.pt.models.workflow.BusinessService;
import org.egov.pt.models.workflow.ProcessInstance;
import org.egov.pt.models.workflow.State;
import org.egov.pt.service.DiffService;
import org.egov.pt.service.PropertyService;
import org.egov.pt.service.WorkflowService;
import org.egov.pt.util.EncryptionDecryptionUtil;
import  org.egov.pt.util.PTConstants;
import org.egov.pt.util.PropertyUtil;
import org.egov.pt.web.contracts.PropertyRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Sets;
import com.jayway.jsonpath.PathNotFoundException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class PropertyValidator {


    @Autowired
    private PropertyUtil propertyUtil;

    @Autowired
    private PropertyConfiguration configs;
    
    @Autowired
    private PropertyService service;
    
    @Autowired
    private ObjectMapper mapper;
    
    
    @Autowired
    private DiffService diffService;
    
    @Autowired
    private WorkflowService workflowService;

	@Autowired
	EncryptionDecryptionUtil encryptionDecryptionUtil;

    /**
     * Validate the masterData and ctizenInfo of the given propertyRequest
     * @param request PropertyRequest for create
     */
	public void validateCreateRequest(PropertyRequest request) {

		Map<String, String> errorMap = new HashMap<>();
		
		List<Unit> units 		=	request.getProperty().getUnits();
		List<OwnerInfo> owners 	=	request.getProperty().getOwners();

		if (!CollectionUtils.isEmpty(units))
			while (units.remove(null));
		while (owners.remove(null));

		if(CollectionUtils.isEmpty(request.getProperty().getOwners()))
			throw new CustomException("OWNER INFO ERROR","Owners cannot be empty, please provide at least one owner information");
		
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);

		validateMasterData(request, errorMap);
		validateMobileNumber(request, errorMap);
		validateFields(request, errorMap);
		if (!CollectionUtils.isEmpty(units))
			validateUnits(request, errorMap);
		
		
		Set<String> uniqueOwnerSet = owners.stream()
				.map(owner -> owner.getName() + owner.getMobileNumber()).collect(Collectors.toSet());
		
		if (uniqueOwnerSet.size() != owners.size())
			throw new CustomException("EG_PT_OWNER INFO ERROR", "Duplicate Owners in the request");
			
		

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}

	private void validateUnits(PropertyRequest request, Map<String, String> errorMap) {

		Property property = request.getProperty();
		List<Unit> units = property.getUnits();

		for (Unit unit : units) {
			
			ConstructionDetail consDtl = unit.getConstructionDetail();
			
			Boolean isBuiltUpAreaNull = consDtl.getBuiltUpArea() == null;
			
			if (isBuiltUpAreaNull) {

				if (consDtl.getPlinthArea() == null || consDtl.getSuperBuiltUpArea() == null)
					errorMap.put("EG_PT_UNIT_AREA_ERROR",
							"Any one of the following either builtUpArea or (plinthArea + superBuiltUpArea) should be provided");

				if (consDtl.getPlinthArea() != null && consDtl.getSuperBuiltUpArea() != null) {
					consDtl.setBuiltUpArea(consDtl.getSuperBuiltUpArea().subtract(consDtl.getPlinthArea()));
					isBuiltUpAreaNull = false;
					
				}

			} else if(!isBuiltUpAreaNull) {

				if (consDtl.getBuiltUpArea().compareTo(configs.getMinUnitArea()) <= 0)
					errorMap.put("EG_PT_UNIT_BUILTUPAREA_ERROR", "BuiltUpArea cannot be lesser than minimum value of : "
							+ configs.getMinUnitArea() + " " + configs.getLandAreaUnit());

				if (consDtl.getCarpetArea() != null && !property.getPropertyType().contains(PTConstants.PT_TYPE_VACANT)
						&& consDtl.getCarpetArea().compareTo(consDtl.getBuiltUpArea()) >= 0)
					errorMap.put("UNIT INFO ERROR ", "Carpet area cannot be greater or equal than builtUp area");
			}
		}
	}

	/**
     * Validates the masterData,CitizenInfo and the authorization of the assessee for update
     * @param request PropertyRequest for update
     */
    public void validateRequestForUpdate(PropertyRequest request, Property propertyFromSearch){ 
    	
    	Property property = request.getProperty();
    	Map<String, String> errorMap = new HashMap<>();
    	
        if(request.getRequestInfo().getUserInfo().getType().equalsIgnoreCase("CITIZEN"))
            validateAssessees(request,propertyFromSearch, errorMap);

        Boolean isstateUpdatable =  false;

		// third variable is needed only for mutation
		List<String> fieldsUpdated = diffService.getUpdatedFields(property, propertyFromSearch, "");
		
		if (configs.getIsWorkflowEnabled()) {

			if (request.getProperty().getWorkflow() == null)
				throw new CustomException("EG_PT_UPDATE_WF_ERROR", "Workflow information is mandatory for update process");
			
			/*
			 * update and mutation open state are same currently - Creation reason will change for begining of a workflow
			 */
			if (property.getWorkflow().getAction().equalsIgnoreCase(configs.getMutationOpenState())
					&& propertyFromSearch.getStatus().equals(Status.ACTIVE)) {
				fieldsUpdated.remove("creationReason");
				isstateUpdatable = true;

			} else {

				State currentState = workflowService.getCurrentState(request.getRequestInfo(), property.getTenantId(),
						property.getAcknowldgementNumber());
				BusinessService businessService = workflowService.getBusinessService(property.getTenantId(),
						property.getWorkflow().getBusinessService(), request.getRequestInfo());
				isstateUpdatable = workflowService.isStateUpdatable(currentState.getState(), businessService);
			}

		} else {
			/*
			 * Creation reason will always change if worklfow is disabled
			 */
			isstateUpdatable = true;
			fieldsUpdated.remove("creationReason");
		}

		// third variable is needed only for mutation
		List<String> objectsAdded = diffService.getObjectsAdded(property, propertyFromSearch, "");
		objectsAdded.removeAll(Arrays.asList("TextNode", "Role", "NullNode", "LongNode", "JsonNodeFactory", "IntNode",
				"ProcessInstance"));

		if (!isstateUpdatable && (!CollectionUtils.isEmpty(objectsAdded) || !CollectionUtils.isEmpty(fieldsUpdated)))
			throw new CustomException("EG_PT_WF_UPDATE_ERROR",
					"The current state of workflow does not allow changes to property");
		
	    
        /*
         * Blocking owner changes in update flow
         */
		List<String> searchOwnerUuids = propertyFromSearch.getOwners().stream().map(OwnerInfo::getUuid).collect(Collectors.toList());
		List<String> uuidsNotFound = new ArrayList<>();

		if (!CollectionUtils.isEmpty(uuidsNotFound))
			errorMap.put("EG_PT_UPDATE_OWNER_UUID_ERROR", "Invalid owners found in request : " + uuidsNotFound);

		if(searchOwnerUuids.size() != request.getProperty().getOwners().size())
			errorMap.put("EG_PT_UPDATE_OWNER_SIZE_ERROR", "Update request cannot change owner Information please use mutation process");
		
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
    }

	/**
	 * Validates common criteria of update and mutation
	 * 
	 * @param request
	 * @return
	 */
	public void validateCommonUpdateInformation(PropertyRequest request, Property propertyFromSearch) {

		Map<String, String> errorMap = new HashMap<>();
		Property property = request.getProperty();
		validateIds(request, errorMap);
		validateMobileNumber(request, errorMap);


		CreationReason reason = property.getCreationReason();
		if (!propertyFromSearch.getStatus().equals(Status.ACTIVE)
				&& !propertyFromSearch.getCreationReason().equals(reason)) {
			throw new CustomException("EG_PT_ERROR_CREATION_REASON",
					"The Creation reason sent in the update Request is Invalid, The Creationg reason can be changed only when a new process is initiated on an ACTIVE record");
		} else if (propertyFromSearch.getStatus().equals(Status.ACTIVE) && reason.equals(CreationReason.CREATE)) {
			throw new CustomException("EG_PT_ERROR_CREATION_REASON",
					"The Creation reason sent in the update Request is Invalid, The Creationg reason cannot be create for an ACTIVE record");
		}
		
		property.getAddress().setId(propertyFromSearch.getAddress().getId());
        validateMasterData(request, errorMap);

		if (propertyFromSearch.getStatus().equals(Status.INWORKFLOW) && (property.getAcknowldgementNumber() == null
				|| (property.getAcknowldgementNumber() != null && !propertyFromSearch.getAcknowldgementNumber()
						.equalsIgnoreCase(property.getAcknowldgementNumber()))))
			errorMap.put("EG_PT_MUTATION_WF_UPDATE_ERROR", "Acknowledgement Number is Invalid OR NULL, Please provide the valid number");

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}

    /**
     * Validates if the fields in PropertyRequest are present in the MDMS master Data
     *
     * @param request PropertyRequest received for creating or update
     *
     */
    private void validateMasterData(PropertyRequest request,  Map<String,String> errorMap) {
    	
        Property property = request.getProperty();
        String tenantId = property.getTenantId();

		List<String> masterNames = new ArrayList<>(
				Arrays.asList(
				PTConstants.MDMS_PT_PROPERTYTYPE,
				PTConstants.MDMS_PT_OWNERSHIPCATEGORY,
				PTConstants.MDMS_PT_OWNERTYPE,
				PTConstants.MDMS_PT_USAGECATEGORY,
				PTConstants.MDMS_PT_OCCUPANCYTYPE,
				PTConstants.MDMS_PT_CONSTRUCTIONTYPE));

		validateInstitution(property, errorMap);
		
		Map<String, List<String>> codes = propertyUtil.getAttributeValues(tenantId, PTConstants.MDMS_PT_MOD_NAME, masterNames,
				"$.*.code", PTConstants.JSONPATH_CODES, request.getRequestInfo());
		
		if (null != codes) {
			validateMDMSData(masterNames, codes);
			validateCodes(property, codes, errorMap);
		} else {
			errorMap.put("MASTER_FETCH_FAILED", "Couldn't fetch master data for validation");
		}

        if (!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }

    private void validateFields(PropertyRequest request, Map<String, String> errorMap) {

    	Property property = request.getProperty();
   	
		if (property.getAddress().getGeoLocation() == null)
			property.getAddress().setGeoLocation(new GeoLocation());

		if (property.getSource() == null)
			errorMap.put("EG_PT_ERROR_SOURCE", "The value given for Source field is either invalid or null");

		if (property.getChannel() == null)
			errorMap.put("EG_PT_ERROR_CHANNEL", "The value given for Channel field is either invalid or null");

		if (!property.getPropertyType().contains(PTConstants.PT_TYPE_SHAREDPROPERTY)) {

			if (property.getLandArea() == null) {

				errorMap.put("EG_PT_ERROR_LAND_AREA",
						"Land Area cannot be null for the property of type  : " + property.getPropertyType());

			} else if (property.getLandArea().compareTo(configs.getMinumumLandArea()) < 0) {

				errorMap.put("EG_PT_ERROR", "Land Area cannot be lesser than minimum value : "
						+ configs.getMinumumLandArea() + " " + configs.getLandAreaUnit());
			}
		}
		
		if (property.getPropertyType().contains(PTConstants.PT_TYPE_BUILTUP)) {

			Long floors = property.getNoOfFloors();

			if (floors == null || (floors != null && floors < 1)) {
				errorMap.put("EG_PT_ERROR_FLOOR_COUNT",
						"No of floors cannot be null or lesser than value one in count for property of type : "
								+ PTConstants.PT_TYPE_BUILTUP);
			}
			
			if (property.getUsageCategory() == null)
				errorMap.put("EG_PT_ERROR_USAGE",
						"Usage Category is mandatory for for property of type : " + PTConstants.PT_TYPE_BUILTUP);
		}
    	
	}

    /**
     *Checks if the codes of all fields are in the list of codes obtain from master data
     *
     * @param property property from PropertyRequest which are to validated
     * @param codes Map of MasterData name to List of codes in that MasterData
     * @param errorMap Map to fill all errors caught to send as custom Exception
     * @return Error map containing error if existed
     *
     */
    private static Map<String,String> validateCodes(Property property, Map<String,List<String>> codes, Map<String,String> errorMap){
    	
		if (property.getPropertyType() != null && !codes.get(PTConstants.MDMS_PT_PROPERTYTYPE).contains(property.getPropertyType())) {
			errorMap.put("Invalid PROPERTYTYPE", "The PropertyType '" + property.getPropertyType() + "' does not exists");
		}

		if (property.getOwnershipCategory() != null && !codes.get(PTConstants.MDMS_PT_OWNERSHIPCATEGORY).contains(property.getOwnershipCategory())) {
			errorMap.put("Invalid OWNERSHIPCATEGORY", "The OwnershipCategory '" + property.getOwnershipCategory() + "' does not exists");
		}

		if (property.getUsageCategory() != null && !codes.get(PTConstants.MDMS_PT_USAGECATEGORY).contains(property.getUsageCategory())) {
			errorMap.put("Invalid USageCategory", "The USageCategory '" + property.getUsageCategory() + "' does not exists");
		}
		
		if (!CollectionUtils.isEmpty(property.getUnits()))
			for (Unit unit : property.getUnits()) {

				if (ObjectUtils.isEmpty(unit.getUsageCategory()) || unit.getUsageCategory() != null
						&& !codes.get(PTConstants.MDMS_PT_USAGECATEGORY).contains(unit.getUsageCategory())) {
					errorMap.put("INVALID USAGE CATEGORY ", "The Usage CATEGORY '" + unit.getUsageCategory()
							+ "' does not exists for unit of index : " + property.getUnits().indexOf(unit));
				}

				String constructionType = unit.getConstructionDetail().getConstructionType();
				
				if (!ObjectUtils.isEmpty(constructionType)
						&& !codes.get(PTConstants.MDMS_PT_CONSTRUCTIONTYPE).contains(constructionType)) {
					errorMap.put("INVALID CONSTRUCTION TYPE ", "The CONSTRUCTION TYPE '" + constructionType
							+ "' does not exists for unit of index : " + property.getUnits().indexOf(unit));
				}
				
				if (!ObjectUtils.isEmpty(unit.getOccupancyType())
						&& !codes.get(PTConstants.MDMS_PT_OCCUPANCYTYPE).contains(unit.getOccupancyType())) {
					errorMap.put("INVALID OCCUPANCYTYPE TYPE ", "The OCCUPANCYTYPE TYPE '" + unit.getOccupancyType()
							+ "' does not exists for unit of index : " + property.getUnits().indexOf(unit));
				}

			}

		if (!CollectionUtils.isEmpty(errorMap))
			throw new CustomException(errorMap);

		for (OwnerInfo owner : property.getOwners()) {

			if (owner.getOwnerType() != null
					&& !codes.get(PTConstants.MDMS_PT_OWNERTYPE).contains(owner.getOwnerType())) {

				errorMap.put("INVALID OWNERTYPE", "The OwnerType '" + owner.getOwnerType() + "' does not exists");
			}
		}

		if(!CollectionUtils.isEmpty(property.getDocuments()) && property.getDocuments().contains(null))
			errorMap.put("INVALID ENTRY IN PROPERTY DOCS", " The proeprty documents cannot contain null values");
		
		
		

		return errorMap;

	}

    /**
     * Validates if MasterData is properly fetched for the given MasterData names
     * @param masterNames
     * @param codes
     */
    private void validateMDMSData(List<String> masterNames,Map<String,List<String>> codes){
    	
        Map<String,String> errorMap = new HashMap<>();
        for(String masterName:masterNames){
            if(CollectionUtils.isEmpty(codes.get(masterName))){
                errorMap.put("MDMS DATA ERROR ","Unable to fetch "+masterName+" codes from MDMS");
            }
        }
        if (!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }


	private void validateIds(PropertyRequest request, Map<String, String> errorMap) {

		Property property = request.getProperty();

		if (!(property.getPropertyId() != null || property.getAcknowldgementNumber() != null))
			errorMap.put("INVALID PROPERTY", "Property cannot be updated without propertyId or acknowledgement number");

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}

    /**
     * Returns PropertyCriteria to search for properties in database with ids set from properties in request
     *
     * @param request PropertyRequest received for update
     * @return PropertyCriteria containg ids of all properties and all its childrens
     */
    public PropertyCriteria getPropertyCriteriaForSearch(PropertyRequest request) {

		Property property = request.getProperty();

		PropertyCriteria propertyCriteria = new PropertyCriteria();
		propertyCriteria.setTenantId(property.getTenantId());
		propertyCriteria.setIsSearchInternal(true);

		if (null != property.getPropertyId()) {

			propertyCriteria.setPropertyIds(Sets.newHashSet(property.getPropertyId()));
		} else if (null != property.getAcknowldgementNumber()) {

			propertyCriteria.setAcknowledgementIds(Sets.newHashSet(property.getAcknowldgementNumber()));
		}

		return propertyCriteria;
	}

    /**
     * Checks if the property ids in search response are same as in request
     * @param responseProperties List of properties received from property Search
     * @return
     */
	public boolean PropertyExists(List<Property> responseProperties) {
		return (!CollectionUtils.isEmpty(responseProperties) && responseProperties.size() == 1);
	}

    /**
     * Validates if institution Object has null InstitutionType
     * @param property PropertyRequest which is to be validated
     * @param errorMap ErrorMap to catch and to throw error using CustomException
     */
    private void validateInstitution(Property property, Map<String,String> errorMap){
    	
		log.debug("contains check: " + property.getOwnershipCategory().contains("INSTITUTIONAL"));
		
		Institution institution = property.getInstitution();
		
		if(ObjectUtils.isEmpty(institution))
			return;
		
		if (!property.getOwnershipCategory().contains("INSTITUTIONAL")) {

			errorMap.put("INVALID INSTITUTION OBJECT",
					"The institution object should be null. OwnershipCategory does not contain Institutional");
			return;
		}


				if (institution.getType() == null)
					errorMap.put(" INVALID INSTITUTION OBJECT ", "The institutionType cannot be null ");
				if (institution.getName() == null)
					errorMap.put("INVALID INSTITUTION OBJECT", "Institution name cannot be null");
				if (institution.getDesignation() == null)
					errorMap.put("INVALID INSTITUTION OBJECT", "Designation cannot be null");
	}

    /**
     * Validates the UserInfo of the the PropertyRequest. Update is allowed only for the user who created the property
     * @param request PropertyRequest received for update
     */
	private void validateAssessees(PropertyRequest request,Property propertyFromSearch, Map<String, String> errorMap) {

		String mobileNumberFromRequestInfo = request.getRequestInfo().getUserInfo().getMobileNumber();
		String uuid = request.getRequestInfo().getUserInfo().getUuid();
		Property property = request.getProperty();

		Set<String> ownerMobileNumbers = propertyFromSearch.getOwners().stream().map(OwnerInfo::getMobileNumber).collect(Collectors.toSet());

		if (!(ownerMobileNumbers.contains(mobileNumberFromRequestInfo) || uuid.equalsIgnoreCase(propertyFromSearch.getAccountId()))) {
			errorMap.put("EG_PT_UPDATE AUTHORIZATION FAILURE",
					"Not Authorized to update property with propertyId " + property.getPropertyId());
		}

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}


	/**
	 * Validates the mobileNumber of owners
	 * 
	 * @param request The propertyRequest received for create or update
	 */
	private void validateMobileNumber(PropertyRequest request, Map<String, String> errorMap) {

		Property property = request.getProperty();
		List<OwnerInfo> owners = property.getOwners();
		
		if (!property.getOwnershipCategory().contains("INSTITUTIONAL")) {

			owners.forEach(owner -> {
				if (!isMobileNumberValid(owner.getMobileNumber()))
					errorMap.put("INVALID OWNER", "MobileNumber is not valid for user : " + property.getPropertyId());
			});
		} else {
			owners.forEach(owner -> {
				if (owner.getAltContactNumber() == null)
					errorMap.put("INVALID OWNER",
							" Alternate ContactNumber cannot be null for institution : " + owner.getName());
			});
		}

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}

	/**
	 * Validator for search criteria
	 * 
	 * @param criteria
	 * @param requestInfo
	 */
    public void validatePropertyCriteria(PropertyCriteria criteria,RequestInfo requestInfo) {
    	
		List<String> allowedParams = null;
		
		User user = requestInfo.getUserInfo();
		String userType = user.getType();
		Boolean isUserCitizen = "CITIZEN".equalsIgnoreCase(userType);

		// Safeguards against the possibility of inbox search being performed when inbox search has been disabled at service level
		if(!configs.getIsInboxSearchAllowed() && criteria.getIsInboxSearch()){
			throw new CustomException("EG_PT_INVALID_SEARCH", "Inbox search has been disabled for property service");
		}
		
		if (propertyUtil.isPropertySearchOpen(user) && !criteria.getIsRequestForCount()) {

			if (StringUtils.isEmpty(criteria.getMobileNumber()) && CollectionUtils.isEmpty(criteria.getPropertyIds()))
				throw new CustomException("EG_PT_INVALID_SEARCH",
						"PropertyId OR MobileNumber are mandatory for open search");
		}

		if ((criteria.getFromDate() != null && criteria.getToDate() == null) || (criteria.getToDate() != null && criteria.getFromDate() == null))
			throw new CustomException("EG_PT_INVALID_SEARCH", "Search is mandatory for both fromDate and toDate : " + userType);

		Boolean isCriteriaEmpty = CollectionUtils.isEmpty(criteria.getOldpropertyids())
				&& CollectionUtils.isEmpty(criteria.getAcknowledgementIds())
				&& CollectionUtils.isEmpty(criteria.getPropertyIds())
				&& CollectionUtils.isEmpty(criteria.getOwnerIds()) 
				&& CollectionUtils.isEmpty(criteria.getUuids())
				&& null == criteria.getMobileNumber()
				&& null == criteria.getName()
				&& null == criteria.getDoorNo()
				&& null == criteria.getOldPropertyId()
				&& (null == criteria.getFromDate() && null == criteria.getToDate());
		
		if (isUserCitizen) {
			criteria.setIsCitizen(true);
			
			if (isCriteriaEmpty)
				criteria.setMobileNumber(user.getMobileNumber());
			
			allowedParams = Arrays.asList(configs.getCitizenSearchParams().split(","));
		}
		
		else {
			
			if(criteria.getTenantId() == null)
				throw new CustomException("EG_PT_INVALID_SEARCH"," TenantId is mandatory for search by " + userType);
			
			if(criteria.getTenantId() != null && isCriteriaEmpty)
				throw new CustomException("EG_PT_INVALID_SEARCH"," Search is not allowed on empty Criteria, Atleast one criteria should be provided with tenantId for " + userType);
			
			allowedParams = Arrays.asList(configs.getEmployeeSearchParams().split(","));
		}

		if (criteria.getName() != null && !allowedParams.contains("name"))
			throw new CustomException("EG_PT_INVALID_SEARCH", "Search based on name is not available for : " + userType);

        if(criteria.getMobileNumber()!=null && !allowedParams.contains("mobileNumber"))
            throw new CustomException("EG_PT_INVALID_SEARCH","Search based on mobileNumber is not available for : " + userType);

        if(!CollectionUtils.isEmpty(criteria.getPropertyIds()) && !allowedParams.contains("ids"))
            throw new CustomException("EG_PT_INVALID_SEARCH","Search based on ids is not available for : " + userType);

        if(!CollectionUtils.isEmpty(criteria.getOldpropertyids()) && !allowedParams.contains("oldpropertyids"))
            throw new CustomException("EG_PT_INVALID_SEARCH","Search based on oldPropertyId is not available for userType : " + userType);

        if(!CollectionUtils.isEmpty(criteria.getOwnerIds()) && !allowedParams.contains("ownerids"))
            throw new CustomException("EG_PT_INVALID_SEARCH","Search based on ownerId is not available for : " + userType);
    }

	/**
	 * Validates if the mobileNumber is 10 digit and starts with 5 or greater
	 * 
	 * @param mobileNumber The mobileNumber to be validated
	 * @return True if valid mobileNumber else false
	 */
	private Boolean isMobileNumberValid(String mobileNumber) {

		if (mobileNumber == null)
			return false;
		else if (mobileNumber.length() != 10)
			return false;
		else if (Character.getNumericValue(mobileNumber.charAt(0)) < 5)
			return false;
		else
			return true;
	}
	
	/*
	 * 
	 * Mutation methods
	 */

	public void validateMutation(PropertyRequest request, Property propertyFromSearch) {

		Map<String, String> errorMap = new HashMap<>();
		Property property = request.getProperty();
		ProcessInstance workFlow = property.getWorkflow();

		String reasonForTransfer = null;
		String docNo = null;
		Long docDate = null;
		Double docVal = null;
		Double marketVal = null;
		
		if (!propertyFromSearch.getStatus().equals(Status.INWORKFLOW)) {

			Boolean isBillUnpaid = propertyUtil.isBillUnpaid(propertyFromSearch.getPropertyId(), propertyFromSearch.getTenantId(), request.getRequestInfo());
			if (isBillUnpaid)
				throw new CustomException("EG_PT_MUTATION_UNPAID_ERROR", "Property has to be completely paid for before initiating the mutation process");
		}
		
		List<String> fieldsUpdated = diffService.getUpdatedFields(property, propertyFromSearch, PTConstants.MUTATION_PROCESS_CONSTANT);
		// only editable field in mutation other than owners, additional details.
		fieldsUpdated.remove("ownershipCategory");
		
		if (configs.getIsMutationWorkflowEnabled()) {
			if (request.getProperty().getWorkflow() == null)
				throw new CustomException("EG_PT_UPDATE_WF_ERROR", "Workflow information is mandatory for mutation process");

			if (property.getWorkflow().getAction().equalsIgnoreCase(configs.getMutationOpenState())
					&& propertyFromSearch.getStatus().equals(Status.ACTIVE)) {
				fieldsUpdated.remove("creationReason");
			}
		}else {
			/*
			 * if workflow is diabled then creationreason will change for every request
			 */
			fieldsUpdated.remove("creationReason");
		}

		if (!CollectionUtils.isEmpty(fieldsUpdated))
			throw new CustomException("EG_PT_MUTATION_ERROR",
					"The property mutation doesnt allow change of these fields " + fieldsUpdated);

		@SuppressWarnings("unchecked")
		Map<String, Object> additionalDetails = mapper.convertValue(property.getAdditionalDetails(), Map.class);
		try {
			
			reasonForTransfer = (String) additionalDetails.get("reasonForTransfer");
			docNo = (String) additionalDetails.get("documentNumber");
			
			String docDateString = String.valueOf(additionalDetails.get("documentDate"));
			if(!StringUtils.isEmpty(docDateString) && !"null".equalsIgnoreCase(docDateString))
			docDate = Long.valueOf(docDateString);
			
			String docValString = String.valueOf(additionalDetails.get("documentValue"));
			if(!StringUtils.isEmpty(docValString) && !"null".equalsIgnoreCase(docValString))
			docVal = Double.valueOf(docValString);
			
			String marketValString = String.valueOf(additionalDetails.get("marketValue"));
			if(!StringUtils.isEmpty(marketValString) && !"null".equalsIgnoreCase(marketValString))
			marketVal = Double.valueOf(marketValString);
			
		} catch (PathNotFoundException e) {
			throw new CustomException("EG_PT_MUTATION_FIELDS_ERROR", "Mandatory fields Missing for mutation, please provide the following information in additionalDetails : "
							+ "reasonForTransfer, documentNumber, documentDate, documentValue and marketValue");
		} catch (Exception e) {
			throw new CustomException("EG_PT_ADDITIONALDETAILS_PARSING_ERROR", e.toString());
		}

		Boolean isNullStatusFound = false;
		Boolean isNewOWnerAdded = false;
		Boolean isOwnerCancelled = false;
		Set<Status> statusSet = new HashSet<>();
		Set<String> searchOwnerUuids = propertyFromSearch.getOwners().stream().map(OwnerInfo::getUuid).collect(Collectors.toSet());
		List<String> uuidsNotFound = new ArrayList<String>();
		Map<String, Integer> activeMobileNumberPlusNameOwnerMap = new HashMap<>();
		
		for (OwnerInfo owner : property.getOwners()) {

			if (owner.getStatus() == Status.ACTIVE) {

				String key = owner.getMobileNumber() + owner.getName();
				if (activeMobileNumberPlusNameOwnerMap.get(key) == null) {
					activeMobileNumberPlusNameOwnerMap.put(key, 1);
				} else {
					Integer val = activeMobileNumberPlusNameOwnerMap.get(key);
					activeMobileNumberPlusNameOwnerMap.put(key, val++);
				}
			}
			
			if (StringUtils.isEmpty(owner.getStatus())) {
				isNullStatusFound = true;
			}

			statusSet.add(owner.getStatus());
			if (owner.getUuid() == null && owner.getStatus().equals(Status.ACTIVE))
				isNewOWnerAdded = true;
			else if (owner.getStatus().equals(Status.INACTIVE))
				isOwnerCancelled = true;

			if (owner.getUuid() != null && !searchOwnerUuids.contains(owner.getUuid()))
				uuidsNotFound.add(owner.getUuid());
		}
		
		if(activeMobileNumberPlusNameOwnerMap.values().stream().anyMatch(valueCount -> valueCount > 1))
			errorMap.put("EG_PT_MUTATION_DUPLICATE_OWNER_ERROR", "Active Owner object with combination of name and mobilenumber is repated in the update Request");

		if (isNullStatusFound)
			errorMap.put("EG_PT_MUTATION_ALL_OWNER_STATUS_NULL_ERROR", "Status of the owner objects cannot be null, please make the status either ACTIVE or INACTIVE");

		if (!statusSet.contains(Status.ACTIVE))
			errorMap.put("EG_PT_MUTATION_ALL_OWNER_INACTIVE_ERROR", "At the least one owner object should be ACTIVE");

		if (!propertyFromSearch.getStatus().equals(Status.INWORKFLOW)) {
			

			if (!isNewOWnerAdded && !isOwnerCancelled) {
					errorMap.put("EG_PT_MUTATION_OWNER_ERROR", "Mutation request should either add a new owner object or update an existing object to INACTIVE");
			}

			if (isOwnerCancelled && property.getOwners().size() == 1)
				errorMap.put("EG_PT_MUTATION_OWNER_REMOVAL_ERROR", "Single owner of a property cannot be deactivated or removed in a mutation request");
		}
		
		if (StringUtils.isEmpty(reasonForTransfer) || StringUtils.isEmpty(docNo) || ObjectUtils.isEmpty(docDate) || ObjectUtils.isEmpty(docVal) || ObjectUtils.isEmpty(marketVal)) {
				throw new CustomException("EG_PT_MUTATION_FIELDS_ERROR", "mandatory fields Missing for mutation, please provide the following information : "
							+ "reasonForTransfer, documentNumber, documentDate, documentValue and marketValue");
		}
		
		if(configs.getIsMutationWorkflowEnabled() && (ObjectUtils.isEmpty(workFlow.getAction()) || ObjectUtils.isEmpty(workFlow.getModuleName()) ||
				ObjectUtils.isEmpty(workFlow.getBusinessService())))
			errorMap.put("EG_PT_MUTATION_WF_FIELDS_ERROR", "mandatory fields Missing in workflow Object for Mutation please provide the following information : "
					+ "action, moduleName and BusinessService");

		List<String> masterNames = new ArrayList<>(Arrays.asList(PTConstants.MDMS_PT_MUTATIONREASON));
		Map<String, List<String>> codes = propertyUtil.getAttributeValues(property.getTenantId(), PTConstants.MDMS_PT_MOD_NAME,
				masterNames, "$.*.code", PTConstants.JSONPATH_CODES, request.getRequestInfo());

		if (null != codes) {
			validateMDMSData(masterNames, codes);
		} else {
			errorMap.put("MASTER_FETCH_FAILED", "Couldn't fetch master data for validation");
		}

		if (!codes.get(PTConstants.MDMS_PT_MUTATIONREASON).contains(reasonForTransfer))
			errorMap.put("EG_PT_MT_REASON_ERROR",
					"The reason for tranfer provided is invalid, please provide a valid mdms data");
		
		
		Boolean isDocsEmpty = CollectionUtils.isEmpty(property.getDocuments());
		Boolean isTransferDocPresent = false;
		if (!isDocsEmpty) {

			isTransferDocPresent = property.getDocuments().stream().map(doc -> doc.getDocumentType().toUpperCase())
					.collect(Collectors.toSet()).contains(reasonForTransfer.toUpperCase());
		}

		if (isDocsEmpty || !isTransferDocPresent) {

			errorMap.put("EG_PT_MT_DOCS_ERROR",
					"Mandatory documents mising for the muation reason : " + reasonForTransfer);
		}

		if (propertyFromSearch.getStatus().equals(Status.INWORKFLOW)
				&& property.getWorkflow().getAction().equalsIgnoreCase(configs.getMutationOpenState()))
			errorMap.put("EG_PT_MUTATION_WF_ACTION_ERROR", "Invalid action, OPEN action cannot be applied on an active workflow ");

		if (!CollectionUtils.isEmpty(errorMap))
			throw new CustomException(errorMap);
	}

	public void validateAlternateMobileNumberInformation(PropertyRequest request, Property propertyFromSearch) {
		
		Map<String, String> errorMap = new HashMap<>();
		Property property = request.getProperty();
		validateIds(request, errorMap);	
	

		List <String> alternateNumbersinRequest = new ArrayList<String>();
		for(OwnerInfo owner : property.getOwners()) {
			if(owner.getAlternatemobilenumber()!=null) {
				alternateNumbersinRequest.add(owner.getAlternatemobilenumber());
			}
		}
		
		if(alternateNumbersinRequest.isEmpty()) {
			throw new CustomException("EG_PT_ALTERNATE_NUMBERS_NOT_FOUND", "The alternate mobile number details are null");
		}
		
		Map<String, String> userToAlternateNumberMap = new HashMap<String,String>(); 
		
		for(OwnerInfo owner : propertyFromSearch.getOwners()) {
			userToAlternateNumberMap.put(owner.getUuid(), owner.getAlternatemobilenumber());
		}
		
		boolean isAlternateNumberSame = true;
		
		for(OwnerInfo owner : property.getOwners()) {
			if(userToAlternateNumberMap.get(owner.getUuid())!=null && userToAlternateNumberMap.get(owner.getUuid()).equals(owner.getAlternatemobilenumber()) ) {
					isAlternateNumberSame = true;
			}
			
			else {
				isAlternateNumberSame=false;
				break;
			}
		}
		
		if(isAlternateNumberSame) {
			throw new CustomException("EG_PT_ALTERNATE_EXISTS", "The alternate mobile number already exists for the owner");
		}
		
		for(OwnerInfo owner : property.getOwners()) {
			if(!userToAlternateNumberMap.containsKey(owner.getUuid())) {
				throw new CustomException("EG_PT_OWNER_DOES_NOT_EXIST", "New owner can not be added while updating alternate mobile number details");
			}
			
			else {
				
				if(owner.getMobileNumber().equals(owner.getAlternatemobilenumber())) {
					throw new CustomException("EG_PT_ALTERNATE_EXISTS", "The alternate mobile number should not be same as primary number");
				}
			}
		}
		
		if(!property.getStatus().equals(Status.ACTIVE)) {throw new CustomException("EG_PT_ALTERNATE_INACTIVE","Alternate number details cannot be updated if status is not active");}
	}

}
