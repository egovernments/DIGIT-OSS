package org.bel.birthdeath.common.controller;

import java.util.List;

import javax.validation.Valid;

import org.bel.birthdeath.birth.model.ImportBirthWrapper;
import org.bel.birthdeath.birth.model.SearchCriteria;
import org.bel.birthdeath.common.contract.BirthResponse;
import org.bel.birthdeath.common.contract.DeathResponse;
import org.bel.birthdeath.common.contract.HospitalResponse;
import org.bel.birthdeath.common.contract.RequestInfoWrapper;
import org.bel.birthdeath.common.model.EgHospitalDtl;
import org.bel.birthdeath.common.services.CommonService;
import org.bel.birthdeath.death.model.ImportDeathWrapper;
import org.bel.birthdeath.utils.ResponseInfoFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/common")
public class CommonController {
	
	@Autowired
	CommonService commonService;
	
	@Autowired
	private ResponseInfoFactory responseInfoFactory;
	
	
	@PostMapping(value = { "/gethospitals"})
    public ResponseEntity<HospitalResponse> search(@RequestBody RequestInfoWrapper requestInfoWrapper,
                                                       @Valid @ModelAttribute SearchCriteria criteria) {
        List<EgHospitalDtl> hospitalDtls = commonService.search(criteria.getTenantId());
        HospitalResponse response = HospitalResponse.builder().hospitalDtls(hospitalDtls).responseInfo(
                responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
                .build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
	
	
	@PostMapping(value = { "/savebirthimport"})
    public ResponseEntity<ImportBirthWrapper> saveBirthImport(
    		@RequestBody BirthResponse importJSon) {
        ImportBirthWrapper importBirthWrapper = commonService.saveBirthImport(importJSon,importJSon.getRequestInfo());
        importBirthWrapper.setResponseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(importJSon.getRequestInfo(), true));
        return new ResponseEntity<>(importBirthWrapper, HttpStatus.OK);
    }
	
	@PostMapping(value = { "/savedeathimport"})
    public ResponseEntity<ImportDeathWrapper> saveDeathImport(	@RequestBody DeathResponse importJSon) {
		ImportDeathWrapper importDeathWrapper = commonService.saveDeathImport(importJSon,importJSon.getRequestInfo());
		importDeathWrapper.setResponseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(importJSon.getRequestInfo(), true));
        return new ResponseEntity<>(importDeathWrapper, HttpStatus.OK);
    }
	
	@PostMapping(value = { "/updatebirthimport"})
    public ResponseEntity<ImportBirthWrapper> updateBirthImport(
    		@RequestBody BirthResponse importJSon) {
        ImportBirthWrapper importBirthWrapper = commonService.updateBirthImport(importJSon,importJSon.getRequestInfo());
        importBirthWrapper.setResponseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(importJSon.getRequestInfo(), true));
        return new ResponseEntity<>(importBirthWrapper, HttpStatus.OK);
    }
	
	@PostMapping(value = { "/updatedeathimport"})
    public ResponseEntity<ImportDeathWrapper> updateDeathImport(
    		@RequestBody DeathResponse importJSon) {
		ImportDeathWrapper importDeathWrapper = commonService.updateDeathImport(importJSon,importJSon.getRequestInfo());
		importDeathWrapper.setResponseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(importJSon.getRequestInfo(), true));
        return new ResponseEntity<>(importDeathWrapper, HttpStatus.OK);
    }
	
}
