package org.egov.wscalculation.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.common.contract.request.User;
import org.egov.tracer.model.CustomException;
import org.egov.wscalculation.config.WSCalculationConfiguration;
import org.egov.wscalculation.constants.WSCalculationConstant;
import org.egov.wscalculation.producer.WSCalculationProducer;
import org.egov.wscalculation.repository.DemandRepository;
import org.egov.wscalculation.repository.ServiceRequestRepository;
import org.egov.wscalculation.repository.WSCalculationDao;
import org.egov.wscalculation.util.CalculatorUtil;
import org.egov.wscalculation.util.NotificationUtil;
import org.egov.wscalculation.util.WSCalculationUtil;
import org.egov.wscalculation.validator.WSCalculationWorkflowValidator;
import org.egov.wscalculation.web.models.*;
import org.egov.wscalculation.web.models.Demand.StatusEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;

import static org.egov.wscalculation.constants.WSCalculationConstant.ONE_TIME_FEE_SERVICE_FIELD;
import static org.egov.wscalculation.constants.WSCalculationConstant.SERVICE_FIELD_VALUE_WS;
import static org.egov.wscalculation.constants.WSCalculationConstant.MODIFY_WATER_CONNECTION;
import static org.egov.wscalculation.constants.WSCalculationConstant.DISCONNECT_WATER_CONNECTION;

@Service
@Slf4j
public class DemandService {

	@Autowired
	private ServiceRequestRepository repository;

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private PayService payService;

	@Autowired
	private MasterDataService mstrDataService;

	@Autowired
	private WSCalculationUtil utils;

	@Autowired
	private WSCalculationConfiguration configs;

	@Autowired
	private ServiceRequestRepository serviceRequestRepository;

	@Autowired
	private DemandRepository demandRepository;
    
    @Autowired
    private WSCalculationDao waterCalculatorDao;
    
    @Autowired
    private CalculatorUtil calculatorUtils;
    
    @Autowired
    private EstimationService estimationService;
    
    @Autowired
    private WSCalculationProducer wsCalculationProducer;
    
    @Autowired
    private WSCalculationUtil wsCalculationUtil;

    @Autowired
	private WSCalculationWorkflowValidator wsCalulationWorkflowValidator;

	@Autowired
	private PaymentNotificationService paymentNotificationService;

	@Autowired
	private EnrichmentService enrichmentService;

	@Autowired
	private NotificationUtil notificationUtil;

	/**
	 * Creates or updates Demand
	 * 
	 * @param request
	 *            The CalculationReq
	 * @param calculations
	 *            The Calculation Objects for which demand has to be generated
	 *            or updated
	 */
	public List<Demand> generateDemand(CalculationReq request, List<Calculation> calculations,
			Map<String, Object> masterMap, boolean isForConnectionNo) {
		@SuppressWarnings("unchecked")
		Map<String, Object> financialYearMaster =  (Map<String, Object>) masterMap
				.get(WSCalculationConstant.BILLING_PERIOD);
		Long fromDate = (Long) financialYearMaster.get(WSCalculationConstant.STARTING_DATE_APPLICABLES);
		Long toDate = (Long) financialYearMaster.get(WSCalculationConstant.ENDING_DATE_APPLICABLES);
		if(request.getIsDisconnectionRequest() != null && request.getIsDisconnectionRequest()){
			fromDate = (Long) request.getCalculationCriteria().get(0).getFrom();
			toDate = (Long) request.getCalculationCriteria().get(0).getTo();
		}
		// List that will contain Calculation for new demands
		List<Calculation> createCalculations = new LinkedList<>();
		// List that will contain Calculation for old demands
		List<Calculation> updateCalculations = new LinkedList<>();
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

			List<Demand> demands = new ArrayList<>();
			// If demand already exists add it updateCalculations else
			for (Calculation calculation : calculations) {
				if(request.getIsDisconnectionRequest() != null && request.getIsDisconnectionRequest()){
					demands = searchDemandForDisconnectionRequest(calculation.getTenantId(), consumerCodes, null,
							toDateSearch, request.getRequestInfo(), null, request.getIsDisconnectionRequest());
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
					demands = searchDemand(tenantId, consumerCodes, fromDateSearch, toDateSearch, request.getRequestInfo(), null,
							request.getIsDisconnectionRequest());
					Set<String> connectionNumbersFromDemands = new HashSet<>();
					if (!CollectionUtils.isEmpty(demands))
						connectionNumbersFromDemands = demands.stream().map(Demand::getConsumerCode)
								.collect(Collectors.toSet());
					if (!connectionNumbersFromDemands.contains(isForConnectionNo ? calculation.getConnectionNo() : calculation.getApplicationNO())) {
						createCalculations.add(calculation);
					} else
						updateCalculations.add(calculation);
				}
			}
		}
		List<Demand> createdDemands = new ArrayList<>();
		if (!CollectionUtils.isEmpty(createCalculations))
			createdDemands = createDemand(request, createCalculations, masterMap, isForConnectionNo);

		if (!CollectionUtils.isEmpty(updateCalculations))
			createdDemands = updateDemandForCalculation(request.getRequestInfo(), updateCalculations, fromDate, toDate,isForConnectionNo, request.getIsDisconnectionRequest());
		return createdDemands;
	}
	
	/**
	 * 
	 * @param calculationReq - calculation request object
	 * @param calculations List of Calculation
	 * @param masterMap Master MDMS Data
	 * @return Returns list of demands
	 */
	private List<Demand> createDemand(CalculationReq calculationReq, List<Calculation> calculations,
			Map<String, Object> masterMap, boolean isForConnectionNO) {
		List<Demand> demands = new LinkedList<>();
		Set<String> waterConnectionIds = new HashSet<>();

		RequestInfo requestInfo = calculationReq.getRequestInfo();

		for (Calculation calculation : calculations) {
			WaterConnection connection = calculation.getWaterConnection();
			if (connection == null) {
				throw new CustomException("EG_WS_INVALID_WATER_CONNECTION", "Demand cannot be generated for "
						+ (isForConnectionNO ? calculation.getConnectionNo() : calculation.getApplicationNO())
						+ " Water Connection with this number does not exist ");
			}
			WaterConnectionRequest waterConnectionRequest = WaterConnectionRequest.builder().waterConnection(connection)
					.requestInfo(requestInfo).build();
			Property property = wsCalculationUtil.getProperty(waterConnectionRequest);
			String tenantId = calculation.getTenantId();
			String consumerCode = isForConnectionNO ? calculation.getConnectionNo()
					: calculation.getApplicationNO();
			waterConnectionIds.add(consumerCode);

			User owner = property.getOwners().get(0).toCommonUser();
			if (!CollectionUtils.isEmpty(waterConnectionRequest.getWaterConnection().getConnectionHolders())) {
				owner = waterConnectionRequest.getWaterConnection().getConnectionHolders().get(0).toCommonUser();
			}
			owner = getPlainOwnerDetails(requestInfo,owner.getUuid(), tenantId);
			List<DemandDetail> demandDetails = new LinkedList<>();
			calculation.getTaxHeadEstimates().forEach(taxHeadEstimate -> {
				demandDetails.add(DemandDetail.builder().taxAmount(taxHeadEstimate.getEstimateAmount())
						.taxHeadMasterCode(taxHeadEstimate.getTaxHeadCode()).collectionAmount(BigDecimal.ZERO)
						.tenantId(tenantId).build());
			});
			@SuppressWarnings("unchecked")
			Map<String, Object> financialYearMaster = (Map<String, Object>) masterMap
					.get(WSCalculationConstant.BILLING_PERIOD);

			Long fromDate = (Long) financialYearMaster.get(WSCalculationConstant.STARTING_DATE_APPLICABLES);
			Long toDate = (Long) financialYearMaster.get(WSCalculationConstant.ENDING_DATE_APPLICABLES);

			if(calculationReq.getIsDisconnectionRequest() != null && calculationReq.getIsDisconnectionRequest()
					&& calculationReq.getCalculationCriteria().get(0).getWaterConnection().getConnectionType().equalsIgnoreCase("Metered")){
				fromDate = (Long) calculationReq.getCalculationCriteria().get(0).getFrom();
				toDate = (Long) calculationReq.getCalculationCriteria().get(0).getTo();
			}

			Long expiryDate = (Long) financialYearMaster.get(WSCalculationConstant.Demand_Expiry_Date_String);
			BigDecimal minimumPayableAmount = isForConnectionNO ? configs.getMinimumPayableAmount()
					: calculation.getTotalAmount();
			String businessService = isForConnectionNO ? configs.getBusinessService()
					: ONE_TIME_FEE_SERVICE_FIELD;

			addRoundOffTaxHead(calculation.getTenantId(), demandDetails);

			Map<String, String> additionalDetailsMap = new HashMap<>();
			additionalDetailsMap.put("propertyId", property.getPropertyId());
			demands.add(Demand.builder().consumerCode(consumerCode).demandDetails(demandDetails).payer(owner)
					.minimumAmountPayable(minimumPayableAmount).tenantId(tenantId).taxPeriodFrom(fromDate)
					.taxPeriodTo(toDate).consumerType("waterConnection").businessService(businessService)
					.status(StatusEnum.valueOf("ACTIVE")).billExpiryTime(expiryDate).additionalDetails(additionalDetailsMap).build());
		}

		String billingcycle = calculatorUtils.getBillingCycle(masterMap);
		DemandNotificationObj notificationObj = DemandNotificationObj.builder()
				.requestInfo(requestInfo)
				.tenantId(calculations.get(0).getTenantId())
				.waterConnectionIds(waterConnectionIds)
				.billingCycle(billingcycle)
				.build();

		List<Demand> demandRes = demandRepository.saveDemand(requestInfo, demands,notificationObj);
		if(isForConnectionNO)
			fetchBill(demandRes, requestInfo, masterMap);
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
			notificationUtil.parseResponse(responseMap,dobFormat);
			user = 	mapper.convertValue(users.get(0), User.class);

		} catch (Exception e) {
			throw new CustomException("EG_USER_SEARCH_ERROR", "Service returned null while fetching user");
		}
		requestInfo.setUserInfo(userInfoCopy);
		return user;
	}
	
	/**
	 * Returns the list of new DemandDetail to be added for updating the demand
	 * 
	 * @param calculation
	 *            The calculation object for the update request
	 * @param demandDetails
	 *            The list of demandDetails from the existing demand
	 * @param isDisconnectionRequest
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
				if (taxHeadEstimate.getTaxHeadCode().equalsIgnoreCase(WSCalculationConstant.WS_Round_Off))
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
			if (!demandDetail.getTaxHeadMasterCode().equalsIgnoreCase(WSCalculationConstant.WS_Round_Off))
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
			DemandDetail roundOffDemandDetail = DemandDetail.builder().taxAmount(roundOff)
					.taxHeadMasterCode(WSCalculationConstant.WS_Round_Off).tenantId(tenantId)
					.collectionAmount(BigDecimal.ZERO).build();
			demandDetails.add(roundOffDemandDetail);
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
	 * @return Lis to demands for the given consumerCode
	 */
	public List<Demand> searchDemand(String tenantId, Set<String> consumerCodes, Long taxPeriodFrom, Long taxPeriodTo,
									 RequestInfo requestInfo, Boolean isDemandPaid, Boolean isDisconnectionRequest) {
		Object result = serviceRequestRepository.fetchResult(
				getDemandSearchURL(tenantId, consumerCodes, taxPeriodFrom, taxPeriodTo, isDemandPaid, isDisconnectionRequest),
				RequestInfoWrapper.builder().requestInfo(requestInfo).build());
		try {
			return mapper.convertValue(result, DemandResponse.class).getDemands();
		} catch (IllegalArgumentException e) {
			throw new CustomException("EG_WS_PARSING_ERROR", "Failed to parse response from Demand Search");
		}

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
	 * @param tenantId TenantId
	 * @param consumerCode Connection number
	 * @param requestInfo - RequestInfo
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
			throw new CustomException("EG_WS_PARSING_ERROR", "Failed to parse response from Demand Search");
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
		mstrDataService.setWaterConnectionMasterValues(requestInfo, getBillCriteria.getTenantId(), billingSlabMaster,
				timeBasedExemptionMasterMap);

		if (CollectionUtils.isEmpty(getBillCriteria.getConsumerCodes()))
			getBillCriteria.setConsumerCodes(Collections.singletonList(getBillCriteria.getConnectionNumber()));

		DemandResponse res = mapper.convertValue(
				repository.fetchResult(utils.getDemandSearchUrl(getBillCriteria), requestInfoWrapper),
				DemandResponse.class);
		if (CollectionUtils.isEmpty(res.getDemands())) {
			return Collections.emptyList();
		}


		// Loop through the consumerCodes and re-calculate the time base applicable
		Map<String, Demand> consumerCodeToDemandMap = res.getDemands().stream()
				.collect(Collectors.toMap(Demand::getId, Function.identity()));
		List<Demand> demandsToBeUpdated = new LinkedList<>();

		String tenantId = getBillCriteria.getTenantId();

		List<TaxPeriod> taxPeriods = mstrDataService.getTaxPeriodList(requestInfoWrapper.getRequestInfo(), tenantId, SERVICE_FIELD_VALUE_WS);
		
		consumerCodeToDemandMap.forEach((id, demand) ->{
			if (demand.getStatus() != null
					&& WSCalculationConstant.DEMAND_CANCELLED_STATUS.equalsIgnoreCase(demand.getStatus().toString()))
				throw new CustomException(WSCalculationConstant.EG_WS_INVALID_DEMAND_ERROR,
						WSCalculationConstant.EG_WS_INVALID_DEMAND_ERROR_MSG);
			User owner = getPlainOwnerDetails(requestInfo,demand.getPayer().getUuid(), tenantId);
			demand.setPayer(owner);
			applyTimeBasedApplicables(demand, requestInfoWrapper, timeBasedExemptionMasterMap, taxPeriods);
			addRoundOffTaxHead(tenantId, demand.getDemandDetails());
			demandsToBeUpdated.add(demand);
		});

		//Call demand update in bulk to update the interest or penalty
		DemandRequest request = DemandRequest.builder().demands(demandsToBeUpdated).requestInfo(requestInfo).build();
		if(!isCallFromBulkGen)
		repository.fetchResult(utils.getUpdateDemandUrl(), request);
		return demandsToBeUpdated;

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
			Set<String> consumerCodes = isForConnectionNo
					? Collections.singleton(calculation.getWaterConnection().getConnectionNo())
					: Collections.singleton(calculation.getWaterConnection().getApplicationNo());
			List<Demand> searchResult = new ArrayList<>();
			if (isDisconnectionRequest) {
				searchResult = searchDemandForDisconnectionRequest(calculation.getTenantId(), consumerCodes, null,
						toDateSearch, requestInfo, null, isDisconnectionRequest);
			} else {
				searchResult = searchDemand(calculation.getTenantId(), consumerCodes, fromDateSearch,
						toDateSearch, requestInfo, null, isDisconnectionRequest);
			}
			if (CollectionUtils.isEmpty(searchResult))
				throw new CustomException("EG_WS_INVALID_DEMAND_UPDATE", "No demand exists for Number: "
						+ consumerCodes.toString());
			Demand demand = searchResult.get(0);
			String tenantId = calculation.getTenantId();
			demand.setDemandDetails(getUpdatedDemandDetails(calculation, demand.getDemandDetails(), isDisconnectionRequest));

			if(isForConnectionNo){
				WaterConnection connection = calculation.getWaterConnection();
				if (connection == null) {
					List<WaterConnection> waterConnectionList = calculatorUtils.getWaterConnection(requestInfo,
							calculation.getConnectionNo(),calculation.getTenantId());
					int size = waterConnectionList.size();
					connection = waterConnectionList.get(size-1);

				}

				if (connection.getApplicationType().equalsIgnoreCase(MODIFY_WATER_CONNECTION) ) {
					WaterConnectionRequest waterConnectionRequest = WaterConnectionRequest.builder().waterConnection(connection)
							.requestInfo(requestInfo).build();
					Property property = wsCalculationUtil.getProperty(waterConnectionRequest);
					User owner = property.getOwners().get(0).toCommonUser();
					if (!CollectionUtils.isEmpty(waterConnectionRequest.getWaterConnection().getConnectionHolders())) {
						owner = waterConnectionRequest.getWaterConnection().getConnectionHolders().get(0).toCommonUser();
					}
					owner = getPlainOwnerDetails(requestInfo, owner.getUuid(), tenantId);
					if (!(demand.getPayer().getUuid().equalsIgnoreCase(owner.getUuid())))
						demand.setPayer(owner);
				}


			}

			demands.add(demand);
		}

		log.info("Updated Demand Details " + demands.toString());
		return demandRepository.updateDemand(requestInfo, demands);
	}

	
	/**
	 * Applies Penalty/Rebate/Interest to the incoming demands
	 * 
	 * If applied already then the demand details will be updated
	 * 
	 * @param demand - Demand Object
	 * @param requestInfoWrapper RequestInfoWrapper Object
	 * @param timeBasedExemptionMasterMap - List of TimeBasedExemption details
	 * @param taxPeriods - List of tax periods
	 * @return Returns TRUE if successful, FALSE otherwise
	 */

	private boolean applyTimeBasedApplicables(Demand demand, RequestInfoWrapper requestInfoWrapper,
											  Map<String, JSONArray> timeBasedExemptionMasterMap, List<TaxPeriod> taxPeriods) {

		String tenantId = demand.getTenantId();
		String demandId = demand.getId();
		Long expiryDate = demand.getBillExpiryTime();
		TaxPeriod taxPeriod = taxPeriods.stream().filter(t -> demand.getTaxPeriodFrom().compareTo(t.getFromDate()) >= 0
				&& demand.getTaxPeriodTo().compareTo(t.getToDate()) <= 0).findAny().orElse(null);
		
		if (taxPeriod == null) {
			log.info("Demand Expired!! ->> Consumer Code "+ demand.getConsumerCode() +" Demand Id -->> "+ demand.getId());
			return false;
		}
		boolean isCurrentDemand = false;
		if (!(taxPeriod.getFromDate() <= System.currentTimeMillis()
				&& taxPeriod.getToDate() >= System.currentTimeMillis()))
			isCurrentDemand = true;
		
		if(expiryDate < System.currentTimeMillis()) {
		BigDecimal waterChargeApplicable = BigDecimal.ZERO;
		BigDecimal oldPenalty = BigDecimal.ZERO;
		BigDecimal oldInterest = BigDecimal.ZERO;
		

		for (DemandDetail detail : demand.getDemandDetails()) {
			if (WSCalculationConstant.TAX_APPLICABLE.contains(detail.getTaxHeadMasterCode())) {
				waterChargeApplicable = waterChargeApplicable.add(detail.getTaxAmount());
			}
			if (detail.getTaxHeadMasterCode().equalsIgnoreCase(WSCalculationConstant.WS_TIME_PENALTY)) {
				oldPenalty = oldPenalty.add(detail.getTaxAmount());
			}
			if (detail.getTaxHeadMasterCode().equalsIgnoreCase(WSCalculationConstant.WS_TIME_INTEREST)) {
				oldInterest = oldInterest.add(detail.getTaxAmount());
			}
		}
		
		boolean isPenaltyUpdated = false;
		boolean isInterestUpdated = false;
		
		List<DemandDetail> details = demand.getDemandDetails();

		Map<String, BigDecimal> interestPenaltyEstimates = payService.applyPenaltyRebateAndInterest(
				waterChargeApplicable, taxPeriod.getFinancialYear(), timeBasedExemptionMasterMap, expiryDate);
		if (null == interestPenaltyEstimates)
			return isCurrentDemand;

		BigDecimal penalty = interestPenaltyEstimates.get(WSCalculationConstant.WS_TIME_PENALTY);
		BigDecimal interest = interestPenaltyEstimates.get(WSCalculationConstant.WS_TIME_INTEREST);
		if(penalty == null)
			penalty = BigDecimal.ZERO;
		if(interest == null)
			interest = BigDecimal.ZERO;

		DemandDetailAndCollection latestPenaltyDemandDetail, latestInterestDemandDetail;

		if (interest.compareTo(BigDecimal.ZERO) != 0) {
			latestInterestDemandDetail = utils.getLatestDemandDetailByTaxHead(WSCalculationConstant.WS_TIME_INTEREST,
					details);
			if (latestInterestDemandDetail != null) {
				updateTaxAmount(interest, latestInterestDemandDetail);
				isInterestUpdated = true;
			}
		}

		if (penalty.compareTo(BigDecimal.ZERO) != 0) {
			latestPenaltyDemandDetail = utils.getLatestDemandDetailByTaxHead(WSCalculationConstant.WS_TIME_PENALTY,
					details);
			if (latestPenaltyDemandDetail != null) {
				updateTaxAmount(penalty, latestPenaltyDemandDetail);
				isPenaltyUpdated = true;
			}
		}

		if (!isPenaltyUpdated && penalty.compareTo(BigDecimal.ZERO) > 0)
			details.add(
					DemandDetail.builder().taxAmount(penalty.setScale(2, 2)).taxHeadMasterCode(WSCalculationConstant.WS_TIME_PENALTY)
							.demandId(demandId).tenantId(tenantId).build());
		if (!isInterestUpdated && interest.compareTo(BigDecimal.ZERO) > 0)
			details.add(
					DemandDetail.builder().taxAmount(interest.setScale(2, 2)).taxHeadMasterCode(WSCalculationConstant.WS_TIME_INTEREST)
							.demandId(demandId).tenantId(tenantId).build());
		}

		return isCurrentDemand;
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
	 * 
	 * @param tenantId
	 *            TenantId for getting master data.
	 */
	public void generateDemandForTenantId(String tenantId, RequestInfo requestInfo, BulkBillCriteria bulkBillCriteria) {
		requestInfo.getUserInfo().setTenantId(tenantId);
		generateDemandForULB(requestInfo, tenantId, bulkBillCriteria);
	}

	/**
	 * 
	 * @param master Master MDMS Data
	 * @param requestInfo Request Info
	 * @param tenantId Tenant Id
	 */
	public void generateDemandForULB(RequestInfo requestInfo, String tenantId, BulkBillCriteria bulkBillCriteria) {

		Map<String, Object> billingMasterData = calculatorUtils.loadBillingFrequencyMasterData(requestInfo, tenantId);
		
		long startDay = (((int) billingMasterData.get(WSCalculationConstant.Demand_Generate_Date_String)) / 86400000);
		if(isCurrentDateIsMatching((String) billingMasterData.get(WSCalculationConstant.Billing_Cycle_String), startDay)) {
			
			Integer batchsize = configs.getBulkbatchSize();
			Integer batchOffset = configs.getBatchOffset();

			if(bulkBillCriteria.getLimit() != null)
				batchsize = Math.toIntExact(bulkBillCriteria.getLimit());

			if(bulkBillCriteria.getOffset() != null)
				batchOffset = Math.toIntExact(bulkBillCriteria.getOffset());


			Map<String, Object> masterMap = mstrDataService.loadMasterData(requestInfo, tenantId);

			ArrayList<?> billingFrequencyMap = (ArrayList<?>) masterMap
					.get(WSCalculationConstant.Billing_Period_Master);
			mstrDataService.enrichBillingPeriod(null, billingFrequencyMap, masterMap, WSCalculationConstant.nonMeterdConnection);
			
			Map<String, Object> financialYearMaster =  (Map<String, Object>) masterMap
					.get(WSCalculationConstant.BILLING_PERIOD);
			
			Long fromDate = (Long) financialYearMaster.get(WSCalculationConstant.STARTING_DATE_APPLICABLES);
			Long toDate = (Long) financialYearMaster.get(WSCalculationConstant.ENDING_DATE_APPLICABLES);
			
			long count = waterCalculatorDao.getConnectionCount(tenantId, fromDate, toDate);
			log.info("batchsize: " + batchsize +  " batchOffset :" + batchOffset);
			log.info("Connection Count: " + count);
			log.info("fromDate: " + fromDate + " toDate :" + toDate);

			if(count>0) {
				while (batchOffset < count) {
					List<WaterConnection> connections = waterCalculatorDao.getConnectionsNoList(tenantId,
							WSCalculationConstant.nonMeterdConnection, batchOffset, batchsize, fromDate, toDate);

					connections = enrichmentService.filterConnections(connections);
					String assessmentYear = estimationService.getAssessmentYear();
					log.info("Size of the connection list for batch : "+ batchOffset + " is " + connections.size());

					if (connections.size() > 0) {
						List<CalculationCriteria> calculationCriteriaList = new ArrayList<>();
						for (WaterConnection connection : connections) {
							CalculationCriteria calculationCriteria = CalculationCriteria.builder().tenantId(tenantId)
									.assessmentYear(assessmentYear).connectionNo(connection.getConnectionNo())
									.waterConnection(connection).build();
							calculationCriteriaList.add(calculationCriteria);
						}
						MigrationCount migrationCount = MigrationCount.builder()
								.tenantid(tenantId)
								.businessService("WS")
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
						
						wsCalculationProducer.push(configs.getCreateDemand(), calculationReq);
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
	 * @param billingFrequency Billing Frequency details
	 * @param dayOfMonth Day of the given month
	 * @return true if current day is for generation of demand
	 */
	private boolean isCurrentDateIsMatching(String billingFrequency, long dayOfMonth) {
		if (billingFrequency.equalsIgnoreCase(WSCalculationConstant.Monthly_Billing_Period)
				&& (dayOfMonth <= LocalDateTime.now().getDayOfMonth())) {
			return true;
		} else if (billingFrequency.equalsIgnoreCase(WSCalculationConstant.Quaterly_Billing_Period)) {
			return false;
		}
		return true;
	}
	
	public boolean fetchBill(List<Demand> demandResponse, RequestInfo requestInfo,Map<String, Object> masterMap) {
		boolean notificationSent = false;
		List<Demand> errorMap = new ArrayList<>();
		int successCount=0;
		for (Demand demand : demandResponse) {
			try {
				Object result = serviceRequestRepository.fetchResult(
						calculatorUtils.getFetchBillURL(demand.getTenantId(), demand.getConsumerCode()),
						RequestInfoWrapper.builder().requestInfo(requestInfo).build());
				HashMap<String, Object> billResponse = new HashMap<>();
				billResponse.put("requestInfo", requestInfo);
				billResponse.put("billResponse", result);
//				log.info("Result"+result.toString());
				wsCalculationProducer.push(configs.getPayTriggers(), billResponse);
				notificationSent = true;
				successCount++;
			} catch (Exception ex) {
				log.error("Fetch Bill Error", ex);
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
 * compare and update the demand details
 * 
 * @param calculation - Calculation object
 * @param demandDetails - List Of Demand Details
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
	 * @param calculations - List of Calculation to update the Demand
	 * @return List of calculation
	 */
	public List<Calculation> updateDemandForAdhocTax(RequestInfo requestInfo, List<Calculation> calculations, String businessService) {
		List<Demand> demands = new LinkedList<>();
		for (Calculation calculation : calculations) {
			String consumerCode = calculation.getConnectionNo();
			List<Demand> searchResult = searchDemandBasedOnConsumerCode(calculation.getTenantId(), consumerCode,
					requestInfo, businessService);
			if (CollectionUtils.isEmpty(searchResult))
				throw new CustomException("EG_WS_INVALID_DEMAND_UPDATE",
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