package org.egov.demand.web.validator;

import static org.egov.demand.util.Constants.BUSINESSSERVICE_NOT_FOUND_KEY;
import static org.egov.demand.util.Constants.BUSINESSSERVICE_NOT_FOUND_MSG;
import static org.egov.demand.util.Constants.BUSINESSSERVICE_NOT_FOUND_REPLACETEXT;
import static org.egov.demand.util.Constants.BUSINESSSERVICE_PATH_CODE;
import static org.egov.demand.util.Constants.CONSUMER_CODE_DUPLICATE_CONSUMERCODE_TEXT;
import static org.egov.demand.util.Constants.CONSUMER_CODE_DUPLICATE_KEY;
import static org.egov.demand.util.Constants.CONSUMER_CODE_DUPLICATE_MSG;
import static org.egov.demand.util.Constants.DEMAND_DETAIL_NOT_FOUND_KEY;
import static org.egov.demand.util.Constants.DEMAND_DETAIL_NOT_FOUND_MSG;
import static org.egov.demand.util.Constants.DEMAND_DETAIL_NOT_FOUND_REPLACETEXT;
import static org.egov.demand.util.Constants.DEMAND_NOT_FOUND_KEY;
import static org.egov.demand.util.Constants.DEMAND_NOT_FOUND_MSG;
import static org.egov.demand.util.Constants.DEMAND_NOT_FOUND_REPLACETEXT;
import static org.egov.demand.util.Constants.DEMAND_WITH_NO_ID_KEY;
import static org.egov.demand.util.Constants.DEMAND_WITH_NO_ID_MSG;
import static org.egov.demand.util.Constants.EMPLOYEE_UUID_FOUND_KEY;
import static org.egov.demand.util.Constants.EMPLOYEE_UUID_FOUND_MSG;
import static org.egov.demand.util.Constants.INVALID_BUSINESS_FOR_TAXPERIOD_KEY;
import static org.egov.demand.util.Constants.INVALID_BUSINESS_FOR_TAXPERIOD_MSG;
import static org.egov.demand.util.Constants.INVALID_BUSINESS_FOR_TAXPERIOD_REPLACE_TEXT;
import static org.egov.demand.util.Constants.INVALID_DEMAND_DETAIL_COLLECTION_TEXT;
import static org.egov.demand.util.Constants.INVALID_DEMAND_DETAIL_ERROR_MSG;
import static org.egov.demand.util.Constants.INVALID_NEGATIVE_DEMAND_DETAIL_ERROR_MSG;
import static org.egov.demand.util.Constants.INVALID_DEMAND_DETAIL_KEY;
import static org.egov.demand.util.Constants.INVALID_DEMAND_DETAIL_MSG;
import static org.egov.demand.util.Constants.INVALID_DEMAND_DETAIL_REPLACETEXT;
import static org.egov.demand.util.Constants.INVALID_DEMAND_DETAIL_TAX_TEXT;
import static org.egov.demand.util.Constants.TAXHEADMASTER_PATH_CODE;
import static org.egov.demand.util.Constants.TAXHEADS_NOT_FOUND_KEY;
import static org.egov.demand.util.Constants.TAXHEADS_NOT_FOUND_MSG;
import static org.egov.demand.util.Constants.TAXHEADS_NOT_FOUND_REPLACETEXT;
import static org.egov.demand.util.Constants.TAXPERIOD_NOT_FOUND_FROMDATE;
import static org.egov.demand.util.Constants.TAXPERIOD_NOT_FOUND_KEY;
import static org.egov.demand.util.Constants.TAXPERIOD_NOT_FOUND_MSG;
import static org.egov.demand.util.Constants.TAXPERIOD_NOT_FOUND_TODATE;
import static org.egov.demand.util.Constants.TAXPERIOD_PATH_CODE;
import static org.egov.demand.util.Constants.USER_UUID_NOT_FOUND_KEY;
import static org.egov.demand.util.Constants.USER_UUID_NOT_FOUND_MSG;
import static org.egov.demand.util.Constants.USER_UUID_NOT_FOUND_REPLACETEXT;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.demand.config.ApplicationProperties;
import org.egov.demand.model.Demand;
import org.egov.demand.model.Demand.StatusEnum;
import org.egov.demand.model.DemandCriteria;
import org.egov.demand.model.DemandDetail;
import org.egov.demand.model.TaxHeadMaster;
import org.egov.demand.model.TaxPeriod;
import org.egov.demand.repository.DemandRepository;
import org.egov.demand.repository.ServiceRequestRepository;
import org.egov.demand.service.UserService;
import org.egov.demand.util.Util;
import org.egov.demand.web.contract.DemandRequest;
import org.egov.demand.web.contract.User;
import org.egov.demand.web.contract.UserResponse;
import org.egov.demand.web.contract.UserSearchRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.DocumentContext;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class DemandValidatorV1 {

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;
	
	@Autowired
	private ObjectMapper mapper;
	
	@Autowired
	UserService userService;
	
	@Autowired
	private DemandRepository demandRepository;
	
	@Autowired
	private ApplicationProperties applicationProperties;
	
	@Autowired
	private Util util;
	
	/**
	 * Method to validate new demand request
	 * 
	 * @param demandRequest 
	 */
	public void validatedemandForCreate(DemandRequest demandRequest, Boolean isCreate, DocumentContext mdmsData) {

		RequestInfo requestInfo = demandRequest.getRequestInfo();
		List<Demand> demands = demandRequest.getDemands();

		/*
		 * Extracting the respective masters from DocumentContext 
		 */
		List<String> businessServiceCodes = mdmsData.read(BUSINESSSERVICE_PATH_CODE);
		List<TaxHeadMaster> taxHeads = Arrays.asList(mapper.convertValue(mdmsData.read(TAXHEADMASTER_PATH_CODE), TaxHeadMaster[].class));
		
		/*
		 * grouping by the list of taxHeads to a map of businessService and List of taxHead codes
		 */
		Map<String, Map<String,TaxHeadMaster>> businessTaxCodeMap = taxHeads.stream().collect(Collectors.groupingBy(
				TaxHeadMaster::getService, Collectors.toMap(TaxHeadMaster::getCode, Function.identity())));
		
		/*
		 * mdms-data read returns a list of hashMap which is converted to array of tax-period and then to list
		 */
		List<TaxPeriod> taxPeriods = Arrays.asList(mapper.convertValue(mdmsData.read(TAXPERIOD_PATH_CODE), TaxPeriod[].class));

		/*
		 * Grouping by the list periods on business services
		 */
		Map<String, List<TaxPeriod>> taxPeriodBusinessMap = taxPeriods.stream()
				.collect(Collectors.groupingBy(TaxPeriod::getService));
		Set<String> payerIds = new HashSet<>();
		
		/* demand details list for validation */
		List<DemandDetail> detailsForValidation = new ArrayList<>();
		
		/* business consumer map for validating uniqueness of consumer code */
		Map<String, Set<String>> businessConsumerValidatorMap = new HashMap<>();
		
		Set<String> businessServicesWithNoTaxPeriods = new HashSet<>();
		Set<String> businessServicesNotFound = new HashSet<>();
		Set<String> taxHeadsNotFound = new HashSet<>();

		Map<String, String> errorMap = new HashMap<>();

		for (Demand demand : demands) {

			List<DemandDetail> details = demand.getDemandDetails();
			Map<String, TaxHeadMaster> taxHeadMap = businessTaxCodeMap.get(demand.getBusinessService());
			log.info(" the taxhead map : " + taxHeadMap);
			detailsForValidation.addAll(details);

			if (isCreate) {
				/* passing the businessConsumerValidator map to be enriched for validation */
				enrichConsumerCodesWithBusinessMap(businessConsumerValidatorMap, demand);
			}

			if (null != demand.getPayer() && !StringUtils.isEmpty(demand.getPayer().getUuid()))
				payerIds.add(demand.getPayer().getUuid());

			if (!businessServiceCodes.contains(demand.getBusinessService()))
				businessServicesNotFound.add(demand.getBusinessService());

			if (!CollectionUtils.isEmpty(taxHeadMap))
				details.forEach(detail -> {

					if (!taxHeadMap.containsKey(detail.getTaxHeadMasterCode()))
						taxHeadsNotFound.add(detail.getTaxHeadMasterCode());
				});

			validateTaxPeriod(taxPeriodBusinessMap, demand, errorMap, businessServicesWithNoTaxPeriods);
			
			// by default demands are being set to active during create but validation should be done for inactive/ cancelled demand in another logic
			if(demand.getStatus() == null) demand.setStatus(StatusEnum.ACTIVE);
		}

		/*
		 * Validating payer(Citizen) data
		 */
		validatePayer(demands, payerIds, requestInfo, errorMap);
		/*
		 * Validating demand details for tax and collection amount
		 * 
		 * if called from update no need to call detail validation 
		 */
		validateDemandDetailsForAmount(detailsForValidation, errorMap);
		
		if (isCreate) {
			/* validating consumer codes for create demands*/
			validateConsumerCodes(demands, businessConsumerValidatorMap, errorMap);
		}
			
		/* passing collected values to throw errors
		 * 
		 * method separated to increase readability
		 * */
		throwErrorForCreate(businessServicesWithNoTaxPeriods, businessServicesNotFound, taxHeadsNotFound, errorMap);
	}

	/**
	 * Private method to throw errors for create validation
	 * 
	 * @param businessServicesWithNoTaxPeriods
	 * @param businessServicesNotFound
	 * @param taxHeadsNotFound
	 * @param errorMap
	 */
	private void throwErrorForCreate(Set<String> businessServicesWithNoTaxPeriods,
			Set<String> businessServicesNotFound, Set<String> taxHeadsNotFound, Map<String, String> errorMap) {

		if (!CollectionUtils.isEmpty(taxHeadsNotFound))
			errorMap.put(TAXHEADS_NOT_FOUND_KEY,
					TAXHEADS_NOT_FOUND_MSG.replace(TAXHEADS_NOT_FOUND_REPLACETEXT, taxHeadsNotFound.toString()));

		if (!CollectionUtils.isEmpty(businessServicesNotFound))
			errorMap.put(BUSINESSSERVICE_NOT_FOUND_KEY, BUSINESSSERVICE_NOT_FOUND_MSG
					.replace(BUSINESSSERVICE_NOT_FOUND_REPLACETEXT, businessServicesNotFound.toString()));

		if (!CollectionUtils.isEmpty(businessServicesWithNoTaxPeriods))
			errorMap.put(INVALID_BUSINESS_FOR_TAXPERIOD_KEY, INVALID_BUSINESS_FOR_TAXPERIOD_MSG
					.replace(INVALID_BUSINESS_FOR_TAXPERIOD_REPLACE_TEXT, businessServicesWithNoTaxPeriods.toString()));

		if (!CollectionUtils.isEmpty(errorMap))
			throw new CustomException(errorMap);
	}

	/**
	 * Method to validate the tax period of the demand
	 * 
	 * @param taxPeriodBusinessMap
	 * @param demand
	 * @param errorMap
	 * @param businessServicesWithNoTaxPeriods
	 */
	private void validateTaxPeriod(Map<String, List<TaxPeriod>> taxPeriodBusinessMap, Demand demand,
			Map<String, String> errorMap, Set<String> businessServicesWithNoTaxPeriods) {
		
		/*
		 * Getting the list of tax periods belonging to the current business service
		 */
		List<TaxPeriod> taxPeriods = taxPeriodBusinessMap.get(demand.getBusinessService());


		if (taxPeriods != null) {

			/*
			 * looping the list of business services to check if the given demand periods gets match
			 */
			TaxPeriod taxPeriod = taxPeriods.stream()
					.filter(t -> demand.getTaxPeriodFrom().compareTo(t.getFromDate()) >= 0
							&& demand.getTaxPeriodTo().compareTo(t.getToDate()) <= 0)
					.findAny().orElse(null);

			if (taxPeriod == null) {

				String msg = TAXPERIOD_NOT_FOUND_MSG
						.replace(TAXPERIOD_NOT_FOUND_FROMDATE, demand.getTaxPeriodFrom().toString())
						.replace(TAXPERIOD_NOT_FOUND_TODATE, demand.getTaxPeriodTo().toString());
				errorMap.put(TAXPERIOD_NOT_FOUND_KEY, msg);
			}

		} else {
			/*
			 * Adding business service name to the set "businessServicesWithNoTaxPeriods"
			 */
			businessServicesWithNoTaxPeriods.add(demand.getBusinessService());
		}

	}

	/**
	 * Method to enrich the businessConsumerMap which will be passed to consumer code validator
	 * 
	 * @param businessConsumerValidatorMap
	 * @param demand
	 */
	private void enrichConsumerCodesWithBusinessMap(Map<String, Set<String>> businessConsumerValidatorMap,
			Demand demand) {

		Set<String> consumerCodes = businessConsumerValidatorMap.get(demand.getBusinessService());
		if (consumerCodes != null)
			consumerCodes.add(demand.getConsumerCode());
		else {
			consumerCodes = new HashSet<>();
			consumerCodes.add(demand.getConsumerCode());
			businessConsumerValidatorMap.put(demand.getBusinessService(), consumerCodes);
		}
	}
	
	/**
	 * Method to validate the Consumer codes in demand request for period and business Code
	 * 
	 * @param demands list of demand to be validated
	 * @param errorMap map with error key and msg
	 */
	private void validateConsumerCodes(List<Demand> demands, Map<String, Set<String>> businessConsumerValidatorMap,
			Map<String, String> errorMap) {

		String tenantId = demands.get(0).getTenantId();
		List<String> errors = new ArrayList<>();

		/*
		 * Collecting the demands from DB for the consumer codes in to a map 
		 */
		List<Demand> dbDemands = demandRepository.getDemandsForConsumerCodes(businessConsumerValidatorMap, tenantId);
		Map<String, List<Demand>> dbDemandMap = dbDemands.stream()
				.collect(Collectors.groupingBy(Demand::getConsumerCode, Collectors.toList()));

		if (!dbDemandMap.isEmpty()) {
			for (Demand demand : demands) {

				List<Demand> demandsWithSamekey = dbDemandMap.get(demand.getConsumerCode());
				if (CollectionUtils.isEmpty(demandsWithSamekey))
					continue;

				for (Demand demandFromMap : demandsWithSamekey) {
					if (demand.getTaxPeriodFrom().equals(demandFromMap.getTaxPeriodFrom())
							&& demand.getTaxPeriodTo().equals(demandFromMap.getTaxPeriodTo()))
						errors.add(demand.getConsumerCode());
				}
			}
		}
		
		if(!CollectionUtils.isEmpty(errors))
			errorMap.put(CONSUMER_CODE_DUPLICATE_KEY,
					CONSUMER_CODE_DUPLICATE_MSG.replace(CONSUMER_CODE_DUPLICATE_CONSUMERCODE_TEXT, errors.toString()));
	}
	
    /**
     * Method to validate payer(user/citizen) data in demand
     * 
     * @param payerIds
     * @param requestInfo
     * @param errorMap
     */
	private void validatePayer(List<Demand> demands, Set<String> payerIds, RequestInfo requestInfo, Map<String, String> errorMap) {

		List<User> owners = null;
		Set<String> missingIds = new HashSet<>();
		Set<String> employeeIds = new HashSet<>();
		Map<String, User> ownerMap = new HashMap<>();
		
		if (!CollectionUtils.isEmpty(payerIds)) {
			
			String url = applicationProperties.getUserServiceHostName().concat(applicationProperties.getUserServiceSearchPath());

			UserSearchRequest userSearchRequest = UserSearchRequest.builder().requestInfo(requestInfo).uuid(payerIds)
					.pageSize(500).build();

			owners = mapper
					.convertValue(serviceRequestRepository.fetchResult(url, userSearchRequest), UserResponse.class)
					.getUser();

			if (CollectionUtils.isEmpty(owners))
				errorMap.put(USER_UUID_NOT_FOUND_KEY,
						USER_UUID_NOT_FOUND_MSG.replace(USER_UUID_NOT_FOUND_REPLACETEXT, payerIds.toString()));

			ownerMap.putAll(owners.stream().collect(Collectors.toMap(User::getUuid, Function.identity())));
		}
		
		
		/*
		 * Adding the missing ids to the list to be added to error map
		 */
		for (Demand demand : demands) {

			User payerFromDemand = demand.getPayer();
			
			if (null != payerFromDemand && null != payerFromDemand.getUuid()) {

				String uuid = demand.getPayer().getUuid();
				User payer = ownerMap.get(uuid);

				if (payer == null)
					missingIds.add(uuid);
				else if ("EMPLOYEE".equalsIgnoreCase(payer.getType()))
					employeeIds.add(uuid);
				else
					demand.setPayer(payer);

			} else if (null != payerFromDemand
					&& (null != payerFromDemand.getMobileNumber() && null != payerFromDemand.getName())
					&& applicationProperties.getIsUserCreateEnabled()) {
				getuserFromNameAndNumber(demand, requestInfo);
			}
		}

		if (!CollectionUtils.isEmpty(employeeIds))
			errorMap.put(EMPLOYEE_UUID_FOUND_KEY,
					EMPLOYEE_UUID_FOUND_MSG.replace(USER_UUID_NOT_FOUND_REPLACETEXT, employeeIds.toString()));

		if (!CollectionUtils.isEmpty(missingIds))
			errorMap.put(USER_UUID_NOT_FOUND_KEY,
					USER_UUID_NOT_FOUND_MSG.replace(USER_UUID_NOT_FOUND_REPLACETEXT, missingIds.toString()));
		
	}

	/**
	 * Method to validate demand details based on tax and collection amount
	 * 
	 * @param demandDetails
	 * @param errorMap
	 */
	public void validateDemandDetailsForAmount(List<DemandDetail> demandDetails, Map<String, String> errorMap) {

		List<String> errors = new ArrayList<>();

		for (DemandDetail demandDetail : demandDetails) {

			BigDecimal tax = demandDetail.getTaxAmount();
			BigDecimal collection = demandDetail.getCollectionAmount();
			
			Boolean isTaxGtZeroAndCollectionGtTaxOrCollectionLtZero = tax.compareTo(BigDecimal.ZERO) >= 0
					&& (tax.compareTo(collection) < 0 || collection.compareTo(BigDecimal.ZERO) < 0);
			
			Boolean isTaxLtZeroAndCollectionNeToZeroAndCollectionGtTax = tax.compareTo(BigDecimal.ZERO) < 0
					&& collection.compareTo(tax) != 0 && collection.compareTo(BigDecimal.ZERO) != 0;
			
			if (isTaxGtZeroAndCollectionGtTaxOrCollectionLtZero) {
				errors.add(INVALID_DEMAND_DETAIL_ERROR_MSG
						.replace(INVALID_DEMAND_DETAIL_COLLECTION_TEXT, collection.toString())
						.replace(INVALID_DEMAND_DETAIL_TAX_TEXT, tax.toString()));
			}
			else if (isTaxLtZeroAndCollectionNeToZeroAndCollectionGtTax) {

					errors.add(INVALID_NEGATIVE_DEMAND_DETAIL_ERROR_MSG
							.replace(INVALID_DEMAND_DETAIL_COLLECTION_TEXT, collection.toString())
							.replace(INVALID_DEMAND_DETAIL_TAX_TEXT, tax.toString()));
				
			}
		}
		if (!CollectionUtils.isEmpty(errors))
			errorMap.put(INVALID_DEMAND_DETAIL_KEY,
					INVALID_DEMAND_DETAIL_MSG.replace(INVALID_DEMAND_DETAIL_REPLACETEXT, errors.toString()));
	}
	

/*
 * 
 * update validation 
 * 
 * 
 */

	/**
	 * Method to validate the update request
	 * 
	 * internally calls the create method to validate the new demands
	 * @param demandRequest
	 */
	public void validateForUpdate(DemandRequest demandRequest, DocumentContext mdmsData) {

		Map<String, String> errorMap = new HashMap<>();
		List<Demand> demands = demandRequest.getDemands();
		String tenantId = demands.get(0).getTenantId();

		List<Demand> oldDemands = new ArrayList<>();
		List<DemandDetail> olddemandDetails = new ArrayList<>();
		List<Demand> newDemands = new ArrayList<>();
		List<DemandDetail> newDemandDetails = new ArrayList<>();

		for (Demand demand : demandRequest.getDemands()) {
			if (demand.getId() != null) {
				oldDemands.add(demand);
				for (DemandDetail demandDetail : demand.getDemandDetails()) {
					if (demandDetail.getId() != null)
						olddemandDetails.add(demandDetail);
					else
						newDemandDetails.add(demandDetail);
				}
			} else {
				newDemands.add(demand);
				newDemandDetails.addAll(demand.getDemandDetails());
			}
		}
		validateOldDemands(oldDemands, olddemandDetails, errorMap, tenantId);
		
		/*
		 * Validating all the demand details for tax and collection amount
		 */
		olddemandDetails.addAll(newDemandDetails);
		validateDemandDetailsForAmount(olddemandDetails, errorMap);

		if(!errorMap.isEmpty())
			throw new CustomException(errorMap);

		/*
		 * validate demand for Create is called to validate the new demand details which is part of update
		 * 
		 * error map will be thrown in the create method itself
		 */
		validatedemandForCreate(demandRequest, false,mdmsData);
	}
	
	/**
	 * Method to validate the old demands for update
	 * 
	 * Queries the DB and validates the result with the request demands
	 * 
	 * @param oldDemands
	 * @param olddemandDetails
	 * @param errorMap
	 * @param tenantId
	 */
	private void validateOldDemands(List<Demand> oldDemands, List<DemandDetail> olddemandDetails, Map<String, String> errorMap,
			String tenantId) {

		List<String> unFoundDemandIds = new ArrayList<>();
		List<String> unFoundDemandDetailIds = new ArrayList<>();

		/*
		 * Demand search criteria creation
		 * 
		 * fetching data from db based on the demand ids of the request
		 * 
		 */
		Set<String> demandIds = oldDemands.stream().map(Demand::getId).collect(Collectors.toSet());
		
		if (CollectionUtils.isEmpty(demandIds)) {
			errorMap.put(DEMAND_WITH_NO_ID_KEY, DEMAND_WITH_NO_ID_MSG);
			throw new CustomException(errorMap);
		}
		
		DemandCriteria demandCriteria = DemandCriteria.builder().tenantId(tenantId).demandId(demandIds).build();
		Map<String, Demand> demandMap = demandRepository.getDemands(demandCriteria).stream()
				.collect(Collectors.toMap(Demand::getId, Function.identity()));
		Map<String, DemandDetail> dbDemandDetailMap = new HashMap<>();

		/*
		 * Collecting ids of the demand and demand detail for which no match has been found
		 */
		for (Demand demand : oldDemands) {
			Demand dbDemand = demandMap.get(demand.getId());
			if (dbDemand == null)
				unFoundDemandIds.add(demand.getId());
			else {
				/* payment completed field information cannot be changed from outside
				 */
				demand.setIsPaymentCompleted(dbDemand.getIsPaymentCompleted());
				dbDemandDetailMap.putAll(dbDemand.getDemandDetails().stream()
						.collect(Collectors.toMap(DemandDetail::getId, Function.identity())));
			}
		}

		for (DemandDetail demandDetail : olddemandDetails) {
			if (dbDemandDetailMap.get(demandDetail.getId()) == null)
				unFoundDemandDetailIds.add(demandDetail.getId());
		}
		
		if (!CollectionUtils.isEmpty(unFoundDemandIds))
			errorMap.put(DEMAND_NOT_FOUND_KEY,
					DEMAND_NOT_FOUND_MSG.replace(DEMAND_NOT_FOUND_REPLACETEXT, unFoundDemandIds.toString()));

		if (!CollectionUtils.isEmpty(unFoundDemandDetailIds))
			errorMap.put(DEMAND_DETAIL_NOT_FOUND_KEY, DEMAND_DETAIL_NOT_FOUND_MSG
					.replace(DEMAND_DETAIL_NOT_FOUND_REPLACETEXT, unFoundDemandDetailIds.toString()));
	}
	
	/*
	 * Search validation
	 */

	/**
	 * Method to validate demand search request
	 * 
	 * @param demandCriteria
	 */
	public void validateDemandCriteria(DemandCriteria demandCriteria, RequestInfo requestInfo) {

		util.validateTenantIdForUserType(demandCriteria.getTenantId(), requestInfo);
		Map<String, String> errorMap = new HashMap<>();

		if (demandCriteria.getDemandId() == null && demandCriteria.getConsumerCode() == null
				&& demandCriteria.getEmail() == null && demandCriteria.getMobileNumber() == null
				&& demandCriteria.getBusinessService() == null && demandCriteria.getDemandFrom() == null
				&& demandCriteria.getDemandTo() == null && demandCriteria.getType() == null)
			errorMap.put("businessService", " Any one of the fields additional to tenantId is mandatory");

		if (!CollectionUtils.isEmpty(errorMap))
			throw new CustomException(errorMap);
	}
	
	/**
	 * If Citizen is paying then the id of the logged in user becomes payer id.
	 * If Employee is paying
	 *  1. the id of the payer info of the bill will be attached as payer id.
	 *  2. if user not found, new user will be created
	 *  
	 * @param {@link Demand}, {@link RequestInfo}
	 */
	private void getuserFromNameAndNumber(Demand demand, RequestInfo requestInfo) {

		org.egov.common.contract.request.User userInfo = requestInfo.getUserInfo();
		User payer = demand.getPayer();

		if (userInfo.getType().equalsIgnoreCase("CITIZEN")) {
			payer.setUuid(userInfo.getUuid());
		} else {

			Map<String, String> res = userService.getUser(requestInfo, payer.getMobileNumber(), payer.getName(), demand.getTenantId());
			if (CollectionUtils.isEmpty(res.keySet())) {

				payer.setUuid(userService.createUser(demand, requestInfo));
			} else {
				payer.setUuid(res.get("id"));
			}
		}
		demand.setPayer(payer);
	}
}