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

    /**
     * Validates whether the user trying to create/update/delete a survey is an Employee
     * @param requestInfo RequestInfo of the request
     */
    public void validateUserType(RequestInfo requestInfo) {
        if(!requestInfo.getUserInfo().getType().equalsIgnoreCase(EMPLOYEE))
            throw new CustomException("EG_SY_ACCESS_ERR", "Survey can only be created/updated/deleted by employees.");
    }

    /**
     * Validates whether the user trying to answer a survey is a Citizen
     * @param requestInfo RequestInfo of the request
     */
    public void validateUserTypeForAnsweringSurvey(RequestInfo requestInfo) {
        if(!requestInfo.getUserInfo().getType().equalsIgnoreCase(CITIZEN))
            throw new CustomException("EG_SY_SUBMIT_RESPONSE_ERR", "Survey can only be answered by citizens.");
    }

    /**
     * Validates whether the survey being created is unique
     * based on whether the search criteria returns a survey
     * @param surveyEntity object containing details of survey to be validated
     */
    public void validateSurveyUniqueness(SurveyEntity surveyEntity) {
        SurveySearchCriteria criteria = SurveySearchCriteria.builder()
                .tenantIds(surveyEntity.getTenantIds())
                .title(surveyEntity.getTitle())
                .isCountCall(Boolean.FALSE)
                .build();

        if(!CollectionUtils.isEmpty(surveyService.searchSurveys(criteria, false)))
            throw new CustomException("EG_SY_DUPLICATE_SURVEY_ERR", "This survey entity already exists.");
    }

    /**
     * Validates whether the survey being updated or deleted exists in the system
     * searches survey based on uuid of the survey
     * @param surveyEntity object containing details of survey to be validated
     * @return SurveyEntity object of the search result
     */
    public SurveyEntity validateSurveyExistence(SurveyEntity surveyEntity) {
        if(ObjectUtils.isEmpty(surveyEntity.getUuid()))
            throw new CustomException("EG_SY_UUID_NOT_PROVIDED_ERR", "Providing survey uuid is mandatory for updating and deleting surveys");

        SurveySearchCriteria criteria = SurveySearchCriteria.builder()
                .uuid(surveyEntity.getUuid())
                .isCountCall(Boolean.FALSE)
                .build();

        List<SurveyEntity> surveyEntities = surveyService.searchSurveys(criteria, false);

        if(CollectionUtils.isEmpty(surveyEntities))
            throw new CustomException("EG_SURVEY_DOES_NOT_EXIST_ERR", "The survey entity provided in update request does not exist.");

        return surveyEntities.get(0);
    }

    /**
     * Validates the questions of the survey
     * based on number of questions, question type, question statement and answer options
     * @param surveyEntity object containing details of survey to be validated
     */
    public void validateQuestions(SurveyEntity surveyEntity) {
        // Validate if there is at least one question
        if(CollectionUtils.isEmpty(surveyEntity.getQuestions()))
            throw new CustomException("EG_SURVEY_NO_QUESTIONS_ERR", "There should be at least one question in the survey");
        // Validate question types
        surveyEntity.getQuestions().forEach(question -> {

            if(ObjectUtils.isEmpty(question.getType())){
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


    public void validateQuestionsWhileUpdate(SurveyEntity surveyEntity) {

        Map<String, String> errorMap = new HashMap<>();
        // Validate if there is at least one question
        if(CollectionUtils.isEmpty(surveyEntity.getQuestions()))
            throw new CustomException("EG_SURVEY_NO_QUESTIONS_ERR", "There should be at least one question in the survey");
        // Validate question types
        surveyEntity.getQuestions().forEach(question -> {

            if(ObjectUtils.isEmpty(question.getType())){
                errorMap.put("EG_SURVEY_QUESTION_TYPE_ERR", "Question type is not either null or not valid");
                //throw new CustomException("EG_SURVEY_QUESTION_TYPE_ERR", "Question type is not valid");
            }

            if(ObjectUtils.isEmpty(question.getUuid())) {
                log.info("Inside empty UUid" +question.getQuestionStatement());
                surveyEntity.addInsertQuestionsForUpdateItem(question);
            }

            if(ObjectUtils.isEmpty(question.getStatus())) {
                errorMap.put("EG_SURVEY_QUESTION_STATUS_ERR", "Status is missing for question");
               // throw new CustomException("EG_SURVEY_QUESTION_STATUS_ERR", "Status is missing for question");
            }
        });
        if (!errorMap.isEmpty())
            throw new CustomException(errorMap);

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

    /**
     * Validates whether all answered questions belong to the same survey or not
     * Validate whether mandatory questions have been answered or not
     * @param answerEntity object containing answers to be validated
     */
    public void validateAnswers(AnswerEntity answerEntity) {
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

    /**
     * Checks if the citizen answering has already responded before
     * @param answerEntity object containing answers to be validated
     */
    public void validateWhetherCitizenAlreadyResponded(AnswerEntity answerEntity, String citizenId) {
        if(surveyService.hasCitizenAlreadyResponded(answerEntity, citizenId))
            throw new CustomException("EG_CITIZEN_ALREADY_RESPONDED", "The citizen has already responded to this survey.");
    }

    /**
     * Validates if the survey has tenantId
     * @param surveyEntity object containing details of survey to be validated
     */
    public void validateUpdateRequest(SurveyEntity surveyEntity) {
        // Validate if there is at least one question
        if(ObjectUtils.isEmpty(surveyEntity.getTenantId()))
            throw new CustomException("EG_SURVEY_NO_TENANTID_ERR", "Update request cannot have tenantId as empty or null.");
    }
}
