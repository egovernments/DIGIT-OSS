package org.egov.pt.service;

import java.util.*;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.*;
import org.egov.pt.models.enums.Status;
import org.egov.pt.models.workflow.BusinessService;
import org.egov.pt.models.workflow.ProcessInstance;
import org.egov.pt.producer.Producer;
import org.egov.pt.repository.AssessmentRepository;
import org.egov.pt.util.AssessmentUtils;
import org.egov.pt.validator.AssessmentValidator;
import org.egov.pt.web.contracts.AssessmentRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import lombok.extern.slf4j.Slf4j;

import static org.egov.pt.util.AssessmentConstants.ASSESSMENT_BUSINESSSERVICE;
import static org.egov.pt.util.AssessmentConstants.WORKFLOW_SENDBACK_CITIZEN;

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
	private AssessmentEnrichmentService assessmentEnrichmentService;

	@Autowired
	private PropertyConfiguration config;

	@Autowired
	private DiffService diffService;

	@Autowired
	private AssessmentUtils utils;

	@Autowired
	private WorkflowService workflowService;

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

			}
				/*
				*
				* if(stateIsUpdatable){
				* 	enrichAssessment();
				* 	producer.push(topic1,request);
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
			producer.push(props.getUpdateAssessmentTopic(), request);
		}
		return request.getAssessment();
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
