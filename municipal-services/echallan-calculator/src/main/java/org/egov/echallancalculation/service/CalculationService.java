package org.egov.echallancalculation.service;


import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import org.egov.common.contract.request.RequestInfo;
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

@Service
@Slf4j
public class CalculationService {

	
	@Autowired
	private DemandService demandService;
	
	 @Autowired
	    private CalculationUtils utils;

	/**
	 * Get CalculationReq and Calculate the Tax Head on challan
	 */
	public List<Calculation> getCalculation(CalculationReq request) {
		
		List<Calculation> calculations = new ArrayList<Calculation>();
		calculations = getCalculation(request.getRequestInfo(),request.getCalulationCriteria());
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

	
	
}
