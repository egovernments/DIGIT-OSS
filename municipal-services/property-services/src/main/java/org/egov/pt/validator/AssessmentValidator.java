package org.egov.pt.validator;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.models.Assessment;
import org.egov.pt.models.AssessmentSearchCriteria;
import org.egov.pt.models.Document;
import org.egov.pt.models.Property;
import org.egov.pt.models.PropertyCriteria;
import org.egov.pt.service.AssessmentService;
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
	private AssessmentService assessmentService;
	
	@Autowired
	private PropertyService propertyService;
	
    @Autowired
    private PropertyValidator propertyValidator;
    
    @Autowired
    private AssessmentUtils utils;

	public void validateAssessmentCreate(AssessmentRequest assessmentRequest) {
		Map<String, String> errorMap = new HashMap<>();
		validateRI(assessmentRequest.getRequestInfo(), errorMap);
		commonValidations(assessmentRequest, errorMap, false);
		validateMDMSData(assessmentRequest.getRequestInfo(), assessmentRequest.getAssessment(), errorMap);
	}

	public void validateAssessmentUpdate(AssessmentRequest assessmentRequest) {
		Map<String, String> errorMap = new HashMap<>();
		validateRI(assessmentRequest.getRequestInfo(), errorMap);
		validateUpdateRequest(assessmentRequest, errorMap);
		commonValidations(assessmentRequest, errorMap, true);
		validateMDMSData(assessmentRequest.getRequestInfo(), assessmentRequest.getAssessment(), errorMap);
	}

	/**
	 * Method to validate the necessary RI details.
	 * 
	 * @param requestInfo
	 * @param errorMap
	 */
	private void validateRI(RequestInfo requestInfo, Map<String, String> errorMap) {
		if (null != requestInfo) {
			if (null != requestInfo.getUserInfo()) {
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

	private void validateUpdateRequest(AssessmentRequest assessmentRequest, Map<String, String> errorMap) {
		Assessment assessment = assessmentRequest.getAssessment();
		if (StringUtils.isEmpty(assessment.getId())) {
			errorMap.put("ASSMNT_ID_EMPTY", "Assessment ID cannot be empty");
		}
		Set<String> ids = new HashSet<>();
		ids.add(assessment.getId());
		AssessmentSearchCriteria criteria = AssessmentSearchCriteria.builder().ids(ids).build();
		List<Assessment> assessments = assessmentService.searchAssessments(assessmentRequest.getRequestInfo(),
				criteria);
		if (CollectionUtils.isEmpty(assessments)) {
			errorMap.put(ErrorConstants.NO_ASSESSMENTS_FOUND_CODE, ErrorConstants.NO_ASSESSMENTS_FOUND_MSG);
		} else {
			Assessment assessmentFromDB = assessments.get(0);
			if (assessmentFromDB.getDocuments().size() > assessment.getDocuments().size()) {
				errorMap.put("MISSING_DOCUMENTS", "Please send all the documents belonging to this assessment");
			}
			
	
			Set<String> existingDocs = assessmentFromDB.getDocuments().stream().map(Document::getId)
					.collect(Collectors.toSet());
			if (!CollectionUtils.isEmpty(assessment.getDocuments())) {
				for (Document doc : assessment.getDocuments()) {
					if (!StringUtils.isEmpty(doc.getId())) {
						if (!existingDocs.contains(doc.getId())) {
							errorMap.put("DOC_NOT_FOUND",
									"You're trying to update a non-existent document: " + doc.getId());
						}
					}
				}
			}
			
		//assessment.setAdditionalDetails(utils.jsonMerge(assessmentFromDB.getAdditionalDetails(), assessment.getAdditionalDetails()));
			
		}

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
		

		if (!CollectionUtils.isEmpty(errorMap.keySet())) {
			throw new CustomException(errorMap);
		}

	}

	private Map<String, List<String>> fetchMaster(RequestInfo requestInfo, String tenantId) {
		String[] masterNames = {PTConstants.MDMS_PT_CONSTRUCTIONTYPE, PTConstants.MDMS_PT_OCCUPANCYTYPE,PTConstants.MDMS_PT_USAGEMAJOR };
		Map<String, List<String>> codes = propertyValidator.getAttributeValues(tenantId, PTConstants.MDMS_PT_MOD_NAME, new ArrayList<>(Arrays.asList(masterNames)), "$.*.code",
				PTConstants.JSONPATH_CODES, requestInfo);
        if(null != codes) {
        	return codes;
        }else {
        	throw new CustomException("MASTER_FETCH_FAILED", "Couldn't fetch master data for validation");
        }
	}

}
