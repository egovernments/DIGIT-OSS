package org.egov.egf.web.controller;

import java.util.Date;
import java.util.List;

import org.egov.egf.web.exception.GenericExceptionResponse;
import org.egov.infra.exception.ApplicationRuntimeException;
import org.egov.infra.microservice.contract.AccountCodeTemplate;
import org.egov.services.accountcode.template.AccountCodeTemplateService;
import org.hibernate.validator.constraints.SafeHtml;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;

@RestController
@RequestMapping("/accountCodeTemplate")
@Validated
public class AccountCodeTemplateController {

    @Autowired
    private AccountCodeTemplateService accCodeTempSer;

    @GetMapping(value = "/list")
    public ResponseEntity<List<AccountCodeTemplate>> getTemplateList(@RequestParam("module") @SafeHtml String module,
            @RequestParam("billSubType") @SafeHtml String billSubType, @RequestParam("detailTypeName") @SafeHtml String detailTypeName,
            @RequestParam("detailTypeId") int detailTypeId) {
        List<AccountCodeTemplate> list = accCodeTempSer.getAccountTemplate(module, billSubType, detailTypeName,
                detailTypeId);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping(value = "/contarctorlist")
    public ResponseEntity<List<AccountCodeTemplate>> getContarctorTemplateList(@RequestParam("module") @SafeHtml String module) {
        List<AccountCodeTemplate> list = accCodeTempSer.getAccountTemplate(module, null, null, 0);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
    
    @GetMapping(value = "/supplierlist")
    public ResponseEntity<List<AccountCodeTemplate>> getSupplierTemplateList(@RequestParam("module") @SafeHtml String module) {
        List<AccountCodeTemplate> list = accCodeTempSer.getAccountTemplate(module, null, null, 0);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @ExceptionHandler(value = { ApplicationRuntimeException.class })
    public final ResponseEntity<Object> accountCodeTemplateException(ApplicationRuntimeException ex,
            WebRequest request) {
        GenericExceptionResponse exceptionResponse = new GenericExceptionResponse(new Date(), ex.getMessage(),
                request.getDescription(false));
        return new ResponseEntity(exceptionResponse, HttpStatus.NOT_FOUND);
    }
}
