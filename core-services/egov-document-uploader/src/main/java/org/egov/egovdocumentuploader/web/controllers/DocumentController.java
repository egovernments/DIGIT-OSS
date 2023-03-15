package org.egov.egovdocumentuploader.web.controllers;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.egovdocumentuploader.service.DocumentService;
import org.egov.egovdocumentuploader.utils.DocumentUtil;
import org.egov.egovdocumentuploader.utils.ResponseInfoFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.egovdocumentuploader.web.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/egov-du")
public class DocumentController {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ResponseInfoFactory responseInfoFactory;

    @Autowired
    private DocumentService documentService;

    @RequestMapping(value="/document/_create", method = RequestMethod.POST)
    public ResponseEntity<DocumentResponse> create(@RequestBody @Valid DocumentRequest documentRequest) {
        //log.info(documentRequest.getDocumentEntity().toString());
        DocumentEntity documentEntity = documentService.createDocument(documentRequest);
        ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(documentRequest.getRequestInfo(), true);
        DocumentResponse response = DocumentResponse.builder().documents(Collections.singletonList(documentEntity)).responseInfo(responseInfo).build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @RequestMapping(value="/document/_search", method = RequestMethod.POST)
    public ResponseEntity<DocumentResponse> search(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
                                                          @Valid @ModelAttribute DocumentSearchCriteria criteria) {
        //log.info(criteria.toString());
        List<DocumentEntity> documents = documentService.searchDocuments(requestInfoWrapper.getRequestInfo(), criteria);
        Integer count = documentService.countDocuments(requestInfoWrapper.getRequestInfo(), criteria);
        List statusCount = documentService.getDocumentStatusCount(requestInfoWrapper.getRequestInfo(), criteria);
        DocumentResponse response  = DocumentResponse.builder().documents(documents).totalCount(count).statusCount(statusCount).build();
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @RequestMapping(value="/document/_update", method = RequestMethod.POST)
    public ResponseEntity<DocumentResponse> update(@RequestBody @Valid DocumentRequest documentRequest){
        DocumentEntity documentEntity = documentService.updateDocument(documentRequest);
        ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(documentRequest.getRequestInfo(), true);
        DocumentResponse response = DocumentResponse.builder().documents(Collections.singletonList(documentEntity)).responseInfo(responseInfo).build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @RequestMapping(value="/document/_delete", method = RequestMethod.POST)
    public ResponseEntity<ResponseInfo> delete(@RequestBody @Valid DocumentRequest documentRequest){
        documentService.deleteDocument(documentRequest);
        ResponseInfo response = responseInfoFactory.createResponseInfoFromRequestInfo(documentRequest.getRequestInfo(), true);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @RequestMapping(value="/document/_count", method = RequestMethod.POST)
    public ResponseEntity<CountResponse> count(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
                                              @Valid @ModelAttribute DocumentSearchCriteria criteria){
        Integer count = documentService.countDocuments(requestInfoWrapper.getRequestInfo(), criteria);
        ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true);
        CountResponse response  = CountResponse.builder().count(count).responseInfo(responseInfo).build();
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

}
