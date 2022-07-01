package org.egov.auditservice.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.auditservice.service.AuditLogProcessingService;
import org.egov.auditservice.web.models.*;
import org.egov.common.contract.response.ResponseInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/log")
public class AuditServiceController {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AuditLogProcessingService service;

    @RequestMapping(value="/v1/_create", method = RequestMethod.POST)
    public ResponseEntity<AuditLogResponse> create(@RequestBody @Valid AuditLogRequest auditLogRequest) {
        log.info("Received request: " + auditLogRequest.toString());
//        List<Integer> responseHash = ingestService.ingestData(ingestRequest);
//        //log.info("############ Completed before pushing data");
//        ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(ingestRequest.getRequestInfo(), true);
//        IngestResponse response = IngestResponse.builder().responseInfo(responseInfo).responseHash(responseHash).build();
        service.process(auditLogRequest);
        AuditLogResponse response = AuditLogResponse.builder().build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @RequestMapping(value="/v1/_search", method = RequestMethod.POST)
    public ResponseEntity<AuditLogResponse> search(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
                                                          @Valid @ModelAttribute AuditLogSearchCriteria criteria) {
        List<AuditLog> auditLogList = service.getAuditLogs(requestInfoWrapper.getRequestInfo(), criteria);
        AuditLogResponse response = AuditLogResponse.builder().auditLogs(auditLogList).build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @RequestMapping(value="/v1/_verify", method = RequestMethod.POST)
    public ResponseEntity<ResponseInfo> verify(@Valid @RequestBody VerificationRequest verificationRequest) {
        service.verifyDbEntity(verificationRequest.getObjectId(), verificationRequest.getKeyValuePairs());
        return new ResponseEntity<>(ResponseInfo.builder().build(), HttpStatus.OK);
    }

}
