package org.egov.nationaldashboardingest.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.nationaldashboardingest.service.IngestService;
import org.egov.nationaldashboardingest.utils.ResponseInfoFactory;
import org.egov.nationaldashboardingest.web.models.IngestRequest;
import org.egov.nationaldashboardingest.web.models.IngestResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/metric")
public class MetricIngestController {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private IngestService ingestService;

    @Autowired
    private ResponseInfoFactory responseInfoFactory;

    @RequestMapping(value="/_ingest", method = RequestMethod.POST)
    public ResponseEntity<IngestResponse> create(@RequestBody @Valid IngestRequest ingestRequest) {
        log.info("Received request: " + ingestRequest.getIngestData().toString());
        List<Integer> responseHash = ingestService.ingestData(ingestRequest);
        //log.info("############ Completed before pushing data");
        ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(ingestRequest.getRequestInfo(), true);
        IngestResponse response = IngestResponse.builder().responseInfo(responseInfo).responseHash(responseHash).build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
