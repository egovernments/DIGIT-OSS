package org.egov.tl.web.controllers;


import org.egov.tl.service.PaymentUpdateService;
import org.egov.tl.service.TradeLicenseService;
import org.egov.tl.service.notification.PaymentNotificationService;
import org.egov.tl.util.ResponseInfoFactory;
import org.egov.tl.web.models.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;

import javax.validation.constraints.*;
import javax.validation.Valid;
import javax.servlet.http.HttpServletRequest;

@RestController
    @RequestMapping("/v1")
    public class TradeLicenseController {

        private final ObjectMapper objectMapper;

        private final HttpServletRequest request;

        private final TradeLicenseService tradeLicenseService;

        private final ResponseInfoFactory responseInfoFactory;

    @Autowired
    public TradeLicenseController(ObjectMapper objectMapper, HttpServletRequest request,
                                  TradeLicenseService tradeLicenseService, ResponseInfoFactory responseInfoFactory) {
        this.objectMapper = objectMapper;
        this.request = request;
        this.tradeLicenseService = tradeLicenseService;
        this.responseInfoFactory = responseInfoFactory;
    }



        @PostMapping("/_create")
        public ResponseEntity<TradeLicenseResponse> create(@Valid @RequestBody TradeLicenseRequest tradeLicenseRequest)
        {
             List<TradeLicense> licenses = tradeLicenseService.create(tradeLicenseRequest);
                TradeLicenseResponse response = TradeLicenseResponse.builder().licenses(licenses).responseInfo(
                    responseInfoFactory.createResponseInfoFromRequestInfo(tradeLicenseRequest.getRequestInfo(), true))
                    .build();
                return new ResponseEntity<>(response,HttpStatus.OK);
        }

        @RequestMapping(value="/_search", method = RequestMethod.POST)
        public ResponseEntity<TradeLicenseResponse> search(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
                                                           @Valid @ModelAttribute TradeLicenseSearchCriteria criteria){

            List<TradeLicense> licenses = tradeLicenseService.search(criteria,requestInfoWrapper.getRequestInfo());

            TradeLicenseResponse response = TradeLicenseResponse.builder().licenses(licenses).responseInfo(
                    responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true))
                    .build();
            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @RequestMapping(value="/_update", method = RequestMethod.POST)
        public ResponseEntity<TradeLicenseResponse> update(@Valid @RequestBody TradeLicenseRequest tradeLicenseRequest){
            List<TradeLicense> licenses = tradeLicenseService.update(tradeLicenseRequest);

            TradeLicenseResponse response = TradeLicenseResponse.builder().licenses(licenses).responseInfo(
                    responseInfoFactory.createResponseInfoFromRequestInfo(tradeLicenseRequest.getRequestInfo(), true))
                    .build();
            return new ResponseEntity<>(response, HttpStatus.OK);
            }


    }
