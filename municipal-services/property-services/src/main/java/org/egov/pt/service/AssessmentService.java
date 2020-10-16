package org.egov.pt.service;

import static org.egov.pt.util.PTConstants.ASSESSMENT_BUSINESSSERVICE;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.*;
import org.egov.pt.models.enums.Status;
import org.egov.pt.models.workflow.BusinessService;
import org.egov.pt.models.workflow.ProcessInstanceRequest;
import org.egov.pt.models.workflow.State;
import org.egov.pt.producer.Producer;
import org.egov.pt.repository.AssessmentRepository;
import org.egov.pt.util.AssessmentUtils;
import org.egov.pt.validator.AssessmentValidator;
import org.egov.pt.validator.DemandValidator;
import org.egov.pt.web.contracts.AssessmentRequest;
import org.egov.pt.web.contracts.DemandRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AssessmentService {

	private AssessmentValidator validator;

	private Producer producer;

	private PropertyConfiguration props;

	private AssessmentRepository repository;

	private AssessmentEnrichmentService assessmentEnrichmentService;

	private PropertyConfiguration config;

	private DiffService diffService;

	private AssessmentUtils utils;

	private WorkflowService workflowService;

	private CalculationService calculationService;


	@Autowired
	public AssessmentService(AssessmentValidator validator, Producer producer, PropertyConfiguration props, AssessmentRepository repository,
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

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private DemandValidator demandValidator;

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
		producer.push(props.getCreateAssessmentTopic(), request);

		return request.getAssessment();
	}

	public Assessment createLegacyAssessments(AssessmentRequest request) {
		Property property = utils.getPropertyForAssessment(request);
		validator.validateAssessmentCreate(request, property);
		Assessment actualAssessment = request.getAssessment();
		DemandRequest demandRequest = mapper.convertValue(actualAssessment.getAdditionalDetails(), DemandRequest.class);
		List<Demand> demands = demandRequest.getDemands();
		if (demands == null || demands.isEmpty())
			throw new CustomException("No_DEMAND", "No demand added for the property");
		demandValidator.validateAndfilterDemands(demands,actualAssessment.getPropertyId(), actualAssessment.getTenantId());

		for (Demand demand : demands) {
			AssessmentRequest assessmentRequest = enrichLegacyAssessment(actualAssessment, demand.getTaxPeriodFrom(),
					request.getRequestInfo());
			assessmentEnrichmentService.enrichAssessmentCreate(assessmentRequest);
			producer.push(props.getCreateAssessmentTopic(), assessmentRequest);
		}

		calculationService.saveDemands(demands, request.getRequestInfo());
		return actualAssessment;
	}

	private AssessmentRequest enrichLegacyAssessment(Assessment assessment, Long fromDate, RequestInfo requestInfo) {
		assessment.setAdditionalDetails(null);
		assessment.setFinancialYear(getFinancialYear(fromDate));
		return AssessmentRequest.builder().requestInfo(requestInfo).assessment(assessment).build();
	}

	private String getFinancialYear(Long fromDate) {
		LocalDate ld = Instant.ofEpochMilli(fromDate).atZone(ZoneId.systemDefault()).toLocalDate();
		return String.valueOf(ld.getYear()).concat("-").concat(String.valueOf(ld.getYear() + 1).substring(2, 4));
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
				producer.push(topic1,request);*/
			}
			ProcessInstanceRequest workflowRequest = new ProcessInstanceRequest(requestInfo, Collections.singletonList(assessment.getWorkflow()));
			State state = workflowService.callWorkFlow(workflowRequest);
			String status = state.getApplicationStatus();
			request.getAssessment().getWorkflow().setState(state);
			//assessmentEnrichmentService.enrichStatus(status, assessment, businessService);
			assessment.setStatus(Status.fromValue(status));
			if(assessment.getWorkflow().getState().getState().equalsIgnoreCase(config.getDemandTriggerState()))
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
		else if(!config.getIsAssessmentWorkflowEnabled()){
			calculationService.calculateTax(request, property);
			producer.push(props.getUpdateAssessmentTopic(), request);
		}
		return request.getAssessment();
	}
	
	public Assessment updateLegacyAssessments(AssessmentRequest request) {
		Property property = utils.getPropertyForAssessment(request);
		Assessment actualAssessment = request.getAssessment();
		RequestInfo requestInfo = request.getRequestInfo();
		DemandRequest demandRequest = mapper.convertValue(actualAssessment.getAdditionalDetails(), DemandRequest.class);
		List<Demand> demands = demandRequest.getDemands();
		if (demands == null || demands.isEmpty())
			throw new CustomException("NO_DEMAND", "No demand added for the property");
		demandValidator.validateLegacyDemands(demands, actualAssessment.getPropertyId(), actualAssessment.getTenantId());
		List<Assessment> assessmentsFromDB = repository.getAssessmentsFromDBByPropertyId(actualAssessment);
		for (Demand demand : demands) {
			if (demand.getId() == null) {
				AssessmentRequest assessmentRequest = enrichLegacyAssessment(actualAssessment,
						demand.getTaxPeriodFrom(), requestInfo);
				assessmentEnrichmentService.enrichAssessmentCreate(assessmentRequest);
				producer.push(props.getCreateAssessmentTopic(), assessmentRequest);
			}

		}
		for (Assessment assessment : assessmentsFromDB) {
			AssessmentRequest assessmentRequest = AssessmentRequest.builder().requestInfo(requestInfo)
					.assessment(assessment).build();
			assessmentEnrichmentService.enrichAssessmentUpdate(assessmentRequest, property);
			producer.push(props.getUpdateAssessmentTopic(), assessmentRequest);
		}
		calculationService.updateDemands(demands, request.getRequestInfo());

		return actualAssessment;
	}

	public List<Assessment> searchAssessments(AssessmentSearchCriteria criteria){
		return repository.getAssessments(criteria);
	}

	public List<Assessment> getAssessmenPlainSearch(AssessmentSearchCriteria criteria) {
		if (criteria.getLimit() != null && criteria.getLimit() > config.getMaxSearchLimit())
			criteria.setLimit(config.getMaxSearchLimit());
		List<String> assessmentNumbers = repository.fetchAssessmentNumbers(criteria);
		if (assessmentNumbers.isEmpty())
			return Collections.emptyList();
		AssessmentSearchCriteria assessmentSearchCriteria = AssessmentSearchCriteria.builder().limit(criteria.getLimit())
				.assessmentNumbers(new HashSet<>(assessmentNumbers)).build();
		return repository.getAssessmentPlainSearch(assessmentSearchCriteria);
	}

	/**
	 * Checks if the fields modified can trigger a workflow
	 * @return true if workflow is triggered else false
	 */
	private Boolean isWorkflowTriggered(Assessment assessment, Assessment assessmentFromSearch){

		Boolean isWorkflowTriggeredByFieldChange = false;
		List<String> fieldsUpdated = diffService.getUpdatedFields(assessment, assessmentFromSearch);

		if(!CollectionUtils.isEmpty(fieldsUpdated))
			isWorkflowTriggeredByFieldChange = intersection(new LinkedList<>(Arrays.asList(config.getAssessmentWorkflowTriggerParams().split(","))), fieldsUpdated);


		List<String> objectsAdded = diffService.getObjectsAdded(assessment, assessmentFromSearch);

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
