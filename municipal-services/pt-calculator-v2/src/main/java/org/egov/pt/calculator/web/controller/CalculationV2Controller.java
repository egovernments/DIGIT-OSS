package org.egov.pt.calculator.web.controller;

import org.egov.pt.calculator.service.EstimationService;
import org.egov.pt.calculator.service.TranslationService;
import org.egov.pt.calculator.web.models.CalculationReq;
import org.egov.pt.calculator.web.models.CalculationRes;
import org.egov.pt.calculator.web.models.propertyV2.AssessmentRequestV2;
import org.egov.pt.calculator.web.models.propertyV2.PropertyRequestV2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.validation.Valid;

@Controller
@RequestMapping("/propertytax/v2")
public class CalculationV2Controller {


    private TranslationService translationService;

    private EstimationService estimationService;


    @Autowired
    public CalculationV2Controller(TranslationService translationService, EstimationService estimationService) {
        this.translationService = translationService;
        this.estimationService = estimationService;
    }

    @PostMapping("/_estimate")
    public ResponseEntity<CalculationRes> getTaxEstimation(@RequestBody @Valid AssessmentRequestV2 assessmentRequestV2) {

        CalculationReq calculationReq = translationService.translate(assessmentRequestV2);
        return new ResponseEntity<>(estimationService.getTaxCalculation(calculationReq), HttpStatus.OK);

    }



}
