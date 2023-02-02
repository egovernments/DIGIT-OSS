package org.egov.egovsurveyservices.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.egovsurveyservices.config.ApplicationProperties;
import org.egov.egovsurveyservices.producer.Producer;
import org.egov.egovsurveyservices.repository.SurveyRepository;
import org.egov.egovsurveyservices.utils.SurveyUtil;
import org.egov.egovsurveyservices.validators.SurveyValidator;
import org.egov.egovsurveyservices.web.models.*;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import java.util.*;

import static org.egov.egovsurveyservices.utils.SurveyServiceConstants.*;

@Slf4j
@Service
public class SurveyService {

    @Autowired
    private SurveyValidator surveyValidator;

    @Autowired
    private Producer producer;

    @Autowired
    private EnrichmentService enrichmentService;

    @Autowired
    private SurveyRepository surveyRepository;

    @Autowired
    private SurveyUtil surveyUtil;

    @Autowired
    private ApplicationProperties applicationProperties;

    /**
     * Creates the survey based on the request object and pushes to Save Survey Topic
     * @param surveyRequest Request object containing details of survey
     */
    public SurveyEntity createSurvey(SurveyRequest surveyRequest) {

        SurveyEntity surveyEntity = surveyRequest.getSurveyEntity();

        // Validate whether usertype employee is trying to create survey.
        surveyValidator.validateUserType(surveyRequest.getRequestInfo());
        // Validate question types.
        surveyValidator.validateQuestions(surveyEntity);
        // Validate survey uniqueness.
        surveyValidator.validateSurveyUniqueness(surveyEntity);

        // Persist survey if it passes all validations
        List<String> listOfTenantIds = new ArrayList<>(surveyEntity.getTenantIds());
        Integer countOfSurveyEntities = listOfTenantIds.size();
        List<String> listOfSurveyIds = surveyUtil.getIdList(surveyRequest.getRequestInfo(), listOfTenantIds.get(0), "ss.surveyid", "SY-[cy:yyyy-MM-dd]-[SEQ_EG_DOC_ID]", countOfSurveyEntities);
        log.info(listOfSurveyIds.toString());
        for(int i = 0; i < countOfSurveyEntities; i++){
            surveyEntity.setUuid(listOfSurveyIds.get(i));
            surveyEntity.setTenantId(listOfTenantIds.get(i));
            // Enrich survey entity
            enrichmentService.enrichSurveyEntity(surveyRequest);
            log.info(surveyRequest.getSurveyEntity().toString());
            producer.push(applicationProperties.getSaveSurveyTopic(), surveyRequest);
        }

        return surveyEntity;
    }

    /**
     * Searches the survey based on the search criteria
     * @param criteria Survey search criteria
     * @return SurveyEntity List of surveys fulfilling the search criteria
     */
    public List<SurveyEntity> searchSurveys(SurveySearchCriteria criteria, Boolean isCitizen) {
        List<String> listOfSurveyIds = surveyRepository.fetchSurveyUuids(criteria);

        if(CollectionUtils.isEmpty(listOfSurveyIds))
            return new ArrayList<>();

        criteria.setListOfSurveyIds(listOfSurveyIds);
        List<SurveyEntity> surveyEntities = surveyRepository.fetchSurveys(criteria);

        if(CollectionUtils.isEmpty(surveyEntities))
            return new ArrayList<>();

        enrichNumberOfResponsesForEachSurvey(listOfSurveyIds, surveyEntities);

        if(isCitizen)
            enrichWhetherCitizenHasResponded(surveyEntities, listOfSurveyIds, criteria.getCitizenId());

        postProcessSurveySearchResults(surveyEntities);

        return surveyEntities;
    }

    private void enrichWhetherCitizenHasResponded(List<SurveyEntity> surveyEntities, List<String> listOfSurveyIds, String citizenId) {
        List<String> surveyIdsForWhichCitizenHasResponded = surveyRepository.fetchSurveyIdsForWhichCitizenResponded(listOfSurveyIds, citizenId);
        Set<String> surveyIdsHashSet = new HashSet<>(surveyIdsForWhichCitizenHasResponded);
        surveyEntities.forEach(surveyEntity -> {
            if(surveyIdsHashSet.contains(surveyEntity.getUuid()))
                surveyEntity.setHasResponded(Boolean.TRUE);
            else
                surveyEntity.setHasResponded(Boolean.FALSE);
        });
    }

    private void postProcessSurveySearchResults(List<SurveyEntity> surveyEntities) {
        Long currentTime = System.currentTimeMillis();
        surveyEntities.forEach(surveyEntity -> {
            if(surveyEntity.getStatus().equals(ACTIVE)){
                if(currentTime < surveyEntity.getStartDate() || currentTime > surveyEntity.getEndDate())
                    surveyEntity.setStatus(INACTIVE);
            }
        });
    }

    private void enrichNumberOfResponsesForEachSurvey(List<String> listOfSurveyIds, List<SurveyEntity> surveyEntities) {
        List<Map<String, Object>> surveyIdToResponseCountList = (List<Map<String, Object>>) surveyRepository.fetchCountMapForGivenSurveyIds(listOfSurveyIds);
        //log.info(surveyIdToResponseCountList.toString());
        Map<Object, Object> surveyIdToResponseCountMap = new HashMap<>();
        for(Map m : surveyIdToResponseCountList){
            surveyIdToResponseCountMap.put(m.get("surveyid"), m.get("count"));
        }
        surveyEntities.forEach(entity -> {
            if(surveyIdToResponseCountMap.containsKey(entity.getUuid()))
                entity.setAnswersCount((Long)surveyIdToResponseCountMap.get(entity.getUuid()));
            else
                entity.setAnswersCount(0l);
        });
    }

    /**
     * Validates the answer request against multiple criterias
     * enriches the answer request object
     * pushes to save answer topic
     * @param answerRequest answer request object
     */
    public void submitResponse(AnswerRequest answerRequest) {
        RequestInfo requestInfo = answerRequest.getRequestInfo();
        AnswerEntity answerEntity = answerRequest.getAnswerEntity();

        // Validations

        // 1. Validate whether userType is citizen or not
        surveyValidator.validateUserTypeForAnsweringSurvey(requestInfo);
        // 2. Validate if survey for which citizen is responding exists
        if(CollectionUtils.isEmpty(surveyRepository.fetchSurveys(SurveySearchCriteria.builder().isCountCall(Boolean.FALSE).uuid(answerEntity.getSurveyId()).build())))
            throw new CustomException("EG_SY_DOES_NOT_EXIST_ERR", "The survey for which citizen responded does not exist");
        // 3. Validate if citizen has already responded or not
        surveyValidator.validateWhetherCitizenAlreadyResponded(answerEntity, requestInfo.getUserInfo().getUuid());
        // 4. Validate answers
        surveyValidator.validateAnswers(answerEntity);

        // Enrich answer request
        enrichmentService.enrichAnswerEntity(answerRequest);

        // Persist response if it passes all validations
        producer.push("save-ss-answer", answerRequest);
    }

    public List<Question> fetchQuestionListBasedOnSurveyId(String surveyId) {
        List<Question> questionList = surveyRepository.fetchQuestionsList(surveyId);
        if(CollectionUtils.isEmpty(questionList))
            return new ArrayList<>();
        return questionList;
    }

    public boolean hasCitizenAlreadyResponded(AnswerEntity answerEntity, String citizenId) {
        if(ObjectUtils.isEmpty(answerEntity.getSurveyId()))
            throw new CustomException("EG_SY_FETCH_CITIZEN_RESP_ERR", "Cannot fetch citizen's response without surveyId");
        return surveyRepository.fetchWhetherCitizenAlreadyResponded(answerEntity.getSurveyId(), citizenId);
    }

    /**
     * Updates the survey based on the request info and pushes to Update Survey Topic
     * @param surveyRequest Request object containing details of survey
     */
    public SurveyEntity updateSurvey(SurveyRequest surveyRequest) {
        SurveyEntity surveyEntity = surveyRequest.getSurveyEntity();
        RequestInfo requestInfo = surveyRequest.getRequestInfo();
        // Validate survey existence
        SurveyEntity existingSurveyEntity = surveyValidator.validateSurveyExistence(surveyEntity);
        // Validate whether usertype employee is trying to update survey.
        surveyValidator.validateUserType(surveyRequest.getRequestInfo());
        sanitizeSurveyForUpdate(surveyRequest);
        // Validate question types.
        surveyValidator.validateQuestionsWhileUpdate(surveyEntity);
        surveyValidator.validateUpdateRequest(surveyEntity);
        // Enrich update request
        surveyEntity.setAuditDetails(existingSurveyEntity.getAuditDetails());
        surveyEntity.getQuestions().forEach(question -> {
            question.setAuditDetails(existingSurveyEntity.getQuestions().get(0).getAuditDetails());
        });

        surveyEntity.setPostedBy(requestInfo.getUserInfo().getName());
        surveyEntity.getAuditDetails().setLastModifiedBy(requestInfo.getUserInfo().getUuid());
        surveyEntity.getAuditDetails().setLastModifiedTime(System.currentTimeMillis());
        surveyEntity.getQuestions().forEach(question -> {
            question.getAuditDetails().setLastModifiedTime(System.currentTimeMillis());
            question.getAuditDetails().setLastModifiedBy(requestInfo.getUserInfo().getUuid());
        });
        long getHigestOrderFromRequest = 0;
        for (int i=0;i<surveyEntity.getQuestions().size();i++) {
            Question question = surveyEntity.getQuestions().get(i);
            if(!(ObjectUtils.isEmpty(question.getQorder()))) {
                if(question.getQorder() > getHigestOrderFromRequest) {
                    getHigestOrderFromRequest=question.getQorder();
                }
            }
        }
        log.info("getHigestOrderFromRequest : " + getHigestOrderFromRequest);
        if(!(CollectionUtils.isEmpty(surveyEntity.getInsertQuestionsForUpdate()))) {
            for(int i=0 ; i<surveyEntity.getInsertQuestionsForUpdate().size(); i++) {
                log.info("inside getInsertQuestionsForUpdate ");
                surveyEntity.getInsertQuestionsForUpdate().get(i).setAuditDetails(existingSurveyEntity.getQuestions().get(0).getAuditDetails());
                surveyEntity.getInsertQuestionsForUpdate().get(i).setUuid(UUID.randomUUID().toString());
                surveyEntity.getInsertQuestionsForUpdate().get(i).setSurveyId(surveyEntity.getUuid());
                surveyEntity.getInsertQuestionsForUpdate().get(i).setQorder(getHigestOrderFromRequest+1+i);
                surveyEntity.getInsertQuestionsForUpdate().get(i).getAuditDetails().setLastModifiedTime(System.currentTimeMillis());
                surveyEntity.getInsertQuestionsForUpdate().get(i).getAuditDetails().setLastModifiedBy(requestInfo.getUserInfo().getUuid());
                log.info("Details of question uuid" + surveyEntity.getInsertQuestionsForUpdate().get(i).getUuid());
            }

        }
       if(!ObjectUtils.isEmpty(surveyEntity.getStartDate()) && !ObjectUtils.isEmpty(surveyEntity.getEndDate())){
           if(surveyEntity.getStartDate() < System.currentTimeMillis() && surveyEntity.getEndDate() > System.currentTimeMillis())
               surveyEntity.setStatus(ACTIVE);

       }

        surveyRequest.setSurveyEntity(surveyEntity);

        // Update survey if it passes all validations
        producer.push(applicationProperties.getUpdateDocumentTopic(), surveyRequest);

        return surveyEntity;
    }
    /*Added method to  set question.option() to null for questions which are not MULTIPLE_ANSWER_TYPE and CHECKBOX_ANSWER_TYPE
    * as in validator class it will throw error for the same*/
    public void sanitizeSurveyForUpdate(SurveyRequest surveyRequest) {
        surveyRequest.getSurveyEntity().getQuestions().forEach(question ->{
            if(!question.getType().toString().equals("MULTIPLE_ANSWER_TYPE") && !question.getType().toString().equals("CHECKBOX_ANSWER_TYPE")) {
                if(!CollectionUtils.isEmpty(question.getOptions()))
                    question.setOptions(null);
            }
        });
    }
    /**
     * Deletes the survey by making it inactive and pushes to Delete Survey Topic
     * @param surveyRequest Request object containing details of survey
     */
    public void deleteSurvey(SurveyRequest surveyRequest) {
        SurveyEntity surveyEntity = surveyRequest.getSurveyEntity();

        // Validate survey existence
        surveyValidator.validateSurveyExistence(surveyEntity);
        // Validate whether usertype employee is trying to delete survey.
        surveyValidator.validateUserType(surveyRequest.getRequestInfo());

        surveyEntity.setActive(Boolean.FALSE);
        surveyEntity.setStatus(INACTIVE);

        producer.push(applicationProperties.getDeleteDocumentTopic(), surveyRequest);

    }

    public AnswerResponse fetchSurveyResults(RequestInfo requestInfo, SurveyResultsSearchCriteria criteria) {

        // Validate whether employee is trying to fetch survey results
        //surveyValidator.validateUserType(requestInfo);

        // Validate survey exists
        List<SurveyEntity> surveyEntities = surveyRepository.fetchSurveys(SurveySearchCriteria.builder().isCountCall(Boolean.FALSE).uuid(criteria.getSurveyId()).build());

        if(CollectionUtils.isEmpty(surveyEntities))
            throw new CustomException("EG_SY_DOES_NOT_EXIST_ERR", "The provided survey does not exist");

        List<Answer> answers = new ArrayList<>();
        List<String> listOfCitizensWhoResponded = new ArrayList<>();

        // If citizen is accessing API, enrich his uuid in answers being fetched, in case of employee, fetch all citizens who responded
        if(requestInfo.getUserInfo().getType().equals(CITIZEN))
            listOfCitizensWhoResponded = Collections.singletonList(requestInfo.getUserInfo().getUuid());
        else
            listOfCitizensWhoResponded = surveyRepository.fetchCitizensUuid(criteria);

//        log.info(listOfCitizensWhoResponded.toString());

        // Fetch answers given by the fetched citizens for the requested survey
        answers = surveyRepository.fetchSurveyResults(SurveyResultsSearchCriteria.builder().citizenUuids(listOfCitizensWhoResponded).surveyId(criteria.getSurveyId()).build());

        AnswerResponse response = AnswerResponse.builder()
                                                .answers(answers)
                                                .surveyId(surveyEntities.get(0).getUuid())
                                                .title(surveyEntities.get(0).getTitle())
                                                .tenantId(surveyEntities.get(0).getTenantId())
                                                .description(surveyEntities.get(0).getDescription())
                                                .build();
        return response;
    }

    /**
     * Fetches total count of surveys in the system based on the search criteria
     * @param criteria Survey search criteria
     */
    public Integer countTotalSurveys(SurveySearchCriteria criteria) {
        return surveyRepository.fetchTotalSurveyCount(criteria);
    }
}
