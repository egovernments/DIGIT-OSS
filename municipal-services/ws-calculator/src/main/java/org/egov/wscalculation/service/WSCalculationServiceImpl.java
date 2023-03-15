package org.egov.wscalculation.service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.minidev.json.JSONArray;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.tracer.model.CustomException;
import org.egov.wscalculation.constants.WSCalculationConstant;
import org.egov.wscalculation.util.WaterCessUtil;
import org.egov.wscalculation.web.models.*;
import org.egov.wscalculation.repository.ServiceRequestRepository;
import org.egov.wscalculation.repository.WSCalculationDao;
import org.egov.wscalculation.util.CalculatorUtil;
import org.egov.wscalculation.util.WSCalculationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

import static org.egov.wscalculation.constants.WSCalculationConstant.*;
import static org.egov.wscalculation.web.models.TaxHeadCategory.CHARGES;

@Service
@Slf4j
public class WSCalculationServiceImpl implements WSCalculationService {

	@Autowired
	private PayService payService;

	@Autowired
	private EstimationService estimationService;
	
	@Autowired
	private CalculatorUtil calculatorUtil;
	
	@Autowired
	private DemandService demandService;
	
	@Autowired
	private MasterDataService masterDataService; 

	@Autowired
	private WSCalculationDao wSCalculationDao;
	
	@Autowired
	private ServiceRequestRepository repository;
	
	@Autowired
	private WSCalculationUtil wSCalculationUtil;

	@Autowired
	private CalculatorUtil util;

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private WaterCessUtil waterCessUtil;

	@Autowired
	private MasterDataService mDataService;


	/**
	 * Get CalculationReq and Calculate the Tax Head on Water Charge And Estimation Charge
	 */
	public List<Calculation> getCalculation(CalculationReq request) {
		List<Calculation> calculations;

		Map<String, Object> masterMap;
		boolean connectionRequest = false;
		//Calculate and create demand for connection
		if (request.getIsDisconnectionRequest() != null && request.getIsDisconnectionRequest()) {
			MeterReadingSearchCriteria meterCriteria = new MeterReadingSearchCriteria();
			meterCriteria.setTenantId(request.getCalculationCriteria().get(0).getTenantId());
			meterCriteria.setConnectionNos(Collections.singleton(request.getCalculationCriteria().get(0).getConnectionNo()));
			List<MeterReading> meterreadingList = wSCalculationDao.searchMeterReadings(meterCriteria);
			if (!meterreadingList.isEmpty()) {
				request.getCalculationCriteria().get(0).setLastReading(meterreadingList.get(0).getLastReading());
				request.getCalculationCriteria().get(0).setCurrentReading(meterreadingList.get(0).getCurrentReading());
				SimpleDateFormat f = new SimpleDateFormat("dd/MM/yyyy");
				String dates[] = meterreadingList.get(0).getBillingPeriod().split("-");
				try {
					Date startDate = f.parse(dates[0]);
					request.getCalculationCriteria().get(0).setFrom(startDate.getTime() + ONE_DAY_ADDON);
					Date endDate = f.parse(dates[1]);
					request.getCalculationCriteria().get(0).setTo(endDate.getTime() + ONE_DAY_ADDON);
				} catch (ParseException e) {
					throw new RuntimeException(e);
				}
			}
			connectionRequest = request.getIsDisconnectionRequest();
			masterMap = masterDataService.loadMasterData(request.getRequestInfo(),
					request.getCalculationCriteria().get(0).getTenantId());
			calculations = getCalculations(request, masterMap);
		} else if (request.getIsconnectionCalculation()) {
			connectionRequest = request.getIsconnectionCalculation();
			masterMap = masterDataService.loadMasterData(request.getRequestInfo(),
					request.getCalculationCriteria().get(0).getTenantId());
			calculations = getCalculations(request, masterMap);
		} else {
			//Calculate and create demand for application
			masterMap = masterDataService.loadExemptionMaster(request.getRequestInfo(),
					request.getCalculationCriteria().get(0).getTenantId());
			calculations = getFeeCalculation(request, masterMap);
			connectionRequest = request.getIsconnectionCalculation();
		}
		demandService.generateDemand(request, calculations, masterMap, connectionRequest);
		unsetWaterConnection(calculations);
		return calculations;
	}
	

	/**
	 * 
	 * @param request - Calculation Request Object
	 * @return list of calculation based on request
	 */
	public List<Calculation> getEstimation(CalculationReq request) {
		Map<String, Object> masterData = masterDataService.loadExemptionMaster(request.getRequestInfo(),
				request.getCalculationCriteria().get(0).getTenantId());
		List<Calculation> calculations = getFeeCalculation(request, masterData);
		unsetWaterConnection(calculations);
		return calculations;
	}
	
	/**
	 * It will take calculation and return calculation with tax head code 
	 * 
	 * @param requestInfo Request Info Object
	 * @param criteria Calculation criteria on meter charge
	 * @param estimatesAndBillingSlabs Billing Slabs
	 * @param masterMap Master MDMS Data
	 * @return Calculation With Tax head
	 */
	public Calculation getCalculation(RequestInfo requestInfo, CalculationCriteria criteria,
									  Map<String, List> estimatesAndBillingSlabs, Map<String, Object> masterMap, boolean isConnectionFee, boolean isLastElementWithDisconnectionRequest) {

		@SuppressWarnings("unchecked")
		List<TaxHeadEstimate> estimates = estimatesAndBillingSlabs.get("estimates");
		@SuppressWarnings("unchecked")
		List<String> billingSlabIds = estimatesAndBillingSlabs.get("billingSlabIds");
		WaterConnection waterConnection = criteria.getWaterConnection();
		
		@SuppressWarnings("unchecked")
		Map<String, TaxHeadCategory> taxHeadCategoryMap = ((List<TaxHeadMaster>) masterMap
				.get(WSCalculationConstant.TAXHEADMASTER_MASTER_KEY)).stream()
						.collect(Collectors.toMap(TaxHeadMaster::getCode, TaxHeadMaster::getCategory, (OldValue, NewValue) -> NewValue));

		BigDecimal taxAmt = BigDecimal.ZERO;
		BigDecimal waterCharge = BigDecimal.ZERO;
		BigDecimal penalty = BigDecimal.ZERO;
		BigDecimal exemption = BigDecimal.ZERO;
		BigDecimal rebate = BigDecimal.ZERO;
		BigDecimal fee = BigDecimal.ZERO;

		Map<String, Object> financialYearMaster =  (Map<String, Object>) masterMap
				.get(WSCalculationConstant.BILLING_PERIOD);
		Long fromDate = (Long) financialYearMaster.get(WSCalculationConstant.STARTING_DATE_APPLICABLES);
		Long toDate = (Long) financialYearMaster.get(WSCalculationConstant.ENDING_DATE_APPLICABLES);
		if(isLastElementWithDisconnectionRequest) {
			if (waterConnection.getApplicationStatus().equalsIgnoreCase(WSCalculationConstant.PENDING_APPROVAL_FOR_DISCONNECTION)) {

				Map<String, Object> finalMap = new HashMap<>();
				List<WaterConnection> waterConnectionList = calculatorUtil.getWaterConnection(requestInfo, criteria.getConnectionNo(), requestInfo.getUserInfo().getTenantId());
				for (WaterConnection connection : waterConnectionList) {
					if (connection.getApplicationType().equalsIgnoreCase(NEW_WATER_CONNECTION)) {
						List<Demand> demandsList = demandService.searchDemandForDisconnectionRequest(requestInfo.getUserInfo().getTenantId(), Collections.singleton(connection.getConnectionNo()),
								null,	toDate, requestInfo, null, isLastElementWithDisconnectionRequest);
						Demand demand = null;
						if (!CollectionUtils.isEmpty(demandsList)) {
							demand = demandsList.get(0);
							fromDate = (Long) demand.getTaxPeriodFrom();
							toDate = (Long) demand.getTaxPeriodTo();
							BigDecimal totalTaxAmount = BigDecimal.ZERO;
							List<DemandDetail> demandDetails = demand.getDemandDetails();
							for (DemandDetail demandDetail : demandDetails) {
								totalTaxAmount = totalTaxAmount.add(demandDetail.getTaxAmount());
							}
							Integer taxPeriod = Math.round((toDate - fromDate) / 86400000);
							Long daysOfUsage = Math.round(Math.abs(Double.parseDouble(toDate.toString()) - waterConnection.getDateEffectiveFrom()) / 86400000);
							BigDecimal finalWaterCharge = waterCharge.add(BigDecimal.valueOf(
									(Double.parseDouble(totalTaxAmount.toString()) * daysOfUsage) / taxPeriod));
							criteria.setTo(waterConnection.getDateEffectiveFrom());
							criteria.setFrom(toDate);

							//Calculate water cess for disconnection charge
							BigDecimal waterCess = getWaterCessForDisconnection(masterMap, finalWaterCharge);
							for (TaxHeadEstimate estimate : estimates) {
								if (estimate.getTaxHeadCode().equals(WS_WATER_CESS)) {
									estimates.remove(estimate);
									break;
								}
							}
							estimates.add(TaxHeadEstimate.builder().taxHeadCode(WSCalculationConstant.WS_WATER_CESS)
									.estimateAmount(waterCess.setScale(2, 2)).build());
							estimates.stream().forEach(estimate -> {
								if (taxHeadCategoryMap.containsKey(estimate.getTaxHeadCode())) {
									if (taxHeadCategoryMap.get(estimate.getTaxHeadCode()).equals(CHARGES)) {
										estimate.setEstimateAmount(finalWaterCharge);
									}
								}
							});
						}
					}
				}
			}
		}

		for (TaxHeadEstimate estimate : estimates) {

			TaxHeadCategory category = taxHeadCategoryMap.get(estimate.getTaxHeadCode());
			estimate.setCategory(category);

			switch (category) {

			case CHARGES:
				waterCharge = waterCharge.add(estimate.getEstimateAmount());
				break;

			case PENALTY:
				penalty = penalty.add(estimate.getEstimateAmount());
				break;

			case REBATE:
				rebate = rebate.add(estimate.getEstimateAmount());
				break;

			case EXEMPTION:
				exemption = exemption.add(estimate.getEstimateAmount());
				break;
			case FEE:
				fee = fee.add(estimate.getEstimateAmount());
				break;
			default:
				taxAmt = taxAmt.add(estimate.getEstimateAmount());
				break;
			}
		}
		TaxHeadEstimate decimalEstimate = payService.roundOfDecimals(taxAmt.add(penalty).add(waterCharge).add(fee),
				rebate.add(exemption), isConnectionFee);
		if (null != decimalEstimate) {
			decimalEstimate.setCategory(taxHeadCategoryMap.get(decimalEstimate.getTaxHeadCode()));
			estimates.add(decimalEstimate);
			if (decimalEstimate.getEstimateAmount().compareTo(BigDecimal.ZERO) >= 0)
				taxAmt = taxAmt.add(decimalEstimate.getEstimateAmount());
			else
				rebate = rebate.add(decimalEstimate.getEstimateAmount());
		}

		BigDecimal totalAmount = taxAmt.add(penalty).add(rebate).add(exemption).add(waterCharge).add(fee);
		return Calculation.builder().totalAmount(totalAmount).taxAmount(taxAmt).penalty(penalty).exemption(exemption)
				.charge(waterCharge).fee(fee).waterConnection(waterConnection).rebate(rebate).tenantId(criteria.getTenantId())
				.taxHeadEstimates(estimates).billingSlabIds(billingSlabIds).connectionNo(criteria.getConnectionNo()).applicationNO(criteria.getApplicationNo())
				.build();
	}
	
	/**
	 * 
	 * @param request would be calculations request
	 * @param masterMap master data
	 * @return all calculations including water charge and taxhead on that
	 */
	public List<Calculation> getCalculations(CalculationReq request, Map<String, Object> masterMap) {
		List<Calculation> calculations = new ArrayList<>(request.getCalculationCriteria().size());
		for (CalculationCriteria criteria : request.getCalculationCriteria()) {
			Map<String, List> estimationMap = estimationService.getEstimationMap(criteria, request.getRequestInfo(),
					masterMap);
			ArrayList<?> billingFrequencyMap = (ArrayList<?>) masterMap
					.get(WSCalculationConstant.Billing_Period_Master);
			masterDataService.enrichBillingPeriod(criteria, billingFrequencyMap, masterMap, criteria.getWaterConnection().getConnectionType());

			Calculation calculation = null;

			if (request.getIsDisconnectionRequest() != null) {
				if (request.getIsDisconnectionRequest() &&
						criteria.getApplicationNo().equals(request.getCalculationCriteria().get(request.getCalculationCriteria().size() - 1)
								.getApplicationNo())) {
					calculation = getCalculation(request.getRequestInfo(), criteria, estimationMap, masterMap, true, true);
				}
			} else {
				calculation = getCalculation(request.getRequestInfo(), criteria, estimationMap, masterMap, true, false);
			}
			calculations.add(calculation);
		}
		return calculations;
	}


	@Override
	public void jobScheduler() {
		// TODO Auto-generated method stub
		ArrayList<String> tenantIds = wSCalculationDao.searchTenantIds();

		for (String tenantId : tenantIds) {
			RequestInfo requestInfo = new RequestInfo();
			User user = new User();
			user.setTenantId(tenantId);
			requestInfo.setUserInfo(user);
			String jsonPath = WSCalculationConstant.JSONPATH_ROOT_FOR_BilingPeriod;
			MdmsCriteriaReq mdmsCriteriaReq = calculatorUtil.getBillingFrequency(requestInfo, tenantId);
			StringBuilder url = calculatorUtil.getMdmsSearchUrl();
			Object res = repository.fetchResult(url, mdmsCriteriaReq);
			if (res == null) {
				throw new CustomException("MDMS_ERROR_FOR_BILLING_FREQUENCY",
						"ERROR IN FETCHING THE BILLING FREQUENCY");
			}
			ArrayList<?> mdmsResponse = JsonPath.read(res, jsonPath);
			getBillingPeriod(mdmsResponse, requestInfo, tenantId);
		}
	}
	

	@SuppressWarnings("unchecked")
	public void getBillingPeriod(ArrayList<?> mdmsResponse, RequestInfo requestInfo, String tenantId) {
		log.info("Billing Frequency Map" + mdmsResponse.toString());
		Map<String, Object> master = (Map<String, Object>) mdmsResponse.get(0);
		LocalDateTime demandStartingDate = LocalDateTime.now();
		Long demandGenerateDateMillis = (Long) master.get(WSCalculationConstant.Demand_Generate_Date_String);

		String connectionType = "Non-metred";

		if (demandStartingDate.getDayOfMonth() == (demandGenerateDateMillis) / 86400) {

			ArrayList<String> connectionNos = wSCalculationDao.searchConnectionNos(connectionType, tenantId);
			for (String connectionNo : connectionNos) {

				CalculationReq calculationReq = new CalculationReq();
				CalculationCriteria calculationCriteria = new CalculationCriteria();
				calculationCriteria.setTenantId(tenantId);
				calculationCriteria.setConnectionNo(connectionNo);

				List<CalculationCriteria> calculationCriteriaList = new ArrayList<>();
				calculationCriteriaList.add(calculationCriteria);

				calculationReq.setRequestInfo(requestInfo);
				calculationReq.setCalculationCriteria(calculationCriteriaList);
				calculationReq.setIsconnectionCalculation(true);
				getCalculation(calculationReq);

			}
		}
	}

	/**
	 * Generate Demand Based on Time (Monthly, Quarterly, Yearly)
	 */
	public void generateDemandBasedOnTimePeriod(RequestInfo requestInfo, BulkBillCriteria bulkBillCriteria) {
		DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		LocalDateTime date = LocalDateTime.now();
		log.info("Time schedule start for water demand generation on : " + date.format(dateTimeFormatter));
		List<String> tenantIds = new ArrayList<>();
		if(!CollectionUtils.isEmpty(bulkBillCriteria.getTenantIds())){
			tenantIds = bulkBillCriteria.getTenantIds();
		}
		else
			tenantIds = wSCalculationDao.getTenantId();

		if (tenantIds.isEmpty())
			return;
		log.info("Tenant Ids : " + tenantIds);
		tenantIds.forEach(tenantId -> {
			demandService.generateDemandForTenantId(tenantId, requestInfo, bulkBillCriteria);
		});
	}
	
	/**
	 * 
	 * @param request - Calculation Request Object
	 * @param masterMap - Master MDMS Data
	 * @return list of calculation based on estimation criteria
	 */
	List<Calculation> getFeeCalculation(CalculationReq request, Map<String, Object> masterMap) {
		List<Calculation> calculations = new ArrayList<>(request.getCalculationCriteria().size());
		for (CalculationCriteria criteria : request.getCalculationCriteria()) {
			Map<String, List> estimationMap = estimationService.getFeeEstimation(criteria, request.getRequestInfo(),
					masterMap);
			masterDataService.enrichBillingPeriodForFee(masterMap);
			Calculation calculation = getCalculation(request.getRequestInfo(), criteria, estimationMap, masterMap, false, false);
			calculations.add(calculation);
		}
		return calculations;
	}
	
	public void unsetWaterConnection(List<Calculation> calculation) {
		calculation.forEach(cal -> cal.setWaterConnection(null));
	}
	
	/**
	 * Add adhoc tax to demand
	 * @param adhocTaxReq - Adhox Tax Request Object
	 * @return List of Calculation
	 */
	public List<Calculation> applyAdhocTax(AdhocTaxReq adhocTaxReq) {
		List<TaxHeadEstimate> estimates = new ArrayList<>();
		String businessService = adhocTaxReq.getBusinessService();
		if(!businessService.equalsIgnoreCase(SERVICE_FIELD_VALUE_WS) && !businessService.equalsIgnoreCase(ONE_TIME_FEE_SERVICE_FIELD))
			throw new CustomException("INVALID_BUSINESSSERVICE", "Provide businessService is invalid");

		if (!(adhocTaxReq.getAdhocpenalty().compareTo(BigDecimal.ZERO) == 0)){
			String penaltyTaxhead = businessService.equals(SERVICE_FIELD_VALUE_WS) ? WS_TIME_ADHOC_PENALTY : WS_ADHOC_PENALTY;
			estimates.add(TaxHeadEstimate.builder().taxHeadCode(penaltyTaxhead)
					.estimateAmount(adhocTaxReq.getAdhocpenalty().setScale(2, 2)).build());
		}
		if (!(adhocTaxReq.getAdhocrebate().compareTo(BigDecimal.ZERO) == 0)){
			String rebateTaxhead = businessService.equals(SERVICE_FIELD_VALUE_WS) ? WS_TIME_ADHOC_REBATE : WS_ADHOC_REBATE;
			estimates.add(TaxHeadEstimate.builder().taxHeadCode(rebateTaxhead)
					.estimateAmount(adhocTaxReq.getAdhocrebate().setScale(2, 2).negate()).build());
		}
		
		Calculation calculation = Calculation.builder()
				.tenantId(adhocTaxReq.getRequestInfo().getUserInfo().getTenantId())
				.connectionNo(adhocTaxReq.getConsumerCode()).taxHeadEstimates(estimates).build();
		List<Calculation> calculations = Collections.singletonList(calculation);
		return demandService.updateDemandForAdhocTax(adhocTaxReq.getRequestInfo(), calculations, businessService);
	}

	/**
	 * Calculate WaterCess during Disconnection Application final Water charge calculation
	 *
	 * @param masterMap
	 * @return waterCess - watercess amount
	 */
	private BigDecimal getWaterCessForDisconnection(Map<String, Object> masterMap, BigDecimal finalWaterCharge) {
		BigDecimal waterCess = BigDecimal.ZERO;
		Map<String, JSONArray> timeBasedExemptionMasterMap = new HashMap<>();
		timeBasedExemptionMasterMap.put(WSCalculationConstant.WC_WATER_CESS_MASTER,
				(JSONArray) (masterMap.getOrDefault(WSCalculationConstant.WC_WATER_CESS_MASTER, null)));

		if (timeBasedExemptionMasterMap.get(WSCalculationConstant.WC_WATER_CESS_MASTER) != null) {
			List<Object> waterCessMasterList = timeBasedExemptionMasterMap
					.get(WSCalculationConstant.WC_WATER_CESS_MASTER);

			Map<String, Object> CessMap = mDataService.getApplicableMaster(WSCalculationConstant.Assessment_Year, waterCessMasterList);
			waterCess = waterCessUtil.calculateWaterCess(finalWaterCharge, CessMap);

		}
		return waterCess;
	}
	
}
