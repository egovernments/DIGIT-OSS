package org.egov.pt.service;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.*;
import org.egov.pt.models.enums.Status;
import org.egov.pt.producer.Producer;
import org.egov.pt.repository.AssessmentRepository;
import org.egov.pt.validator.AssessmentValidator;
import org.egov.pt.web.contracts.AssessmentRequest;
import org.egov.tracer.model.CustomException;
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

	@Autowired
	private PropertyConfiguration config;

	@Autowired
	private DiffService diffService;


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
		Assessment assessmentFromSearch = getAssessmentFromDB(request.getAssessment());
		List<String> fieldsUpdated = diffService.getUpdatedFields(request.getAssessment(),assessmentFromSearch);
		if (config.getIsWorkflowEnabled()){


		}
		else {
			producer.push(props.getUpdateAssessmentTopic(), request);
		}
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

		if(!CollectionUtils.isEmpty(assessment.getUnitUsageList())) {
			for(UnitUsage unitUsage: assessment.getUnitUsageList()) {
				unitUsage.setId(String.valueOf(UUID.randomUUID()));
				unitUsage.setAuditDetails(auditDetails);
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

		if(!CollectionUtils.isEmpty(assessment.getUnitUsageList())) {
			for(UnitUsage unitUsage: assessment.getUnitUsageList()) {
				if(StringUtils.isEmpty(unitUsage.getId())) {
					unitUsage.setId(String.valueOf(UUID.randomUUID()));
					unitUsage.setAuditDetails(auditDetails);
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
	 * @param criteria
	 * @return
	 */
	public List<Assessment> searchAssessments(AssessmentSearchCriteria criteria) {
		List<Assessment> assessments = repository.getAssessments(criteria);
		return assessments;
	}


	private String getAssessmentNo(AssessmentRequest request) {
		return enrichmentService.getIdList(request.getRequestInfo(), request.getAssessment().getTenantId(),
				props.getAssessmentIdGenName(), props.getAssessmentIdGenFormat(), 1).get(0);
	}


	/**
	 * Fetches the assessment from DB corresponding to given assessment for update
	 * @param assessment THe Assessment to be updated
	 * @return Assessment from DB
	 */
	private Assessment getAssessmentFromDB(Assessment assessment){

		AssessmentSearchCriteria criteria = AssessmentSearchCriteria.builder()
											.ids(Collections.singleton(assessment.getId()))
											.tenantId(assessment.getTenantId())
											.build();

		List<Assessment> assessments = searchAssessments(criteria);

		if(CollectionUtils.isEmpty(assessments))
			throw new CustomException("ASSESSMENT_NOT_FOUND","The assessment with id: "+assessment.getId()+" is not found in DB");

		return assessments.get(0);
	}


}
