package org.egov.pgr.controller;


import org.egov.pgr.contract.MigrationCriteria;
import org.egov.pgr.contract.RequestInfoWrapper;
import org.egov.pgr.service.MigrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Controller
@RequestMapping(value = "v2/")
public class MigrationController {



    @Autowired
    private MigrationService migrationService;


    @PostMapping("_migrate")
    @ResponseBody
    private ResponseEntity<?> search(@RequestBody @Valid RequestInfoWrapper requestInfoWrapper,
                                     @ModelAttribute @Valid MigrationCriteria migrationCriteria) {
        migrationService.migrateData(requestInfoWrapper.getRequestInfo(),
                migrationCriteria);
        return new ResponseEntity<>(HttpStatus.OK);
    }



}
