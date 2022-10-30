package org.egov.land.calcutaor;

import java.io.FileNotFoundException;
import java.io.IOException;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CalculatorController {

//	@Autowired
//	Calculator calculatorService;

	@GetMapping("/_calculate")
	public FeeTypeCalculationDtoInfo get(@RequestParam("arce") float arce, @RequestParam("feeType") String feeType,
			@RequestParam("potenialZone") String potenialZone, @RequestParam("purposename") String purposename,
			@RequestParam("colonyType") String colonyType) throws FileNotFoundException, IOException, ParseException {
		System.out.println("arce==" + arce);
		System.out.println("feeType==" + feeType);
		System.out.println("potenialZone==" + potenialZone);
		System.out.println("purposename==" + purposename);
		System.out.println("colonyType==" + colonyType);

//		String i ="1";
//		if(i=="1") {
//			return null;
//			//throw IOException;
//		}
		
		
		String colony = "";
		if (colonyType.equals("P")) {
			colony = "plotted";
		}
		if (colonyType.equals("D")) {
			colony = "ddjay";
		}
		if (colonyType.equals("I")) {
			colony = "itColony";
		}
		if (colonyType.equals("G")) {
			colony = "groupHousing";
		}
		if (colonyType.equals("C")) {
			colony = "commPlotted";
		}
		if (colonyType.equals("TC")) {
			colony = "todCommercial";
		}
		if (colonyType.equals("TG")) {
			colony = "todGroupHousing";
		}

		if (colonyType.equals("N")) {
			colony = "nilp";
		}
		if (colonyType.equals("IC")) {
			colony = "industrialColony";
		}
		if (colonyType.equals("L")) {
			colony = "lowDensityEcoFriendly";
		}
		
		System.out.println("Colony : " + colony);
		FeeTypeCalculationDtoInfo info = new FeeTypeCalculationDtoInfo();
		FeesTypeCalculationDto calculator = Calculator.feesTypeCalculation(arce, feeType, potenialZone, purposename, colony);
		info.setFeeTypeCalculationDto(calculator);
		return info;
	}
}