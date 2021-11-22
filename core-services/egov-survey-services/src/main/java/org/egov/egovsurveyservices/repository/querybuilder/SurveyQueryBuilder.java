package org.egov.egovsurveyservices.repository.querybuilder;

import org.egov.egovsurveyservices.config.ApplicationProperties;
import org.egov.egovsurveyservices.web.models.SurveyResultsSearchCriteria;
import org.egov.egovsurveyservices.web.models.SurveySearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import java.util.List;

@Component
public class SurveyQueryBuilder {

    @Autowired
    private ApplicationProperties config;

    private static final String SELECT = " SELECT ";
    private static final String INNER_JOIN = " INNER JOIN ";
    private static final String LEFT_JOIN  =  " LEFT OUTER JOIN ";
    private static final String AND_QUERY = " AND ";
    private final String ORDERBY_CREATEDTIME = " ORDER BY survey.createdtime DESC ";

    private static final String SURVEY_SELECT_VALUES = " survey.uuid as suuid, survey.tenantid as stenantid, survey.title as stitle, survey.description as sdescription, survey.status as sstatus, survey.startdate as sstartdate, survey.enddate as senddate, survey.collectcitizeninfo as scollectcitizeninfo, survey.active as sactive, survey.postedby as spostedby, survey.createdby as screatedby, survey.lastmodifiedby as slastmodifiedby, survey.createdtime as screatedtime, survey.lastmodifiedtime as slastmodifiedtime ";

    private static final String QUESTION_SELECT_VALUES = " question.uuid as quuid, question.surveyid as qsurveyid, question.questionstatement as qstatement, question.options as qoptions, question.status as qstatus, question.type as qtype, question.required as qrequired, question.createdby as qcreatedby, question.lastmodifiedby as qlastmodifiedby, question.createdtime as qcreatedtime, question.lastmodifiedtime as qlastmodifiedtime ";

    public static final String SURVEY_COUNT_WRAPPER = " SELECT COUNT(suuid) FROM ({INTERNAL_QUERY}) AS count ";

    public String getSurveySearchQuery(SurveySearchCriteria criteria, List<Object> preparedStmtList){
        StringBuilder query = new StringBuilder(SELECT);
        query.append(SURVEY_SELECT_VALUES + ",");
        query.append(QUESTION_SELECT_VALUES);
        query.append(" FROM eg_ss_survey survey ");
        query.append(INNER_JOIN);
        query.append(" eg_ss_question question ON survey.uuid = question.surveyid ");

        if(!CollectionUtils.isEmpty(criteria.getListOfSurveyIds())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" survey.uuid IN ( ").append(createQuery(criteria.getListOfSurveyIds())).append(" )");
            addToPreparedStatement(preparedStmtList, criteria.getListOfSurveyIds());
        }

        // order surveys based on their createdtime in latest first manner
        query.append(ORDERBY_CREATEDTIME);

        return query.toString();
    }

    private void addClauseIfRequired(StringBuilder query, List<Object> preparedStmtList){
        if(preparedStmtList.isEmpty()){
            query.append(" WHERE ");
        }else{
            query.append(" AND ");
        }
    }

    private String createQuery(List<String> ids) {
        StringBuilder builder = new StringBuilder();
        int length = ids.size();
        for (int i = 0; i < length; i++) {
            builder.append(" ?");
            if (i != length - 1)
                builder.append(",");
        }
        return builder.toString();
    }

    private void addToPreparedStatement(List<Object> preparedStmtList, List<String> ids) {
        ids.forEach(id -> {
            preparedStmtList.add(id);
        });
    }

    public String getQuestionsBasedOnSurveyIdsQuery() {
        return " SELECT uuid, surveyid, questionstatement, options, status, type, required, createdby, lastmodifiedby, createdtime, lastmodifiedtime FROM eg_ss_question WHERE surveyid = ? ";
    }

    public String getAnonymitySettingQuery() {
        return " SELECT collectcitizeninfo FROM eg_ss_survey WHERE uuid = ? ";
    }

    public String getCitizenResponseExistsQuery() {
        return " SELECT EXISTS(SELECT uuid FROM eg_ss_answer WHERE surveyid = ? AND citizenid = ? ) ";
    }

    public String getCitizensWhoRespondedUuidQuery(SurveyResultsSearchCriteria criteria, List<Object> preparedStmtList) {
        StringBuilder query = new StringBuilder(" SELECT DISTINCT citizenid FROM eg_ss_answer  ");
        if(!ObjectUtils.isEmpty(criteria.getSurveyId())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" surveyid = ? ");
            preparedStmtList.add(criteria.getSurveyId());
        }
        if(!ObjectUtils.isEmpty(criteria.getOffset())){
            query.append(" offset ? ");
            preparedStmtList.add(criteria.getOffset());
        }
        if(!ObjectUtils.isEmpty(criteria.getLimit())){
            query.append(" limit ? ");
            preparedStmtList.add(criteria.getLimit());
        }
        return  query.toString();
    }

    public String fetchSurveyResultsQuery(SurveyResultsSearchCriteria criteria, List<Object> preparedStmtList) {
        StringBuilder query = new StringBuilder(" SELECT uuid,questionid,surveyid,answer,createdby,lastmodifiedby,createdtime,lastmodifiedtime,citizenid,mobilenumber,emailid FROM eg_ss_answer  ");
        if(!ObjectUtils.isEmpty(criteria.getSurveyId())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" surveyid = ? ");
            preparedStmtList.add(criteria.getSurveyId());
        }
        if(!CollectionUtils.isEmpty(criteria.getCitizenUuids())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" citizenid IN ( ").append(createQuery(criteria.getCitizenUuids())).append(" ) ");
            addToPreparedStatement(preparedStmtList, criteria.getCitizenUuids());
        }
        return query.toString();
    }

    private void addPagination(StringBuilder query,List<Object> preparedStmtList,SurveySearchCriteria criteria){
        int limit = config.getDefaultLimit();
        int offset = config.getDefaultOffset();
        query.append(" OFFSET ? ");
        query.append(" LIMIT ? ");

        if(criteria.getLimit()!=null && criteria.getLimit()<=config.getMaxSearchLimit())
            limit = criteria.getLimit();

        if(criteria.getLimit()!=null && criteria.getLimit()>config.getMaxSearchLimit())
            limit = config.getMaxSearchLimit();

        if(criteria.getOffset()!=null)
            offset = criteria.getOffset();

        preparedStmtList.add(offset);
        preparedStmtList.add(limit);

    }

    public String getSurveyCountQuery(SurveySearchCriteria criteria, List<Object> preparedStmtList) {
        String query = getSurveyUuidsQuery(criteria, preparedStmtList);
        return SURVEY_COUNT_WRAPPER.replace("{INTERNAL_QUERY}", query);
    }

    public String getSurveyUuidsQuery(SurveySearchCriteria criteria, List<Object> preparedStmtList) {
        StringBuilder query = new StringBuilder(SELECT + " DISTINCT survey.uuid as suuid ");
        query.append(" FROM eg_ss_survey survey ");

        if(!CollectionUtils.isEmpty(criteria.getTenantIds())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" survey.tenantid IN ( ").append(createQuery(criteria.getTenantIds())).append(" )");
            addToPreparedStatement(preparedStmtList, criteria.getTenantIds());
        }
        if(!ObjectUtils.isEmpty(criteria.getTitle())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" survey.title ILIKE ? ");
            preparedStmtList.add("%" + criteria.getTitle() + "%");
        }
        if(!ObjectUtils.isEmpty(criteria.getPostedBy())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" survey.postedby ILIKE ? ");
            preparedStmtList.add("%" + criteria.getPostedBy() + "%");
        }
        if(!ObjectUtils.isEmpty(criteria.getStatus())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" survey.status = ? ");
            preparedStmtList.add(criteria.getStatus());
        }
        if(!ObjectUtils.isEmpty(criteria.getUuid())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" survey.uuid = ? ");
            preparedStmtList.add(criteria.getUuid());
        }
        // Fetch surveys which have NOT been soft deleted
        addClauseIfRequired(query, preparedStmtList);
        query.append(" survey.active = ? ");
        preparedStmtList.add(Boolean.TRUE);

        // order surveys based on their createdtime in latest first manner
        query.append(ORDERBY_CREATEDTIME);

        // Pagination to limit results, do not paginate query in case of count call.
        if(!criteria.getIsCountCall())
            addPagination(query, preparedStmtList, criteria);

        return query.toString();
    }
}
