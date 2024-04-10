package org.egov.pt.service;

import static org.egov.pt.util.PTConstants.ASSESSMENT_BUSINESSSERVICE;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.Assessment;
import org.egov.pt.models.AssessmentSearchCriteria;
import org.egov.pt.models.Property;
import org.egov.pt.models.enums.Status;
import org.egov.pt.models.workflow.BusinessService;
import org.egov.pt.models.workflow.ProcessInstanceRequest;
import org.egov.pt.models.workflow.State;
import org.egov.pt.producer.PropertyProducer;
import org.egov.pt.repository.AssessmentRepository;
import org.egov.pt.util.AssessmentUtils;
import org.egov.pt.validator.AssessmentValidator;
import org.egov.pt.web.contracts.AssessmentRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Service
public class AssessmentService {

	private AssessmentValidator validator;

	private PropertyProducer producer;

	private PropertyConfiguration props;

	private AssessmentRepository repository;

	private AssessmentEnrichmentService assessmentEnrichmentService;

	private PropertyConfiguration config;

	private DiffService diffService;

	private AssessmentUtils utils;

	private WorkflowService workflowService;

	private CalculationService calculationService;


	@Autowired
	public AssessmentService(AssessmentValidator validator, PropertyProducer producer, PropertyConfiguration props, AssessmentRepository repository,
                             AssessmentEnrichmentService assessmentEnrichmentService, PropertyConfiguration config, DiffService diffService,
                             AssessmentUtils utils, WorkflowService workflowService, CalculationService calculationService) {
		this.validator = validator;
		this.producer = producer;
		this.props = props;
		this.repository = repository;
		this.assessmentEnrichmentService = assessmentEnrichmentService;
		this.config = config;
		this.diffService = diffService;
		this.utils = utils;
		this.workflowService = workflowService;
		this.calculationService = calculationService;
	}

	/**
	 * Method to create an assessment asynchronously.
	 *
	 * @param request
	 * @return
	 */
	public Assessment createAssessment(AssessmentRequest request) {

		String tenantId = request.getAssessment().getTenantId();
		Property property = utils.getPropertyForAssessment(request);
		validator.validateAssessmentCreate(request, property);
		assessmentEnrichmentService.enrichAssessmentCreate(request);

		if(config.getIsAssessmentWorkflowEnabled()){
			assessmentEnrichmentService.enrichWorkflowForInitiation(request);
			ProcessInstanceRequest workflowRequest = new ProcessInstanceRequest(request.getRequestInfo(),
					Collections.singletonList(request.getAssessment().getWorkflow()));
			State state = workflowService.callWorkFlow(workflowRequest);
			request.getAssessment().getWorkflow().setState(state);
		}
		else {
			calculationService.calculateTax(request, property);
		}
		producer.push(tenantId, props.getCreateAssessmentTopic(), request);

		return request.getAssessment();
	}


	/**
	 * Method to update an assessment asynchronously.
	 *
	 * @param request
	 * @return
	 */
	public Assessment updateAssessment(AssessmentRequest request) {

		String tenantId = request.getAssessment().getTenantId();
		Assessment assessment = request.getAssessment();
		RequestInfo requestInfo = request.getRequestInfo();
		Property property = utils.getPropertyForAssessment(request);
		assessmentEnrichmentService.enrichAssessmentUpdate(request, property);
		Assessment assessmentFromSearch = repository.getAssessmentFromDB(request.getAssessment());
		Boolean isWorkflowTriggered = isWorkflowTriggered(request.getAssessment(),assessmentFromSearch);
		validator.validateAssessmentUpdate(request, assessmentFromSearch, property, isWorkflowTriggered);

		if ((request.getAssessment().getStatus().equals(Status.INWORKFLOW) || isWorkflowTriggered)
				&& config.getIsAssessmentWorkflowEnabled()){

			BusinessService businessService = workflowService.getBusinessService(request.getAssessment().getTenantId(),
												ASSESSMENT_BUSINESSSERVICE,request.getRequestInfo());

			assessmentEnrichmentService.enrichAssessmentProcessInstance(request, property);

			Boolean isStateUpdatable = workflowService.isStateUpdatable(request.getAssessment().getWorkflow().getState().getState(),businessService);

			if(isStateUpdatable){

				assessmentEnrichmentService.enrichAssessmentUpdate(request, property);
				/*
				calculationService.getMutationFee();
				producer.push(tenantId, topic1,request);*/
			}
			ProcessInstanceRequest workflowRequest = new ProcessInstanceRequest(requestInfo, Collections.singletonList(assessment.getWorkflow()));
			State state = workflowService.callWorkFlow(workflowRequest);
			String status = state.getApplicationStatus();
			request.getAssessment().getWorkflow().setState(state);
			//assessmentEnrichmentService.enrichStatus(status, assessment, businessService);
			assessment.setStatus(Status.fromValue(status));
			if(assessment.getWorkflow().getState().getState().equalsIgnoreCase(config.getDemandTriggerState()))
				calculationService.calculateTax(request, property);

			producer.push(tenantId, props.getUpdateAssessmentTopic(), request);


			/*
				*
				* if(stateIsUpdatable){
				*
				*
				*  }
				*
				*  else {
				*  	producer.push(tenantId, stateUpdateTopic, request);
				*
				*  }
				*
				*
				* */


		}
		else if(!config.getIsAssessmentWorkflowEnabled()){
			calculationService.calculateTax(request, property);
			producer.push(tenantId, props.getUpdateAssessmentTopic(), request);
		}
		return request.getAssessment();
	}

	public List<Assessment> searchAssessments(AssessmentSearchCriteria criteria){
		return repository.getAssessments(criteria);
	}

	public List<Assessment> getAssessmenPlainSearch(AssessmentSearchCriteria criteria) {
		if (criteria.getLimit() != null && criteria.getLimit() > config.getMaxSearchLimit())
			criteria.setLimit(config.getMaxSearchLimit());
		if(criteria.getLimit()==null)
			criteria.setLimit(config.getDefaultLimit());
		if(criteria.getOffset()==null)
			criteria.setOffset(config.getDefaultOffset());
		AssessmentSearchCriteria assessmentSearchCriteria = new AssessmentSearchCriteria();
		if (criteria.getIds() != null || criteria.getPropertyIds() != null || criteria.getAssessmentNumbers() != null) {
			if (criteria.getIds() != null)
				assessmentSearchCriteria.setIds(criteria.getIds());
			if (criteria.getPropertyIds() != null)
				assessmentSearchCriteria.setPropertyIds(criteria.getPropertyIds());
			if (criteria.getAssessmentNumbers() != null)
				assessmentSearchCriteria.setAssessmentNumbers(criteria.getAssessmentNumbers());

		} else {
			List<String> assessmentNumbers = repository.fetchAssessmentNumbers(criteria);
			if (assessmentNumbers.isEmpty())
				return Collections.emptyList();
			assessmentSearchCriteria.setAssessmentNumbers(new HashSet<>(assessmentNumbers));
		}
		assessmentSearchCriteria.setLimit(criteria.getLimit());
		return repository.getAssessmentPlainSearch(assessmentSearchCriteria);
	}

	/**
	 * Checks if the fields modified can trigger a workflow
	 * @return true if workflow is triggered else false
	 */
	private Boolean isWorkflowTriggered(Assessment assessment, Assessment assessmentFromSearch){

		Boolean isWorkflowTriggeredByFieldChange = false;
		List<String> fieldsUpdated = diffService.getUpdatedFields(assessment, assessmentFromSearch, "");

		if(!CollectionUtils.isEmpty(fieldsUpdated))
			isWorkflowTriggeredByFieldChange = intersection(new LinkedList<>(Arrays.asList(config.getAssessmentWorkflowTriggerParams().split(","))), fieldsUpdated);

		// third variable is needed only for mutation
		List<String> objectsAdded = diffService.getObjectsAdded(assessment, assessmentFromSearch, "");

		Boolean isWorkflowTriggeredByObjectAddition = false;
		if(!CollectionUtils.isEmpty(objectsAdded))
			isWorkflowTriggeredByObjectAddition = intersection(new LinkedList<>(Arrays.asList(config.getAssessmentWorkflowObjectTriggers().split(","))), objectsAdded);

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
