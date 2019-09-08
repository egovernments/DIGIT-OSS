package org.egov.wf.web.controllers;


import org.egov.wf.service.BusinessMasterService;
import org.egov.wf.util.ResponseInfoFactory;
import org.egov.wf.web.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/egov-wf")
public class BusinessServiceController {

    private BusinessMasterService businessMasterService;

    private final ResponseInfoFactory responseInfoFactory;

    @Autowired
    public BusinessServiceController(BusinessMasterService businessMasterService, ResponseInfoFactory responseInfoFactory) {
        this.businessMasterService = businessMasterService;
        this.responseInfoFactory = responseInfoFactory;
    }


    /**
     * Controller for creating BusinessService
     * @param businessServiceRequest The BusinessService request for create
     * @return The created object
     */
    @RequestMapping(value="/businessservice/_create", method = RequestMethod.POST)
    public ResponseEntity<BusinessServiceResponse> create(@Valid @RequestBody BusinessServiceRequest businessServiceRequest) {
        List<BusinessService> businessServices = businessMasterService.create(businessServiceRequest);
        BusinessServiceResponse response = BusinessServiceResponse.builder().businessServices(businessServices)
                .responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(businessServiceRequest.getRequestInfo(),true))
                .build();
        return new ResponseEntity<>(response,HttpStatus.OK);
    }


    /**
     * Controller for searching BusinessService api
     * @param searchCriteria Object containing the search params
     * @param requestInfoWrapper The requestInfoWrapper object containing requestInfo
     * @return List of businessServices from db based on search params
     */
    @RequestMapping(value="/businessservice/_search", method = RequestMethod.POST)
    public ResponseEntity<BusinessServiceResponse> search(@Valid @ModelAttribute BusinessServiceSearchCriteria searchCriteria,
                                                          @Valid @RequestBody RequestInfoWrapper requestInfoWrapper) {
        List<BusinessService> businessServices = businessMasterService.search(searchCriteria);
        BusinessServiceResponse response = BusinessServiceResponse.builder().businessServices(businessServices)
                .responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(),true))
                .build();
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @RequestMapping(value="/businessservice/_update", method = RequestMethod.POST)
    public ResponseEntity<BusinessServiceResponse> update(@Valid @RequestBody BusinessServiceRequest businessServiceRequest) {
        List<BusinessService> businessServices = businessMasterService.update(businessServiceRequest);
        BusinessServiceResponse response = BusinessServiceResponse.builder().businessServices(businessServices)
                .responseInfo(responseInfoFactory.createResponseInfoFromRequestInfo(businessServiceRequest.getRequestInfo(),true))
                .build();
        return new ResponseEntity<>(response,HttpStatus.OK);
    }




}
