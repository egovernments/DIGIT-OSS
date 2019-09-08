package org.egov.wf.repository.querybuilder;

import org.egov.wf.config.WorkflowConfig;
import org.egov.wf.web.models.ProcessInstanceSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.List;


@Component
public class WorkflowQueryBuilder {

    private WorkflowConfig config;

    @Autowired
    public WorkflowQueryBuilder(WorkflowConfig config) {
        this.config = config;
    }

    private static final String INNER_JOIN = " INNER JOIN ";
    private static final String LEFT_OUTER_JOIN = " LEFT OUTER JOIN ";


    private static final String QUERY = "SELECT pi.*,doc.*,pi.id as wf_id," +
            "pi.lastModifiedTime as wf_lastModifiedTime,pi.createdTime as wf_createdTime," +
            "pi.createdBy as wf_createdBy,pi.lastModifiedBy as wf_lastModifiedBy,pi.status as pi_status," +
            "doc.lastModifiedTime as doc_lastModifiedTime,doc.createdTime as doc_createdTime," +
            "doc.createdBy as doc_createdBy,doc.lastModifiedBy as doc_lastModifiedBy," +
            "doc.tenantid as doc_tenantid,doc.id as doc_id " +
            " FROM eg_wf_processinstance_v2 pi " +
            LEFT_OUTER_JOIN+
            " eg_wf_document_v2 doc " +
            " ON doc.processinstanceid = pi.id WHERE ";

    /*
     * ORDER BY class for wf last modified time added to make search result in desc order 
     */
    private static final String STATE_JOIN_QUERY  = INNER_JOIN + " eg_wf_state_v2 st ON st.uuid = fp.pi_status " +
            LEFT_OUTER_JOIN  + " eg_wf_action_v2 ac ON ac.currentState = st.uuid";

    private static final String OUTER_QUERY = "SELECT fp.*,st.*,ac.*, st.uuid as st_uuid,st.tenantId as st_tenantId,"+
            " ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.action as ac_action FROM ( ";

    private final String paginationWrapper = "SELECT * FROM " +
            "(SELECT *, DENSE_RANK() OVER (ORDER BY wf_id) offset_ FROM " +
            "({})" +
            " result) result_offset " +
            "WHERE offset_ > ? AND offset_ <= ?";

    private final String ORDERBY_CREATEDTIME = " ORDER BY result_offset.wf_createdTime DESC ";

    private final String LATEST_RECORD = " LIMIT 1";

    /**
     * Creates the query according to the search params
     * @param criteria The criteria containg fields to search on
     * @param preparedStmtList The List of object to store the search params
     * @return
     */
    public String getProcessInstanceSearchQuery(ProcessInstanceSearchCriteria criteria, List<Object> preparedStmtList) {

        StringBuilder builder = new StringBuilder(QUERY);

        builder.append(" pi.tenantid=? ");
        preparedStmtList.add(criteria.getTenantId());

        List<String> ids = criteria.getIds();
        if(!CollectionUtils.isEmpty(ids)) {
            builder.append("and tl.id IN (").append(createQuery(ids)).append(")");
            addToPreparedStatement(preparedStmtList,ids);
        }


        List<String> businessIds = criteria.getBusinessIds();
        if(!CollectionUtils.isEmpty(businessIds)) {
            builder.append(" and pi.businessId IN (").append(createQuery(businessIds)).append(")");
            addToPreparedStatement(preparedStmtList,businessIds);
        }


        String query = addPaginationWrapper(builder.toString(),preparedStmtList,criteria);
        query = query + ORDERBY_CREATEDTIME;

        if(!criteria.getHistory())
            query = query + LATEST_RECORD;


        return query;

    }

    public String getProcessInstanceSearchQueryWithState(ProcessInstanceSearchCriteria criteria, List<Object> preparedStmtList) {
       String query = getProcessInstanceSearchQuery(criteria,preparedStmtList);
       String finalQuery = OUTER_QUERY+query+")" + " fp "+STATE_JOIN_QUERY;
       finalQuery = addOrderByCreatedTime(finalQuery);
       return finalQuery;
    }



        /**
         * Creates preparedStatement
         * @param ids The ids to search on
         * @return Query with prepares statement
         */
    private String createQuery(List<String> ids) {
        StringBuilder builder = new StringBuilder();
        int length = ids.size();
        for( int i = 0; i< length; i++){
            builder.append(" ?");
            if(i != length -1) builder.append(",");
        }
        return builder.toString();
    }


    /**
     * Add ids to preparedStatement list
     * @param preparedStmtList The list containing the values of search params
     * @param ids The ids to be searched
     */
    private void addToPreparedStatement(List<Object> preparedStmtList,List<String> ids)
    {
        ids.forEach(id ->{ preparedStmtList.add(id);});
    }


    /**
     * Wraps pagination around the base query
     * @param query The query for which pagination has to be done
     * @param preparedStmtList The object list to send the params
     * @param criteria The object containg the search params
     * @return Query with pagination
     */
    private String addPaginationWrapper(String query,List<Object> preparedStmtList,
                                        ProcessInstanceSearchCriteria criteria){
        int limit = config.getDefaultLimit();
        int offset = config.getDefaultOffset();
        String finalQuery = paginationWrapper.replace("{}",query);

        if(criteria.getLimit()!=null && criteria.getLimit()<=config.getMaxSearchLimit())
            limit = criteria.getLimit();

        if(criteria.getLimit()!=null && criteria.getLimit()>config.getMaxSearchLimit())
            limit = config.getMaxSearchLimit();

        if(criteria.getOffset()!=null)
            offset = criteria.getOffset();

        preparedStmtList.add(offset);
        preparedStmtList.add(limit+offset);

        return finalQuery;
    }


    /**
     * Adds orderBy clause to the query with limit 1
     * @param query The query to be modified
     * @return Query ordered descending by createTime returning the tp entry
     */
    private String addOrderByCreatedTime(String query){
        StringBuilder builder = new StringBuilder(query);
        builder.append(" ORDER BY fp.wf_createdTime DESC ");
        return builder.toString();
    }



    /**
     * Creates query to search processInstanceFromRequest assigned to user
     * @return search query based on assignee
     */
    public String getAssigneeSearchQuery(ProcessInstanceSearchCriteria criteria, List<Object> preparedStmtList){
        String query = QUERY +" assignee = ? "+
                " AND pi.tenantid = ? " +
                " AND pi.lastmodifiedTime IN  (SELECT max(lastmodifiedTime) from eg_wf_processinstance_v2 GROUP BY businessid)";
        preparedStmtList.add(criteria.getAssignee());
        preparedStmtList.add(criteria.getTenantId());
        query = OUTER_QUERY+query+")" + " fp "+STATE_JOIN_QUERY;
        return query;
    }


    /**
     * Creates query to search processInstanceFromRequest based on user roles
     * @return search query based on assignee
     */
    public String getStatusBasedProcessInstance(ProcessInstanceSearchCriteria criteria, List<Object> preparedStmtList){
        String query = QUERY +" pi.tenantid = ? " +
                " AND pi.lastmodifiedTime IN  (SELECT max(lastmodifiedTime) from eg_wf_processinstance_v2 GROUP BY businessid)";

        StringBuilder builder = new StringBuilder(query);
        preparedStmtList.add(criteria.getTenantId());
        List<String> statuses = criteria.getStatus();
        if(!CollectionUtils.isEmpty(statuses)) {
            builder.append(" and status IN (").append(createQuery(statuses)).append(")");
            addToPreparedStatement(preparedStmtList,statuses);
        }
        return OUTER_QUERY+builder.toString()+")" + " fp "+STATE_JOIN_QUERY;
    }










}
