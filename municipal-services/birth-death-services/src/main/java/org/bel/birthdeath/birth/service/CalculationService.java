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
        BirthCertificate BirthCertificate = request.getBirthCertificate();

        if(BirthCertificate==null)
            throw new CustomException("INVALID REQUEST","The request for calculation cannot be empty or null");

        CalculationRes response = getCalculationFromService(requestInfo,BirthCertificate);
        List<Calculation> calculations = response.getCalculations();
        Map<String,Calculation> applicationNumberToCalculation = new HashMap<>();
        calculations.forEach(calculation -> {
            applicationNumberToCalculation.put(calculation.getBirthCertificate().getBirthCertificateNo(),calculation);
            calculation.setBirthCertificate(null);
        });

            BirthCertificate.setCalculation(applicationNumberToCalculation.get(BirthCertificate.getBirthCertificateNo()));

        return BirthCertificate;
    }

    private CalculationRes getCalculationFromService(RequestInfo requestInfo,BirthCertificate birthCertificate){
    	List<CalulationCriteria> criterias = new LinkedList<>();
        criterias.add(new CalulationCriteria(birthCertificate,birthCertificate.getBirthCertificateNo(),birthCertificate.getTenantId()));
        CalculationReq request = CalculationReq.builder().calulationCriteria(criterias)
                .requestInfo(requestInfo)
                .build();

        List<Calculation> calculations = null;
		calculations = getCalculationSerivce(request);
		CalculationRes calculationRes = CalculationRes.builder().calculations(calculations).build();
		return calculationRes;
    }

    private List<Calculation> getCalculationSerivce(CalculationReq request) {
		
		List<Calculation> calculations = new ArrayList<Calculation>();
		calculations = getCalculation(request.getRequestInfo(),request.getCalulationCriteria());
		demandService.generateDemand(request.getRequestInfo(), calculations,  request.getCalulationCriteria().get(0).getBirthCertificate().getBusinessService());
		return calculations;
	}
	
	//Creating calculation using amount entered by user
    private List<Calculation> getCalculation(RequestInfo requestInfo, List<CalulationCriteria> criterias){
	      List<Calculation> calculations = new LinkedList<>();
	      for(CalulationCriteria criteria : criterias) {
	          BirthCertificate BirthCertificate = criteria.getBirthCertificate();
	          /*if (criteria.getBirthCertificate()==null && criteria.getBirthCertificateNo() != null) {
	              BirthCertificate = utils.getBirthCertificate(requestInfo, criteria.getBirthCertificateNo(), criteria.getTenantId());
	              criteria.setBirthCertificate(BirthCertificate);
	          }*/
	          
	          List<TaxHeadEstimate> estimates = new LinkedList<>();
	          List<Amount> amount = BirthCertificate.getAmount();
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
