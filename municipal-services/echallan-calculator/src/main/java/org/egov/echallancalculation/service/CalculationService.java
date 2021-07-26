package org.egov.echallancalculation.service;


import java.util.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.common.contract.request.RequestInfo;
import org.egov.echallancalculation.config.ChallanConfiguration;
import org.egov.echallancalculation.model.Amount;
import org.egov.echallancalculation.model.Challan;
import org.egov.echallancalculation.util.CalculationUtils;
import org.egov.echallancalculation.web.models.calculation.Calculation;
import org.egov.echallancalculation.web.models.calculation.CalculationReq;
import org.egov.echallancalculation.web.models.calculation.CalulationCriteria;
import org.egov.echallancalculation.web.models.demand.TaxHeadEstimate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import lombok.extern.slf4j.Slf4j;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class CalculationService {

	
	@Autowired
	private DemandService demandService;
	
	@Autowired
	private CalculationUtils utils;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private ChallanConfiguration config;

	@Autowired
	private RestTemplate restTemplate;

	/**
	 * Get CalculationReq and Calculate the Tax Head on challan
	 */
	public List<Calculation> getCalculation(CalculationReq request) {
		
		List<Calculation> calculations = new ArrayList<Calculation>();
		calculations = getCalculation(request.getRequestInfo(),request.getCalulationCriteria());
		for(CalulationCriteria criteria : request.getCalulationCriteria()){
			String applicationStatus = criteria.getChallan().getApplicationStatus();
			if(applicationStatus.equalsIgnoreCase("CANCELLED"))
				cancelBill(request.getRequestInfo(),criteria.getChallan());
		}
		demandService.generateDemand(request.getRequestInfo(), calculations,  request.getCalulationCriteria().get(0).getChallan().getBusinessService());
		return calculations;
	}
	
	//Creating calculation using amount entered by user
	public List<Calculation> getCalculation(RequestInfo requestInfo, List<CalulationCriteria> criterias){
	      List<Calculation> calculations = new LinkedList<>();
	      for(CalulationCriteria criteria : criterias) {
	          Challan challan = criteria.getChallan();
	          if (criteria.getChallan()==null && criteria.getChallanNo() != null) {
	              challan = utils.getChallan(requestInfo, criteria.getChallanNo(), criteria.getTenantId());
	              criteria.setChallan(challan);
	          }
	          
	          List<TaxHeadEstimate> estimates = new LinkedList<>();
	          List<Amount> amount = challan.getAmount();
	          for(Amount amount1 : amount) {
	        	  TaxHeadEstimate estimate = new TaxHeadEstimate();
		          estimate.setEstimateAmount(amount1.getAmount());
		          estimate.setTaxHeadCode(amount1.getTaxHeadCode());
		          estimates.add(estimate);
	          }
	          Calculation calculation = new Calculation();
	          calculation.setChallan(criteria.getChallan());
	          calculation.setTenantId(criteria.getTenantId());
	          calculation.setTaxHeadEstimates(estimates);

	          calculations.add(calculation);

	      }
	      return calculations;
	  }

	public void cancelBill(RequestInfo requestInfo, Challan challan){
		Map<String, Object> request = new HashMap<>();
		Map<String, Object> updateBillCriteria = new HashMap<>();
		List<String> consumerCodes = Arrays.asList(challan.getChallanNo());
		String businessService = challan.getBusinessService();

		updateBillCriteria.put("tenantId", challan.getTenantId());
		updateBillCriteria.put("consumerCodes", consumerCodes);
		updateBillCriteria.put("businessService", businessService);
		updateBillCriteria.put("additionalDetails", challan.getAdditionalDetail());

		request.put("RequestInfo", requestInfo);
		request.put("UpdateBillCriteria", updateBillCriteria);

		StringBuilder url = new StringBuilder();
		url.append(config.getBillingHost()).append(config.getCancelBillEndpoint());
		try {
			Object response = restTemplate.postForObject(url.toString(), request, Map.class);
		}catch(Exception e) {
			log.error("Exception while fetching user: ", e);
		}
	}

	
	
}
