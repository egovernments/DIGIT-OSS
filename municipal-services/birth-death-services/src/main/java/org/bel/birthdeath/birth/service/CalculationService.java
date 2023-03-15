package org.bel.birthdeath.birth.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.bel.birthdeath.birth.calculation.Calculation;
import org.bel.birthdeath.birth.calculation.CalculationReq;
import org.bel.birthdeath.birth.calculation.CalculationRes;
import org.bel.birthdeath.birth.calculation.CalulationCriteria;
import org.bel.birthdeath.birth.certmodel.BirthCertRequest;
import org.bel.birthdeath.birth.certmodel.BirthCertificate;
import org.bel.birthdeath.common.calculation.TaxHeadEstimate;
import org.bel.birthdeath.common.model.Amount;
import org.egov.common.contract.request.RequestInfo;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class CalculationService {


    @Autowired
    CalculationService calculationService;
    
    @Autowired
    DemandService demandService;
    
    public BirthCertificate addCalculation(BirthCertRequest request){
        RequestInfo requestInfo = request.getRequestInfo();
        BirthCertificate birthCertificate = request.getBirthCertificate();

        if(birthCertificate==null)
            throw new CustomException("INVALID REQUEST","The request for calculation cannot be empty or null");

        CalculationRes response = getCalculationFromService(requestInfo,birthCertificate);
        List<Calculation> calculations = response.getCalculations();
        Map<String,Calculation> applicationNumberToCalculation = new HashMap<>();
        calculations.forEach(calculation -> {
            applicationNumberToCalculation.put(calculation.getBirthCertificate().getBirthCertificateNo(),calculation);
            calculation.setBirthCertificate(null);
        });

		birthCertificate.setCalculation(applicationNumberToCalculation.get(birthCertificate.getBirthCertificateNo()));

        return birthCertificate;
    }

    private CalculationRes getCalculationFromService(RequestInfo requestInfo,BirthCertificate birthCertificate){
    	List<CalulationCriteria> criterias = new LinkedList<>();
        criterias.add(new CalulationCriteria(birthCertificate,birthCertificate.getBirthCertificateNo(),birthCertificate.getTenantId()));
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
		demandService.generateDemand(request.getRequestInfo(), calculations);
		return calculations;
	}
	
	//Creating calculation using amount entered by user
    private List<Calculation> getCalculation(List<CalulationCriteria> criterias){
	      List<Calculation> calculations = new LinkedList<>();
	      for(CalulationCriteria criteria : criterias) {
	          BirthCertificate birthCertificate = criteria.getBirthCertificate();
	          List<TaxHeadEstimate> estimates = new LinkedList<>();
	          List<Amount> amount = birthCertificate.getAmount();
	          for(Amount amount1 : amount) {
	        	  TaxHeadEstimate estimate = new TaxHeadEstimate();
		          estimate.setEstimateAmount(amount1.getAmount());
		          estimate.setTaxHeadCode(amount1.getTaxHeadCode());
		          estimates.add(estimate);
	          }
	          Calculation calculation = new Calculation();
	          calculation.setBirthCertificate(criteria.getBirthCertificate());
	          calculation.setTenantId(criteria.getTenantId());
	          calculation.setTaxHeadEstimates(estimates);

	          calculations.add(calculation);

	      }
	      return calculations;
	  }

}
