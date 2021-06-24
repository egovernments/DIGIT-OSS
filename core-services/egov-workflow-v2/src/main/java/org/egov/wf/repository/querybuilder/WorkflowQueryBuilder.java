package org.egov.wf.repository.querybuilder;

import org.apache.commons.lang3.StringUtils;
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
    private static final String CONCAT = " CONCAT ";

    private static final String QUERY = " SELECT pi.*,st.*,ac.*,doc.*,pi.id as wf_id,pi.lastModifiedTime as wf_lastModifiedTime,pi.createdTime as wf_createdTime,"
            + "       pi.createdBy as wf_createdBy,pi.lastModifiedBy as wf_lastModifiedBy,pi.status as pi_status,"
            + "       doc.lastModifiedTime as doc_lastModifiedTime,doc.createdTime as doc_createdTime,doc.createdBy as doc_createdBy,"
            + "       doc.lastModifiedBy as doc_lastModifiedBy,doc.tenantid as doc_tenantid,doc.id as doc_id,asg.assignee as assigneeuuid,"
            + "       st.uuid as st_uuid,st.tenantId as st_tenantId, ac.uuid as ac_uuid,ac.tenantId as ac_tenantId,ac.action as ac_action"
            + "       FROM eg_wf_processinstance_v2 pi  " + LEFT_OUTER_JOIN
            + "       eg_wf_assignee_v2 asg ON asg.processinstanceid = pi.id " + LEFT_OUTER_JOIN
            + "      eg_wf_document_v2 doc  ON doc.processinstanceid = pi.id " + INNER_JOIN
            + "       eg_wf_state_v2 st ON st.uuid = pi.status" + LEFT_OUTER_JOIN
            + "       eg_wf_action_v2 ac ON ac.currentState = st.uuid " + "       WHERE ";


    private static final String WITH_CLAUSE = " select id from eg_wf_processinstance_v2 pi_outer WHERE " ;



    private final String paginationWrapper = "SELECT * FROM "
            + "(SELECT *, DENSE_RANK() OVER (ORDER BY wf_createdTime DESC,wf_id) offset_ FROM " + "({})"
            + " result) result_offset " + "WHERE offset_ > ? AND offset_ <= ?";

    private final String ORDERBY_CREATEDTIME = " ORDER BY result_offset.wf_createdTime DESC ";

    private final String LATEST_RECORD = " pi.lastmodifiedTime  IN  (SELECT max(lastmodifiedTime) from eg_wf_processinstance_v2 GROUP BY businessid) ";

    private static final String COUNT_WRAPPER = "select count(DISTINCT wf_id) from ({INTERNAL_QUERY}) as count";



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
            builder.append("and tl.id IN (").append(createQuery(ids)).append(")");
            addToPreparedStatement(preparedStmtList, ids);
        }

        List<String> businessIds = criteria.getBusinessIds();
        if (!CollectionUtils.isEmpty(businessIds)) {
            builder.append(" and pi.businessId IN (").append(createQuery(businessIds)).append(")");
            addToPreparedStatement(preparedStmtList, businessIds);
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
            with_query_builder.append(" and pi_outer.businessId IN (").append(createQuery(businessIds)).append(")");
            addToPreparedStatement(preparedStmtList, businessIds);
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



    public String getInboxIdQuery(ProcessInstanceSearchCriteria criteria, List<Object> preparedStmtList){

        String with_query = WITH_CLAUSE + " pi_outer.lastmodifiedTime = (" +
                "SELECT max(lastmodifiedTime) from eg_wf_processinstance_v2 as pi_inner where pi_inner.businessid = pi_outer.businessid and tenantid = ? " +
                ") ";

        preparedStmtList.add(criteria.getTenantId());
        List<String> statuses = criteria.getStatus();
        StringBuilder with_query_builder = new StringBuilder(with_query);

        if(!config.getAssignedOnly() && !CollectionUtils.isEmpty(statuses)){
            with_query_builder.append(" AND ((id in (select processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid = ? ) OR (pi_outer.tenantid || ':' || pi_outer.status) IN (").append(createQuery(statuses)).append("))");
            preparedStmtList.add(criteria.getAssignee());
            preparedStmtList.add(criteria.getTenantId());
            addToPreparedStatement(preparedStmtList,statuses);
        }
        else {
            with_query_builder.append(" id in (select processinstanceid from eg_wf_assignee_v2 asg_inner where asg_inner.assignee = ?) AND pi_outer.tenantid = ? ");
            preparedStmtList.add(criteria.getAssignee());
            preparedStmtList.add(criteria.getTenantId());
        }

        if(!StringUtils.isEmpty(criteria.getBusinessService())){
            with_query_builder.append(" AND pi_outer.businessservice =? ");
            preparedStmtList.add(criteria.getBusinessService());
        }

        with_query_builder.append(" ORDER BY pi_outer.lastModifiedTime DESC ");

        addPagination(with_query_builder,preparedStmtList,criteria);

        StringBuilder builder = new StringBuilder(with_query_builder);

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
    public String getInboxCount(ProcessInstanceSearchCriteria criteria, List<Object> preparedStmtList){

        String query = QUERY + " pi.lastmodifiedTime IN  (SELECT max(lastmodifiedTime) from eg_wf_processinstance_v2 WHERE tenantid=? GROUP BY businessid)";
        preparedStmtList.add(criteria.getTenantId());

        List<String> statuses = criteria.getStatus();
        StringBuilder builder = new StringBuilder(query);

        if(!config.getAssignedOnly() && !CollectionUtils.isEmpty(statuses)){
            builder.append(" AND ((asg.assignee = ?  AND pi.tenantid = ?) OR CONCAT (pi.tenantid,':',pi.status) IN (").append(createQuery(statuses)).append("))");
            preparedStmtList.add(criteria.getAssignee());
            preparedStmtList.add(criteria.getTenantId());
            addToPreparedStatement(preparedStmtList,statuses);
        }
        else {
            builder.append(" AND asg.assignee = ?  AND pi.tenantid = ?");
            preparedStmtList.add(criteria.getAssignee());
            preparedStmtList.add(criteria.getTenantId());
        }

        String countQuery = addCountWrapper(builder.toString());

        return countQuery;
    }


    public String getProcessInstanceCount(ProcessInstanceSearchCriteria criteria, List<Object> preparedStmtList) {
        String finalQuery = getProcessInstanceSearchQueryWithoutPagination(criteria,preparedStmtList);
        String countQuery = addCountWrapper(finalQuery);
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


}
