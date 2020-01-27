package org.egov.pt.service;

import static org.egov.pt.util.AssessmentConstants.ASSESSMENT_BUSINESSSERVICE;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.Assessment;
import org.egov.pt.models.AssessmentSearchCriteria;
import org.egov.pt.models.Property;
import org.egov.pt.models.enums.Status;
import org.egov.pt.models.workflow.BusinessService;
import org.egov.pt.models.workflow.ProcessInstance;
import org.egov.pt.models.workflow.ProcessInstanceRequest;
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
		calculationService.calculateTax(request, property);
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

		Assessment assessment = request.getAssessment();
		RequestInfo requestInfo = request.getRequestInfo();
		Property property = utils.getPropertyForAssessment(request);
		assessmentEnrichmentService.enrichAssessmentUpdate(request, property);
		validator.validateAssessmentUpdate(request, property);
		Assessment assessmentFromSearch = repository.getAssessmentFromDB(request.getAssessment());
		Boolean workflowTriggered = isWorkflowTriggered(request.getAssessment(),assessmentFromSearch);

		if ((request.getAssessment().getStatus().equals(Status.INWORKFLOW) || workflowTriggered)
				&& config.getIsWorkflowEnabled()){

			BusinessService businessService = workflowService.getBusinessService(request.getAssessment().getTenantId(),
												ASSESSMENT_BUSINESSSERVICE,request.getRequestInfo());

			assessmentEnrichmentService.enrichAssessmentProcessInstance(request, property);

			Boolean isStateUpdatable = workflowService.isStateUpdatable(assessmentFromSearch.getWorkflow().getState().getState(),businessService);

			if(isStateUpdatable){

				assessmentEnrichmentService.enrichAssessmentUpdate(request, property);
				/*
				calculationService.getMutationFee();
				producer.push(topic1,request);*/
			}
			ProcessInstanceRequest workflowRequest = new ProcessInstanceRequest(requestInfo, Collections.singletonList(assessment.getWorkflow()));
			String state = workflowService.callWorkFlow(workflowRequest);
			assessmentEnrichmentService.enrichStatus(state, assessment, businessService);
			calculationService.calculateTax(request, property);
			producer.push(props.getUpdateAssessmentTopic(), request);


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
	 * @return true if workflow is triggered else false
	 */
	private Boolean isWorkflowTriggered(Assessment assessment, Assessment assessmentFromSearch){

		Boolean isWorkflowTriggeredByFieldChange = false;
		List<String> fieldsUpdated = diffService.getUpdatedFields(assessment, assessmentFromSearch);
		isWorkflowTriggeredByFieldChange = intersection(Arrays.asList(config.getAssessmentWorkflowTriggerParams().split(",")), fieldsUpdated);

		List<String> objectsAdded = diffService.getObjectsAdded(assessment, assessmentFromSearch);

		Boolean isWorkflowTriggeredByObjectAddition = false;
		if(!CollectionUtils.isEmpty(objectsAdded))
			isWorkflowTriggeredByObjectAddition = intersection(Arrays.asList(config.getAssessmentWorkflowObjectTriggers().split(",")), objectsAdded);

		return (isWorkflowTriggeredByFieldChange || isWorkflowTriggeredByObjectAddition);
	}

	/**
	 * Checks if list2 has any element in list1
	 * @param list1
	 * @param list2
	 * @return true if list2 have any element in list1 else false
	 */
	private Boolean intersection(List<String> list1, List<String> list2){
		list1.retainAll(list2);
		return !CollectionUtils.isEmpty(list1);

	}



}
