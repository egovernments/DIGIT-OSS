package org.egov.pt.calculator.service;

import static org.egov.pt.calculator.util.CalculatorConstants.BILLINGSLAB_KEY;
import static org.egov.pt.calculator.util.CalculatorConstants.PT_ROUNDOFF;
import static org.egov.pt.calculator.util.CalculatorConstants.PT_TIME_INTEREST;
import static org.egov.pt.calculator.util.CalculatorConstants.PT_TIME_PENALTY;
import static org.egov.pt.calculator.util.CalculatorConstants.PT_TIME_REBATE;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.pt.calculator.repository.Repository;
import org.egov.pt.calculator.util.CalculatorConstants;
import org.egov.pt.calculator.util.CalculatorUtils;
import org.egov.pt.calculator.util.Configurations;
import org.egov.pt.calculator.validator.CalculationValidator;
import org.egov.pt.calculator.web.models.Calculation;
import org.egov.pt.calculator.web.models.CalculationCriteria;
import org.egov.pt.calculator.web.models.CalculationReq;
import org.egov.pt.calculator.web.models.DemandDetailAndCollection;
import org.egov.pt.calculator.web.models.GetBillCriteria;
import org.egov.pt.calculator.web.models.TaxHeadEstimate;
import org.egov.pt.calculator.web.models.collections.Payment;
import org.egov.pt.calculator.web.models.demand.Bill;
import org.egov.pt.calculator.web.models.demand.BillResponse;
import org.egov.pt.calculator.web.models.demand.Demand;
import org.egov.pt.calculator.web.models.demand.DemandDetail;
import org.egov.pt.calculator.web.models.demand.DemandRequest;
import org.egov.pt.calculator.web.models.demand.DemandResponse;
import org.egov.pt.calculator.web.models.demand.TaxHeadMaster;
import org.egov.pt.calculator.web.models.demand.TaxPeriod;
import org.egov.pt.calculator.web.models.property.OwnerInfo;
import org.egov.pt.calculator.web.models.property.Property;
import org.egov.pt.calculator.web.models.property.PropertyDetail;
import org.egov.pt.calculator.web.models.property.RequestInfoWrapper;
import org.egov.tracer.model.CustomException;
import org.egov.tracer.model.ServiceCallException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONArray;

@Service
@Slf4j
public class DemandService {

	@Autowired
	private EstimationService estimationService;

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private Configurations configs;

	@Autowired
	private AssessmentService assessmentService;

	@Autowired
	private CalculatorUtils utils;

	@Autowired
	private Repository repository;

	@Autowired
	private ObjectMapper mapper;

	@Autowired
	private PayService payService;

	@Autowired
	private MasterDataService mstrDataService;

	@Autowired
	private CalculationValidator validator;

	@Autowired
	private MasterDataService mDataService;

	@Autowired
    private PaymentService paymentService;

	/**
	 * Generates and persists the demand to billing service for the given property
	 * 
	 * if the property has been assessed already for the given financial year then
	 * 
	 * it carry forwards the old collection amount to the new demand as advance
	 * 
	 * @param request
	 * @return
	 */
	public Map<String, Calculation> generateDemands(CalculationReq request) {

		List<CalculationCriteria> criterias = request.getCalculationCriteria();
		List<Demand> demands = new ArrayList<>();
		List<String> lesserAssessments = new ArrayList<>();
		Map<String, String> consumerCodeFinYearMap = new HashMap<>();
		Map<String,Object> masterMap = mDataService.getMasterMap(request);


		Map<String, Calculation> propertyCalculationMap = estimationService.getEstimationPropertyMap(request,masterMap);
		for (CalculationCriteria criteria : criterias) {

			Property property = criteria.getProperty();

			PropertyDetail detail = property.getPropertyDetails().get(0);

			Calculation calculation = propertyCalculationMap.get(property.getPropertyDetails().get(0).getAssessmentNumber());

			String assessmentNumber = detail.getAssessmentNumber();

			// pt_tax for the new assessment
			BigDecimal newTax =  BigDecimal.ZERO;
			Optional<TaxHeadEstimate> advanceCarryforwardEstimate = propertyCalculationMap.get(assessmentNumber).getTaxHeadEstimates()
			.stream().filter(estimate -> estimate.getTaxHeadCode().equalsIgnoreCase(CalculatorConstants.PT_TAX))
				.findAny();
			if(advanceCarryforwardEstimate.isPresent())
				newTax = advanceCarryforwardEstimate.get().getEstimateAmount();

			Demand oldDemand = utils.getLatestDemandForCurrentFinancialYear(request.getRequestInfo(),criteria);

			// true represents that the demand should be updated from this call
			BigDecimal carryForwardCollectedAmount = getCarryForwardAndCancelOldDemand(newTax, criteria,
					request.getRequestInfo(),oldDemand, true);

			if (carryForwardCollectedAmount.doubleValue() >= 0.0) {

				Demand demand = prepareDemand(property, calculation ,oldDemand);

				// Add billingSLabs in demand additionalDetails as map with key calculationDescription
				demand.setAdditionalDetails(Collections.singletonMap(BILLINGSLAB_KEY, calculation.getBillingSlabIds()));

				demands.add(demand);
				consumerCodeFinYearMap.put(demand.getConsumerCode(), detail.getFinancialYear());

			}else {
				lesserAssessments.add(assessmentNumber);
			}
		}
		
		if (!CollectionUtils.isEmpty(lesserAssessments)) {
			throw new CustomException(CalculatorConstants.EG_PT_DEPRECIATING_ASSESSMENT_ERROR,
					CalculatorConstants.EG_PT_DEPRECIATING_ASSESSMENT_ERROR_MSG + lesserAssessments);
		}
		
		DemandRequest dmReq = DemandRequest.builder().demands(demands).requestInfo(request.getRequestInfo()).build();
		String url = new StringBuilder().append(configs.getBillingServiceHost())
				.append(configs.getDemandCreateEndPoint()).toString();
		DemandResponse res = new DemandResponse();

		try {
			res = restTemplate.postForObject(url, dmReq, DemandResponse.class);

		} catch (HttpClientErrorException e) {
			throw new ServiceCallException(e.getResponseBodyAsString());
		}
		log.info(" The demand Response is : " + res);
	//	assessmentService.saveAssessments(res.getDemands(), consumerCodeFinYearMap, request.getRequestInfo());
		return propertyCalculationMap;
	}

	/**
	 * Generates and returns bill from billing service
	 * 
	 * updates the demand with penalty and rebate if applicable before generating
	 * bill
	 * 
	 * @param getBillCriteria
	 * @param requestInfoWrapper
	 */
	public BillResponse getBill(GetBillCriteria getBillCriteria, RequestInfoWrapper requestInfoWrapper) {

		DemandResponse res = updateDemands(getBillCriteria, requestInfoWrapper);

		/**
		 * Loop through the demands and call generateBill for each demand.
		 * Group the Bills and return the bill responsew
		 */
		List<Bill> bills = new LinkedList<>();
		BillResponse billResponse;
		ResponseInfo responseInfo = null;
		StringBuilder billGenUrl;

		Set<String> consumerCodes = res.getDemands().stream().map(Demand::getConsumerCode).collect(Collectors.toSet());

		// If toDate or fromDate is not given bill is generated across all taxPeriod for the given consumerCode
		if(getBillCriteria.getToDate()==null || getBillCriteria.getFromDate()==null){
			for(String consumerCode : consumerCodes){
				billGenUrl = utils.getBillGenUrl(getBillCriteria.getTenantId(), consumerCode);
				billResponse = mapper.convertValue(repository.fetchResult(billGenUrl, requestInfoWrapper), BillResponse.class);
				responseInfo = billResponse.getResposneInfo();
				bills.addAll(billResponse.getBill());
			}
		}
		// else if toDate and fromDate is given bill is generated for the taxPeriod corresponding to given dates for the given consumerCode
		else {
			for(Demand demand : res.getDemands()){
				billGenUrl = utils.getBillGenUrl(getBillCriteria.getTenantId(),demand.getId(),demand.getConsumerCode());
				billResponse = mapper.convertValue(repository.fetchResult(billGenUrl, requestInfoWrapper), BillResponse.class);
				responseInfo = billResponse.getResposneInfo();
				bills.addAll(billResponse.getBill());
			}
		}


		return BillResponse.builder().resposneInfo(responseInfo).bill(bills).build();
	}

	/**
	 * Method updates the demands based on the getBillCriteria
	 * 
	 * The response will be the list of demands updated for the 
	 * @param getBillCriteria
	 * @param requestInfoWrapper
	 * @return
	 */
	public DemandResponse updateDemands(GetBillCriteria getBillCriteria, RequestInfoWrapper requestInfoWrapper) {
		
		if (getBillCriteria.getAmountExpected() == null) getBillCriteria.setAmountExpected(BigDecimal.ZERO);
		validator.validateGetBillCriteria(getBillCriteria);
		RequestInfo requestInfo = requestInfoWrapper.getRequestInfo();
		Map<String, Map<String, List<Object>>> propertyBasedExemptionMasterMap = new HashMap<>();
		Map<String, JSONArray> timeBasedExmeptionMasterMap = new HashMap<>();
		mstrDataService.setPropertyMasterValues(requestInfo, getBillCriteria.getTenantId(),
				propertyBasedExemptionMasterMap, timeBasedExmeptionMasterMap);

/*
		if(CollectionUtils.isEmpty(getBillCriteria.getConsumerCodes()))
			getBillCriteria.setConsumerCodes(Collections.singletonList(getBillCriteria.getPropertyId()+ CalculatorConstants.PT_CONSUMER_CODE_SEPARATOR +getBillCriteria.getAssessmentNumber()));
*/

		DemandResponse res = mapper.convertValue(
				repository.fetchResult(utils.getDemandSearchUrl(getBillCriteria), requestInfoWrapper),
				DemandResponse.class);
		if (CollectionUtils.isEmpty(res.getDemands())) {
			return res;
		}


		/**
		 * Loop through the consumerCodes and re-calculate the time based applicables
		 */


		Map<String,List<Demand>> consumerCodeToDemandMap = new HashMap<>();
		res.getDemands().forEach(demand -> {
			if(consumerCodeToDemandMap.containsKey(demand.getConsumerCode()))
				consumerCodeToDemandMap.get(demand.getConsumerCode()).add(demand);
			else {
				List<Demand> demands = new LinkedList<>();
				demands.add(demand);
				consumerCodeToDemandMap.put(demand.getConsumerCode(),demands);
			}
		});
		
		if (CollectionUtils.isEmpty(consumerCodeToDemandMap))
			throw new CustomException(CalculatorConstants.EMPTY_DEMAND_ERROR_CODE,
					"No demands were found for the given consumerCodes : " + getBillCriteria.getConsumerCodes());

		List<Demand> demandsToBeUpdated = new LinkedList<>();

		String tenantId = getBillCriteria.getTenantId();

		List<TaxPeriod> taxPeriods = mstrDataService.getTaxPeriodList(requestInfoWrapper.getRequestInfo(), tenantId);

		for (String consumerCode : getBillCriteria.getConsumerCodes()) {
			List<Demand> demands = consumerCodeToDemandMap.get(consumerCode);
			if (CollectionUtils.isEmpty(demands))
				continue;

			for(Demand demand : demands){
				if (demand.getStatus() != null
						&& CalculatorConstants.DEMAND_CANCELLED_STATUS.equalsIgnoreCase(demand.getStatus().toString()))
					throw new CustomException(CalculatorConstants.EG_PT_INVALID_DEMAND_ERROR,
							CalculatorConstants.EG_PT_INVALID_DEMAND_ERROR_MSG);

				applytimeBasedApplicables(demand, requestInfoWrapper, timeBasedExmeptionMasterMap,taxPeriods);

				roundOffDecimalForDemand(demand, requestInfoWrapper);

				demandsToBeUpdated.add(demand);
			}
		}


		/**
		 * Call demand update in bulk to update the interest or penalty
		 */
		DemandRequest request = DemandRequest.builder().demands(demandsToBeUpdated).requestInfo(requestInfo).build();
		StringBuilder updateDemandUrl = utils.getUpdateDemandUrl();
		repository.fetchResult(updateDemandUrl, request);
		return res;
	}

	/**
	 * if any previous assessments and demands associated with it exists for the
	 * same financial year
	 * 
	 * Then Returns the collected amount of previous demand if the current
	 * assessment is for the current year
	 * 
	 * and cancels the previous demand by updating it's status to inactive
	 * 
	 * @param criteria
	 * @return
	 */
	protected BigDecimal getCarryForwardAndCancelOldDemand(BigDecimal newTax, CalculationCriteria criteria, RequestInfo requestInfo
			,Demand demand, boolean cancelDemand) {

		Property property = criteria.getProperty();

		BigDecimal carryForward = BigDecimal.ZERO;
		BigDecimal oldTaxAmt = BigDecimal.ZERO;

		if(null == property.getPropertyId()) return carryForward;

	//	Demand demand = getLatestDemandForCurrentFinancialYear(requestInfo, property);
		
		if(null == demand) return carryForward;

		carryForward = utils.getTotalCollectedAmountAndPreviousCarryForward(demand);
		
		for (DemandDetail detail : demand.getDemandDetails()) {
			if (detail.getTaxHeadMasterCode().equalsIgnoreCase(CalculatorConstants.PT_TAX))
				oldTaxAmt = oldTaxAmt.add(detail.getTaxAmount());
		}			

		log.debug("The old tax amount in string : " + oldTaxAmt.toPlainString());
		log.debug("The new tax amount in string : " + newTax.toPlainString());
		
		if (oldTaxAmt.compareTo(newTax) > 0) {
			boolean isDepreciationAllowed = utils.isAssessmentDepreciationAllowed(demand,new RequestInfoWrapper(requestInfo));
			if (!isDepreciationAllowed)
				carryForward = BigDecimal.valueOf(-1);
		}

		if (BigDecimal.ZERO.compareTo(carryForward) > 0 || !cancelDemand) return carryForward;
		
		demand.setStatus(Demand.DemandStatusEnum.CANCELLED);
		DemandRequest request = DemandRequest.builder().demands(Arrays.asList(demand)).requestInfo(requestInfo).build();
		StringBuilder updateDemandUrl = utils.getUpdateDemandUrl();
		repository.fetchResult(updateDemandUrl, request);

		return carryForward;
	}

/*	*//**
	 * @param requestInfo
	 * @param property
	 * @return
	 *//*
	@Deprecated
	public Demand getLatestDemandForCurrentFinancialYear(RequestInfo requestInfo, Property property) {
		
		Assessment assessment = Assessment.builder().propertyId(property.getPropertyId())
				.tenantId(property.getTenantId())
				.assessmentYear(property.getPropertyDetails().get(0).getFinancialYear()).build();

		List<Assessment> assessments = assessmentService.getMaxAssessment(assessment);

		if (CollectionUtils.isEmpty(assessments))
			return null;

		Assessment latestAssessment = assessments.get(0);
		log.debug(" the latest assessment : " + latestAssessment);

		DemandResponse res = mapper.convertValue(
				repository.fetchResult(utils.getDemandSearchUrl(latestAssessment), new RequestInfoWrapper(requestInfo)),
				DemandResponse.class);
		return res.getDemands().get(0);
	}*/





	/**
	 * Prepares Demand object based on the incoming calculation object and property
	 * 
	 * @param property
	 * @param calculation
	 * @return
	 */
	private Demand prepareDemand(Property property, Calculation calculation,Demand demand) {

		String tenantId = property.getTenantId();
		PropertyDetail detail = property.getPropertyDetails().get(0);
		String propertyType = detail.getPropertyType();
		String consumerCode = property.getPropertyId();

		OwnerInfo owner = null;

		for(OwnerInfo ownerInfo : detail.getOwners()){
			if(ownerInfo.getStatus().toString().equalsIgnoreCase(OwnerInfo.OwnerStatus.ACTIVE.toString())){
				owner = ownerInfo;
				break;
			}
		}	

		/*if (null != detail.getCitizenInfo())
			owner = detail.getCitizenInfo();
		else
			owner = detail.getOwners().iterator().next();*/
		
	//	Demand demand = getLatestDemandForCurrentFinancialYear(requestInfo, property);

		List<DemandDetail> details = new ArrayList<>();

		details = getAdjustedDemandDetails(tenantId,calculation,demand);

		return Demand.builder().tenantId(tenantId).businessService(configs.getPtModuleCode()).consumerType(propertyType)
				.consumerCode(consumerCode).payer(owner.toCommonUser()).taxPeriodFrom(calculation.getFromDate())
				.taxPeriodTo(calculation.getToDate()).status(Demand.DemandStatusEnum.ACTIVE)
				.minimumAmountPayable(BigDecimal.valueOf(configs.getPtMinAmountPayable())).demandDetails(details)
				.build();
	}

	/**
	 * Applies Penalty/Rebate/Interest to the incoming demands
	 * 
	 * If applied already then the demand details will be updated
	 * 
	 * @param demand
	 * @return
	 */
	private boolean applytimeBasedApplicables(Demand demand,RequestInfoWrapper requestInfoWrapper,
			Map<String, JSONArray> timeBasedExmeptionMasterMap,List<TaxPeriod> taxPeriods) {

		boolean isCurrentDemand = false;
		String tenantId = demand.getTenantId();
		String demandId = demand.getId();
		
		TaxPeriod taxPeriod = taxPeriods.stream()
				.filter(t -> demand.getTaxPeriodFrom().compareTo(t.getFromDate()) >= 0
				&& demand.getTaxPeriodTo().compareTo(t.getToDate()) <= 0)
		.findAny().orElse(null);
		
		if(!(taxPeriod.getFromDate()<= System.currentTimeMillis() && taxPeriod.getToDate() >= System.currentTimeMillis()))
			isCurrentDemand = true;
		/*
		 * method to get the latest collected time from the receipt service
		 */


		List<Payment> payments = paymentService.getPaymentsFromDemand(demand,requestInfoWrapper);


		boolean isRebateUpdated = false;
		boolean isPenaltyUpdated = false;
		boolean isInterestUpdated = false;
		
		List<DemandDetail> details = demand.getDemandDetails();

		BigDecimal taxAmt = utils.getTaxAmtFromDemandForApplicablesGeneration(demand);
		BigDecimal collectedPtTax = BigDecimal.ZERO;
		BigDecimal totalCollectedAmount = BigDecimal.ZERO;

		for (DemandDetail detail : demand.getDemandDetails()) {

			totalCollectedAmount = totalCollectedAmount.add(detail.getCollectionAmount());
			if (CalculatorConstants.TAXES_TO_BE_CONSIDERD.contains(detail.getTaxHeadMasterCode()))
				collectedPtTax = collectedPtTax.add(detail.getCollectionAmount());
		}


		Map<String, BigDecimal> rebatePenaltyEstimates = payService.applyPenaltyRebateAndInterest(taxAmt,collectedPtTax,
                taxPeriod.getFinancialYear(), timeBasedExmeptionMasterMap,payments,taxPeriod);
		
		if(null == rebatePenaltyEstimates) return isCurrentDemand;
		
		BigDecimal rebate = rebatePenaltyEstimates.get(PT_TIME_REBATE);
		BigDecimal penalty = rebatePenaltyEstimates.get(CalculatorConstants.PT_TIME_PENALTY);
		BigDecimal interest = rebatePenaltyEstimates.get(CalculatorConstants.PT_TIME_INTEREST);

		DemandDetailAndCollection latestPenaltyDemandDetail,latestInterestDemandDetail;


		BigDecimal oldRebate = BigDecimal.ZERO;
		for(DemandDetail demandDetail : details) {
			if(demandDetail.getTaxHeadMasterCode().equalsIgnoreCase(PT_TIME_REBATE)){
				oldRebate = oldRebate.add(demandDetail.getTaxAmount());
			}
		}
		if(rebate.compareTo(oldRebate)!=0){
				details.add(DemandDetail.builder().taxAmount(rebate.subtract(oldRebate))
						.taxHeadMasterCode(PT_TIME_REBATE).demandId(demandId).tenantId(tenantId)
						.build());
		}


		if(interest.compareTo(BigDecimal.ZERO)!=0){
			latestInterestDemandDetail = utils.getLatestDemandDetailByTaxHead(PT_TIME_INTEREST,details);
			if(latestInterestDemandDetail!=null){
				updateTaxAmount(interest,latestInterestDemandDetail);
				isInterestUpdated = true;
			}
		}

		if(penalty.compareTo(BigDecimal.ZERO)!=0){
			latestPenaltyDemandDetail = utils.getLatestDemandDetailByTaxHead(PT_TIME_PENALTY,details);
			if(latestPenaltyDemandDetail!=null){
				updateTaxAmount(penalty,latestPenaltyDemandDetail);
				isPenaltyUpdated = true;
			}
		}

		
		if (!isPenaltyUpdated && penalty.compareTo(BigDecimal.ZERO) > 0)
			details.add(DemandDetail.builder().taxAmount(penalty).taxHeadMasterCode(CalculatorConstants.PT_TIME_PENALTY)
					.demandId(demandId).tenantId(tenantId).build());
		if (!isInterestUpdated && interest.compareTo(BigDecimal.ZERO) > 0)
			details.add(
					DemandDetail.builder().taxAmount(interest).taxHeadMasterCode(CalculatorConstants.PT_TIME_INTEREST)
							.demandId(demandId).tenantId(tenantId).build());
		
		return isCurrentDemand;
	}

	/**
	 * 
	 * Balances the decimal values in the newly updated demand by performing a roundoff
	 * 
	 * @param demand
	 * @param requestInfoWrapper
	 */
	public void roundOffDecimalForDemand(Demand demand, RequestInfoWrapper requestInfoWrapper) {
		
		List<DemandDetail> details = demand.getDemandDetails();
		String tenantId = demand.getTenantId();
		String demandId = demand.getId();

		BigDecimal taxAmount = BigDecimal.ZERO;

		// Collecting the taxHead master codes with the isDebit field in a Map
		Map<String, Boolean> isTaxHeadDebitMap = mstrDataService.getTaxHeadMasterMap(requestInfoWrapper.getRequestInfo(), tenantId).stream()
				.collect(Collectors.toMap(TaxHeadMaster::getCode, TaxHeadMaster::getIsDebit));

		/*
		 * Summing the credit amount and Debit amount in to separate variables(based on the taxhead:isdebit map) to send to roundoffDecimal method
		 */

		BigDecimal totalRoundOffAmount = BigDecimal.ZERO;
		for (DemandDetail detail : demand.getDemandDetails()) {

			if(!detail.getTaxHeadMasterCode().equalsIgnoreCase(PT_ROUNDOFF)){
				taxAmount = taxAmount.add(detail.getTaxAmount());
			}
			else{
				totalRoundOffAmount = totalRoundOffAmount.add(detail.getTaxAmount());
			}
		}

		/*
		 *  An estimate object will be returned incase if there is a decimal value
		 *  
		 *  If no decimal value found null object will be returned 
		 */
		TaxHeadEstimate roundOffEstimate = payService.roundOffDecimals(taxAmount,totalRoundOffAmount);



		BigDecimal decimalRoundOff = null != roundOffEstimate
				? roundOffEstimate.getEstimateAmount() : BigDecimal.ZERO;

		if(decimalRoundOff.compareTo(BigDecimal.ZERO)!=0){
				details.add(DemandDetail.builder().taxAmount(roundOffEstimate.getEstimateAmount())
						.taxHeadMasterCode(roundOffEstimate.getTaxHeadCode()).demandId(demandId).tenantId(tenantId).build());
		}


	}


	/**
	 * Creates demandDetails for the new demand by adding all old demandDetails and then adding demandDetails
	 * using the difference between the new and old tax amounts for each taxHead
	 * @param tenantId The tenantId of the property
	 * @param calculation The calculation object for the property
	 * @param oldDemand The oldDemand against the property
	 * @return List of DemanDetails for the new demand
	 */
	private List<DemandDetail> getAdjustedDemandDetails(String tenantId,Calculation calculation,Demand oldDemand){

		List<DemandDetail> details = new ArrayList<>();

		/*Create map of taxHead to list of DemandDetail*/

		Map<String, List<DemandDetail>> taxHeadCodeDetailMap = new LinkedHashMap<>();
		if(oldDemand!=null){
			for(DemandDetail detail : oldDemand.getDemandDetails()){
				if(taxHeadCodeDetailMap.containsKey(detail.getTaxHeadMasterCode()))
					taxHeadCodeDetailMap.get(detail.getTaxHeadMasterCode()).add(detail);
				else {
					List<DemandDetail> detailList  = new LinkedList<>();
					detailList.add(detail);
					taxHeadCodeDetailMap.put(detail.getTaxHeadMasterCode(),detailList);
				}
			}
		}

		for (TaxHeadEstimate estimate : calculation.getTaxHeadEstimates()) {

			List<DemandDetail> detailList = taxHeadCodeDetailMap.get(estimate.getTaxHeadCode());
			taxHeadCodeDetailMap.remove(estimate.getTaxHeadCode());

			if (estimate.getTaxHeadCode().equalsIgnoreCase(CalculatorConstants.PT_ADVANCE_CARRYFORWARD))
				continue;

			if(!CollectionUtils.isEmpty(detailList)){
				details.addAll(detailList);
				BigDecimal amount= detailList.stream().map(DemandDetail::getTaxAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

				details.add(DemandDetail.builder().taxHeadMasterCode(estimate.getTaxHeadCode())
						.taxAmount(estimate.getEstimateAmount().subtract(amount))
						.collectionAmount(BigDecimal.ZERO)
						.tenantId(tenantId).build());
			}
			else{
				details.add(DemandDetail.builder().taxHeadMasterCode(estimate.getTaxHeadCode())
						.taxAmount(estimate.getEstimateAmount())
						.collectionAmount(BigDecimal.ZERO)
						.tenantId(tenantId).build());
			}
		}

		/*
		* If some taxHeads are in old demand but not in new one a new demandetail
		*  is added for each taxhead to balance it out during apportioning
		* */

		for(Map.Entry<String, List<DemandDetail>> entry : taxHeadCodeDetailMap.entrySet()){
			List<DemandDetail> demandDetails = entry.getValue();
			BigDecimal taxAmount= demandDetails.stream().map(DemandDetail::getTaxAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
			BigDecimal collectionAmount= demandDetails.stream().map(DemandDetail::getCollectionAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
			BigDecimal netAmount = collectionAmount.subtract(taxAmount);
			details.add(DemandDetail.builder().taxHeadMasterCode(entry.getKey())
					.taxAmount(netAmount)
					.collectionAmount(BigDecimal.ZERO)
					.tenantId(tenantId).build());
		}

		return details;
	}

	/**
	 * Updates the amount in the latest demandDetail by adding the diff between
	 * new and old amounts to it
	 * @param newAmount The new tax amount for the taxHead
	 * @param latestDetailInfo The latest demandDetail for the particular taxHead
	 */
	private void updateTaxAmount(BigDecimal newAmount,DemandDetailAndCollection latestDetailInfo){
		BigDecimal diff = newAmount.subtract(latestDetailInfo.getTaxAmountForTaxHead());
		BigDecimal newTaxAmountForLatestDemandDetail = latestDetailInfo.getLatestDemandDetail().getTaxAmount().add(diff);
		latestDetailInfo.getLatestDemandDetail().setTaxAmount(newTaxAmountForLatestDemandDetail);
	}

}
