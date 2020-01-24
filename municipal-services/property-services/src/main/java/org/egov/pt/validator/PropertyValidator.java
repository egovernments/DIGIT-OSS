package org.egov.pt.validator;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.ConstructionDetail;
import org.egov.pt.models.Institution;
import org.egov.pt.models.OwnerInfo;
import org.egov.pt.models.Property;
import org.egov.pt.models.PropertyCriteria;
import org.egov.pt.models.Unit;
import org.egov.pt.repository.PropertyRepository;
import org.egov.pt.repository.ServiceRequestRepository;
import org.egov.pt.util.ErrorConstants;
import  org.egov.pt.util.PTConstants;
import org.egov.pt.util.PropertyUtil;
import org.egov.pt.web.contracts.PropertyRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import com.google.common.collect.Sets;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class PropertyValidator {


    @Autowired
    private PropertyUtil propertyUtil;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PropertyConfiguration propertyConfiguration;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;
    
    @Autowired
    private PropertyConfiguration configs;
    

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

		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
	}

	private void validateUnits(PropertyRequest request, Map<String, String> errorMap) {

		Property property = request.getProperty();
		List<Unit> units = property.getUnits();

		for (Unit unit : units) {
			
			ConstructionDetail consDtl = unit.getConstructionDetail();
			
			if (consDtl.getCarpetArea() != null && !property.getPropertyType().contains(PTConstants.PT_TYPE_VACANT)
					&& consDtl.getCarpetArea().compareTo(consDtl.getBuiltUpArea()) >= 0)
				errorMap.put("UNIT INFO ERROR ", "Carpet area cannot be greater or equal than builtUp area");
		}
	}

	/**
     * Validates the masterData,CitizenInfo and the authorization of the assessee for update
     * @param request PropertyRequest for update
     */
    public Property validateUpdateRequest(PropertyRequest request){ 
    	
    	Map<String, String> errorMap = new HashMap<>();
    	
        validateIds(request, errorMap);
        validateMobileNumber(request, errorMap);
        
        PropertyCriteria criteria = getPropertyCriteriaForSearch(request);
        List<Property> propertiesFromSearchResponse = propertyRepository.getProperties(criteria);
        boolean ifPropertyExists=PropertyExists(propertiesFromSearchResponse);
        if(!ifPropertyExists)
        {
        	throw new CustomException("PROPERTY NOT FOUND","The property to be updated does not exist");
        	}
        propertyUtil.addAddressIds(propertiesFromSearchResponse, request.getProperty());
        
        validateMasterData(request, errorMap);
        if(request.getRequestInfo().getUserInfo().getType().equalsIgnoreCase("CITIZEN"))
            validateAssessees(request, errorMap);
        
		if (!errorMap.isEmpty())
			throw new CustomException(errorMap);
		
		return propertiesFromSearchResponse.get(0);
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
		
		Map<String, List<String>> codes = getAttributeValues(tenantId, PTConstants.MDMS_PT_MOD_NAME, 
											masterNames, "$.*.code", PTConstants.JSONPATH_CODES, request.getRequestInfo());
		if (null != codes) {
			validateMDMSData(masterNames, codes);
			validateCodes(property, codes, errorMap);
		} else {
			errorMap.put("MASTER_FETCH_FAILED", "Couldn't fetch master data for validation");
		}

        if (!errorMap.isEmpty())
            throw new CustomException(errorMap);
    }

    /**
     *Fetches all the values of particular attribute as map of fieldname to list
     *
     * @param tenantId tenantId of properties in PropertyRequest
     * @param names List of String containing the names of all masterdata whose code has to be extracted
     * @param requestInfo RequestInfo of the received PropertyRequest
     * @return Map of MasterData name to the list of code in the MasterData
     *
     */
    public Map<String,List<String>> getAttributeValues(String tenantId, String moduleName, List<String> names, String filter,String jsonpath, RequestInfo requestInfo){

    	StringBuilder uri = new StringBuilder(configs.getMdmsHost()).append(configs.getMdmsEndpoint());
        MdmsCriteriaReq criteriaReq = propertyUtil.prepareMdMsRequest(tenantId,moduleName,names,filter,requestInfo);
        Optional<Object> response = serviceRequestRepository.fetchResult(uri, criteriaReq);
        
        try {
        	if(response.isPresent()) {
                return JsonPath.read(response.get(),jsonpath);
        	}
        } catch (Exception e) {
            log.error("Error while fetvhing MDMS data",e);
            throw new CustomException(ErrorConstants.INVALID_TENANT_ID_MDMS_KEY,
                    ErrorConstants.INVALID_TENANT_ID_MDMS_MSG);
        }
        
        return null;
    }
    
    private void validateFields(PropertyRequest request, Map<String, String> errorMap) {

    	Property property = request.getProperty();
    	
//    	if(configs.getIsWorkflowEnabled() && null == property.getWorkflow())
//    		errorMap.put("EG_PR_WF_NOT_NULL", "Wokflow is enabled for create please provide the necessary info in workflow field in property");
   	
		if (!property.getPropertyType().contains(PTConstants.PT_TYPE_SHAREDPROPERTY)) {

			if (property.getLandArea() == null) {

				errorMap.put("EG_PT_ERROR_LAND_AREA",
						"Land Area cannot be null for the property of type  : " + property.getPropertyType());

			} else if (property.getLandArea().compareTo(configs.getMinumumLandArea()) < 0) {

				errorMap.put("EG_PT_ERROR", "Land Area cannot be lesser than minimum value : "
						+ configs.getMinumumLandArea() + " " + configs.getLandAreaUnit());
			}
		}
    	
	}

    /**
     *Checks if the codes of all fields are in the list of codes obtain from master data
     *
     * @param properties List of properties from PropertyRequest which are to validated
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

			}

		if (!CollectionUtils.isEmpty(errorMap))
			throw new CustomException(errorMap);

		for (OwnerInfo owner : property.getOwners()) {

			if (ObjectUtils.isEmpty(owner.getOwnerType()) || owner.getOwnerType() != null
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

		if (null != property.getPropertyId()) {

			propertyCriteria.setPropertyIds(Sets.newHashSet(property.getPropertyId()));
		} else if (null != property.getAcknowldgementNumber()) {

			propertyCriteria.setAcknowledgementIds(Sets.newHashSet(property.getAcknowldgementNumber()));
		}

		return propertyCriteria;
	}

    /**
     * Checks if the property ids in search response are same as in request
     * @param request PropertyRequest received for update
     * @param responseProperties List of properties received from property Search
     * @return
     */
	public boolean PropertyExists(List<Property> responseProperties) {
		return (!CollectionUtils.isEmpty(responseProperties) && responseProperties.size() == 1);
	}

    /**
     * Validates if institution Object has null InstitutionType
     * @param request PropertyRequest which is to be validated
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
	private void validateAssessees(PropertyRequest request, Map<String, String> errorMap) {

		String uuid = request.getRequestInfo().getUserInfo().getUuid();
		Property property = request.getProperty();

		Set<String> owners = property.getOwners().stream().map(OwnerInfo::getUuid).collect(Collectors.toSet());

		if (!owners.contains(uuid)) {
			errorMap.put("UPDATE AUTHORIZATION FAILURE",
					"Not Authorized to assess property with propertyId " + property.getPropertyId());
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
					errorMap.put("INVALID OWNER", "MobileNumber is not valid for user : " + owner.getName());
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
		String userType = requestInfo.getUserInfo().getType();
		Boolean isUserCitizen = userType.equalsIgnoreCase("CITIZEN");
		
		Boolean isCriteriaEmpty = CollectionUtils.isEmpty(criteria.getOldpropertyids())
				&& CollectionUtils.isEmpty(criteria.getAcknowledgementIds())
				&& CollectionUtils.isEmpty(criteria.getPropertyIds())
				&& CollectionUtils.isEmpty(criteria.getOwnerIds()) 
				&& CollectionUtils.isEmpty(criteria.getUuids())
				&& null == criteria.getMobileNumber()
				&& null == criteria.getName();
		
		if (isUserCitizen) {
			
			if (isCriteriaEmpty)
				criteria.setOwnerIds(Sets.newHashSet(user.getUuid()));
			
			allowedParams = Arrays.asList(propertyConfiguration.getCitizenSearchParams().split(","));
		}
		
		else {
			
			if(criteria.getTenantId() == null)
				throw new CustomException("EG_PT_INVALID_SEARCH"," TenantId is mandatory for search by " + userType);
			
			if(criteria.getTenantId() != null && isCriteriaEmpty)
				throw new CustomException("EG_PT_INVALID_SEARCH"," Search is not allowed on empty Criteria, Atleast one criteria should be provided with tenantId for " + userType);
			
			allowedParams = Arrays.asList(propertyConfiguration.getEmployeeSearchParams().split(","));
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







}
