package org.egov.fsm.calculator.validator;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
import org.egov.fsm.calculator.config.BillingSlabConfig;
import org.egov.fsm.calculator.repository.BillingSlabRepository;
import org.egov.fsm.calculator.repository.querybuilder.BillingSlabQueryBuilder;
import org.egov.fsm.calculator.utils.BillingSlabUtil;
import org.egov.fsm.calculator.utils.CalculatorConstants;
import org.egov.fsm.calculator.web.models.BillingSlab;
import org.egov.fsm.calculator.web.models.BillingSlab.SlumEnum;
import org.egov.fsm.calculator.web.models.BillingSlabRequest;
import org.egov.fsm.calculator.web.models.BillingSlabSearchCriteria;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class BillingSlabValidator {

	@Autowired
	private BillingSlabQueryBuilder queryBuilder;

	@Autowired
	private BillingSlabRepository repository;

	@Autowired
	private BillingSlabUtil util;

	@Autowired
	private MDMSValidator mdmsValidator;
	

	@Autowired
	private BillingSlabConfig config;

	public void validateCreate(BillingSlabRequest request) {
		validateInputs(request);
		List<Object> preparedStmtList = new ArrayList<>();
		String query = queryBuilder.getBillingSlabCombinationCountQuery(
				request.getBillingSlab().getTenantId(),
				request.getBillingSlab().getCapacityFrom(),
				request.getBillingSlab().getCapacityTo(), request.getBillingSlab().getPropertyType(),
				request.getBillingSlab().getSlum().toString(), preparedStmtList);
		
		BillingSlabSearchCriteria searchCriteria = BillingSlabSearchCriteria.builder().propertyType( request.getBillingSlab().getPropertyType()).tenantId(request.getBillingSlab().getTenantId()).capacity(request.getBillingSlab().getCapacityFrom().doubleValue()).slum(SlumEnum.valueOf(request.getBillingSlab().getSlum().toString())).build();
		List<BillingSlab> billingSlabs= repository.getBillingSlabData(searchCriteria);
		if (!CollectionUtils.isEmpty(billingSlabs) ) {
			throw new CustomException(CalculatorConstants.INVALID_BILLING_SLAB_ERROR,
					"Billing Slab already exits with the given combination of capacityType, capacityFrom, propertyType and slum");
		}else {
			searchCriteria.setCapacity(request.getBillingSlab().getCapacityTo().doubleValue());
			billingSlabs= repository.getBillingSlabData(searchCriteria);
			if (!CollectionUtils.isEmpty(billingSlabs) ) {
				throw new CustomException(CalculatorConstants.INVALID_BILLING_SLAB_ERROR,
						"Billing Slab already exits with the given combination of capacityType, capacityFrom, propertyType and slum");
			}
		}
	}

	public void validateUpdate(BillingSlabRequest request) {
		if (StringUtils.isEmpty(request.getBillingSlab().getId())) {
			throw new CustomException(CalculatorConstants.INVALID_BILLING_SLAB_ERROR, "id is mandatory");
		}
		
		validateInputs(request);
		List<Object> preparedStmtList = new ArrayList<>();
		String queryForBillingSlab = queryBuilder.getBillingSlabExistQuery(request.getBillingSlab().getId(), preparedStmtList);
		int count = repository.getDataCount(queryForBillingSlab, preparedStmtList);
		if (count <= 0) {
			throw new CustomException(CalculatorConstants.INVALID_BILLING_SLAB_ERROR, "Billing Slab not found");
		}

		preparedStmtList = new ArrayList<>();
		String query = queryBuilder.getBillingSlabCombinationCountForUpdateQuery(
				request.getBillingSlab().getTenantId(),
				request.getBillingSlab().getCapacityFrom(), request.getBillingSlab().getCapacityTo(),
				request.getBillingSlab().getPropertyType(), request.getBillingSlab().getSlum().toString(),
				request.getBillingSlab().getId(), preparedStmtList);
		
		int combinationCount = repository.getDataCount(query, preparedStmtList);
		if (combinationCount >= 1) {
			throw new CustomException(CalculatorConstants.INVALID_BILLING_SLAB_ERROR,
					"Billing Slab already exits with the given combination of capacityType, capacityFrom, propertyType and slum");
		}
	}

	public void validateInputs(BillingSlabRequest request) {
		
		if (StringUtils.isEmpty(request.getBillingSlab().getTenantId())) {
			throw new CustomException(CalculatorConstants.INVALID_BILLING_SLAB_ERROR, "TenantId is mandatory");
		}

		if (request.getBillingSlab().getCapacityFrom() == null) {
			throw new CustomException(CalculatorConstants.INVALID_BILLING_SLAB_ERROR, "CapacityFrom is mandatory");
		}

		if (request.getBillingSlab().getCapacityTo() == null) {
			throw new CustomException(CalculatorConstants.INVALID_BILLING_SLAB_ERROR, "CapacityTo is mandatory");
		}

		if (StringUtils.isEmpty(request.getBillingSlab().getPropertyType())) {
			throw new CustomException(CalculatorConstants.INVALID_BILLING_SLAB_ERROR, "PropertyType is mandatory");
		}

		if (request.getBillingSlab().getPrice() == null || request.getBillingSlab().getPrice().compareTo(BigDecimal.ZERO) <0) {
			throw new CustomException(CalculatorConstants.INVALID_BILLING_SLAB_ERROR, "Price is mandatory, should be greater than zero");
		}

		if (request.getBillingSlab().getSlum() ==null || StringUtils.isEmpty(request.getBillingSlab().getSlum().toString())) {
			throw new CustomException(CalculatorConstants.INVALID_BILLING_SLAB_ERROR, "Slum is mandatory");
		}

		if (request.getBillingSlab().getCapacityFrom().compareTo(request.getBillingSlab().getCapacityTo()) >= 0) {
			throw new CustomException(CalculatorConstants.INVALID_BILLING_SLAB_ERROR,
					"CapacityTo cannot be less than capacityFrom");
		}
		String tenantId = request.getBillingSlab().getTenantId().split("\\.")[0];
		Object mdmsData = util.mDMSCall(request.getRequestInfo(), tenantId);
		mdmsValidator.validateMdmsData(mdmsData);
		mdmsValidator.validatePropertyType(request.getBillingSlab().getPropertyType());
	}
	
	
	
	/**
	 * Validates if the search parameters are valid
	 * 
	 * @param requestInfo
	 *            The requestInfo of the incoming request
	 * @param criteria
	 *            The FSMSearch Criteria
	 */
	public void validateSearch(RequestInfo requestInfo, BillingSlabSearchCriteria criteria) {
		
		if (requestInfo.getUserInfo().getType().equalsIgnoreCase(CalculatorConstants.EMPLOYEE) && criteria.getTenantId().split("\\.").length == 1) {
			throw new CustomException(CalculatorConstants.EMPLOYEE_INVALID_SEARCH, "Employee cannot search at state level");
		}
		if (!requestInfo.getUserInfo().getType().equalsIgnoreCase(CalculatorConstants.CITIZEN) && criteria.isEmpty())
			throw new CustomException(CalculatorConstants.INVALID_SEARCH, "Search without any paramters is not allowed");

		if (!requestInfo.getUserInfo().getType().equalsIgnoreCase(CalculatorConstants.CITIZEN) && !criteria.tenantIdOnly()
				&& criteria.getTenantId() == null)
			throw new CustomException(CalculatorConstants.INVALID_SEARCH, "TenantId is mandatory in search");

		if (requestInfo.getUserInfo().getType().equalsIgnoreCase(CalculatorConstants.CITIZEN) && !criteria.isEmpty()
				&& !criteria.tenantIdOnly() && criteria.getTenantId() == null) 
			throw new CustomException(CalculatorConstants.INVALID_SEARCH, "TenantId is mandatory in search");
		if(criteria.getTenantId() == null)
			throw new CustomException(CalculatorConstants.INVALID_SEARCH, "TenantId is mandatory in search");
			
		String allowedParamStr = null;

		if (requestInfo.getUserInfo().getType().equalsIgnoreCase(CalculatorConstants.CITIZEN))
			allowedParamStr = config.getAllowedCitizenSearchParameters();
		else if (requestInfo.getUserInfo().getType().equalsIgnoreCase(CalculatorConstants.EMPLOYEE))
			allowedParamStr = config.getAllowedEmployeeSearchParameters();
		else
			throw new CustomException(CalculatorConstants.INVALID_SEARCH,
					"The userType: " + requestInfo.getUserInfo().getType() + " does not have any search config");

		if (StringUtils.isEmpty(allowedParamStr) && !criteria.isEmpty())
			throw new CustomException(CalculatorConstants.INVALID_SEARCH, "No search parameters are expected");
		else {
			List<String> allowedParams = Arrays.asList(allowedParamStr.split(","));
			validateSearchParams(criteria, allowedParams);
		}
	}

	/**
	 * Validates if the paramters coming in search are allowed
	 * 
	 * @param criteria
	 *            fsm search criteria
	 * @param allowedParams
	 *            Allowed Params for search
	 */
	private void validateSearchParams(BillingSlabSearchCriteria criteria, List<String> allowedParams) {

		if (criteria.getCapacity() !=null && !allowedParams.contains("capacity")) {
			throw new CustomException(CalculatorConstants.INVALID_SEARCH, "Search on capacity is not allowed");
		}
		if ( criteria.getSlum() !=null && !StringUtils.isEmpty(criteria.getSlum().toString()) && !allowedParams.contains("slum")) {
			throw new CustomException(CalculatorConstants.INVALID_SEARCH, "Search on slum is not allowed");
		}
		if ( !CollectionUtils.isEmpty(criteria.getIds()) && !allowedParams.contains("ids")) {
			throw new CustomException(CalculatorConstants.INVALID_SEARCH, "Search on id is not allowed");
		}
			
	}

}
