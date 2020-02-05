package org.egov.pt.service;

import static org.egov.pt.util.PTConstants.CREATE_PROCESS_CONSTANT;
import static org.egov.pt.util.PTConstants.MUTATION_PROCESS_CONSTANT;
import static org.egov.pt.util.PTConstants.UPDATE_PROCESS_CONSTANT;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.pt.models.OwnerInfo;
import org.egov.pt.models.Property;
import org.egov.pt.models.PropertyCriteria;
import org.egov.pt.models.enums.Status;
import org.egov.pt.models.user.User;
import org.egov.pt.models.user.UserDetailResponse;
import org.egov.pt.models.user.UserSearchRequest;
import org.egov.pt.models.workflow.ProcessInstance;
import org.egov.pt.models.workflow.State;
import org.egov.pt.producer.Producer;
import org.egov.pt.repository.PropertyRepository;
import org.egov.pt.util.PTConstants;
import org.egov.pt.util.PropertyUtil;
import org.egov.pt.validator.PropertyValidator;
import org.egov.pt.web.contracts.PropertyRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.Sets;

@Service
public class PropertyService {

    @Autowired
    private Producer producer;

    @Autowired
    private PropertyConfiguration config;

    @Autowired
    private PropertyRepository repository;

    @Autowired
    private EnrichmentService enrichmentService;

    @Autowired
    private PropertyValidator propertyValidator;

    @Autowired
    private UserService userService;

    @Autowired
	private WorkflowService wfService;
    
    @Autowired
    private PropertyUtil util;
    
    @Autowired
    private ObjectMapper mapper;


    
	/**
	 * Enriches the Request and pushes to the Queue
	 *
	 * @param request PropertyRequest containing list of properties to be created
	 * @return List of properties successfully created
	 */
	public Property createProperty(PropertyRequest request) {

		propertyValidator.validateCreateRequest(request);
		enrichmentService.enrichCreateRequest(request);
		userService.createUser(request);
		if (config.getIsWorkflowEnabled())
			wfService.updateWorkflow(request, CREATE_PROCESS_CONSTANT);
		producer.push(config.getSavePropertyTopic(), request);
		return request.getProperty();
	}
	
	/**
	 * Updates the property
	 * 
	 * handles multiple processes 
	 * 
	 * Update
	 * 
	 * Mutation
	 *
	 * @param request PropertyRequest containing list of properties to be update
	 * @return List of updated properties
	 */
	public Property updateProperty(PropertyRequest request) {

		Property propertyFromSearch = propertyValidator.validateCommonUpdateInformation(request);
		ProcessInstance workFlow = request.getProperty().getWorkflow();
		
		boolean isRequestForOwnerMutation = workFlow != null
				&& workFlow.getBusinessService().equalsIgnoreCase(config.getMutationWfName());
		
		// ID for audit and history search 
		request.getProperty().setAuditId(UUID.randomUUID().toString());

		if (isRequestForOwnerMutation)
			processOwnerMutation(request, propertyFromSearch);
		else
			processPropertyUpdate(request, propertyFromSearch);

		return request.getProperty();
	}

	/**
	 * Method to process Property update 
	 * 
	 * @param request
	 * @param propertyFromSearch
	 */
	private void processPropertyUpdate(PropertyRequest request, Property propertyFromSearch) {
		
		propertyValidator.validateUpdateRequestForOwnerFields(request, propertyFromSearch);
		enrichmentService.enrichUpdateRequest(request, propertyFromSearch);
		
		request.getProperty().setOwners(propertyFromSearch.getOwners());
		PropertyRequest OldPropertyRequest = PropertyRequest.builder()
				.requestInfo(request.getRequestInfo())
				.property(propertyFromSearch)
				.build();
		
		util.mergeAdditionalDetails(request, propertyFromSearch);
		
		if(config.getIsUpdateWorkflowEnabled()) {
			
			State state = wfService.updateWorkflow(request, UPDATE_PROCESS_CONSTANT);
			request.getProperty().getWorkflow().setState(state);
					
			if (state.getIsStartState() == true
					&& state.getApplicationStatus().equalsIgnoreCase(Status.INWORKFLOW.toString())) {

				propertyFromSearch.setStatus(Status.INACTIVE);
				producer.push(config.getUpdatePropertyTopic(), OldPropertyRequest);
				util.saveOldUuidToRequest(request, propertyFromSearch.getId());
				producer.push(config.getSavePropertyTopic(), request);

			} else if (state.getIsTerminateState()
					&& !state.getApplicationStatus().equalsIgnoreCase(Status.ACTIVE.toString())) {

				terminateWorkflowAndReInstatePreviousRecord(request, propertyFromSearch);
			}
		}
		producer.push(config.getUpdatePropertyTopic(), request);
	}

	/**
	 * method to process owner mutation
	 * 
	 * @param request
	 * @param propertyFromSearch
	 */
	private void processOwnerMutation(PropertyRequest request, Property propertyFromSearch) {
		
		propertyValidator.validateMutation(request, propertyFromSearch);
		userService.createUser(request);
		Boolean isMutationSatrting = request.getProperty().getWorkflow().getAction().equalsIgnoreCase(
				config.getMutationOpenState());
		enrichmentService.enrichMutationRequest(request, isMutationSatrting);
		// TODO FIX ME block property changes FIXME

		util.mergeAdditionalDetails(request, propertyFromSearch);
		PropertyRequest oldPropertyRequest = PropertyRequest.builder()
				.requestInfo(request.getRequestInfo())
				.property(propertyFromSearch)
				.build();
		
		if (config.getIsMutationWorkflowEnabled()) {

			State state = wfService.updateWorkflow(request, MUTATION_PROCESS_CONSTANT);
			request.getProperty().getWorkflow().setState(state);
			/*
			 * updating property from search to INACTIVE status
			 * 
			 * to create new entry for new Mutation
			 */
			if (state.getIsStartState() == true
					&& state.getApplicationStatus().equalsIgnoreCase(Status.INWORKFLOW.toString())) {
				
				propertyFromSearch.setStatus(Status.INACTIVE);
				producer.push(config.getUpdatePropertyTopic(), oldPropertyRequest);

				util.saveOldUuidToRequest(request, propertyFromSearch.getId());
				/* save new record */
				producer.push(config.getSavePropertyTopic(), request);

			} else if (state.getIsTerminateState()
					&& !state.getApplicationStatus().equalsIgnoreCase(Status.ACTIVE.toString())) {

				terminateWorkflowAndReInstatePreviousRecord(request, propertyFromSearch);
			} else {
				/*
				 * If property is In Workflow then continue
				 */
				producer.push(config.getUpdatePropertyTopic(), request);
			}

		} else {

			/*
			 * If no workflow then update property directly with mutation information
			 */
			producer.push(config.getUpdatePropertyTopic(), request);
		}
	}

	private void terminateWorkflowAndReInstatePreviousRecord(PropertyRequest request, Property propertyFromSearch) {
		
		/* current record being rejected */
		producer.push(config.getUpdatePropertyTopic(), request);
		
		/* Previous record set to ACTIVE */
		@SuppressWarnings("unchecked")
		Map<String, Object> additionalDetails = mapper.convertValue(propertyFromSearch.getAdditionalDetails(), Map.class);
		String propertyUuId = (String) additionalDetails.get(PTConstants.PREVIOUS_PROPERTY_PREVIOUD_UUID);
		
		PropertyCriteria criteria = PropertyCriteria.builder().uuids(Sets.newHashSet(propertyUuId)).build();
		Property previousPropertyToBeReInstated = searchProperty(criteria, request.getRequestInfo()).get(0);
		previousPropertyToBeReInstated.setStatus(Status.ACTIVE);
		request.setProperty(previousPropertyToBeReInstated);
		
		producer.push(config.getUpdatePropertyTopic(), request);
	}

    /**
     * Search property with given PropertyCriteria
     *
     * @param criteria PropertyCriteria containing fields on which search is based
     * @return list of properties satisfying the containing fields in criteria
     */
	public List<Property> searchProperty(PropertyCriteria criteria, RequestInfo requestInfo) {

		List<Property> properties;
		propertyValidator.validatePropertyCriteria(criteria, requestInfo);

		if (criteria.getMobileNumber() != null || criteria.getName() != null || criteria.getOwnerIds() != null) {
			
			Boolean shouldReturnEmptyList = enrichCriteriaFromUser(criteria, requestInfo);

			if (shouldReturnEmptyList)
				return Collections.emptyList();

			properties = getPropertiesWithOwnerInfo(criteria, requestInfo);
		} else {
			properties = getPropertiesWithOwnerInfo(criteria, requestInfo);
		}

		properties.forEach(property -> {
			enrichmentService.enrichBoundary(property, requestInfo);
		});
		return properties;
	}
	
	/**
	 * 
	 * Method to enrich property search criteria with user based criteria info
	 * 
	 * If no info found based on user criteria boolean true will be returned so that empty list can be returned 
	 * 
	 * else returns false to continue the normal flow
	 * 
	 * The enrichment of object is done this way(instead of directly applying in the search query) to fetch multiple owners related to property at once
	 * 
	 * @param criteria
	 * @param requestInfo
	 * @return
	 */
	private Boolean enrichCriteriaFromUser(PropertyCriteria criteria, RequestInfo requestInfo) {
		
		Set<String> ownerIds = new HashSet<String>();
		
		if(!CollectionUtils.isEmpty(criteria.getOwnerIds()))
			ownerIds.addAll(criteria.getOwnerIds());
		criteria.setOwnerIds(null);
		
		String userTenant = criteria.getTenantId();
		if(criteria.getTenantId() == null)
			userTenant = requestInfo.getUserInfo().getTenantId();

		UserSearchRequest userSearchRequest = userService.getBaseUserSearchRequest(userTenant, requestInfo);
		userSearchRequest.setMobileNumber(criteria.getMobileNumber());
		userSearchRequest.setName(criteria.getName());
		userSearchRequest.setUuid(criteria.getOwnerIds());

		UserDetailResponse userDetailResponse = userService.getUser(userSearchRequest);
		if (CollectionUtils.isEmpty(userDetailResponse.getUser()))
			return true;

		// fetching property id from owner table and enriching criteria
		ownerIds.addAll(userDetailResponse.getUser().stream().map(User::getUuid).collect(Collectors.toSet()));
		List<String> propertyIds = repository.getPropertyIds(ownerIds);

		// returning empty list if no property id found for user criteria
		if (CollectionUtils.isEmpty(propertyIds)) {

			return true;
		} else if (!CollectionUtils.isEmpty(criteria.getPropertyIds())) {

			// eliminating property Ids not matching with Ids found using user data

			Set<String> givenIds = criteria.getPropertyIds();

			givenIds.forEach(id -> {

				if (!propertyIds.contains(id))
					givenIds.remove(id);
			});

			if (CollectionUtils.isEmpty(givenIds))
				return true;
		} else {

			criteria.setPropertyIds(Sets.newHashSet(propertyIds));
		}

		return false;
	}

	/**
	 * Returns list of properties based on the given propertyCriteria with owner
	 * fields populated from user service
	 *
	 * @param criteria    PropertyCriteria on which to search properties
	 * @param requestInfo RequestInfo object of the request
	 * @return properties with owner information added from user service
	 */
	List<Property> getPropertiesWithOwnerInfo(PropertyCriteria criteria, RequestInfo requestInfo) {

		List<Property> properties = repository.getProperties(criteria);
		if (CollectionUtils.isEmpty(properties))
			return Collections.emptyList();

		Set<String> ownerIds = properties.stream().map(Property::getOwners).flatMap(List::stream)
				.map(OwnerInfo::getUuid).collect(Collectors.toSet());

		UserSearchRequest userSearchRequest = userService.getBaseUserSearchRequest(criteria.getTenantId(), requestInfo);
		userSearchRequest.setUuid(ownerIds);

		UserDetailResponse userDetailResponse = userService.getUser(userSearchRequest);
		enrichmentService.enrichOwner(userDetailResponse, properties);
		return properties;
	}

}