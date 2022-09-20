package org.egov.fsm.calculator.web.controllers;

import java.math.BigDecimal;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.egov.common.contract.request.RequestInfo;
import org.egov.fsm.calculator.services.CalculationService;
import org.egov.fsm.calculator.services.DemandService;
import org.egov.fsm.calculator.web.models.Calculation;
import org.egov.fsm.calculator.web.models.CalculationReq;
import org.egov.fsm.calculator.web.models.CalculationRes;
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
	public CalculatorController(ObjectMapper objectMapper, HttpServletRequest request,
								CalculationService calculationService,DemandService demandService) {
		this.objectMapper = objectMapper;
		this.request = request;
		this.calculationService=calculationService;
		this.demandService=demandService;
	}

	/**
	 * Calulates the FSM fee and creates Demand
	 * @param calculationReq The calculation Request
	 * @return Calculation Response
	 */
	@PostMapping(value = "/_calculate")
	public ResponseEntity<CalculationRes> calculate(@Valid @RequestBody CalculationReq calculationReq) {
		log.debug("CalculationReaquest:: " + calculationReq);
		 List<Calculation> calculations = calculationService.calculate(calculationReq);
		 CalculationRes calculationRes = CalculationRes.builder().calculations(calculations).build();
		 return new ResponseEntity<CalculationRes>(calculationRes,HttpStatus.OK);
	}
	
	@PostMapping(value = "/_estimate")
	public ResponseEntity<CalculationRes> estimate(@Valid @RequestBody CalculationReq calculationReq) {
		log.debug("CalculationReaquest:: " + calculationReq);
		 List<Calculation> calculations = calculationService.estimate(calculationReq);
		 CalculationRes calculationRes = CalculationRes.builder().calculations(calculations).build();
		 return new ResponseEntity<CalculationRes>(calculationRes,HttpStatus.OK);
	}


}
