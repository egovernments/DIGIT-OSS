package org.egov.web.notification.sms.controller;

import org.egov.web.notification.sms.models.Category;
import org.egov.web.notification.sms.models.Sms;
import org.egov.web.notification.sms.service.SMSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/otp")
public class TestController {

    @Autowired
    SMSService smsService;

    @GetMapping
    public ResponseEntity<?> test(@RequestParam(value="number", required = true) String number,
                                  @RequestParam(value="msg", required = true) String msg,
                                  @RequestParam(value="category", required = true) Category category,
                                  @RequestParam(value="expirytime", required = true) Long expirytime){

        //Sms sms = new Sms(number, sms, Category.OTP, expirytime);

        Sms sms = new Sms(number, msg, category, expirytime, "123");

        smsService.sendSMS(sms);

        return null;
    }

}