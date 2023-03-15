package org.egov.pt.validator;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Sets;
import com.jayway.jsonpath.PathNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.*;
import org.egov.pt.models.enums.CreationReason;
import org.egov.pt.models.enums.Status;
import org.egov.pt.models.workflow.ProcessInstance;
import org.egov.pt.repository.AssessmentRepository;
import org.egov.pt.service.PropertyService;
import org.egov.pt.util.ErrorConstants;
import org.egov.pt.util.PTConstants;
import org.egov.pt.util.PropertyUtil;
import org.egov.pt.web.contracts.AssessmentRequest;
import org.egov.pt.web.contracts.PropertyRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Component
public class PropertyMigrationValidator {


    @Autowired
    private PropertyUtil propertyUtil;

    @Autowired
    private PropertyConfiguration configs;
    
    @Autowired
    private PropertyService service;
    
    @Autowired
    private ObjectMapper mapper;

	@Autowired
	private AssessmentRepository assessmentRepository;
    

    /**
     * Validate the masterData and ctizenInfo of the given propertyRequest
     * @param request PropertyRequest for create
     */
	public void validatePropertyCreateRequest(PropertyRequest request,Map<String, List<String>> masters,Map<String, String> errorMap) {

		//Map<String, String> errorMap = new HashMap<>();
		
		List<Unit> units 		=	request.getProperty().getUnits();
		List<OwnerInfo> owners 	=	request.getProperty().getOwners();

		if (!CollectionUtils.isEmpty(units))
			while (units.remove(null));
		while (owners.remove(null));

		if(CollectionUtils.isEmpty(request.getProperty().getOwners()))
			throw new CustomException("OWNER INFO ERROR","Owners cannot be empty, please provide at least one owner information");
		
		/*if (!errorMap.isEmpty())
			throw new CustomException(errorMap);*/

		validateMasterData(request, masters, errorMap);
		//validateMobileNumber(request, errorMap);
		validateFields(request, errorMap);
		if (!CollectionUtils.isEmpty(units))
			validateUnits(request, errorMap);

		/*if (!errorMap.isEmpty()){
			throw new CustomException(errorMap);
		}*/
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
     * Validates if the fields in PropertyRequest are present in the MDMS master Data
     *
     * @param request PropertyRequest received for creating or update
     *
     */
    private void validateMasterData(PropertyRequest request, Map<String, List<String>> codes,  Map<String,String> errorMap) {
    	
        Property property = request.getProperty();

		validateInstitution(property, errorMap);

		
		if (null != codes) {
			validateCodes(property, codes, errorMap);
		} else {
			errorMap.put("MASTER_FETCH_FAILED", "Couldn't fetch master data for validation");
		}

//        if (!errorMap.isEmpty()){
//			throw new CustomException(errorMap);
//		}

    }

    private void validateFields(PropertyRequest request, Map<String, String> errorMap) {

    	Property property = request.getProperty();
    	
//    	if(configs.getIsWorkflowEnabled() && null == property.getWorkflow())
//    		errorMap.put("EG_PR_WF_NOT_NULL", "Wokflow is enabled for create please provide the necessary info in workflow field in property");
   	
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
						+ configs.getMinumumLandArea() + " " + configs.getLandAreaUnit()+ "Current "+property.getLandArea());
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

//		if (!CollectionUtils.isEmpty(errorMap)){
//			throw new CustomException(errorMap);
//		}

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

//		if (!errorMap.isEmpty())
//			throw new CustomException(errorMap);

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



	public void ValidateAssessmentMigrationData(AssessmentRequest assessmentRequest, Property property, Map<String, List<String>> masters,Map<String, String> errorMap) {
		//Map<String, String> errorMap = new HashMap<>();
		validateRI(assessmentRequest.getRequestInfo(), errorMap);
		validateUnitIds(assessmentRequest.getAssessment(),property,errorMap);
		//validateCreateRequest(assessmentRequest.getAssessment(),property);
		commonValidations(assessmentRequest, errorMap, false);
		validateAsmtMDMSData(assessmentRequest.getRequestInfo(), assessmentRequest.getAssessment(), errorMap,masters);
		if(configs.getIsAssessmentWorkflowEnabled())
			validateWorkflowOfOtherAssessments(assessmentRequest.getAssessment(),errorMap);
	}

	public void validateRI(RequestInfo requestInfo, Map<String, String> errorMap) {
		if (requestInfo != null) {
			if (requestInfo.getUserInfo() != null) {
				if ((org.apache.commons.lang3.StringUtils.isEmpty(requestInfo.getUserInfo().getUuid()))
						|| (CollectionUtils.isEmpty(requestInfo.getUserInfo().getRoles()))
						|| (org.apache.commons.lang3.StringUtils.isEmpty(requestInfo.getUserInfo().getTenantId()))) {
					errorMap.put(ErrorConstants.MISSING_ROLE_USERID_CODE, ErrorConstants.MISSING_ROLE_USERID_MSG);
				}
			} else {
				errorMap.put(ErrorConstants.MISSING_USR_INFO_CODE, ErrorConstants.MISSING_USR_INFO_MSG);
			}

		} else {
			errorMap.put(ErrorConstants.MISSING_REQ_INFO_CODE, ErrorConstants.MISSING_REQ_INFO_MSG);
		}
//		if (!CollectionUtils.isEmpty(errorMap.keySet())) {
//			throw new CustomException(errorMap);
//		}

	}

	private void validateUnitIds(Assessment assessment, Property property,Map<String, String> errorMap){

		List<String> activeUnitIdsInAssessment = new LinkedList<>();
		List<String> activeUnitIdsInProperty = new LinkedList<>();

		if(!CollectionUtils.isEmpty(assessment.getUnitUsageList())){
			assessment.getUnitUsageList().forEach(unitUsage -> {
				activeUnitIdsInAssessment.add(unitUsage.getUnitId());
			});
		}

		if(!CollectionUtils.isEmpty(property.getUnits())){
			property.getUnits().forEach(unit -> {
				if(unit.getActive())
					activeUnitIdsInProperty.add(unit.getId());
			});
		}

		if(!CollectionUtils.isEmpty(assessment.getUnitUsageList()) && !listEqualsIgnoreOrder(activeUnitIdsInAssessment, activeUnitIdsInProperty)){
			//throw new CustomException("INVALID_UNITIDS","The unitIds are not matching in property and assessment");
			errorMap.put("INVALID_UNITIDS","The unitIds are not matching in property and assessment");
		}



	}

	/**
	 * Compares if two list contains same elements
	 * @param list1
	 * @param list2
	 * @param <T>
	 * @return Boolean true if both list contains the same elements irrespective of order
	 */
	private static <T> boolean listEqualsIgnoreOrder(List<T> list1, List<T> list2) {
		return new HashSet<>(list1).equals(new HashSet<>(list2));
	}

	private void validateCreateRequest(Assessment assessment, Property property){

		if(!property.getStatus().equals(Status.ACTIVE))
			throw new CustomException("INVALID_REQUEST","Assessment cannot be done on inactive or property in workflow");

	}

	private void commonValidations(AssessmentRequest assessmentReq, Map<String, String> errorMap, boolean isUpdate) {
		Assessment assessment = assessmentReq.getAssessment();
		if (assessment.getAssessmentDate() > new Date().getTime()) {
			errorMap.put(ErrorConstants.ASSMENT_DATE_FUTURE_ERROR_CODE, ErrorConstants.ASSMENT_DATE_FUTURE_ERROR_MSG);
		}

		if (isUpdate) {
			if (null == assessment.getStatus()) {
				errorMap.put("ASSMNT_STATUS_EMPTY", "Assessment Status cannot be empty");
			}
		}

		else {

		}

//		if (!CollectionUtils.isEmpty(errorMap.keySet())) {
//			throw new CustomException(errorMap);
//		}

	}

	private void validateAsmtMDMSData(RequestInfo requestInfo, Assessment assessment, Map<String, String> errorMap,Map<String, List<String>> masters) {

		if(!CollectionUtils.isEmpty(assessment.getUnitUsageList())) {
			for (UnitUsage unitUsage : assessment.getUnitUsageList()) {

				if (!CollectionUtils.isEmpty(masters.get(PTConstants.MDMS_PT_USAGECATEGORY))) {
					if (!masters.get(PTConstants.MDMS_PT_USAGECATEGORY).contains(unitUsage.getUsageCategory()))
						errorMap.put("USAGE_CATEGORY_INVALID", "The usage category provided is invalid="+unitUsage.getUsageCategory());
				}

				if (CollectionUtils.isEmpty(masters.get(PTConstants.MDMS_PT_OCCUPANCYTYPE))) {
					if (!masters.get(PTConstants.MDMS_PT_OCCUPANCYTYPE).contains(unitUsage.getOccupancyType().toString()))
						errorMap.put("OCCUPANCY_TYPE_INVALID", "The occupancy type provided is invalid");
				}
			}
		}
//		if (!CollectionUtils.isEmpty(errorMap.keySet())) {
//			throw new CustomException(errorMap);
//		}

	}

	/**
	 * Validates if any other assessments are in workflow for the given property
	 * @param assessment
	 */
	private void validateWorkflowOfOtherAssessments(Assessment assessment,Map<String, String> errorMap){

		AssessmentSearchCriteria criteria = AssessmentSearchCriteria.builder()
				.tenantId(assessment.getTenantId())
				.status(Status.INWORKFLOW)
				.propertyIds(Collections.singleton(assessment.getPropertyId()))
				.build();

		List<Assessment> assessments = assessmentRepository.getAssessments(criteria);

		if(!CollectionUtils.isEmpty(assessments)){
			//throw new CustomException("INVALID_REQUEST","The property has other assessment in workflow");
			errorMap.put("INVALID_REQUEST","The property has other assessment in workflow");
		}


	}


}
