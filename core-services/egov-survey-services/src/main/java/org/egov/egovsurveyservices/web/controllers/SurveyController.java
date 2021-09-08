package org.egov.egovsurveyservices.web.controllers;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.common.contract.response.ResponseInfo;
import org.egov.egovsurveyservices.service.SurveyService;
import org.egov.egovsurveyservices.web.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.egov.egovsurveyservices.utils.ResponseInfoFactory;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/egov-ss")
public class SurveyController {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ResponseInfoFactory responseInfoFactory;

    @Autowired
    private SurveyService surveyService;

    @RequestMapping(value="/survey/_create", method = RequestMethod.POST)
    public ResponseEntity<SurveyResponse> create(@RequestBody @Valid SurveyRequest surveyRequest) {
        //log.info(documentRequest.getDocumentEntity().toString());
        SurveyEntity surveyEntity = surveyService.createSurvey(surveyRequest);
        ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(surveyRequest.getRequestInfo(), true);
        SurveyResponse response = SurveyResponse.builder().surveyEntities(Collections.singletonList(surveyEntity)).responseInfo(responseInfo).build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @RequestMapping(value="/survey/_search", method = RequestMethod.POST)
    public ResponseEntity<SurveyResponse> search(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
                                                   @Valid @ModelAttribute SurveySearchCriteria criteria) {
        //log.info(criteria.toString());
        List<SurveyEntity> surveys = surveyService.searchSurveys(requestInfoWrapper.getRequestInfo(), criteria);
        SurveyResponse response  = SurveyResponse.builder().surveyEntities(surveys).build();
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @RequestMapping(value="/survey/_submit", method = RequestMethod.POST)
    public ResponseEntity<SurveyResponse> search(@Valid @RequestBody AnswerRequest answerRequest) {
        //log.info(criteria.toString());
        //List<SurveyEntity> surveys = surveyService.searchSurveys(requestInfoWrapper.getRequestInfo(), criteria);
        log.info(answerRequest.getAnswerEntity().toString());
        SurveyResponse response  = SurveyResponse.builder().build();
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

}
