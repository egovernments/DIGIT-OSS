package org.egov.web.notification.mail.controller;

import org.egov.web.notification.mail.consumer.contract.EmailRequest;
import org.egov.web.notification.mail.service.EmailService;
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
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping(value = "/_sendEmail")
    public ResponseEntity sendEmail(@Valid @RequestBody EmailRequest request) {
        emailService.sendEmail(request.getEmail());
        return ResponseEntity.ok().body("Email successfully sent");
    }

}
