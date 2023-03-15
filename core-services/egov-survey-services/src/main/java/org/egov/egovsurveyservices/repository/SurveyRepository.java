package org.egov.egovsurveyservices.repository;

import lombok.extern.slf4j.Slf4j;
import org.egov.egovsurveyservices.repository.querybuilder.SurveyQueryBuilder;
import org.egov.egovsurveyservices.repository.rowmapper.AnswerRowMapper;
import org.egov.egovsurveyservices.repository.rowmapper.QuestionRowMapper;
import org.egov.egovsurveyservices.repository.rowmapper.SurveyRowMapper;
import org.egov.egovsurveyservices.web.models.*;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Repository
public class SurveyRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private SurveyRowMapper rowMapper;

    @Autowired
    private SurveyQueryBuilder surveyQueryBuilder;

    @Autowired
    private QuestionRowMapper questionRowMapper;

    @Autowired
    private AnswerRowMapper answerRowMapper;

    public List<SurveyEntity> fetchSurveys(SurveySearchCriteria criteria){

        List<Object> preparedStmtList = new ArrayList<>();

        if(CollectionUtils.isEmpty(criteria.getTenantIds()) && ObjectUtils.isEmpty(criteria.getUuid()))
            return new ArrayList<>();

        String query = surveyQueryBuilder.getSurveySearchQuery(criteria, preparedStmtList);
        log.info("query for search: " + query + " params: " + preparedStmtList);

        return jdbcTemplate.query(query, preparedStmtList.toArray(), rowMapper);

    }

    public List<Question> fetchQuestionsList(String surveyId) {
        List<Object> preparedStmtList = new ArrayList<>();
        if(ObjectUtils.isEmpty(surveyId))
            throw new CustomException("EG_SY_SURVEYID_ERR", "Cannot fetch question list without surveyId");
        String query = surveyQueryBuilder.getQuestionsBasedOnSurveyIdsQuery();
        preparedStmtList.add(surveyId);
        return jdbcTemplate.query(query, preparedStmtList.toArray(), questionRowMapper);
    }

    public boolean fetchWhetherCitizenAlreadyResponded(String surveyId, String citizenId) {
        List<Object> preparedStmtList = new ArrayList<>();
        preparedStmtList.add(surveyId);
        preparedStmtList.add(citizenId);
        String query = surveyQueryBuilder.getCitizenResponseExistsQuery();
        return jdbcTemplate.queryForObject(query, preparedStmtList.toArray(), Boolean.class);
    }

    public List<String> fetchCitizensUuid(SurveyResultsSearchCriteria criteria) {
        List<Object> preparedStmtList = new ArrayList<>();
        String query = surveyQueryBuilder.getCitizensWhoRespondedUuidQuery(criteria, preparedStmtList);
        return jdbcTemplate.query(query, preparedStmtList.toArray(), new SingleColumnRowMapper<>(String.class));
    }

    public List<Answer> fetchSurveyResults(SurveyResultsSearchCriteria criteria) {
        List<Object> preparedStmtList = new ArrayList<>();
        String query = surveyQueryBuilder.fetchSurveyResultsQuery(criteria, preparedStmtList);
        return jdbcTemplate.query(query, preparedStmtList.toArray(), answerRowMapper);
    }

    public Integer fetchTotalSurveyCount(SurveySearchCriteria criteria) {
        List<Object> preparedStmtList = new ArrayList<>();

        if(CollectionUtils.isEmpty(criteria.getTenantIds()) && ObjectUtils.isEmpty(criteria.getUuid()))
            return 0;

        // Omit pagination in case of count
        criteria.setIsCountCall(Boolean.TRUE);
        String query = surveyQueryBuilder.getSurveyCountQuery(criteria, preparedStmtList);
        criteria.setIsCountCall(Boolean.FALSE);

        log.info("query for search: " + query + " params: " + preparedStmtList);

        return jdbcTemplate.queryForObject(query, preparedStmtList.toArray(), Integer.class);
    }

    public List<String> fetchSurveyUuids(SurveySearchCriteria criteria) {
        List<Object> preparedStmtList = new ArrayList<>();

        if(CollectionUtils.isEmpty(criteria.getTenantIds()) && ObjectUtils.isEmpty(criteria.getUuid()))
            return new ArrayList<>();

        criteria.setIsCountCall(Boolean.FALSE);

        String query = surveyQueryBuilder.getSurveyUuidsQuery(criteria, preparedStmtList);
        log.info("query for uuids search: " + query + " params: " + preparedStmtList);

        return jdbcTemplate.query(query, preparedStmtList.toArray(), new SingleColumnRowMapper<>(String.class));
    }

    public List fetchCountMapForGivenSurveyIds(List<String> listOfSurveyIds) {
        List<Object> preparedStmtList = new ArrayList<>();

        if(CollectionUtils.isEmpty(listOfSurveyIds))
            return new ArrayList();

        String query = surveyQueryBuilder.getSurveyUuidsToCountMapQuery(listOfSurveyIds, preparedStmtList);
        log.info("query for uuids to count map search: " + query + " params: " + preparedStmtList);

        return jdbcTemplate.queryForList(query, preparedStmtList.toArray());
    }

    public List<String> fetchSurveyIdsForWhichCitizenResponded(List<String> listOfSurveyIds, String citizenId) {
        List<Object> preparedStmtList = new ArrayList<>();

        if(CollectionUtils.isEmpty(listOfSurveyIds))
            return new ArrayList();

        String query = surveyQueryBuilder.getWhetherCitizenHasRespondedQuery(listOfSurveyIds, citizenId, preparedStmtList);
        log.info("query for surveys for which citizen responded " + query + " params: " + preparedStmtList);

        return jdbcTemplate.query(query, preparedStmtList.toArray(), new SingleColumnRowMapper<>(String.class));
    }
}
