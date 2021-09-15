package org.egov.egovsurveyservices.validators;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.egovsurveyservices.service.SurveyService;
import org.egov.egovsurveyservices.web.models.AnswerEntity;
import org.egov.egovsurveyservices.web.models.Question;
import org.egov.egovsurveyservices.web.models.SurveyEntity;
import org.egov.egovsurveyservices.web.models.SurveySearchCriteria;
import org.egov.egovsurveyservices.web.models.enums.Type;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.egov.tracer.model.CustomException;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import java.util.*;

import static org.egov.egovsurveyservices.utils.SurveyServiceConstants.CITIZEN;
import static org.egov.egovsurveyservices.utils.SurveyServiceConstants.EMPLOYEE;

@Slf4j
@Component
public class SurveyValidator {

    @Autowired
    SurveyService surveyService;

    public void validateUserType(RequestInfo requestInfo) {
        if(!requestInfo.getUserInfo().getType().equalsIgnoreCase(EMPLOYEE))
            throw new CustomException("EG_SY_ACCESS_ERR", "Survey can only be created/updated/deleted by employees.");
    }

    public void validateUserTypeForAnsweringSurvey(RequestInfo requestInfo) {
        if(!requestInfo.getUserInfo().getType().equalsIgnoreCase(CITIZEN))
            throw new CustomException("EG_SY_SUBMIT_RESPONSE_ERR", "Survey can only be answered by citizens.");
    }

    public void validateSurveyUniqueness(SurveyEntity surveyEntity) {
        SurveySearchCriteria criteria = SurveySearchCriteria.builder()
                .tenantIds(surveyEntity.getTenantIds())
                .title(surveyEntity.getTitle())
                .build();

        if(!CollectionUtils.isEmpty(surveyService.searchSurveys(criteria)))
            throw new CustomException("EG_SY_DUPLICATE_SURVEY_ERR", "This survey entity already exists.");
    }

    public void validateSurveyExistence(SurveyEntity surveyEntity) {
        if(ObjectUtils.isEmpty(surveyEntity.getUuid()))
            throw new CustomException("EG_SY_UUID_NOT_PROVIDED_ERR", "Providing survey uuid is mandatory for updating and deleting surveys");

        SurveySearchCriteria criteria = SurveySearchCriteria.builder()
                .uuid(surveyEntity.getUuid())
                .build();

        if(CollectionUtils.isEmpty(surveyService.searchSurveys(criteria)))
            throw new CustomException("EG_SURVEY_DOES_NOT_EXIST_ERR", "The survey entity provided in update request does not exist.");
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

        surveyEntity.getQuestions().forEach(question -> {
            // Question statement should not be empty
            if(ObjectUtils.isEmpty(question.getQuestionStatement()))
                throw new CustomException("EG_SY_QUESTION_STMT_NOT_PROVIDED_ERR", "Question statement was not provided for uuid - " + question.getUuid());
            // Options should NOT be provided for open ended question types
            if(!question.getType().toString().equals("MULTIPLE_ANSWER_TYPE") && !question.getType().toString().equals("CHECKBOX_ANSWER_TYPE")) {
                if (!CollectionUtils.isEmpty(question.getOptions()))
                    throw new CustomException("EG_SY_OPTIONS_ERR", "Options should not be provided for open ended question types");
            }
            /* Assign NA to options in case of short answer, long answer, date and time type of questions
           since these type of questions are open ended. */
            if(CollectionUtils.isEmpty(question.getOptions()))
                question.setOptions(Collections.singletonList("NA"));
        });
    }

    public void validateAnswers(AnswerEntity answerEntity) {
        // 1. Validates whether all answered questions belong to the same survey or not
        // 2. Validate whether mandatory questions have been answered or not
        List<Question> questionsList = surveyService.fetchQuestionListBasedOnSurveyId(answerEntity.getSurveyId());
        HashSet<String> mandatoryQuestionsUuids = new HashSet<>();
        HashSet<String> allQuestionsUuids = new HashSet<>();
        List<String> questionsThatAreAnsweredUuids = new ArrayList<>();
        questionsList.forEach(question -> {
            allQuestionsUuids.add(question.getUuid());
            if(question.getRequired())
                mandatoryQuestionsUuids.add(question.getUuid());
        });
        answerEntity.getAnswers().forEach(answer -> {
            questionsThatAreAnsweredUuids.add(answer.getQuestionId());
        });
        // Check to validate whether all answers belong to same survey
        if(!allQuestionsUuids.containsAll(questionsThatAreAnsweredUuids))
            throw new CustomException("EG_SY_DIFF_QUES_ANSWERED_ERR", "A question belonging to some other survey has been answered.");
        // Check to validate whether all mandatory questions have been answered or not
        if(!questionsThatAreAnsweredUuids.containsAll(mandatoryQuestionsUuids))
            throw new CustomException("EG_SY_MANDATORY_QUES_NOT_ANSWERED_ERR", "A mandatory question was not answered");
    }

    public void validateWhetherCitizenAlreadyResponded(AnswerEntity answerEntity, String citizenId) {
        if(surveyService.hasCitizenAlreadyResponded(answerEntity, citizenId))
            throw new CustomException("EG_CITIZEN_ALREADY_RESPONDED", "The citizen has already responded to this survey.");
    }
}
