package org.egov.pt.service;

import static org.egov.pt.util.AssessmentConstants.ASSESSMENT_BUSINESSSERVICE;

import java.util.Arrays;
import java.util.List;

import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.Assessment;
import org.egov.pt.models.AssessmentSearchCriteria;
import org.egov.pt.models.Property;
import org.egov.pt.models.enums.Status;
import org.egov.pt.models.workflow.BusinessService;
import org.egov.pt.producer.Producer;
import org.egov.pt.repository.AssessmentRepository;
import org.egov.pt.util.AssessmentUtils;
import org.egov.pt.validator.AssessmentValidator;
import org.egov.pt.web.contracts.AssessmentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Service
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
	private AssessmentEnrichmentService assessmentEnrichmentService;

	@Autowired
	private PropertyConfiguration config;

	@Autowired
	private DiffService diffService;

	@Autowired
	private AssessmentUtils utils;

	@Autowired
	private WorkflowService workflowService;

	@Autowired
	private CalculationService calculationService;

	/**
	 * Method to create an assessment asynchronously.
	 *
	 * @param request
	 * @return
	 */
	public Assessment createAssessment(AssessmentRequest request) {
		Property property = utils.getPropertyForAssessment(request);
		validator.validateAssessmentCreate(request, property);
		assessmentEnrichmentService.enrichAssessmentCreate(request);
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

		Property property = utils.getPropertyForAssessment(request);
		validator.validateAssessmentUpdate(request, property);
		assessmentEnrichmentService.enrichAssessmentUpdate(request);
		Assessment assessmentFromSearch = repository.getAssessmentFromDB(request.getAssessment());
		List<String> fieldsUpdated = diffService.getUpdatedFields(request.getAssessment(),assessmentFromSearch);
		Boolean workflowTriggered = isWorkflowTriggered(fieldsUpdated);

		if ((request.getAssessment().getStatus().equals(Status.INWORKFLOW) || workflowTriggered)
				&& config.getIsWorkflowEnabled()){

			assessmentEnrichmentService.enrichAssessmentProcessInstance(request, property);
			BusinessService businessService = workflowService.getBusinessService(request.getAssessment().getTenantId(),
												ASSESSMENT_BUSINESSSERVICE,request.getRequestInfo());


			Boolean isStateUpdatable = workflowService.isStateUpdatable(assessmentFromSearch.getWorkflow().getState().getState(),businessService);

			if(isStateUpdatable){

				/*enrichAssessment();
				calculationService.getMutationFee();
				producer.push(topic1,request);*/

			}

				/*
				*
				* if(stateIsUpdatable){
				*
				*
				*  }
				*
				*  else {
				*  	producer.push(stateUpdateTopic, request);
				*
				*  }
				*
				*
				* */


		}
		else {
			calculationService.calculateTax(request, property);
			producer.push(props.getUpdateAssessmentTopic(), request);
		}
		return request.getAssessment();
	}

	public List<Assessment> searchAssessments(AssessmentSearchCriteria criteria){
		return repository.getAssessments(criteria);
	}

	/**
	 * Checks if the fields modified can trigger a workflow
	 * @param fieldsUpdated Fields modified in update
	 * @return true if workflow is triggered else false
	 */
	private Boolean isWorkflowTriggered(List<String> fieldsUpdated){
		List<String> workflowParams = Arrays.asList(config.getAssessmentWorkflowTriggerParams().split(","));
		workflowParams.retainAll(fieldsUpdated);
		return !CollectionUtils.isEmpty(workflowParams);
	}




}
