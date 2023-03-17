package org.egov.fsm.calculator.web.controllers;

import java.math.BigDecimal;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.fsm.calculator.services.CalculationService;
import org.egov.fsm.calculator.services.DemandService;
import org.egov.fsm.calculator.utils.ResponseInfoFactory;
import org.egov.fsm.calculator.web.models.AdvanceAmountResponse;
import org.egov.fsm.calculator.web.models.Calculation;
import org.egov.fsm.calculator.web.models.CalculationReq;
import org.egov.fsm.calculator.web.models.CalculationRes;
import org.egov.fsm.calculator.web.models.CancellationAmountResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/v1")
@Slf4j
public class CalculatorController {

	private ObjectMapper objectMapper;

	private HttpServletRequest request;

	private CalculationService calculationService;

	private DemandService demandService;
	
	@Autowired
	private ResponseInfoFactory responseInfoFactory;

	@Autowired
	public CalculatorController(ObjectMapper objectMapper, HttpServletRequest request,
			CalculationService calculationService, DemandService demandService) {
		this.objectMapper = objectMapper;
		this.request = request;
		this.calculationService = calculationService;
		this.demandService = demandService;
	}

	/**
	 * Calulates the FSM fee and creates Demand
	 * 
	 * @param calculationReq The calculation Request
	 * @return Calculation Response
	 */
	@PostMapping(value = "/_calculate")
	public ResponseEntity<CalculationRes> calculate(@Valid @RequestBody CalculationReq calculationReq) {
		log.debug("CalculationReaquest:: " + calculationReq);
		List<Calculation> calculations = calculationService.calculate(calculationReq);
		CalculationRes calculationRes = CalculationRes.builder().calculations(calculations).build();
		return new ResponseEntity<CalculationRes>(calculationRes, HttpStatus.OK);
	}

	/**
	 * advanceBalanceCalculate the FSM fee and creates Demand
	 * 
	 * @param TotalTripAmount ,tenantId and The RequestInfo
	 * @return adavnceamount Response
	 */
	@PostMapping(value = "/_advancebalancecalculate")
	public ResponseEntity<AdvanceAmountResponse> advanceBalanceCalculate(@Valid BigDecimal totalTripAmount, @Valid String tenantId,
			RequestInfo requestInfo) {
		BigDecimal advanceAmount = calculationService.advanceCalculate(totalTripAmount, tenantId, requestInfo);
		
		AdvanceAmountResponse response = AdvanceAmountResponse.builder().responseInfo(
				responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true)).advanceAmount(advanceAmount)
				.build();
		return new ResponseEntity<AdvanceAmountResponse>(response, HttpStatus.OK);
	}

	/**
	 * cancellationFee of the FSM and creates Demand
	 * 
	 * @param TotalTripAmount ,tenantId and The RequestInfo
	 * @return cancellationfee Response
	 */
	@PostMapping(value = "/_cancellationfee")
	public ResponseEntity<CancellationAmountResponse> cancellationFee(@Valid BigDecimal totalTripAmount, @Valid String tenantId,
			RequestInfo requestInfo) {
		
		BigDecimal cancellationAmount = calculationService.cancellationAmount(totalTripAmount, tenantId, requestInfo);
		
		CancellationAmountResponse response = CancellationAmountResponse.builder().responseInfo(
				responseInfoFactory.createResponseInfoFromRequestInfo(requestInfo, true)).cancellationAmount(cancellationAmount)
				.build();
		return new ResponseEntity<CancellationAmountResponse>(response, HttpStatus.OK);
	}

	@PostMapping(value = "/_estimate")
	public ResponseEntity<CalculationRes> estimate(@Valid @RequestBody CalculationReq calculationReq) {
		log.debug("CalculationReaquest:: " + calculationReq);
		List<Calculation> calculations = calculationService.estimate(calculationReq);
		CalculationRes calculationRes = CalculationRes.builder().calculations(calculations).build();
		return new ResponseEntity<CalculationRes>(calculationRes, HttpStatus.OK);
	}

}
