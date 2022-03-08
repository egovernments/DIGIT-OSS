package org.egov.tlcalculator.web.controllers;


import java.util.List;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import org.egov.tlcalculator.service.BPACalculationService;
import org.egov.tlcalculator.service.CalculationService;
import org.egov.tlcalculator.service.DemandService;
import org.egov.tlcalculator.web.models.*;
import org.egov.tlcalculator.web.models.demand.BillResponse;
import org.egov.tlcalculator.web.models.demand.GenerateBillCriteria;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.egov.tlcalculator.utils.TLCalculatorConstants.businessService_BPA;
import static org.egov.tlcalculator.utils.TLCalculatorConstants.businessService_TL;


@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2018-09-27T14:56:03.454+05:30")

@Controller
@RequestMapping("/v1")
public class CalculatorController {

	private ObjectMapper objectMapper;

	private HttpServletRequest request;

	private CalculationService calculationService;

	private DemandService demandService;

	private BPACalculationService bpaCalculationService;

	@Autowired
	public CalculatorController(ObjectMapper objectMapper, HttpServletRequest request,
								CalculationService calculationService, DemandService demandService, BPACalculationService bpaCalculationService) {
		this.objectMapper = objectMapper;
		this.request = request;
		this.calculationService = calculationService;
		this.demandService = demandService;
		this.bpaCalculationService = bpaCalculationService;
	}

	/**
	 * Calulates the tradeLicense fee and creates Demand
	 * @param calculationReq The calculation Request
	 * @return Calculation Response
	 */
	@RequestMapping(value = {"/{servicename}/_calculate","/_calculate"}, method = RequestMethod.POST)
	public ResponseEntity<CalculationRes> calculate(@Valid @RequestBody CalculationReq calculationReq,@PathVariable(required = false) String servicename) {

		if(servicename==null)
			servicename = businessService_TL;
		List<Calculation> calculations = null;
		switch(servicename)
		{
			case businessService_TL:
				calculations = calculationService.calculate(calculationReq, false);
				break;

			case businessService_BPA:
				calculations = bpaCalculationService.calculate(calculationReq);
				break;
			default:
				throw new CustomException("UNKNOWN_BUSINESSSERVICE", " Business Service not supported");
		}

		CalculationRes calculationRes = CalculationRes.builder().calculations(calculations).build();
		return new ResponseEntity<CalculationRes>(calculationRes, HttpStatus.OK);
	}


	/**
	 * Generates Bill for the given criteria
	 *
	 * @param requestInfoWrapper   Wrapper containg the requestInfo
	 * @param generateBillCriteria The criteria to generate bill
	 * @return The response of generate bill
	 */
	@RequestMapping(value = {"/{servicename}/_getbill","/_getbill"}, method = RequestMethod.POST)
	public ResponseEntity<BillAndCalculations> getBill(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
													   @ModelAttribute @Valid GenerateBillCriteria generateBillCriteria,
													   @PathVariable(required = false) String servicename) {
		if(servicename==null)
			servicename = businessService_TL;
		BillAndCalculations response = demandService.getBill(requestInfoWrapper.getRequestInfo(), generateBillCriteria, servicename);
		return new ResponseEntity<BillAndCalculations>(response, HttpStatus.OK);
	}


	/**
	 * Calulates the tradeLicense fee and returns estimate
	 * @param calculationReq The calculation Request
	 * @return Calculation Response
	 */
	@RequestMapping(value = {"/{servicename}/_estimate","/_estimate"}, method = RequestMethod.POST)
	public ResponseEntity<CalculationRes> estimate(@Valid @RequestBody CalculationReq calculationReq,@PathVariable(required = false) String servicename) {

		if(servicename==null)
			servicename = businessService_TL;
		List<Calculation> calculations = null;
		switch(servicename)
		{
			case businessService_TL:
				calculations = calculationService.calculate(calculationReq, true);
				break;

			default:
				throw new CustomException("UNKNOWN_BUSINESSSERVICE", " Business Service not supported");
		}

		CalculationRes calculationRes = CalculationRes.builder().calculations(calculations).build();
		return new ResponseEntity<CalculationRes>(calculationRes, HttpStatus.OK);
	}

}
