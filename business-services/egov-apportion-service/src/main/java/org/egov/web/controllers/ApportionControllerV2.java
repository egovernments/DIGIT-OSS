package org.egov.web.controllers;


import org.egov.service.ApportionServiceV2;
import org.egov.util.ResponseInfoFactory;
import org.egov.web.models.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.web.models.enums.DemandApportionRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.*;

import javax.validation.Valid;

@javax.annotation.Generated(value = "org.egov.codegen.SpringBootCodegen", date = "2019-02-25T15:07:36.183+05:30")

@Controller
@RequestMapping("/v2")
public class ApportionControllerV2 {

    private final ObjectMapper objectMapper;

    private ApportionServiceV2 apportionService;

    private ResponseInfoFactory responseInfoFactory;


    @Autowired
    public ApportionControllerV2(ObjectMapper objectMapper, ApportionServiceV2 apportionService, ResponseInfoFactory responseInfoFactory) {
        this.objectMapper = objectMapper;
        this.apportionService = apportionService;
        this.responseInfoFactory = responseInfoFactory;
    }




    /**
     * Executes the apportioning process on the given bills
     * @param apportionRequest The ApportionRequest containing the bill to be apportioned
     * @return Apportioned Bills
     */
    @RequestMapping(value="/bill/_apportion", method = RequestMethod.POST)
    public ResponseEntity<ApportionResponse> apportionPost(@Valid @RequestBody ApportionRequest apportionRequest){
        List<Bill> billInfos = apportionService.apportionBills(apportionRequest);
        ApportionResponse response = ApportionResponse.builder()
                .tenantId(apportionRequest.getTenantId())
                .bills(billInfos)
                .responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(apportionRequest.getRequestInfo(),
                        true)).build();
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @RequestMapping(value="/demand/_apportion", method = RequestMethod.POST)
    public ResponseEntity<ApportionDemandResponse> apportionPost(@Valid @RequestBody DemandApportionRequest apportionRequest){
        List<Demand> demands = apportionService.apportionDemands(apportionRequest);
        ApportionDemandResponse response = ApportionDemandResponse.builder()
                .tenantId(apportionRequest.getTenantId())
                .demands(demands)
                .responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(apportionRequest.getRequestInfo(),
                        true)).build();
        return new ResponseEntity<>(response,HttpStatus.OK);
    }





}
