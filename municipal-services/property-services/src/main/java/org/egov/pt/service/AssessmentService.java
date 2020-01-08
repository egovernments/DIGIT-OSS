package org.egov.pt.service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.Assessment;
import org.egov.pt.models.AssessmentSearchCriteria;
import org.egov.pt.models.AuditDetails;
import org.egov.pt.models.Document;
import org.egov.pt.models.Unit;
import org.egov.pt.models.enums.Status;
import org.egov.pt.producer.Producer;
import org.egov.pt.repository.AssessmentRepository;
import org.egov.pt.validator.AssessmentValidator;
import org.egov.pt.web.contracts.AssessmentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AssessmentService {
	
	@Autowired
	private AssessmentValidator validator;
	
	@Autowired
	private Producer producer;
	
	@Autowired
	private PropertyConfiguration props;
	
	@Autowired
	private AssessmentRepository repository;
	
	@Autowired
	private EnrichmentService enrichmentService;
	
	
	/**
	 * Method to create an assessment asynchronously.
	 * 
	 * @param request
	 * @return
	 */
	public Assessment createAssessment(AssessmentRequest request) {
		validator.validateAssessmentCreate(request);
		enrichAssessmentCreate(request);
		producer.push(props.getCreateAssessmentTopic(), request);
		
		return request.getAssessment();
	}
	
	
	/**
	 * Method to update an assessment asynchronously.
	 * 
	 * @param request
	 * @return
	 */
	public Assessment updateAssessment(AssessmentRequest request) {
		validator.validateAssessmentUpdate(request);
		enrichAssessmentUpdate(request);
		producer.push(props.getUpdateAssessmentTopic(), request);

		return request.getAssessment();
	}
	
	
	/**
	 * Service layer to enrich assessment object in create flow
	 * 
	 * @param request
	 */
	private void enrichAssessmentCreate(AssessmentRequest request) {
		Assessment assessment = request.getAssessment();
		assessment.setId(String.valueOf(UUID.randomUUID()));
		assessment.setAssessmentNumber(getAssessmentNo(request));
		if(null == assessment.getStatus()) 
			assessment.setStatus(Status.ACTIVE);

		AuditDetails auditDetails = AuditDetails.builder()
				.createdBy(request.getRequestInfo().getUserInfo().getUuid())
				.createdTime(new Date().getTime())
				.lastModifiedBy(request.getRequestInfo().getUserInfo().getUuid())
				.lastModifiedTime(new Date().getTime()).build();
		
		if(!CollectionUtils.isEmpty(assessment.getUnits())) {
			for(Unit unit: assessment.getUnits()) {
				unit.setId(String.valueOf(UUID.randomUUID()));
				unit.setActive(true);
				unit.setAuditDetails(auditDetails);
			}
		}		
		if(!CollectionUtils.isEmpty(assessment.getDocuments())) {
			for(Document doc: assessment.getDocuments()) {
				doc.setId(String.valueOf(UUID.randomUUID()));
				doc.setAuditDetails(auditDetails);
				doc.setStatus(Status.ACTIVE);
			}
		}		
		assessment.setAuditDetails(auditDetails);
	}
	
	
	/**
	 * Service layer to enrich assessment object in update flow
	 * 
	 * @param request
	 */
	private void enrichAssessmentUpdate(AssessmentRequest request) {
		Assessment assessment = request.getAssessment();
		
		AuditDetails auditDetails = AuditDetails.builder()
				.createdBy(request.getRequestInfo().getUserInfo().getUuid())
				.createdTime(new Date().getTime())
				.lastModifiedBy(request.getRequestInfo().getUserInfo().getUuid())
				.lastModifiedTime(new Date().getTime()).build();
		
		if(!CollectionUtils.isEmpty(assessment.getUnits())) {
			for(Unit unit: assessment.getUnits()) {
				if(StringUtils.isEmpty(unit.getId())) {
					unit.setId(String.valueOf(UUID.randomUUID()));
					unit.setActive(true);
					unit.setAuditDetails(auditDetails);
				}
			}
		}
		if(!CollectionUtils.isEmpty(assessment.getDocuments())) {
			for(Document doc: assessment.getDocuments()) {
				if(StringUtils.isEmpty(doc.getId())) {
					doc.setId(String.valueOf(UUID.randomUUID()));
					doc.setAuditDetails(auditDetails);
					doc.setStatus(Status.ACTIVE);
				}
			}
		}
		assessment.getAuditDetails().setLastModifiedBy(auditDetails.getLastModifiedBy());
		assessment.getAuditDetails().setLastModifiedTime(auditDetails.getLastModifiedTime());	
	}
	
	/**
	 * Service layer to search assessments.
	 * 
	 * @param requestInfo
	 * @param criteria
	 * @return
	 */
	public List<Assessment> searchAssessments(RequestInfo requestInfo, AssessmentSearchCriteria criteria) {
		List<Assessment> assessments = repository.getAssessments(criteria);
		return assessments;
	}
	
	
	private String getAssessmentNo(AssessmentRequest request) {
		return enrichmentService.getIdList(request.getRequestInfo(), request.getAssessment().getTenantId(), 
				props.getAssessmentIdGenName(), props.getAssessmentIdGenFormat(), 1).get(0);
	}
}
