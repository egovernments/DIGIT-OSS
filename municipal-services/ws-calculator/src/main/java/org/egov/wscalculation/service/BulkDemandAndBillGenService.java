package org.egov.wscalculation.service;

import java.math.BigDecimal;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.tracer.kafka.CustomKafkaTemplate;
import org.egov.wscalculation.config.WSCalculationConfiguration;
import org.egov.wscalculation.constants.WSCalculationConstant;
import org.egov.wscalculation.util.WSCalculationUtil;
import org.egov.wscalculation.web.models.BulkBillGenerator;
import org.egov.wscalculation.web.models.Calculation;
import org.egov.wscalculation.web.models.CalculationReq;
import org.egov.wscalculation.web.models.Demand;
import org.egov.wscalculation.web.models.Demand.StatusEnum;
import org.egov.wscalculation.web.models.DemandDetail;
import org.egov.wscalculation.web.models.GetBillCriteria;
import org.egov.wscalculation.web.models.Property;
import org.egov.wscalculation.web.models.RequestInfoWrapper;
import org.egov.wscalculation.web.models.WaterConnection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class BulkDemandAndBillGenService {

	
	@Autowired
	private WSCalculationServiceImpl wsCalculationService;
	
	@Autowired
	private DemandService demandService;
	
	@Autowired
	private MasterDataService mDataService;
	
    @Autowired
    private WSCalculationUtil wsCalculationUtil;
    
	@Autowired
	private WSCalculationConfiguration configs;
	
	@Autowired
	private CustomKafkaTemplate<String, Object> kafkaTemplate;
	
	@Value("${kafka.topics.bulk.bill.generation}")
	private String bulkBillGenTopic;
	
	/**
	 * 
	 * 
	 * @param request - Calculation Request Object
	 * @return List of calculation.
	 */
	public void bulkDemandGeneration(CalculationReq request) {

		Map<String, Object> masterMap = mDataService.loadMasterData(request.getRequestInfo(),
				request.getCalculationCriteria().get(0).getTenantId());
		List<Calculation> calculations = wsCalculationService.getCalculations(request, masterMap);
		BulkBillGenerator bulkBillGenerator = generateDemandInBulk(request.getRequestInfo(), calculations, masterMap,
				true);
		bulkBillGenerator.setMigrationCount(request.getMigrationCount());
		kafkaTemplate.send(bulkBillGenTopic, bulkBillGenerator);
	}
	
	
	/**
	 * Creates or updates Demand
	 * 
	 * @param requestInfo
	 *            The RequestInfo of the calculation request
	 * @param calculations
	 *            The Calculation Objects for which demand has to be generated
	 *            or updated
	 */
	public BulkBillGenerator generateDemandInBulk(RequestInfo requestInfo, List<Calculation> calculations,
			Map<String, Object> masterMap, boolean isForConnectionNo) {


			String tenantId = calculations.get(0).getTenantId();
			List<String> consumerCodes = calculations.stream().map(calculation -> calculation.getConnectionNo())
					.collect(Collectors.toList());
		
		List<Demand> createDemands = createDemands(requestInfo, calculations, masterMap, isForConnectionNo);
		
		GetBillCriteria updateDemandCriteria = GetBillCriteria.builder()
				.consumerCodes(consumerCodes)
				.tenantId(tenantId)
				.build();
		List<Demand> updateDemands = demandService.updateDemands(updateDemandCriteria, new RequestInfoWrapper(requestInfo), true);
		
		return BulkBillGenerator.builder()
				.createDemands(createDemands)
				.updateDemands(updateDemands)
				.migrationCount(null)
				.requestInfo(requestInfo)
				.build();
	}
	
	
	/**
	 * 
	 * @param requestInfo RequestInfo
	 * @param calculations List of Calculation
	 * @param masterMap Master MDMS Data
	 * @return Returns list of demands
	 */
	private List<Demand> createDemands (RequestInfo requestInfo, List<Calculation> calculations,
			Map<String, Object> masterMap, boolean isForConnectionNO) {
		
		List<Demand> demands = new LinkedList<>();
		String tenantId = calculations.get(0).getTenantId();
		Set<String> propertyIds = calculations.stream().map(Calculation::getConnectionNo).collect(Collectors.toSet());
		List<Property> properties = wsCalculationUtil.propertySearch(requestInfo, propertyIds, tenantId);
		Map<String, Property> propertyUuidMap = properties.stream().collect(Collectors.toMap(Property::getId, Function.identity()));
		
		
		for (Calculation calculation : calculations) {
			
			WaterConnection connection = calculation.getWaterConnection();
			String consumerCode = connection.getConnectionNo();
			String propertyId = connection.getPropertyId();
			User owner = propertyUuidMap.get(propertyId).getOwners().get(0).toCommonUser();
		
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
			Long expiryDate = (Long) financialYearMaster.get(WSCalculationConstant.Demand_Expiry_Date_String);
			BigDecimal minimumPayableAmount = isForConnectionNO ? configs.getMinimumPayableAmount()
					: calculation.getTotalAmount();
			String businessService = isForConnectionNO ? configs.getBusinessService()
					: WSCalculationConstant.ONE_TIME_FEE_SERVICE_FIELD;

			demandService.addRoundOffTaxHead(calculation.getTenantId(), demandDetails);

			demands.add(Demand.builder().consumerCode(consumerCode).demandDetails(demandDetails).payer(owner)
					.minimumAmountPayable(minimumPayableAmount).tenantId(tenantId).taxPeriodFrom(fromDate)
					.taxPeriodTo(toDate).consumerType("waterConnection").businessService(businessService)
					.status(StatusEnum.valueOf("ACTIVE")).billExpiryTime(expiryDate).build());
		}
		return demands;
	}
}
