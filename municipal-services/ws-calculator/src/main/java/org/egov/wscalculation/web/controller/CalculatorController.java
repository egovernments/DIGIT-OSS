package org.egov.wscalculation.web.controller;


import java.util.List;

import javax.validation.Valid;

import org.egov.wscalculation.web.models.AdhocTaxReq;
import org.egov.wscalculation.web.models.Calculation;
import org.egov.wscalculation.web.models.CalculationReq;
import org.egov.wscalculation.web.models.CalculationRes;
import org.egov.wscalculation.web.models.Demand;
import org.egov.wscalculation.web.models.DemandResponse;
import org.egov.wscalculation.web.models.GetBillCriteria;
import org.egov.wscalculation.web.models.RequestInfoWrapper;
import org.egov.wscalculation.service.DemandService;
import org.egov.wscalculation.service.WSCalculationService;
import org.egov.wscalculation.service.WSCalculationServiceImpl;
import org.egov.wscalculation.util.ResponseInfoFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Builder
@RestController
@RequestMapping("/waterCalculator")
public class CalculatorController {
	
	
	@Autowired
	private DemandService demandService;
	
	@Autowired
	private WSCalculationService wSCalculationService;
	
	@Autowired
	private WSCalculationServiceImpl wSCalculationServiceImpl;
	
	@Autowired
	private final ResponseInfoFactory responseInfoFactory;
	
	@PostMapping("/_estimate")
	public ResponseEntity<CalculationRes> getTaxEstimation(@RequestBody @Valid CalculationReq calculationReq) {
		List<Calculation> calculations = wSCalculationServiceImpl.getEstimation(calculationReq);
		CalculationRes response = CalculationRes.builder().calculation(calculations)
				.responseInfo(
						responseInfoFactory.createResponseInfoFromRequestInfo(calculationReq.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PostMapping("/_calculate")
	public ResponseEntity<CalculationRes> calculate(@RequestBody @Valid CalculationReq calculationReq) {
		List<Calculation> calculations = wSCalculationService.getCalculation(calculationReq);
		CalculationRes response = CalculationRes.builder().calculation(calculations)
				.responseInfo(
						responseInfoFactory.createResponseInfoFromRequestInfo(calculationReq.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PostMapping("/_updateDemand")
	public ResponseEntity<DemandResponse> updateDemands(@RequestBody @Valid RequestInfoWrapper requestInfoWrapper,
			@ModelAttribute @Valid GetBillCriteria getBillCriteria) {
		List<Demand> demands = demandService.updateDemands(getBillCriteria, requestInfoWrapper);
		DemandResponse response = DemandResponse.builder().demands(demands)
				.responseInfo(
				responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
	
	@PostMapping("/_jobscheduler")
	public void jobscheduler(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper) {
		wSCalculationService.generateDemandBasedOnTimePeriod(requestInfoWrapper.getRequestInfo());
	}
	
	@PostMapping("/_applyAdhocTax")
	public ResponseEntity<CalculationRes> applyAdhocTax(@Valid @RequestBody AdhocTaxReq adhocTaxReq) {
		List<Calculation> calculations = wSCalculationServiceImpl.applyAdhocTax(adhocTaxReq);
		CalculationRes response = CalculationRes.builder().calculation(calculations)
				.responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(adhocTaxReq.getRequestInfo(), true))
				.build();
		return new ResponseEntity<>(response, HttpStatus.OK);

	}
}
