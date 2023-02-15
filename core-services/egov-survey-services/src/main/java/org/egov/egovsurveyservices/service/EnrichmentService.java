package org.egov.egovsurveyservices.service;

import java.util.*;
import java.util.stream.Collectors;

import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.Role;
import org.egov.common.contract.request.User;
import org.egov.egovsurveyservices.web.models.*;
import org.egov.egovsurveyservices.web.models.enums.Status;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import static org.egov.egovsurveyservices.utils.SurveyServiceConstants.*;


@Service
@Slf4j
public class EnrichmentService {

    public void enrichSurveyEntity(SurveyRequest surveyRequest) {
        SurveyEntity surveyEntity = surveyRequest.getSurveyEntity();
        surveyEntity.setStatus(ACTIVE);
        surveyEntity.setActive(Boolean.TRUE);
        surveyEntity.setAuditDetails(AuditDetails.builder()
                .createdBy(surveyRequest.getRequestInfo().getUserInfo().getUuid())
                .lastModifiedBy(surveyRequest.getRequestInfo().getUserInfo().getUuid())
                .createdTime(System.currentTimeMillis())
                .lastModifiedTime(System.currentTimeMillis())
                .build());
        surveyEntity.setPostedBy(surveyRequest.getRequestInfo().getUserInfo().getName());

        for(int i = 0; i < surveyEntity.getQuestions().size(); i++) {
            Question question = surveyEntity.getQuestions().get(i);
            question.setQorder((long)i+1);
            question.setUuid(UUID.randomUUID().toString());
            question.setSurveyId(surveyEntity.getUuid());
            if(ObjectUtils.isEmpty(question.getStatus()))
                question.setStatus(Status.ACTIVE);
            question.setAuditDetails(AuditDetails.builder()
                    .createdBy(surveyRequest.getRequestInfo().getUserInfo().getUuid())
                    .lastModifiedBy(surveyRequest.getRequestInfo().getUserInfo().getUuid())
                    .createdTime(System.currentTimeMillis())
                    .lastModifiedTime(System.currentTimeMillis())
                    .build());
        }
    }

    public void enrichAnswerEntity(AnswerRequest answerRequest) {
        RequestInfo requestInfo = answerRequest.getRequestInfo();
        AnswerEntity answerEntity = answerRequest.getAnswerEntity();
        answerEntity.getAnswers().forEach(answer -> {
            answer.setUuid(UUID.randomUUID().toString());
            answer.setCitizenId(requestInfo.getUserInfo().getUuid());
            answer.setAuditDetails(AuditDetails.builder()
                    .createdBy(requestInfo.getUserInfo().getUuid())
                    .lastModifiedBy(requestInfo.getUserInfo().getUuid())
                    .createdTime(System.currentTimeMillis())
                    .lastModifiedTime(System.currentTimeMillis())
                    .build());
        });
    }
}
