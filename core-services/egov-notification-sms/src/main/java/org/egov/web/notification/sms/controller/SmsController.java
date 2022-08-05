package org.egov.web.notification.sms.controller;

import org.egov.common.contract.response.ResponseInfo;
import org.egov.web.notification.sms.consumer.contract.SMSRequest;
import org.egov.web.notification.sms.service.BaseSMSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.validation.Valid;

@Controller
@RequestMapping("/v1")
public class SmsController {

    @Autowired
    private BaseSMSService baseSMSService;

    @PostMapping(value = "/_sendSms")
    public ResponseEntity sendSms(@Valid @RequestBody SMSRequest request) {
        baseSMSService.initatiteSmsProcess(request);
        return ResponseEntity.ok().body("SMS process has been triggered and succesfull");
    }

}
