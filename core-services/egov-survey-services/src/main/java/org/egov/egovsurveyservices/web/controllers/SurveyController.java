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

import static org.egov.egovsurveyservices.utils.SurveyServiceConstants.CITIZEN;

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
        Boolean isCitizen = requestInfoWrapper.getRequestInfo().getUserInfo().getType().equals(CITIZEN);
        if(isCitizen)
            criteria.setCitizenId(requestInfoWrapper.getRequestInfo().getUserInfo().getUuid());
        List<SurveyEntity> surveys = surveyService.searchSurveys(criteria, isCitizen);
        Integer totalCount = surveyService.countTotalSurveys(criteria);
        SurveyResponse response  = SurveyResponse.builder().surveyEntities(surveys).totalCount(totalCount).build();
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @RequestMapping(value="/survey/_update", method = RequestMethod.POST)
    public ResponseEntity<SurveyResponse> update(@RequestBody @Valid SurveyRequest surveyRequest) {
        //log.info(documentRequest.getDocumentEntity().toString());
        SurveyEntity surveyEntity = surveyService.updateSurvey(surveyRequest);
        ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(surveyRequest.getRequestInfo(), true);
        SurveyResponse response = SurveyResponse.builder().surveyEntities(Collections.singletonList(surveyEntity)).responseInfo(responseInfo).build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @RequestMapping(value="/survey/_delete", method = RequestMethod.POST)
    public ResponseEntity<?> delete(@RequestBody @Valid SurveyRequest surveyRequest) {
        //log.info(documentRequest.getDocumentEntity().toString());
        surveyService.deleteSurvey(surveyRequest);
        ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(surveyRequest.getRequestInfo(), true);
        return new ResponseEntity<>(responseInfo, HttpStatus.OK);
    }

    @RequestMapping(value="/survey/response/_submit", method = RequestMethod.POST)
    public ResponseEntity<AnswerResponse> responseSubmit(@Valid @RequestBody AnswerRequest answerRequest) {
        surveyService.submitResponse(answerRequest);
        ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(answerRequest.getRequestInfo(), true);
        AnswerResponse response = AnswerResponse.builder().responseInfo(responseInfo).answers(answerRequest.getAnswerEntity().getAnswers()).build();
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @RequestMapping(value="/survey/response/_results", method = RequestMethod.POST)
    public ResponseEntity<AnswerResponse> responseSubmit(@Valid @RequestBody RequestInfoWrapper requestInfoWrapper,
                                            @Valid @ModelAttribute SurveyResultsSearchCriteria criteria) {
        ResponseInfo responseInfo = responseInfoFactory.createResponseInfoFromRequestInfo(requestInfoWrapper.getRequestInfo(), true);
        AnswerResponse response = surveyService.fetchSurveyResults(requestInfoWrapper.getRequestInfo(), criteria);
        response.setResponseInfo(responseInfo);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
