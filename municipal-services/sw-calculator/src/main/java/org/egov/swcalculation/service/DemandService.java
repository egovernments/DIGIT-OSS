package org.egov.swcalculation.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.common.contract.request.User;
import org.egov.swcalculation.config.SWCalculationConfiguration;
import org.egov.swcalculation.constants.SWCalculationConstant;
import org.egov.swcalculation.producer.SWCalculationProducer;
import org.egov.swcalculation.repository.DemandRepository;
import org.egov.swcalculation.repository.ServiceRequestRepository;
import org.egov.swcalculation.repository.SewerageCalculatorDao;
import org.egov.swcalculation.util.CalculatorUtils;
import org.egov.swcalculation.util.SWCalculationUtil;
import org.egov.swcalculation.validator.SWCalculationWorkflowValidator;
import org.egov.swcalculation.web.models.*;
import org.egov.swcalculation.web.models.Demand.StatusEnum;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;

import static org.egov.swcalculation.constants.SWCalculationConstant.ONE_TIME_FEE_SERVICE_FIELD;

@Service
@Slf4j
public class DemandService {

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private SWCalculationUtil utils;

	@Autowired
	private MasterDataService masterDataService;

	@Autowired
	private DemandRepository demandRepository;

	@Autowired
	private SWCalculationConfiguration configs;
	
	
	@Autowired
	private ServiceRequestRepository repository;


	@Autowired
	private ServiceRequestRepository serviceRequestRepository;
	
	@Autowired
	private PayService payService;
	
    @Autowired
    private CalculatorUtils calculatorUtils;
    
    @Autowired
    private SewerageCalculatorDao sewerageCalculatorDao;
    
    @Autowired
    private EstimationService estimationService;
    
    @Autowired
    private SWCalculationProducer producer;
    
    @Autowired
    private KafkaTemplate kafkaTemplate;
    
    @Autowired
    private SWCalculationUtil sWCalculationUtil;
    
    @Autowired
	private SWCalculationWorkflowValidator swCalulationWorkflowValidator;

	@Autowired
	private PaymentNotificationService paymentNotificationService;
	
	@Autowired
	private EnrichmentService enrichmentService;



	/**
	 * Creates or updates Demand
	 * 
	 * @param requestInfo The RequestInfo of the calculation request
	 * @param calculations The Calculation Objects for which demand has to be generated or updated
	 */
	public List<Demand> generateDemand(CalculationReq request, List<Calculation> calculations,
			Map<String, Object> masterMap, boolean isForConnectionNo) {
		@SuppressWarnings("unchecked")
		Map<String, Object> financialYearMaster =  (Map<String, Object>) masterMap
				.get(SWCalculationConstant.BILLING_PERIOD);
		Long fromDate = (Long) financialYearMaster.get(SWCalculationConstant.STARTING_DATE_APPLICABLES);
		Long toDate = (Long) financialYearMaster.get(SWCalculationConstant.ENDING_DATE_APPLICABLES);
		
		// List that will contain Calculation for old demands
		List<Calculation> updateCalculations = new LinkedList<>();
		List<Calculation> createCalculations = new LinkedList<>();
		if (!CollectionUtils.isEmpty(calculations)) {
			// Collect required parameters for demand search
			String tenantId = calculations.get(0).getTenantId();
			Long fromDateSearch = null;
			Long toDateSearch = null;
			Set<String> consumerCodes;
			if (isForConnectionNo) {
				fromDateSearch = fromDate;
				toDateSearch = toDate;
				consumerCodes = calculations.stream().map(calculation -> calculation.getConnectionNo())
						.collect(Collectors.toSet());
			} else {
				consumerCodes = calculations.stream().map(calculation -> calculation.getApplicationNO())
						.collect(Collectors.toSet());
			}

			List<Demand> demands = searchDemand(tenantId, consumerCodes, fromDateSearch, toDateSearch, request.getRequestInfo(), null,
					request.getDisconnectRequest());
			Set<String> connectionNumbersFromDemands = new HashSet<>();
			if (!CollectionUtils.isEmpty(demands))
				connectionNumbersFromDemands = demands.stream().map(Demand::getConsumerCode)
						.collect(Collectors.toSet());
			// List that will contain Calculation for new demands
			// If demand already exists add it updateCalculations else
			// createCalculations
			for (Calculation calculation : calculations) {
				if (request.getDisconnectRequest() != null && request.getDisconnectRequest()) {
					demands = searchDemandForDisconnectionRequest(calculation.getTenantId(), consumerCodes, null,
							toDateSearch, request.getRequestInfo(), null, request.getDisconnectRequest());
					if (!CollectionUtils.isEmpty(demands) &&
							!(demands.get(0).getDemandDetails().get(0).getCollectionAmount().doubleValue() == 0.0)) {
						createCalculations.add(calculation);
					} else if (CollectionUtils.isEmpty(demands)) {
						calculation.getApplicationNO();
						createCalculations.add(calculation);
					} else {
						updateCalculations.add(calculation);
					}
				} else {
					if (!connectionNumbersFromDemands.contains(isForConnectionNo ? calculation.getConnectionNo() : calculation.getApplicationNO())) {
						createCalculations.add(calculation);
					} else
						updateCalculations.add(calculation);
				}
			}
		}
		List<Demand> createdDemands = new ArrayList<>();
		if (!CollectionUtils.isEmpty(createCalculations))
			createdDemands = createDemand(request.getRequestInfo(), createCalculations, masterMap, isForConnectionNo);

		if (!CollectionUtils.isEmpty(updateCalculations))
			createdDemands = updateDemandForCalculation(request.getRequestInfo(), updateCalculations, fromDate, toDate, isForConnectionNo,
					request.getDisconnectRequest());
		return createdDemands;
	}

	/**
	 * Creates demand for the given list of calculations
	 * 
	 * @param requestInfo
	 *            The RequestInfo of the calculation request
	 * @param calculations
	 *            List of calculation object
	 * @return Demands that are created
	 */
	private List<Demand> createDemand(RequestInfo requestInfo, List<Calculation> calculations,
			Map<String, Object> masterMap,boolean isForConnectionNO) {
		List<Demand> demands = new LinkedList<>();
		Set<String> sewerageConnectionIds = new HashSet<>();
		for (Calculation calculation : calculations) {

			SewerageConnection connection = calculation.getSewerageConnection();

			if (connection == null)
				throw new CustomException("EG_SW_INVALID_SEWERAGE_CONNECTION",
						"Demand cannot be generated for "
								+ (isForConnectionNO ? calculation.getConnectionNo() : calculation.getApplicationNO())
								+ " Sewerage Connection with this number does not exist ");
			
			SewerageConnectionRequest sewerageConnectionRequest = SewerageConnectionRequest.builder()
					.sewerageConnection(connection).requestInfo(requestInfo).build();
			
			Property property = sWCalculationUtil.getProperty(sewerageConnectionRequest);
			String tenantId = calculation.getTenantId();
			String consumerCode = isForConnectionNO ?  calculation.getConnectionNo() : calculation.getApplicationNO();
			sewerageConnectionIds.add(consumerCode);
			User owner = property.getOwners().get(0).toCommonUser();
			if (!CollectionUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getConnectionHolders())) {
				owner = sewerageConnectionRequest.getSewerageConnection().getConnectionHolders().get(0).toCommonUser();
			}
			owner = getPlainOwnerDetails(requestInfo,owner.getUuid(), tenantId);
			List<DemandDetail> demandDetails = new LinkedList<>();
			
			calculation.getTaxHeadEstimates().forEach(taxHeadEstimate -> {
				demandDetails.add(DemandDetail.builder().taxAmount(taxHeadEstimate.getEstimateAmount())
						.taxHeadMasterCode(taxHeadEstimate.getTaxHeadCode()).collectionAmount(BigDecimal.ZERO)
						.tenantId(calculation.getTenantId()).build());
			});
			
			@SuppressWarnings("unchecked")
			Map<String, Object> financialYearMaster =  (Map<String, Object>) masterMap
					.get(SWCalculationConstant.BILLING_PERIOD);

			Long fromDate = (Long) financialYearMaster.get(SWCalculationConstant.STARTING_DATE_APPLICABLES);
			Long toDate = (Long) financialYearMaster.get(SWCalculationConstant.ENDING_DATE_APPLICABLES);
			Long expiryDate = (Long) financialYearMaster.get(SWCalculationConstant.Demand_Expiry_Date_String);
			BigDecimal minimumPayableAmount = isForConnectionNO ? configs.getMinimumPayableAmount() : calculation.getTotalAmount();
			String businessService = isForConnectionNO ? configs.getBusinessService() : ONE_TIME_FEE_SERVICE_FIELD;
		
			addRoundOffTaxHead(calculation.getTenantId(), demandDetails);
			Map<String, String> additionalDetailsMap = new HashMap<>();
			additionalDetailsMap.put("propertyId", property.getPropertyId());
			demands.add(Demand.builder().consumerCode(consumerCode).demandDetails(demandDetails).payer(owner)
					.minimumAmountPayable(minimumPayableAmount).tenantId(calculation.getTenantId()).taxPeriodFrom(fromDate)
					.taxPeriodTo(toDate).consumerType("sewerageConnection").businessService(businessService)
					.status(StatusEnum.valueOf("ACTIVE")).billExpiryTime(expiryDate).additionalDetails(additionalDetailsMap).build());
		}

		String billingcycle = calculatorUtils.getBillingCycle(masterMap);
		DemandNotificationObj notificationObj = DemandNotificationObj.builder()
				.requestInfo(requestInfo)
				.tenantId(calculations.get(0).getTenantId())
				.sewerageConnetionIds(sewerageConnectionIds)
				.billingCycle(billingcycle)
				.build();
		List<Demand> demandRes = demandRepository.saveDemand(requestInfo, demands,notificationObj);
		if(isForConnectionNO)
			fetchBill(demandRes, requestInfo,masterMap);
		return demandRes;
	}

	private User getPlainOwnerDetails(RequestInfo requestInfo, String uuid, String tenantId){
		User userInfoCopy = requestInfo.getUserInfo();
		StringBuilder uri = new StringBuilder();
		uri.append(configs.getUserHost()).append(configs.getUserSearchEndpoint());
		Map<String, Object> userSearchRequest = new HashMap<>();
		tenantId = tenantId.split("\\.")[0];

		Role role = Role.builder()
				.name("Internal Microservice Role").code("INTERNAL_MICROSERVICE_ROLE")
				.tenantId(tenantId).build();

		User userInfo = User.builder()
				.uuid(configs.getEgovInternalMicroserviceUserUuid())
				.type("SYSTEM")
				.roles(Collections.singletonList(role)).id(0L).build();

		requestInfo.setUserInfo(userInfo);

		userSearchRequest.put("RequestInfo", requestInfo);
		userSearchRequest.put("tenantId", tenantId);
		userSearchRequest.put("uuid",Collections.singletonList(uuid));
		User user = null;
		try {
			LinkedHashMap<String, Object> responseMap = (LinkedHashMap<String, Object>) serviceRequestRepository.fetchResult(uri, userSearchRequest);

			List<LinkedHashMap<String, Object>> users = (List<LinkedHashMap<String, Object>>) responseMap.get("user");
			String dobFormat = "yyyy-MM-dd";
			utils.parseResponse(responseMap,dobFormat);
			user = 	mapper.convertValue(users.get(0), User.class);

		} catch (Exception e) {
			throw new CustomException("EG_USER_SEARCH_ERROR", "Service returned null while fetching user");
		}
		requestInfo.setUserInfo(userInfoCopy);
		return user;
	}
	
	
	public boolean fetchBill(List<Demand> demandResponse, RequestInfo requestInfo,Map<String, Object> masterMap) {
		boolean notificationSent = false;
		List<Demand> errorMap = new ArrayList<>();
		int successCount=0;
		for (Demand demand : demandResponse) {
			try {
				Object result = serviceRequestRepository.fetchResult(calculatorUtils.getFetchBillURL(demand.getTenantId(), demand.getConsumerCode()),
						RequestInfoWrapper.builder().requestInfo(requestInfo).build());
				HashMap<String, Object> billResponse = new HashMap<>();
				billResponse.put("requestInfo", requestInfo);
				billResponse.put("billResponse", result);
				producer.push(configs.getPayTriggers(), billResponse);
				notificationSent = true;
				successCount++;

			} catch (Exception ex) {
				log.error("EG_SW Fetch Bill Error", ex);
				errorMap.add(demand);
			}
		}
		String uuid = demandResponse.get(0).getAuditDetails().getCreatedBy();
		if(errorMap.size() == demandResponse.size())
		{
			paymentNotificationService.sendBillNotification(requestInfo,uuid,demandResponse.get(0).getTenantId(),masterMap,false);
		}
		else
		{if(!errorMap.isEmpty())
		{
			paymentNotificationService.sendBillNotification(requestInfo,uuid, demandResponse.get(0).getTenantId(), masterMap,false);
		}
			paymentNotificationService.sendBillNotification(requestInfo,uuid,demandResponse.get(0).getTenantId(),masterMap,true);
		}
		return notificationSent;
	}

	/**
	 * Adds roundOff taxHead if decimal values exists
	 * 
	 * @param tenantId
	 *            The tenantId of the demand
	 * @param demandDetails
	 *            The list of demandDetail
	 */
	public void addRoundOffTaxHead(String tenantId, List<DemandDetail> demandDetails) {
		BigDecimal totalTax = BigDecimal.ZERO;
		
		BigDecimal previousRoundOff = BigDecimal.ZERO;
		/*
		 * Sum all taxHeads except RoundOff as new roundOff will be calculated
		 */
		for (DemandDetail demandDetail : demandDetails) {
			if (!demandDetail.getTaxHeadMasterCode().equalsIgnoreCase(SWCalculationConstant.MDMS_ROUNDOFF_TAXHEAD))
				totalTax = totalTax.add(demandDetail.getTaxAmount());
			else
				previousRoundOff = previousRoundOff.add(demandDetail.getTaxAmount());
		}

		BigDecimal decimalValue = totalTax.remainder(BigDecimal.ONE);
		BigDecimal midVal = BigDecimal.valueOf(0.5);
		BigDecimal roundOff = BigDecimal.ZERO;

		/*
		 * If the decimal amount is greater than 0.5 we subtract it from 1 and
		 * put it as roundOff taxHead so as to nullify the decimal eg: If the
		 * tax is 12.64 we will add extra tax roundOff taxHead of 0.36 so that
		 * the total becomes 13
		 */
		if (decimalValue.compareTo(midVal) >= 0)
			roundOff = BigDecimal.ONE.subtract(decimalValue);

		/*
		 * If the decimal amount is less than 0.5 we put negative of it as
		 * roundOff taxHead so as to nullify the decimal eg: If the tax is 12.36
		 * we will add extra tax roundOff taxHead of -0.36 so that the total
		 * becomes 12
		 */
		if (decimalValue.compareTo(midVal) < 0)
			roundOff = decimalValue.negate();

		/*
		 * If roundOff already exists in previous demand create a new roundOff
		 * taxHead with roundOff amount equal to difference between them so that
		 * it will be balanced when bill is generated. eg: If the previous
		 * roundOff amount was of -0.36 and the new roundOff excluding the
		 * previous roundOff is 0.2 then the new roundOff will be created with
		 * 0.2 so that the net roundOff will be 0.2 -(-0.36)
		 */
		if (previousRoundOff.compareTo(BigDecimal.ZERO) != 0) {
			roundOff = roundOff.subtract(previousRoundOff);
		}

		if (roundOff.compareTo(BigDecimal.ZERO) != 0) {
			demandDetails.add(DemandDetail.builder().taxAmount(roundOff)
					.taxHeadMasterCode(SWCalculationConstant.MDMS_ROUNDOFF_TAXHEAD).tenantId(tenantId)
					.collectionAmount(BigDecimal.ZERO).build());
		}
	}

	/**
	 * Searches demand for the given consumerCode and tenantIDd
	 * 
	 * @param tenantId
	 *            The tenantId of the tradeLicense
	 * @param consumerCodes
	 *            The set of consumerCode of the demands
	 * @param requestInfo
	 *            The RequestInfo of the incoming request
	 * @return List of demands for the given consumerCode
	 */
	public List<Demand> searchDemand(String tenantId, Set<String> consumerCodes, Long taxPeriodFrom, Long taxPeriodTo,
									 RequestInfo requestInfo, Boolean isDemandPaid, Boolean isDisconnectionRequest) {
		Object result = serviceRequestRepository.fetchResult(getDemandSearchURL(tenantId, consumerCodes, taxPeriodFrom, taxPeriodTo, isDemandPaid,
						isDisconnectionRequest),
				RequestInfoWrapper.builder().requestInfo(requestInfo).build());
		DemandResponse response;
		try {
			response = mapper.convertValue(result, DemandResponse.class);
			if (CollectionUtils.isEmpty(response.getDemands()))
				return Collections.emptyList();
			return response.getDemands();
		} catch (IllegalArgumentException e) {
			throw new CustomException("EG_SW_PARSING_ERROR", "Failed to parse response from Demand Search");
		}

	}
	
	/**
	 * Creates demand Search url based on tenantId,businessService, period from, period to and
	 * ConsumerCode 
	 * 
	 * @return demand search url
	 */
	public StringBuilder getDemandSearchURL(String tenantId, Set<String> consumerCodes, Long taxPeriodFrom, Long taxPeriodTo, Boolean isDemandPaid,
											Boolean isDisconnectionRequest) {
		StringBuilder url = new StringBuilder(configs.getBillingServiceHost());
		String businessService = taxPeriodFrom == null && !isDisconnectionRequest ? ONE_TIME_FEE_SERVICE_FIELD : configs.getBusinessService();
		url.append(configs.getDemandSearchEndPoint());
		url.append("?");
		url.append("tenantId=");
		url.append(tenantId);
		url.append("&");
		url.append("businessService=");
		url.append(businessService);
		url.append("&");
		url.append("consumerCode=");
		url.append(StringUtils.join(consumerCodes, ','));
		if (taxPeriodFrom != null) {
			url.append("&");
			url.append("periodFrom=");
			url.append(taxPeriodFrom.toString());
		}
		if (taxPeriodTo != null) {
			url.append("&");
			url.append("periodTo=");
			url.append(taxPeriodTo.toString());
		}
		if (isDemandPaid != null) {
			url.append("&");
			url.append("isPaymentCompleted=");
			url.append(isDemandPaid);
		}
		return url;
	}

	/**
	 * Updates demand for the given list of calculations
	 * 
	 * @param requestInfo
	 *            The RequestInfo of the calculation request
	 * @param calculations
	 *            List of calculation object
	 * @return Demands that are updated
	 */
	private List<Demand> updateDemandForCalculation(RequestInfo requestInfo, List<Calculation> calculations,
			Long fromDate, Long toDate, boolean isForConnectionNo, Boolean isDisconnectionRequest) {

		List<Demand> demands = new LinkedList<>();
		Long fromDateSearch = isForConnectionNo ? fromDate : null;
		Long toDateSearch = isForConnectionNo ? toDate : null;

		for (Calculation calculation : calculations) {
			Set<String> consumerCodes = new HashSet<>();
			consumerCodes = isForConnectionNo
					? Collections.singleton(calculation.getSewerageConnection().getConnectionNo())
					: Collections.singleton(calculation.getSewerageConnection().getApplicationNo());
			List<Demand> searchResult = new ArrayList<>();
			if (isDisconnectionRequest)
				searchResult = searchDemandForDisconnectionRequest(calculation.getTenantId(), consumerCodes, null, toDateSearch,
						requestInfo, null, isDisconnectionRequest);
			else
				searchResult = searchDemand(calculation.getTenantId(), consumerCodes, fromDateSearch, toDateSearch, requestInfo,
						null, isDisconnectionRequest);

			if (CollectionUtils.isEmpty(searchResult))
				throw new CustomException("EG_SW_INVALID_DEMAND_UPDATE", "No demand exists for Number: "
						+ consumerCodes.toString());
			Demand demand = searchResult.get(0);
			String tenantId = calculation.getTenantId();
			List<DemandDetail> demandDetails = demand.getDemandDetails();
			List<DemandDetail> updatedDemandDetails = getUpdatedDemandDetails(calculation, demandDetails, isDisconnectionRequest);
			demand.setDemandDetails(updatedDemandDetails);

			if(isForConnectionNo){
				SewerageConnection connection = calculation.getSewerageConnection();
				if (connection == null) {
					List<SewerageConnection> sewerageConnectionList = calculatorUtils.getSewerageConnection(requestInfo,
							calculation.getConnectionNo(),calculation.getTenantId());
					int size = sewerageConnectionList.size();
					connection = sewerageConnectionList.get(size-1);

				}

				if(connection.getApplicationType().equalsIgnoreCase("MODIFY_SEWERAGE_CONNECTION")){
					SewerageConnectionRequest sewerageConnectionRequest = SewerageConnectionRequest.builder().sewerageConnection(connection)
							.requestInfo(requestInfo).build();
					Property property = sWCalculationUtil.getProperty(sewerageConnectionRequest);
					User owner = property.getOwners().get(0).toCommonUser();
					if (!CollectionUtils.isEmpty(sewerageConnectionRequest.getSewerageConnection().getConnectionHolders())) {
						owner = sewerageConnectionRequest.getSewerageConnection().getConnectionHolders().get(0).toCommonUser();
					}
					owner = getPlainOwnerDetails(requestInfo,owner.getUuid(), tenantId);
					if(!(demand.getPayer().getUuid().equalsIgnoreCase(owner.getUuid())))
						demand.setPayer(owner);
				}
			}
			demands.add(demand);
		}

		log.info("Updated Demand Details " + demands.toString());
		return demandRepository.updateDemand(requestInfo, demands);
	}

	/**
	 * Returns the list of new DemandDetail to be added for updating the demand
	 * 
	 * @param calculation
	 *            The calculation object for the update request
	 * @param demandDetails
	 *            The list of demandDetails from the existing demand
	 * @return The list of new DemandDetails
	 */
	private List<DemandDetail> getUpdatedDemandDetails(Calculation calculation, List<DemandDetail> demandDetails, Boolean isDisconnectionRequest) {

		List<DemandDetail> newDemandDetails = new ArrayList<>();
		Map<String, List<DemandDetail>> taxHeadToDemandDetail = new HashMap<>();

		demandDetails.forEach(demandDetail -> {
			if (!taxHeadToDemandDetail.containsKey(demandDetail.getTaxHeadMasterCode())) {
				List<DemandDetail> demandDetailList = new LinkedList<>();
				demandDetailList.add(demandDetail);
				taxHeadToDemandDetail.put(demandDetail.getTaxHeadMasterCode(), demandDetailList);
			} else
				taxHeadToDemandDetail.get(demandDetail.getTaxHeadMasterCode()).add(demandDetail);
		});

		BigDecimal diffInTaxAmount;
		List<DemandDetail> demandDetailList;
		BigDecimal total;

		for (TaxHeadEstimate taxHeadEstimate : calculation.getTaxHeadEstimates()) {
			if (!taxHeadToDemandDetail.containsKey(taxHeadEstimate.getTaxHeadCode()) && !isDisconnectionRequest)
				newDemandDetails.add(DemandDetail.builder().taxAmount(taxHeadEstimate.getEstimateAmount())
						.taxHeadMasterCode(taxHeadEstimate.getTaxHeadCode()).tenantId(calculation.getTenantId())
						.collectionAmount(BigDecimal.ZERO).build());
			else if (isDisconnectionRequest) {
				if (taxHeadEstimate.getTaxHeadCode().equalsIgnoreCase(SWCalculationConstant.SW_Round_Off))
					continue;
				total = taxHeadEstimate.getEstimateAmount();
				if (total.compareTo(BigDecimal.ZERO) != 0) {
					newDemandDetails.add(DemandDetail.builder().taxAmount(total)
							.taxHeadMasterCode(taxHeadEstimate.getTaxHeadCode()).tenantId(calculation.getTenantId())
							.collectionAmount(BigDecimal.ZERO).build());
				}
			} else {
				demandDetailList = taxHeadToDemandDetail.get(taxHeadEstimate.getTaxHeadCode());
				total = demandDetailList.stream().map(DemandDetail::getTaxAmount).reduce(BigDecimal.ZERO,
						BigDecimal::add);
				diffInTaxAmount = taxHeadEstimate.getEstimateAmount().subtract(total);
				if (diffInTaxAmount.compareTo(BigDecimal.ZERO) != 0) {
					newDemandDetails.add(DemandDetail.builder().taxAmount(diffInTaxAmount)
							.taxHeadMasterCode(taxHeadEstimate.getTaxHeadCode()).tenantId(calculation.getTenantId())
							.collectionAmount(BigDecimal.ZERO).build());
				}
			}
		}
		List<DemandDetail> combinedBillDetails = new LinkedList<>(demandDetails);
		if (!CollectionUtils.isEmpty(combinedBillDetails) && isDisconnectionRequest) {
			combinedBillDetails.clear();
			combinedBillDetails.addAll(newDemandDetails);
		} else
			combinedBillDetails.addAll(newDemandDetails);
		addRoundOffTaxHead(calculation.getTenantId(), combinedBillDetails);
		return combinedBillDetails;
	}

	/**
	 * 
	 * @param getBillCriteria Bill Criteria
	 * @param requestInfoWrapper contains request info wrapper
	 * @return updated demand response
	 */
	public List<Demand> updateDemands(GetBillCriteria getBillCriteria, RequestInfoWrapper requestInfoWrapper, Boolean isCallFromBulkGen) {

		if (getBillCriteria.getAmountExpected() == null)
			getBillCriteria.setAmountExpected(BigDecimal.ZERO);
		RequestInfo requestInfo = requestInfoWrapper.getRequestInfo();
		Map<String, JSONArray> billingSlabMaster = new HashMap<>();

		Map<String, JSONArray> timeBasedExemptionMasterMap = new HashMap<>();
		masterDataService.setSewerageConnectionMasterValues(requestInfoWrapper.getRequestInfo(), getBillCriteria.getTenantId(), billingSlabMaster,
				timeBasedExemptionMasterMap);

		if (CollectionUtils.isEmpty(getBillCriteria.getConsumerCodes()))
			getBillCriteria.setConsumerCodes(Collections.singletonList(getBillCriteria.getConnectionNumber()));

		DemandResponse res = mapper.convertValue(
				repository.fetchResult(utils.getDemandSearchUrl(getBillCriteria), requestInfoWrapper),
				DemandResponse.class);
		if (CollectionUtils.isEmpty(res.getDemands())) {
			return Collections.emptyList();
		}


		// Loop through the consumerCodes and re-calculate the time based applicable
		Map<String, Demand> consumerCodeToDemandMap = res.getDemands().stream()
				.collect(Collectors.toMap(Demand::getId, Function.identity()));
		String tenantId = getBillCriteria.getTenantId();
		List<Demand> demandsToBeUpdated = new LinkedList<>();
		List<TaxPeriod> taxPeriods = masterDataService.getTaxPeriodList(requestInfoWrapper.getRequestInfo(), getBillCriteria.getTenantId(), SWCalculationConstant.SERVICE_FIELD_VALUE_SW);
		consumerCodeToDemandMap.forEach((id, demand) ->{
			if (demand.getStatus() != null
					&& SWCalculationConstant.DEMAND_CANCELLED_STATUS.equalsIgnoreCase(demand.getStatus().toString()))
				throw new CustomException(SWCalculationConstant.EG_SW_INVALID_DEMAND_ERROR,
						SWCalculationConstant.EG_SW_INVALID_DEMAND_ERROR_MSG);
			User owner = getPlainOwnerDetails(requestInfo,demand.getPayer().getUuid(), tenantId);
			demand.setPayer(owner);
			applyTimeBasedApplicables(demand, requestInfoWrapper, timeBasedExemptionMasterMap, taxPeriods);
			addRoundOffTaxHead(getBillCriteria.getTenantId(), demand.getDemandDetails());
			demandsToBeUpdated.add(demand);
		});
		// Call demand update in bulk to update the interest or penalty
		if(!isCallFromBulkGen)
			repository.fetchResult(utils.getUpdateDemandUrl(),
					DemandRequest.builder().demands(demandsToBeUpdated).requestInfo(requestInfoWrapper.getRequestInfo()).build());

		return demandsToBeUpdated;
	}

	
	/**
	 * Updates the amount in the latest demandDetail by adding the diff between
	 * new and old amounts to it
	 * 
	 * @param newAmount
	 *            The new tax amount for the taxHead
	 * @param latestDetailInfo
	 *            The latest demandDetail for the particular taxHead
	 */
	private void updateTaxAmount(BigDecimal newAmount, DemandDetailAndCollection latestDetailInfo) {
		BigDecimal diff = newAmount.subtract(latestDetailInfo.getTaxAmountForTaxHead());
		BigDecimal newTaxAmountForLatestDemandDetail = latestDetailInfo.getLatestDemandDetail().getTaxAmount()
				.add(diff);
		latestDetailInfo.getLatestDemandDetail().setTaxAmount(newTaxAmountForLatestDemandDetail);
	}

	
	/**
	 * Applies Penalty/Rebate/Interest to the incoming demands
	 * 
	 * If applied already then the demand details will be updated
	 * 
	 * @param demand - Demand Object
	 * @param requestInfoWrapper - Request Info Object
	 * @param timeBasedExemptionMasterMap - List of Time based exemptions
	 * @param taxPeriods - List of Tax Periods
	 * @return - Returns TRUE or FALSE
	 */

	private boolean applyTimeBasedApplicables(Demand demand, RequestInfoWrapper requestInfoWrapper,
											  Map<String, JSONArray> timeBasedExemptionMasterMap, List<TaxPeriod> taxPeriods) {

		TaxPeriod taxPeriod = taxPeriods.stream().filter(t -> demand.getTaxPeriodFrom().compareTo(t.getFromDate()) >= 0
				&& demand.getTaxPeriodTo().compareTo(t.getToDate()) <= 0).findAny().orElse(null);
		if (taxPeriod == null) {
			log.info("Demand Expired!!");
			return false;
		}

		boolean isCurrentDemand = false;
		if (!(taxPeriod.getFromDate() <= System.currentTimeMillis()
				&& taxPeriod.getToDate() >= System.currentTimeMillis()))
			isCurrentDemand = true;
		
		if(demand.getBillExpiryTime() < System.currentTimeMillis()) {
		BigDecimal sewerageChargeApplicable = BigDecimal.ZERO;
		BigDecimal oldPenalty = BigDecimal.ZERO;
		BigDecimal oldInterest = BigDecimal.ZERO;
		

		for (DemandDetail detail : demand.getDemandDetails()) {
			if (SWCalculationConstant.TAX_APPLICABLE.contains(detail.getTaxHeadMasterCode())) {
				sewerageChargeApplicable = sewerageChargeApplicable.add(detail.getTaxAmount());
			}
			if (detail.getTaxHeadMasterCode().equalsIgnoreCase(SWCalculationConstant.SW_TIME_PENALTY)) {
				oldPenalty = oldPenalty.add(detail.getTaxAmount());
			}
			if (detail.getTaxHeadMasterCode().equalsIgnoreCase(SWCalculationConstant.SW_TIME_INTEREST)) {
				oldInterest = oldInterest.add(detail.getTaxAmount());
			}
		}
		
		boolean isPenaltyUpdated = false;
		boolean isInterestUpdated = false;
		
		Map<String, BigDecimal> interestPenaltyEstimates = payService.applyPenaltyRebateAndInterest(
				sewerageChargeApplicable, taxPeriod.getFinancialYear(), timeBasedExemptionMasterMap, demand.getBillExpiryTime());
		if (null == interestPenaltyEstimates)
			return isCurrentDemand;

		BigDecimal penalty = interestPenaltyEstimates.get(SWCalculationConstant.SW_TIME_PENALTY);
		BigDecimal interest = interestPenaltyEstimates.get(SWCalculationConstant.SW_TIME_INTEREST);
		if(penalty == null)
			penalty = BigDecimal.ZERO;
		if(interest == null)
			interest = BigDecimal.ZERO;

		DemandDetailAndCollection latestPenaltyDemandDetail, latestInterestDemandDetail;

		if (interest.compareTo(BigDecimal.ZERO) != 0) {
			latestInterestDemandDetail = utils.getLatestDemandDetailByTaxHead(SWCalculationConstant.SW_TIME_INTEREST,
					demand.getDemandDetails());
			if (latestInterestDemandDetail != null) {
				updateTaxAmount(interest, latestInterestDemandDetail);
				isInterestUpdated = true;
			}
		}

		if (penalty.compareTo(BigDecimal.ZERO) != 0) {
			latestPenaltyDemandDetail = utils.getLatestDemandDetailByTaxHead(SWCalculationConstant.SW_TIME_PENALTY,
					demand.getDemandDetails());
			if (latestPenaltyDemandDetail != null) {
				updateTaxAmount(penalty, latestPenaltyDemandDetail);
				isPenaltyUpdated = true;
			}
		}

		if (!isPenaltyUpdated && penalty.compareTo(BigDecimal.ZERO) > 0)
			demand.getDemandDetails().add(
					DemandDetail.builder().taxAmount(penalty.setScale(2, 2)).taxHeadMasterCode(SWCalculationConstant.SW_TIME_PENALTY)
							.demandId(demand.getId()).tenantId(demand.getTenantId()).build());
		if (!isInterestUpdated && interest.compareTo(BigDecimal.ZERO) > 0)
			demand.getDemandDetails().add(
					DemandDetail.builder().taxAmount(interest.setScale(2, 2)).taxHeadMasterCode(SWCalculationConstant.SW_TIME_INTEREST)
							.demandId(demand.getId()).tenantId(demand.getTenantId()).build());
		}

		return isCurrentDemand;
	}
	
	/**
	 * 
	 * @param tenantId TenantId for getting master data.
	 */
	public void generateDemandForTenantId(String tenantId, RequestInfo requestInfo, BulkBillCriteria bulkBillCriteria) {
		requestInfo.getUserInfo().setTenantId(tenantId);
		Map<String, Object> billingMasterData = calculatorUtils.loadBillingFrequencyMasterData(requestInfo, tenantId);
		generateDemandForULB(requestInfo, tenantId, bulkBillCriteria);
	}
	
	/**
	 * 
	 * @param master - List of MDMS master data
	 * @param requestInfo - Request Info Object
	 * @param tenantId - Tenant Id
	 * @param bulkBillCriteria - Critera for bulk bill generation
	 */
	@SuppressWarnings("unchecked")
	public void generateDemandForULB(RequestInfo requestInfo, String tenantId, BulkBillCriteria bulkBillCriteria) {

		Map<String, Object> billingMasterData = calculatorUtils.loadBillingFrequencyMasterData(requestInfo, tenantId);

		long startDay = (((int) billingMasterData.get(SWCalculationConstant.Demand_Generate_Date_String)) / 86400000);
		if(isCurrentDateIsMatching((String) billingMasterData.get(SWCalculationConstant.Billing_Cycle_String), startDay)) {

			Integer batchsize = configs.getBulkbatchSize();
			Integer batchOffset = configs.getBatchOffset();

			if(bulkBillCriteria.getLimit() != null)
				batchsize = Math.toIntExact(bulkBillCriteria.getLimit());

			if(bulkBillCriteria.getOffset() != null)
				batchOffset = Math.toIntExact(bulkBillCriteria.getOffset());

			Map<String, Object> masterMap = masterDataService.loadMasterData(requestInfo, tenantId);

			ArrayList<?> billingFrequencyMap = (ArrayList<?>) masterMap
					.get(SWCalculationConstant.Billing_Period_Master);
			masterDataService.enrichBillingPeriod(null, billingFrequencyMap, masterMap, SWCalculationConstant.nonMeterdConnection);

			Map<String, Object> financialYearMaster =  (Map<String, Object>) masterMap
					.get(SWCalculationConstant.BILLING_PERIOD);

			Long fromDate = (Long) financialYearMaster.get(SWCalculationConstant.STARTING_DATE_APPLICABLES);
			Long toDate = (Long) financialYearMaster.get(SWCalculationConstant.ENDING_DATE_APPLICABLES);

			long count = sewerageCalculatorDao.getConnectionCount(tenantId, fromDate, toDate);
			
			log.info("Count: "+count);

			if(count > 0) {
				while (batchOffset < count) {
					List<SewerageConnection> connections = sewerageCalculatorDao.getConnectionsNoList(tenantId,
							SWCalculationConstant.nonMeterdConnection, batchOffset, batchsize, fromDate, toDate);
					log.info("Size of the connection list for batch : "+ batchOffset + " is " + connections.size());
					connections = enrichmentService.filterConnections(connections);
					
					if(connections.size()>0){
						List<CalculationCriteria> calculationCriteriaList = new ArrayList<>();

						for (SewerageConnection connection : connections) {
							CalculationCriteria calculationCriteria = CalculationCriteria.builder().tenantId(tenantId)
									.assessmentYear(estimationService.getAssessmentYear()).connectionNo(connection.getConnectionNo())
									.sewerageConnection(connection).build();
							calculationCriteriaList.add(calculationCriteria);
						}

						/*MigrationCount migrationCount = MigrationCount.builder().id(UUID.randomUUID().toString()).offset(Long.valueOf(batchOffset)).limit(Long.valueOf(batchsize)).recordCount(Long.valueOf(connectionNos.size()))
								.tenantid(tenantId).createdTime(System.currentTimeMillis()).businessService("SW").build();*/

						MigrationCount migrationCount = MigrationCount.builder()
								.tenantid(tenantId)
								.businessService("SW")
								.limit(Long.valueOf(batchsize))
								.id(UUID.randomUUID().toString())
								.offset(Long.valueOf(batchOffset))
								.createdTime(System.currentTimeMillis())
								.recordCount(Long.valueOf(connections.size()))
								.build();

						CalculationReq calculationReq = CalculationReq.builder()
								.calculationCriteria(calculationCriteriaList)
								.requestInfo(requestInfo)
								.isconnectionCalculation(true)
								.migrationCount(migrationCount).build();
						
						kafkaTemplate.send(configs.getCreateDemand(), calculationReq);
						log.info("Bulk bill Gen batch info : " + migrationCount);
						calculationCriteriaList.clear();
					}
					batchOffset = batchOffset + batchsize;
				}
			}
		}
	}
	
	/**
	 * 
	 * @param billingFrequency - Billing Frequency period
	 * @param dayOfMonth - Day of the Month
	 * @return true if current day is for generation of demand
	 */
	private boolean isCurrentDateIsMatching(String billingFrequency, long dayOfMonth) {
		if (billingFrequency.equalsIgnoreCase(SWCalculationConstant.Monthly_Billing_Period)
				&& (dayOfMonth == LocalDateTime.now().getDayOfMonth())) {
			return true;
		} else if (billingFrequency.equalsIgnoreCase(SWCalculationConstant.Quaterly_Billing_Period)) {
			return false;
		}
		return true;
	}
	
	/**
	 * Creates demand Search url based on tenantId,businessService, and
	 * 
	 * @return demand search url
	 */
	public StringBuilder getDemandSearchURLForDemandId() {
		StringBuilder url = new StringBuilder(configs.getBillingServiceHost());
		url.append(configs.getDemandSearchEndPoint());
		url.append("?");
		url.append("tenantId=");
		url.append("{1}");
		url.append("&");
		url.append("businessService=");
		url.append("{2}");
		url.append("&");
		url.append("consumerCode=");
		url.append("{3}");
		url.append("&");
		url.append("isPaymentCompleted=false");
		return url;
	}
	/**
	 * 
	 * @param tenantId - Tenant ID
	 * @param consumerCode - Connection number
	 * @param requestInfo - Request Info Object
	 * @return List of Demand
	 */
	private List<Demand> searchDemandBasedOnConsumerCode(String tenantId, String consumerCode,
			RequestInfo requestInfo, String businessService) {
		String uri = getDemandSearchURLForDemandId().toString();
		uri = uri.replace("{1}", tenantId);
		uri = uri.replace("{2}", businessService);
		uri = uri.replace("{3}", consumerCode);
		Object result = serviceRequestRepository.fetchResult(new StringBuilder(uri),
				RequestInfoWrapper.builder().requestInfo(requestInfo).build());
		try {
			return mapper.convertValue(result, DemandResponse.class).getDemands();
		} catch (IllegalArgumentException e) {
			throw new CustomException("EG_SW_PARSING_ERROR", "Failed to parse response from Demand Search");
		}
	}
	
	/**
	 * compare and update the demand details
	 * 
	 * @param calculation - Calculation Object
	 * @param demandDetails - List of Demand Details
	 * @return combined demand details list
	 */ 
		private List<DemandDetail> getUpdatedAdhocTax(Calculation calculation, List<DemandDetail> demandDetails) {

			List<DemandDetail> newDemandDetails = new ArrayList<>();
			Map<String, List<DemandDetail>> taxHeadToDemandDetail = new HashMap<>();

			demandDetails.forEach(demandDetail -> {
				if (!taxHeadToDemandDetail.containsKey(demandDetail.getTaxHeadMasterCode())) {
					List<DemandDetail> demandDetailList = new LinkedList<>();
					demandDetailList.add(demandDetail);
					taxHeadToDemandDetail.put(demandDetail.getTaxHeadMasterCode(), demandDetailList);
				} else
					taxHeadToDemandDetail.get(demandDetail.getTaxHeadMasterCode()).add(demandDetail);
			});

			BigDecimal diffInTaxAmount;
			List<DemandDetail> demandDetailList;
			BigDecimal total;

			for (TaxHeadEstimate taxHeadEstimate : calculation.getTaxHeadEstimates()) {
				if (!taxHeadToDemandDetail.containsKey(taxHeadEstimate.getTaxHeadCode()))
					newDemandDetails.add(DemandDetail.builder().taxAmount(taxHeadEstimate.getEstimateAmount())
							.taxHeadMasterCode(taxHeadEstimate.getTaxHeadCode()).tenantId(calculation.getTenantId())
							.collectionAmount(BigDecimal.ZERO).build());
				else {
					demandDetailList = taxHeadToDemandDetail.get(taxHeadEstimate.getTaxHeadCode());
					total = demandDetailList.stream().map(DemandDetail::getTaxAmount).reduce(BigDecimal.ZERO,
							BigDecimal::add);
					diffInTaxAmount = taxHeadEstimate.getEstimateAmount().subtract(total);
					if (diffInTaxAmount.compareTo(BigDecimal.ZERO) != 0) {
						newDemandDetails.add(DemandDetail.builder().taxAmount(diffInTaxAmount)
								.taxHeadMasterCode(taxHeadEstimate.getTaxHeadCode()).tenantId(calculation.getTenantId())
								.collectionAmount(BigDecimal.ZERO).build());
					}
				}
			}
			List<DemandDetail> combinedBillDetails = new LinkedList<>(demandDetails);
			combinedBillDetails.addAll(newDemandDetails);
			addRoundOffTaxHead(calculation.getTenantId(), combinedBillDetails);
			return combinedBillDetails;
		}

		/**
		 * Search demand based on demand id and updated the tax heads with new adhoc tax heads
		 * 
		 * @param requestInfo - Request Info Object
		 * @param calculations - List of Calculations
		 * @return List of calculation
		 */
		public List<Calculation> updateDemandForAdhocTax(RequestInfo requestInfo, List<Calculation> calculations, String businessService) {
			List<Demand> demands = new LinkedList<>();
			for (Calculation calculation : calculations) {
				String consumerCode = calculation.getConnectionNo();
				List<Demand> searchResult = searchDemandBasedOnConsumerCode(calculation.getTenantId(), consumerCode,
						requestInfo, businessService);
				if (CollectionUtils.isEmpty(searchResult))
					throw new CustomException("EG_SW_INVALID_DEMAND_UPDATE",
							"No demand exists for Number: " + consumerCode);

				Collections.sort(searchResult, new Comparator<Demand>() {
					@Override
					public int compare(Demand d1, Demand d2) {
						return d1.getTaxPeriodFrom().compareTo(d2.getTaxPeriodFrom());
					}
				});

				Demand demand = searchResult.get(0);
				demand.setDemandDetails(getUpdatedAdhocTax(calculation, demand.getDemandDetails()));
				demands.add(demand);
			}

			log.info("Updated Demand Details " + demands.toString());
			demandRepository.updateDemand(requestInfo, demands);
			return calculations;
		}

	/**
	 * Search the latest demand generated for a connection.
	 *
	 * @param tenantId
	 * @param consumerCodes
	 * @param fromDateSearch
	 * @param toDateSearch
	 * @param requestInfo            - Request Info Object
	 * @param isDisconnectionRequest - Boleean value to test if it is a Disconnection request
	 * @return List of calculation
	 */
	List<Demand> searchDemandForDisconnectionRequest(String tenantId, Set<String> consumerCodes,
													 Long fromDateSearch, Long toDateSearch, RequestInfo requestInfo, Boolean isDemandPaid, Boolean isDisconnectionRequest) {
		List<Demand> demandList = searchDemand(tenantId, consumerCodes, null, toDateSearch, requestInfo,
				null, isDisconnectionRequest);
		if (!CollectionUtils.isEmpty(demandList)) {
			//Sorting the demandList in descending order to pick the latest demand generated
			demandList = demandList.stream().sorted(Comparator.comparing(Demand::getTaxPeriodTo)
					.reversed()).collect(Collectors.toList());
		}
		return demandList;
	}

}
