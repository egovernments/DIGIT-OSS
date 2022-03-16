package org.egov.wf.repository.querybuilder;

import static java.util.Objects.isNull;

import java.util.ArrayList;
import java.util.List;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.wf.config.WorkflowConfig;
import org.egov.wf.web.models.ProcessInstanceSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

@Component
public class WorkflowQueryBuilder {

    private WorkflowConfig config;

    @Value("${egov.wf.fuzzysearch.isFuzzyEnabled}")
    private boolean isFuzzyEnabled;

    @Autowired
    public WorkflowQueryBuilder(WorkflowConfig config) {
        this.config = config;
    }

    private static final String INNER_JOIN = " INNER JOIN ";
    private static final String LEFT_OUTER_JOIN = " LEFT OUTER JOIN ";
    private static final String CONCAT = " CONCAT ";

    private static final String QUERY = " SELECT pi.*,st.*,ac.*,doc.*,pi.id as wf_id,pi.lastModifiedTime as wf_lastModifiedTime,pi.createdTime as wf_createdTime,"
            + "       pi.createdBy as wf_createdBy,pi.lastModifiedBy as wf_lastModifiedBy,pi.status as pi_status, pi.tenantid as pi_tenantid, "
            + "       doc.lastModifiedTime as doc_lastModifiedTime,doc.createdTime as doc_createdTime,doc.createdBy as doc_createdBy,"
            + "       doc.lastModifiedBy as doc_lastModifiedBy,doc.tenantid as doc_tenantid,doc.id as doc_id,asg.assignee as assigneeuuid,"
            + "       st.uuid as st_uuid,st.tenantId as st_tenantId, ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.action as ac_action"
            + "       FROM eg_wf_processinstance_v2 pi  " + LEFT_OUTER_JOIN
            + "       eg_wf_assignee_v2 asg ON asg.processinstanceid = pi.id " + LEFT_OUTER_JOIN
            + "      eg_wf_document_v2 doc  ON doc.processinstanceid = pi.id " + INNER_JOIN
            + "       eg_wf_state_v2 st ON st.uuid = pi.status" + LEFT_OUTER_JOIN
            + "       eg_wf_action_v2 ac ON ac.currentState = st.uuid AND ac.active=TRUE " + "       WHERE ";


    private static final String WITH_CLAUSE = " select id from eg_wf_processinstance_v2 pi_outer WHERE " ;

    private static final String STATUS_COUNT_WRAPPER = "select  count(DISTINCT wf_id),cq.applicationStatus,cq.businessservice,cq.PI_STATUS as statusId from ({INTERNAL_QUERY}) as cq GROUP BY cq.applicationStatus,cq.businessservice,cq.PI_STATUS";


    private final String paginationWrapper = "SELECT * FROM "
            + "(SELECT *, DENSE_RANK() OVER (ORDER BY wf_createdTime DESC,wf_id) offset_ FROM " + "({})"
            + " result) result_offset " + "WHERE offset_ > ? AND offset_ <= ?";

    private final String ORDERBY_CREATEDTIME = " ORDER BY result_offset.wf_createdTime DESC ";

    private final String LATEST_RECORD = " pi.lastmodifiedTime  IN  (SELECT max(lastmodifiedTime) from eg_wf_processinstance_v2 GROUP BY businessid) ";

    private static final String COUNT_WRAPPER = "select count(DISTINCT wf_id) from ({INTERNAL_QUERY}) as count";
    private static final String COUNT_WRAPPER_ESCALATED = "select count(DISTINCT businessid) from ({INTERNAL_QUERY}) as count";
    private static final String COUNT_WRAPPER_INBOX = " select count(DISTINCT id) from ({INTERNAL_QUERY}) as count" ;
    private static final String BASE_QUERY = "select businessId from (" +
            "  SELECT *,RANK () OVER (PARTITION BY businessId ORDER BY createdtime  DESC) rank_number " +
            " FROM eg_wf_processinstance_v2 ";

    private static final String RANK_WRAPPER = "SELECT wf.* , assg.assignee AS asg, " +
            " DENSE_RANK() OVER(PARTITION BY wf.businessid ORDER BY wf.createdtime DESC) outer_rank " +
            " FROM eg_wf_processinstance_v2 wf LEFT OUTER JOIN eg_wf_assignee_v2 assg ON wf.id = assg.processinstanceid WHERE wf.businessid IN ({BASE_QUERY})";

    private static final String FINAL_ESCALATED_QUERY ="SELECT businessid from ( {RANKED_QUERY} ) final WHERE outer_rank = 2 ";

    private String getProcessInstanceSearchQueryWithoutPagination(ProcessInstanceSearchCriteria criteria, List<Object> preparedStmtList){


        StringBuilder builder = new StringBuilder(QUERY);

        if (!criteria.getHistory())
            builder.append(LATEST_RECORD);

        if (criteria.getHistory())
            builder.append(" pi.tenantid=? ");
        else
            builder.append(" AND pi.tenantid=? ");

        preparedStmtList.add(criteria.getTenantId());

        List<String> ids = criteria.getIds();
        if (!CollectionUtils.isEmpty(ids)) {
            builder.append("and pi.id IN (").append(createQuery(ids)).append(")");
            addToPreparedStatement(preparedStmtList, ids);
        }

        List<String> businessIds = criteria.getBusinessIds();
        if (!CollectionUtils.isEmpty(businessIds)) {
            builder.append(" and pi.businessId IN (").append(createQuery(businessIds)).append(")");
            addToPreparedStatement(preparedStmtList, businessIds);
        }
        

        if(!StringUtils.isEmpty(criteria.getBusinessService())){
        	builder.append(" AND pi.businessservice =? ");
            preparedStmtList.add(criteria.getBusinessService());
        }

        List<String> tenantSpecificStatuses = criteria.getTenantSpecifiStatus();
        if (!CollectionUtils.isEmpty(tenantSpecificStatuses)) {
            builder.append(" and CONCAT (pi.tenantid,':',pi.status)  IN (").append(createQuery(tenantSpecificStatuses)).append(")");
            addToPreparedStatement(preparedStmtList, tenantSpecificStatuses);
        }
        
        List<String> statuses = criteria.getStatus();
        if (!CollectionUtils.isEmpty(statuses)) {
            builder.append(" and pi.status  IN (").append(createQuery(statuses)).append(")");
            addToPreparedStatement(preparedStmtList, statuses);
        }
        
        if(!ObjectUtils.isEmpty(criteria.getIsNearingSlaCount()) && criteria.getIsNearingSlaCount()){
            builder.append(" AND ((select extract(epoch from current_timestamp)) * 1000 - pi.lastmodifiedTime) BETWEEN ? AND ? ");
             preparedStmtList.add(0l);
             preparedStmtList.add(criteria.getSlotPercentageSlaLimit());
         }
        
        if(!StringUtils.isEmpty(criteria.getAssignee())) {
        	
        	builder.append(" AND asg.assignee=? ");
        	 preparedStmtList.add(criteria.getAssignee());
        }

        return builder.toString();


    }
    
    

    public String getProcessInstanceIds(ProcessInstanceSearchCriteria criteria, List<Object> preparedStmtList){
        StringBuilder with_query_builder = new StringBuilder(WITH_CLAUSE);


        if (!criteria.getHistory()) {
            with_query_builder.append(" pi_outer.lastmodifiedTime = (" +
                    "SELECT max(lastmodifiedTime) from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid = pi_outer.businessid and tenantid = ? " +
                    ") ");
            preparedStmtList.add(criteria.getTenantId());
        }

        if (criteria.getHistory())
            with_query_builder.append(" pi_outer.tenantid=? ");
        else
            with_query_builder.append(" AND pi_outer.tenantid=? ");

        preparedStmtList.add(criteria.getTenantId());


        List<String> ids = criteria.getIds();
        if (!CollectionUtils.isEmpty(ids)) {
            with_query_builder.append("and pi_outer.id IN (").append(createQuery(ids)).append(")");
            addToPreparedStatement(preparedStmtList, ids);
        }

        List<String> businessIds = criteria.getBusinessIds();
        if (!CollectionUtils.isEmpty(businessIds)) {
            if(isFuzzyEnabled) {
                with_query_builder.append(" and pi_outer.businessId LIKE ANY(ARRAY[ ").append(createQuery(businessIds)).append("])");
                addToPreparedStatementForFuzzySearch(preparedStmtList, businessIds);
            }
            else {
                with_query_builder.append(" and pi_outer.businessId IN ( ").append(createQuery(businessIds)).append(")");
                addToPreparedStatement(preparedStmtList, businessIds);
            }
        }

        List<String> status = criteria.getStatus();
        if (!CollectionUtils.isEmpty(status)) {
            with_query_builder.append(" and pi_outer.status IN (").append(createQuery(status)).append(")");
            addToPreparedStatement(preparedStmtList, status);
        }

        if(criteria.getAssignee()!=null){
            with_query_builder.append(" and id in (select processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid = ? ");
            preparedStmtList.add(criteria.getAssignee());
            preparedStmtList.add(criteria.getTenantId());
        }

        if(!StringUtils.isEmpty(criteria.getBusinessService())){
            with_query_builder.append(" AND pi_outer.businessservice =? ");
            preparedStmtList.add(criteria.getBusinessService());
        }

        if(!StringUtils.isEmpty(criteria.getModuleName())){
            with_query_builder.append(" AND pi_outer.modulename =? ");
            preparedStmtList.add(criteria.getModuleName());
        }


        with_query_builder.append(" ORDER BY pi_outer.lastModifiedTime DESC ");

        addPagination(with_query_builder,preparedStmtList,criteria);

        return with_query_builder.toString();
    }


    public String getProcessInstanceSearchQueryById(List<String> ids, List<Object> preparedStmtList){

        StringBuilder builder = new StringBuilder(QUERY);

        builder.append(" pi.id IN (").append(createQuery(ids)).append(")");
        addToPreparedStatement(preparedStmtList, ids);

        builder.append(" ORDER BY wf_lastModifiedTime DESC ");

        return builder.toString();
    }


    /**
     * Creates preparedStatement
     *
     * @param ids The ids to search on
     * @return Query with prepares statement
     */
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

    /**
     * Add ids to preparedStatement list
     *
     * @param preparedStmtList The list containing the values of search params
     * @param ids              The ids to be searched
     */
    private void addToPreparedStatement(List<Object> preparedStmtList, List<String> ids) {
        ids.forEach(id -> {
            preparedStmtList.add(id);
        });
    }

    private void addToPreparedStatementForFuzzySearch(List<Object> preparedStmtList, List<String> ids) {
        ids.forEach(id -> {
            preparedStmtList.add("%"+id+"%");
        });
    }

    /**
     * Wraps pagination around the base query
     *
     * @param query            The query for which pagination has to be done
     * @param preparedStmtList The object list to send the params
     * @param criteria         The object containg the search params
     * @return Query with pagination
     */
    private String addPaginationWrapper(String query, List<Object> preparedStmtList,
                                        ProcessInstanceSearchCriteria criteria) {
        int limit = config.getDefaultLimit();
        int offset = config.getDefaultOffset();
        String finalQuery = paginationWrapper.replace("{}", query);

        if (criteria.getLimit() != null && criteria.getLimit() <= config.getMaxSearchLimit())
            limit = criteria.getLimit();

        if (criteria.getLimit() != null && criteria.getLimit() > config.getMaxSearchLimit())
            limit = config.getMaxSearchLimit();

        if (criteria.getOffset() != null)
            offset = criteria.getOffset();

        preparedStmtList.add(offset);
        preparedStmtList.add(limit + offset);

        return finalQuery;
    }


    private String addCountWrapperForInboxIdQuery(String query){
        String countQuery = COUNT_WRAPPER_INBOX.replace("{INTERNAL_QUERY}", query);
        return countQuery;
    }

    public String getInboxIdCount(ProcessInstanceSearchCriteria criteria, ArrayList<Object> preparedStmtList) {
        String finalQuery = getInboxIdQuery(criteria,preparedStmtList,false);
        String countQuery = addCountWrapperForInboxIdQuery(finalQuery);
        return countQuery;
    }

    public String getInboxIdQuery(ProcessInstanceSearchCriteria criteria, List<Object> preparedStmtList, Boolean isPaginationRequired){

        String with_query = WITH_CLAUSE + " pi_outer.lastmodifiedTime = (" +
                "SELECT max(lastmodifiedTime) from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid = pi_outer.businessid and tenantid = ? " +
                ") ";

        preparedStmtList.add(criteria.getTenantId());
        List<String> statuses = criteria.getStatus();
        List<String> tenantSpecificStatus = criteria.getTenantSpecifiStatus();
        StringBuilder with_query_builder = new StringBuilder(with_query);

        if(criteria.getIsAssignedToMeCount()!=null && criteria.getIsAssignedToMeCount())
        {
            with_query_builder.append(" AND id in (select processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid = ? ");
            preparedStmtList.add(criteria.getAssignee());
            preparedStmtList.add(criteria.getTenantId());
        }
       else if(!config.getAssignedOnly() && !CollectionUtils.isEmpty(tenantSpecificStatus)){
            String clause = " AND ((id in (select processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee = ?)" +
                    " AND pi_outer.tenantid = ? ) {{OR_CLUASE_PLACEHOLDER}} )";

            preparedStmtList.add(criteria.getAssignee());
            preparedStmtList.add(criteria.getTenantId());

            String statusWhereCluse = getStatusRelatedWhereClause(statuses, tenantSpecificStatus, preparedStmtList);
            clause = clause.replace("{{OR_CLUASE_PLACEHOLDER}}", statusWhereCluse);
            with_query_builder.append(clause);
        } 
        else {
            if(!isNull(criteria.getModuleName()) && criteria.getModuleName().equals("BPAREG")) {
                List<String> statusesIrrespectiveOfTenant = criteria.getStatusesIrrespectiveOfTenant();
                if (CollectionUtils.isEmpty(tenantSpecificStatus) && !CollectionUtils.isEmpty(statusesIrrespectiveOfTenant)) {
                    String clause = " AND ((id in (select processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee = ?)" +
                            " AND pi_outer.tenantid = ? ) {{OR_CLUASE_PLACEHOLDER}} )";

                    preparedStmtList.add(criteria.getAssignee());
                    preparedStmtList.add(criteria.getTenantId());

                    StringBuilder statusQuery = new StringBuilder(" OR pi_outer.status IN (").append(createQuery(statusesIrrespectiveOfTenant)).append(")");
                    addToPreparedStatement(preparedStmtList, statusesIrrespectiveOfTenant);
                    clause = clause.replace("{{OR_CLUASE_PLACEHOLDER}}", statusQuery.toString());
                    with_query_builder.append(clause);
                }
            } else {
                with_query_builder.append(" AND id in (select processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid = ? ");
                preparedStmtList.add(criteria.getAssignee());
                preparedStmtList.add(criteria.getTenantId());
            }
        }

        if(!StringUtils.isEmpty(criteria.getBusinessService())){
            with_query_builder.append(" AND pi_outer.businessservice =? ");
            preparedStmtList.add(criteria.getBusinessService());
        }
        
        if(!ObjectUtils.isEmpty(criteria.getIsNearingSlaCount()) && criteria.getIsNearingSlaCount()){
            with_query_builder.append(" AND ((select extract(epoch from current_timestamp)) * 1000 - pi_outer.lastmodifiedTime) BETWEEN ? AND ? ");
            preparedStmtList.add(0l);
            preparedStmtList.add(criteria.getSlotPercentageSlaLimit());
        }
        

        with_query_builder.append(" ORDER BY pi_outer.lastModifiedTime DESC ");

        if(isPaginationRequired)
            addPagination(with_query_builder,preparedStmtList,criteria);

        StringBuilder builder = new StringBuilder(with_query_builder);

        return builder.toString();
    }


    private String getStatusRelatedWhereClause(List<String> statuses, List<String> tenantSpecificStatus, List<Object> preparedStmtList)
    {
        StringBuilder innerQuery = new StringBuilder();

        if(!CollectionUtils.isEmpty(tenantSpecificStatus)){
            innerQuery.append(getTenantSpecificStatusClause(tenantSpecificStatus));
            addToPreparedStatement(preparedStmtList, tenantSpecificStatus);
        }

        if(!CollectionUtils.isEmpty(statuses)){
            innerQuery.append(getStatusClause(statuses));
            addToPreparedStatement(preparedStmtList, statuses);
        }

        return innerQuery.toString();
    }


    private String getTenantSpecificStatusClause(List<String> tenantSpecificStatus){
        StringBuilder builder = new StringBuilder(" OR (pi_outer.tenantid || ':' || pi_outer.status) IN (").append(createQuery(tenantSpecificStatus)).append(")");
        return builder.toString();
    }

    private String getStatusClause(List<String> statuses){
        StringBuilder builder = new StringBuilder(" OR pi_outer.status IN (").append(createQuery(statuses)).append(")");
        return builder.toString();
    }


    /**
     * Wraps pagination around the base query
     * @param query The query for which pagination has to be done
     * @param preparedStmtList The object list to send the params
     * @param criteria The object containg the search params
     * @return Query with pagination
     */
    private void addPagination(StringBuilder query,List<Object> preparedStmtList,ProcessInstanceSearchCriteria criteria){
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

    /**
     * Returns the total number of processInstances for the given criteria
     * @param criteria
     * @param preparedStmtList
     * @return
     */
    public String getInboxCount(ProcessInstanceSearchCriteria criteria, List<Object> preparedStmtList,Boolean statuCount){

        String query = getInboxIdQuery(criteria, preparedStmtList, false);

        String countQuery = null;

        if(statuCount) {
        	countQuery = "select  count(DISTINCT cq.id),cq.applicationStatus,cq.businessservice,cq.PI_STATUS as statusId from  ( select ppi.id,ppi.businessservice,ppst.applicationstatus,ppi.status as PI_STATUS FROM eg_wf_processinstance_v2 ppi  JOIN eg_wf_state_v2 ppst ON ( ppst.uuid =ppi.status ) WHERE ppi.id IN ({INTERNAL_QUERY}) ) cq GROUP BY cq.applicationStatus,cq.businessservice,cq.PI_STATUS";

            countQuery = countQuery.replace("{INTERNAL_QUERY}", query);
        }else {
        	 countQuery = "select count(DISTINCT id) from ({INTERNAL_QUERY}) as count";

             countQuery = countQuery.replace("{INTERNAL_QUERY}", query);
        }

        return countQuery;
    }


    public String getProcessInstanceCount(ProcessInstanceSearchCriteria criteria, List<Object> preparedStmtList, boolean statuCount) {
        String finalQuery = getProcessInstanceSearchQueryWithoutPagination(criteria,preparedStmtList);
        String countQuery = null;
        if(statuCount) {
        	countQuery =addStatusCountWrapper(finalQuery);
        }else {
        	countQuery = addCountWrapper(finalQuery);
        }
        return countQuery;
    }


    /**
     * Adds a count wrapper around the query
     * @param query
     * @return
     */
    private String addCountWrapper(String query){
        String countQuery = COUNT_WRAPPER.replace("{INTERNAL_QUERY}", query);
        return countQuery;
    }


    public String getInboxApplicationsBusinessIdsQuery(ProcessInstanceSearchCriteria criteria, ArrayList<Object> preparedStmtList) {
        StringBuilder query = new StringBuilder("SELECT DISTINCT businessid FROM eg_wf_processinstance_v2 ");

        if(!isNull(criteria.getTenantId())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" tenantid = ? ");
            preparedStmtList.add(criteria.getTenantId());
        }

        if(!isNull(criteria.getAssignee())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" createdby = ? ");
            preparedStmtList.add(criteria.getAssignee());
        }

        if(!isNull(criteria.getBusinessService())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" businessservice = ? ");
            preparedStmtList.add(criteria.getBusinessService());
        }

        return query.toString();
    }

    private String addCountWrapperForEscalatedApplications(String query){
        String countQuery = COUNT_WRAPPER_ESCALATED.replace("{INTERNAL_QUERY}", query);
        return countQuery;
    }

    public String getEscalatedApplicationsCount(RequestInfo requestInfo,ProcessInstanceSearchCriteria criteria, ArrayList<Object> preparedStmtList) {
        String finalQuery = getAutoEscalatedApplicationsFinalQuery(requestInfo,criteria,preparedStmtList);
        String countQuery = addCountWrapperForEscalatedApplications(finalQuery);
        return countQuery;
    }

    public String getAutoEscalatedApplicationsFinalQuery(RequestInfo requestInfo,ProcessInstanceSearchCriteria criteria, ArrayList<Object> preparedStmtList) {
        String autoEscalatedApplicationsRankedQuery = getAutoEscalatedApplicationsRankedQuery(criteria,preparedStmtList);
        String query = FINAL_ESCALATED_QUERY.replace("{RANKED_QUERY}", autoEscalatedApplicationsRankedQuery);
        StringBuilder builder = new StringBuilder(query);

        if(!isNull(requestInfo.getUserInfo().getUuid())){
            builder.append(" AND asg = ? ");
            preparedStmtList.add(requestInfo.getUserInfo().getUuid());
        }

        if(!ObjectUtils.isEmpty(criteria.getIsEscalatedCount())) {
            if (!criteria.getIsEscalatedCount()) {
                addPagination(builder,preparedStmtList,criteria);
            }
        }

        return builder.toString();
    }

    public String getAutoEscalatedApplicationsRankedQuery(ProcessInstanceSearchCriteria criteria, ArrayList<Object> preparedStmtList) {
        String autoEscalatedApplicationsBusinessIdsQuery = getAutoEscalatedApplicationsBusinessIdsQuery(criteria,preparedStmtList);
        String query = RANK_WRAPPER.replace("{BASE_QUERY}", autoEscalatedApplicationsBusinessIdsQuery);
        return query;
    }

    public String getAutoEscalatedApplicationsBusinessIdsQuery(ProcessInstanceSearchCriteria criteria, ArrayList<Object> preparedStmtList) {
        StringBuilder query = new StringBuilder(BASE_QUERY);

        if(!isNull(criteria.getTenantId())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" tenantid = ? ");
            preparedStmtList.add(criteria.getTenantId());
        }

//        List<String> businessIds = criteria.getBusinessIds();
//        if(!CollectionUtils.isEmpty(criteria.getBusinessIds())){
//            addClauseIfRequired(query, preparedStmtList);
//            query.append(" businessid IN ( ").append(createQuery(businessIds)).append(" )");
//            addToPreparedStatement(preparedStmtList, businessIds);
//        }

        List<String> businessIds = criteria.getBusinessIds();
        if (!CollectionUtils.isEmpty(businessIds)) {
            if(isFuzzyEnabled) {
                query.append(" and businessId LIKE ANY(ARRAY[ ").append(createQuery(businessIds)).append("])");
                addToPreparedStatementForFuzzySearch(preparedStmtList, businessIds);
            }
            else {
                query.append(" and businessId IN ( ").append(createQuery(businessIds)).append(")");
                addToPreparedStatement(preparedStmtList, businessIds);
            }
        }

//        List<String> uuidsOfAutoEscalationEmployees = criteria.getMultipleAssignees();
//        if(!CollectionUtils.isEmpty(uuidsOfAutoEscalationEmployees)){
//            addClauseIfRequired(query, preparedStmtList);
//            query.append(" createdby IN ( ").append(createQuery(uuidsOfAutoEscalationEmployees)).append(" )");
//            addToPreparedStatement(preparedStmtList, uuidsOfAutoEscalationEmployees);
//        }

        if(!isNull(criteria.getBusinessService())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" businessservice = ? ");
            preparedStmtList.add(criteria.getBusinessService());
        }

        query.append( ") wf  WHERE rank_number = 1 AND wf.escalated = true ");
        return query.toString();
    }

    private void addClauseIfRequired(StringBuilder query, List<Object> preparedStmtList){
        if(preparedStmtList.isEmpty()){
            query.append(" WHERE ");
        }else{
            query.append(" AND ");
        }
    }
    /**
     * Adds a count wrapper around the query
     * @param query
     * @return
     */
    private String addStatusCountWrapper(String query){
        String countQuery = STATUS_COUNT_WRAPPER.replace("{INTERNAL_QUERY}", query);
        return countQuery;
    }
}
