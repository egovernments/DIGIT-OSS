package org.egov.web.controller;

import lombok.extern.slf4j.Slf4j;
import org.egov.domain.service.OtpService;
import org.egov.web.contract.OtpRequest;
import org.egov.web.contract.OtpResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
public class OtpController {

    private OtpService otpService;

    @Autowired
    public OtpController(OtpService otpService) {
        this.otpService = otpService;
    }

    @PostMapping("/v1/_send")
    @ResponseStatus(HttpStatus.CREATED)
    public OtpResponse sendOtp(@RequestBody OtpRequest otpRequest) {
        otpService.sendOtp(otpRequest.toDomain());
        return OtpResponse.builder().
                responseInfo(null).successful(true).build();
    }

}
