package org.egov.access.domain.service;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.egov.access.domain.criteria.ActionSearchCriteria;
import org.egov.access.domain.criteria.ValidateActionCriteria;
import org.egov.access.domain.model.Action;
import org.egov.access.domain.model.ActionContainer;
import org.egov.access.domain.model.ActionValidation;
import org.egov.access.domain.model.authorize.AuthorizationRequest;
import org.egov.access.domain.model.authorize.Role;
import org.egov.access.persistence.repository.ActionRepository;
import org.egov.access.persistence.repository.BaseRepository;
import org.egov.access.persistence.repository.MdmsRepository;
import org.egov.access.persistence.repository.querybuilder.ActionFinderQueryBuilder;
import org.egov.access.persistence.repository.querybuilder.ValidateActionQueryBuilder;
import org.egov.access.persistence.repository.rowmapper.ActionRowMapper;
import org.egov.access.persistence.repository.rowmapper.ActionValidationRowMapper;
import org.egov.access.util.AccessControlConstants;
import org.egov.access.util.Utils;
import org.egov.access.web.contract.action.ActionRequest;
import org.egov.access.web.contract.action.Module;
import org.egov.common.utils.MultiStateInstanceUtil;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ActionService {

	private BaseRepository repository;

	private ActionRepository actionRepository;

	private MdmsRepository mdmsRepository;
	
	@Autowired
	private MultiStateInstanceUtil multiStateInstanceUtil;

	@Autowired
	public ActionService(BaseRepository repository, ActionRepository actionRepository, MdmsRepository mdmsRepository) {
		this.repository = repository;
		this.actionRepository = actionRepository;
		this.mdmsRepository = mdmsRepository;
	}

	public List<Action> getActions(ActionSearchCriteria actionSearchCriteria) {
		ActionFinderQueryBuilder queryBuilder = new ActionFinderQueryBuilder(actionSearchCriteria);
		return (List<Action>) (List<?>) repository.run(queryBuilder, new ActionRowMapper());
	}

	public ActionValidation validate(ValidateActionCriteria criteria) {
		ValidateActionQueryBuilder queryBuilder = new ValidateActionQueryBuilder(criteria);
		return (ActionValidation) repository.run(queryBuilder, new ActionValidationRowMapper()).get(0);
	}

	public List<Action> createAction(ActionRequest actionRequest) {

		return actionRepository.createAction(actionRequest);
	}

	public List<Action> updateAction(ActionRequest actionRequest) {

		return actionRepository.updateAction(actionRequest);
	}

	public boolean checkActionNameExit(String name) {

		return actionRepository.checkActionNameExit(name);
	}

	public boolean checkCombinationOfUrlAndqueryparamsExist(String url, String queryParams) {

		return actionRepository.checkCombinationOfUrlAndqueryparamsExist(url, queryParams);
	}

	public List<Module> getAllActionsBasedOnRoles(final ActionRequest actionRequest) {

		return actionRepository.getAllActionsBasedOnRoles(actionRequest).getModules();

	}

	public List<Action> getAllActions(final ActionRequest actionRequest) {

		return actionRepository.getAllActions(actionRequest);

	}
	public List<Action> getAllMDMSActions(final ActionRequest actionRequest) throws JSONException, UnsupportedEncodingException{

		return actionRepository.getAllMDMSActions(actionRequest);
	}
	
	/**
	 * Authorize the request
	 *
	 * @param authorizeRequest URI and role to be authorized
	 * @return true when authorized, false when unauthorized
	 */
	public boolean isAuthorized(AuthorizationRequest authorizeRequest){

		String inputTenantId = authorizeRequest.getTenantIds().iterator().next();
		List<String> roles = authorizeRequest.getRoles().stream().map(Role::getCode).collect(Collectors.toList());
		List<String> listOfMdmsTenantIdsToCheck = new ArrayList<>(fetchListOfTenantIdsForAuthorizationCheck(inputTenantId, roles));
		Collections.sort(listOfMdmsTenantIdsToCheck, Collections.reverseOrder(Comparator.comparing(String::length)));

		boolean isAuthorized = false;

		for(String tenantId : listOfMdmsTenantIdsToCheck) {
			if(isAuthorizedOnGivenTenantLevel(authorizeRequest, tenantId)){
				isAuthorized = true;
				break;
			}
		}

		return isAuthorized;
	}

	private Set<String> fetchListOfTenantIdsForAuthorizationCheck(String tenantId, List<String> roles){
		
		Set<String> listOfMdmsTenantIdsToCheck = new LinkedHashSet<>();
		
		/*
		 *  Adding city specific tenant Id
		 *  
		 *  Then state Level tenant-id based on index from central instance configs
		 *  
		 *  Then index 0 for national level in case of central server deployment
		 */
		listOfMdmsTenantIdsToCheck.add(tenantId);
		listOfMdmsTenantIdsToCheck.add(multiStateInstanceUtil.getStateLevelTenant(tenantId));
		if (multiStateInstanceUtil.getIsEnvironmentCentralInstance()
				&& roles.contains(AccessControlConstants.CITIZNE_ROLE_CODE))
			listOfMdmsTenantIdsToCheck.add(tenantId.split("\\.")[0]);

		log.info("The list of tenants for auth" + listOfMdmsTenantIdsToCheck);

		return listOfMdmsTenantIdsToCheck;
	}

	private boolean isAuthorizedOnGivenTenantLevel(AuthorizationRequest authorizeRequest, String tenantId){

		Map<String, ActionContainer>  roleActions = mdmsRepository.fetchRoleActionData(tenantId);

		String uriToBeAuthorized = authorizeRequest.getUri();
		Set<String> applicableRoles = getApplicableRoles(authorizeRequest);
		Set<String> uris = new HashSet<>();
		List<String> regexUris = new ArrayList<>();

		for(String roleCode : applicableRoles){
			if(roleActions.containsKey(roleCode))
				uris.addAll(roleActions.get(roleCode).getUris());

			if(roleActions.containsKey(roleCode))
				regexUris.addAll(roleActions.get(roleCode).getRegexUris());
		}

		boolean isAuthorized = uris.contains(uriToBeAuthorized) || containsRegexUri(regexUris, uriToBeAuthorized);

		//log.info("Request tenant ids:  " + authorizeRequest.getTenantIds());
		log.info("Role {} has access to requested URI {} : {}", applicableRoles, uriToBeAuthorized,
				isAuthorized);

		return isAuthorized;
	}

	private Set<String> getApplicableRoles(AuthorizationRequest authorizationRequest){
		
		Set<String> requestTenantIds = authorizationRequest.getTenantIds();
		String tenantId = requestTenantIds.iterator().next();
		String centralInstanceLevelTenantId = getCentralInstanceLevelTenant(tenantId);
		String stateLevelTenantId = multiStateInstanceUtil.getStateLevelTenant(tenantId);

		Set<Role> roles = authorizationRequest.getRoles();
		Set<Role> applicableRoles = new HashSet<>();

		for(Role role : roles){
			if(requestTenantIds.contains(role.getTenantId()) || role.getTenantId().equalsIgnoreCase(stateLevelTenantId)){
				applicableRoles.add(role);
			}
			if(!ObjectUtils.isEmpty(stateLevelTenantId) && role.getTenantId().equalsIgnoreCase(centralInstanceLevelTenantId)){
				applicableRoles.add(role);
			}
		}

		return applicableRoles.stream().map(Role::getCode).collect(Collectors.toSet());
	}

	private boolean containsRegexUri(List<String> actionUris, String requestUri){
		for(String actionUri : actionUris){
			if(Utils.isRegexUriMatch(actionUri, requestUri))
				return true;
		}
		return false;
	}

	private String getCentralInstanceLevelTenant(String tenantId){
		return tenantId.split("\\.")[0];
	}
}
