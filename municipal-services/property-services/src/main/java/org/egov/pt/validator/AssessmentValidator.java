package org.egov.pt.validator;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.Assessment;
import org.egov.pt.models.AssessmentSearchCriteria;
import org.egov.pt.models.Property;
import org.egov.pt.models.PropertyCriteria;
import org.egov.pt.models.UnitUsage;
import org.egov.pt.models.enums.Status;
import org.egov.pt.repository.AssessmentRepository;
import org.egov.pt.service.PropertyService;
import org.egov.pt.util.AssessmentUtils;
import org.egov.pt.util.ErrorConstants;
import org.egov.pt.util.PTConstants;
import org.egov.pt.web.contracts.AssessmentRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Service
public class AssessmentValidator {

	@Autowired
	private PropertyService propertyService;

	@Autowired
	private AssessmentUtils AssmtUtils;

	@Autowired
	private AssessmentRepository assessmentRepository;

	@Autowired
	private PropertyConfiguration config;


	public void validateAssessmentCreate(AssessmentRequest assessmentRequest, Property property) {
		Map<String, String> errorMap = new HashMap<>();
		validateRI(assessmentRequest.getRequestInfo(), errorMap);
		//validateUnitIds(assessmentRequest.getAssessment(),property);
		validateCreateRequest(assessmentRequest.getAssessment(),property);
		commonValidations(assessmentRequest, errorMap, false);
		validateMDMSData(assessmentRequest.getRequestInfo(), assessmentRequest.getAssessment(), errorMap);
		if(config.getIsAssessmentWorkflowEnabled())
			validateWorkflowOfOtherAssessments(assessmentRequest.getAssessment());

	}

	public void validateAssessmentUpdate(AssessmentRequest assessmentRequest, Assessment assessmentFromDB, Property property , Boolean isWorkflowTriggered) {
		Map<String, String> errorMap = new HashMap<>();
		validateRI(assessmentRequest.getRequestInfo(), errorMap);
		//validateUnitIds(assessmentRequest.getAssessment(),property);
		validateUpdateRequest(assessmentRequest, assessmentFromDB, property, errorMap);
		commonValidations(assessmentRequest, errorMap, true);
		validateMDMSData(assessmentRequest.getRequestInfo(), assessmentRequest.getAssessment(), errorMap);
		if(config.getIsAssessmentWorkflowEnabled())
			validateProcessInstance(assessmentRequest, assessmentFromDB, isWorkflowTriggered);

	}

	/**
	 * Method to validate the necessary RI details.
	 *
	 * @param requestInfo
	 * @param errorMap
	 */
	private void validateRI(RequestInfo requestInfo, Map<String, String> errorMap) {
		if (requestInfo != null) {
			if (requestInfo.getUserInfo() != null) {
				if ((StringUtils.isEmpty(requestInfo.getUserInfo().getUuid()))
						|| (CollectionUtils.isEmpty(requestInfo.getUserInfo().getRoles()))
						|| (StringUtils.isEmpty(requestInfo.getUserInfo().getTenantId()))) {
					errorMap.put(ErrorConstants.MISSING_ROLE_USERID_CODE, ErrorConstants.MISSING_ROLE_USERID_MSG);
				}
			} else {
				errorMap.put(ErrorConstants.MISSING_USR_INFO_CODE, ErrorConstants.MISSING_USR_INFO_MSG);
			}

		} else {
			errorMap.put(ErrorConstants.MISSING_REQ_INFO_CODE, ErrorConstants.MISSING_REQ_INFO_MSG);
		}
		if (!CollectionUtils.isEmpty(errorMap.keySet())) {
			throw new CustomException(errorMap);
		}

	}


	/**
	 * Validates the assessment create request
	 * @param assessment
	 * @param property
	 */
	private void validateCreateRequest(Assessment assessment, Property property){

		if(!property.getStatus().equals(Status.ACTIVE))
			throw new CustomException("INVALID_REQUEST","Assessment cannot be done on inactive or property in workflow");

	}

	private void validateUpdateRequest(AssessmentRequest assessmentRequest, Assessment assessmentFromDB, Property property, Map<String, String> errorMap) {
		Assessment assessment = assessmentRequest.getAssessment();
		if (StringUtils.isEmpty(assessment.getId())) {
			errorMap.put("ASSMNT_ID_EMPTY", "Assessment ID cannot be empty");
		}

		if (assessmentFromDB!=null && !CollectionUtils.isEmpty(assessmentFromDB.getDocuments()) && assessmentFromDB.getDocuments().size() > assessment.getDocuments().size()) {
			errorMap.put("MISSING_DOCUMENTS", "Please send all the documents belonging to this assessment");
		}
		if (assessmentFromDB!=null && !CollectionUtils.isEmpty(assessmentFromDB.getUnitUsageList()) && assessmentFromDB.getUnitUsageList().size() > assessment.getUnitUsageList().size()) {
			errorMap.put("MISSING_UNITS", "Please send all the units belonging to this assessment");
		}

		if(!property.getStatus().equals(Status.ACTIVE))
			errorMap.put("INVALID_REQUEST","Assessment cannot be done on inactive or property in workflow");

		/*Set<String> existingUnitUsages = new HashSet<>();
		Set<String> existingDocs = new HashSet<>();

		if(assessmentFromDB!=null)
			existingUnitUsages = assessmentFromDB.getUnitUsageList().stream().map(UnitUsage::getId).collect(Collectors.toSet());

		if(assessmentFromDB!=null && !CollectionUtils.isEmpty(assessmentFromDB.getDocuments()))
			existingDocs = assessmentFromDB.getDocuments().stream().map(Document::getId).collect(Collectors.toSet());

		if (!CollectionUtils.isEmpty(assessment.getUnitUsageList())) {
			for (UnitUsage unitUsage : assessment.getUnitUsageList()) {
				if (!StringUtils.isEmpty(unitUsage.getId())) {
					if (!existingUnitUsages.contains(unitUsage.getId())) {
						errorMap.put("UNITUSAGE_NOT_FOUND",
								"You're trying to update a non-existent unitUsage: " + unitUsage.getId());
					}
				}
			}
		}
		if (!CollectionUtils.isEmpty(assessment.getDocuments())) {
			for (Document doc : assessment.getDocuments()) {
				if (!StringUtils.isEmpty(doc.getId())) {
					if (!existingDocs.contains(doc.getId())) {
						errorMap.put("DOC_NOT_FOUND",
								"You're trying to update a non-existent document: " + doc.getId());
					}
				}
			}
		}*/
		assessment.setAdditionalDetails(
				AssmtUtils.jsonMerge(assessmentFromDB.getAdditionalDetails(), assessment.getAdditionalDetails()));


		if (!CollectionUtils.isEmpty(errorMap.keySet())) {
			throw new CustomException(errorMap);
		}
	}

	private void commonValidations(AssessmentRequest assessmentReq, Map<String, String> errorMap, boolean isUpdate) {
		Assessment assessment = assessmentReq.getAssessment();
		if(!checkIfPropertyExists(assessmentReq.getRequestInfo(), assessment.getPropertyId(), assessment.getTenantId())) {
			throw new CustomException("PROPERTY_NOT_FOUND", "You're trying to assess a non-existing property.");
		}
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

		if (!CollectionUtils.isEmpty(errorMap.keySet())) {
			throw new CustomException(errorMap);
		}

	}

	private Boolean checkIfPropertyExists(RequestInfo requestInfo, String propertyId, String tenantId) {
		Boolean propertyExists = false;
		Set<String> propertyIds = new HashSet<>(); propertyIds.add(propertyId);
		PropertyCriteria criteria = PropertyCriteria.builder().propertyIds(propertyIds).tenantId(tenantId).build();
		List<Property> properties = propertyService.searchProperty(criteria, requestInfo);
		if(!CollectionUtils.isEmpty(properties))
			propertyExists = true;

		return propertyExists;
	}

	private void validateMDMSData(RequestInfo requestInfo, Assessment assessment, Map<String, String> errorMap) {
		Map<String, List<String>> masters = fetchMaster(requestInfo, assessment.getTenantId());
		if(CollectionUtils.isEmpty(masters.keySet()))
			throw new CustomException("MASTER_FETCH_FAILED", "Couldn't fetch master data for validation");

		if(!CollectionUtils.isEmpty(assessment.getUnitUsageList())) {
			for (UnitUsage unitUsage : assessment.getUnitUsageList()) {

				if (!CollectionUtils.isEmpty(masters.get(PTConstants.MDMS_PT_USAGECATEGORY))) {
					if (!masters.get(PTConstants.MDMS_PT_USAGECATEGORY).contains(unitUsage.getUsageCategory()))
						errorMap.put("USAGE_CATEGORY_INVALID", "The usage category provided is invalid");
				}

				if (CollectionUtils.isEmpty(masters.get(PTConstants.MDMS_PT_OCCUPANCYTYPE))) {
					if (!masters.get(PTConstants.MDMS_PT_OCCUPANCYTYPE).contains(unitUsage.getOccupancyType().toString()))
						errorMap.put("OCCUPANCY_TYPE_INVALID", "The occupancy type provided is invalid");
				}
			}
		}
		if (!CollectionUtils.isEmpty(errorMap.keySet())) {
			throw new CustomException(errorMap);
		}

	}

	private Map<String, List<String>> fetchMaster(RequestInfo requestInfo, String tenantId) {
		
		String[] masterNames = { 
				PTConstants.MDMS_PT_CONSTRUCTIONTYPE,
				PTConstants.MDMS_PT_OCCUPANCYTYPE,
				PTConstants.MDMS_PT_USAGEMAJOR 
				};
		
		Map<String, List<String>> codes = AssmtUtils.getAttributeValues(tenantId, PTConstants.MDMS_PT_MOD_NAME,
				new ArrayList<>(Arrays.asList(masterNames)), "$.*.code", PTConstants.JSONPATH_CODES, requestInfo);

		if (null != codes) {
			return codes;
		} else {
			throw new CustomException("MASTER_FETCH_FAILED", "Couldn't fetch master data for validation");
		}
	}


	private void validateUnitIds(Assessment assessment, Property property){

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

		System.out.println("activeUnitIdsInProperty--->"+activeUnitIdsInProperty);
		System.out.println("activeUnitIdsInAssessment--->"+activeUnitIdsInAssessment);

		if(!CollectionUtils.isEmpty(assessment.getUnitUsageList()) && !listEqualsIgnoreOrder(activeUnitIdsInAssessment, activeUnitIdsInProperty))
			throw new CustomException("INVALID_UNITIDS","The unitIds are not matching in property and assessment");


	}


	/**
	 * Validates the workflow object and the status
	 * @param assessmentRequest The assessment request for update or create
	 * @param assessmentFromDB The assessment from db
	 */
	public void validateProcessInstance(AssessmentRequest assessmentRequest, Assessment assessmentFromDB, Boolean isWorkflowTriggered){

		Assessment assessment = assessmentRequest.getAssessment();
		Map<String, String> errorMap = new HashMap<>();

		if(isWorkflowTriggered && assessment.getWorkflow()==null)
			errorMap.put("INVALID_REQUEST","Workflow object is invalid");

		if(isWorkflowTriggered && assessment.getWorkflow()!=null && assessment.getWorkflow().getAction()==null)
			errorMap.put("INVALID_REQUEST","Workflow object is invalid");

		if(assessmentFromDB!=null && assessmentFromDB.getStatus().equals(Status.INWORKFLOW)){
			if(!assessment.getStatus().equals(Status.INWORKFLOW))
				throw new CustomException("INVALID_STATUS","The status of the assessment is incorrect");

			if(assessment.getWorkflow()==null)
				errorMap.put("INVALID_REQUEST","The workflow object is not valid");
			else {
				if(assessment.getWorkflow().getAction()==null)
					errorMap.put("INVALID_REQUEST","Action cannot be null");
			}
		}

		if(assessment.getStatus().equals(Status.INWORKFLOW) && assessment.getWorkflow()==null){
			errorMap.put("INVALID_REQUEST","Workflow cannot be null");
		}

		if(!CollectionUtils.isEmpty(errorMap))
			throw new CustomException(errorMap);

	}


	/**
	 * Validates if any other assessments are in workflow for the given property
	 * @param assessment
	 */
	private void validateWorkflowOfOtherAssessments(Assessment assessment){

		AssessmentSearchCriteria criteria = AssessmentSearchCriteria.builder()
											.tenantId(assessment.getTenantId())
											.status(Status.INWORKFLOW)
											.propertyIds(Collections.singleton(assessment.getPropertyId()))
											.build();

		List<Assessment> assessments = assessmentRepository.getAssessments(criteria);

		if(!CollectionUtils.isEmpty(assessments))
			throw new CustomException("INVALID_REQUEST","The property has other assessment in workflow");

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

}
