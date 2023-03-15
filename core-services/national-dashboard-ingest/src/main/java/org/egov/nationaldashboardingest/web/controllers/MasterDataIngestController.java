package org.egov.nationaldashboardingest.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.nationaldashboardingest.service.IngestService;
import org.egov.nationaldashboardingest.utils.ResponseInfoFactory;
import org.egov.nationaldashboardingest.web.models.MasterDataRequest;
import org.egov.nationaldashboardingest.web.models.MasterDataResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/masterdata")
public class MasterDataIngestController {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private IngestService ingestService;

    @Autowired
    private ResponseInfoFactory responseInfoFactory;

    @RequestMapping(value="/_ingest", method = RequestMethod.POST)
    public ResponseEntity<MasterDataResponse> create(@RequestBody @Valid MasterDataRequest masterDataRequest) {
        log.info(masterDataRequest.getMasterData().toString());
        ingestService.ingestMasterData(masterDataRequest);
        ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(masterDataRequest.getRequestInfo(), true);
        MasterDataResponse response = MasterDataResponse.builder().responseInfo(responseInfo).build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
