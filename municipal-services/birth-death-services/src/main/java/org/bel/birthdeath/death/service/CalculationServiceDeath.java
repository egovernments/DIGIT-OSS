package org.bel.birthdeath.death.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.bel.birthdeath.common.calculation.TaxHeadEstimate;
import org.bel.birthdeath.common.model.Amount;
import org.bel.birthdeath.death.calculation.Calculation;
import org.bel.birthdeath.death.calculation.CalculationReq;
import org.bel.birthdeath.death.calculation.CalculationRes;
import org.bel.birthdeath.death.calculation.CalulationCriteria;
import org.bel.birthdeath.death.certmodel.DeathCertRequest;
import org.bel.birthdeath.death.certmodel.DeathCertificate;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class CalculationServiceDeath {

    @Autowired
    DemandServiceDeath demandServiceDeath;
    
    public DeathCertificate addCalculation(DeathCertRequest request){
        RequestInfo requestInfo = request.getRequestInfo();
        DeathCertificate deathCertificate = request.getDeathCertificate();

        if(deathCertificate==null)
            throw new CustomException("INVALID REQUEST","The request for calculation cannot be empty or null");

        CalculationRes response = getCalculationFromService(requestInfo,deathCertificate);
        List<Calculation> calculations = response.getCalculations();
        Map<String,Calculation> applicationNumberToCalculation = new HashMap<>();
        calculations.forEach(calculation -> {
            applicationNumberToCalculation.put(calculation.getDeathCertificate().getDeathCertificateNo(),calculation);
            calculation.setDeathCertificate(null);
        });

		deathCertificate.setCalculation(applicationNumberToCalculation.get(deathCertificate.getDeathCertificateNo()));

        return deathCertificate;
    }

    private CalculationRes getCalculationFromService(RequestInfo requestInfo,DeathCertificate deathCertificate){
    	List<CalulationCriteria> criterias = new LinkedList<>();
        criterias.add(new CalulationCriteria(deathCertificate,deathCertificate.getDeathCertificateNo(),deathCertificate.getTenantId()));
        CalculationReq request = CalculationReq.builder().calulationCriteria(criterias)
                .requestInfo(requestInfo)
                .build();

        List<Calculation> calculations = null;
		calculations = getCalculationSerivce(request);
		return CalculationRes.builder().calculations(calculations).build();
    }

    private List<Calculation> getCalculationSerivce(CalculationReq request) {
		
		List<Calculation> calculations = new ArrayList<>();
		calculations = getCalculation(request.getCalulationCriteria());
		demandServiceDeath.generateDemand(request.getRequestInfo(), calculations);
		return calculations;
	}
	
	//Creating calculation using amount entered by user
    private List<Calculation> getCalculation(List<CalulationCriteria> criterias){
	      List<Calculation> calculations = new LinkedList<>();
	      for(CalulationCriteria criteria : criterias) {
	          DeathCertificate deathCertificate = criteria.getDeathCertificate();
	          List<TaxHeadEstimate> estimates = new LinkedList<>();
	          List<Amount> amount = deathCertificate.getAmount();
	          for(Amount amount1 : amount) {
	        	  TaxHeadEstimate estimate = new TaxHeadEstimate();
		          estimate.setEstimateAmount(amount1.getAmount());
		          estimate.setTaxHeadCode(amount1.getTaxHeadCode());
		          estimates.add(estimate);
	          }
	          Calculation calculation = new Calculation();
	          calculation.setDeathCertificate(criteria.getDeathCertificate());
	          calculation.setTenantId(criteria.getTenantId());
	          calculation.setTaxHeadEstimates(estimates);

	          calculations.add(calculation);

	      }
	      return calculations;
	  }

}
