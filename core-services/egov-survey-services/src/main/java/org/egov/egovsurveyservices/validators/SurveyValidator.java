package org.egov.egovsurveyservices.validators;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.egovsurveyservices.web.models.SurveyEntity;
import org.egov.egovsurveyservices.web.models.enums.Type;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.egov.tracer.model.CustomException;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import java.util.Collections;
import java.util.Map;
import java.util.Set;

import static org.egov.egovsurveyservices.utils.SurveyServiceConstants.EMPLOYEE;

@Slf4j
@Component
public class SurveyValidator {

    public void validateUserType(RequestInfo requestInfo) {
        if(!requestInfo.getUserInfo().getType().equalsIgnoreCase(EMPLOYEE))
            throw new CustomException("EG_SURVEY_CREATE_ERR", "Survey can only be created by employees.");
    }

    public void validateSurveyUniqueness(SurveyEntity surveyEntity) {
        // Add search call here
    }

    public void validateQuestions(SurveyEntity surveyEntity) {
        // Validate if there is at least one question
        if(CollectionUtils.isEmpty(surveyEntity.getQuestions()))
            throw new CustomException("EG_SURVEY_NO_QUESTIONS_ERR", "There should be at least one question in the survey");
        // Validate question types
        surveyEntity.getQuestions().forEach(question -> {
            try{
                question.getType().toString();
            }catch (NullPointerException e) {
                throw new CustomException("EG_SURVEY_QUESTION_TYPE_ERR", "Question type is not valid");
            }
        });
    }
}
