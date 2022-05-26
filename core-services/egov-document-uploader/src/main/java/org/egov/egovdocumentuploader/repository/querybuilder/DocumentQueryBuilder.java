package org.egov.egovdocumentuploader.repository.querybuilder;

import org.egov.egovdocumentuploader.config.ApplicationProperties;
import org.egov.egovdocumentuploader.web.models.DocumentSearchCriteria;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import java.time.Instant;
import java.util.List;

@Component
public class DocumentQueryBuilder {

    @Autowired
    private ApplicationProperties config;

    private static final String QUERY = " SELECT uuid, tenantid, name, category, description, filestoreid, documentlink, postedby, filetype, filesize, active, createdby, lastmodifiedby, createdtime, lastmodifiedtime FROM eg_du_document ";

    private final String ORDERBY_CREATEDTIME = " ORDER BY createdtime DESC ";

    private static final String COUNT_WRAPPER = " SELECT COUNT(uuid) FROM ({INTERNAL_QUERY}) AS count ";

    private static final String STATUS_COUNT_WRAPPER = " SELECT  COUNT(DISTINCT uuid),category from ({INTERNAL_QUERY}) AS dq GROUP BY dq.category ";

    public String getDocumentSearchQuery(DocumentSearchCriteria criteria, List<Object> preparedStmtList){
        StringBuilder query = new StringBuilder(QUERY);

        if(!CollectionUtils.isEmpty(criteria.getTenantIds())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" tenantid IN ( ").append(createQuery(criteria.getTenantIds())).append(" )");
            addToPreparedStatement(preparedStmtList, criteria.getTenantIds());
        }
        if(!ObjectUtils.isEmpty(criteria.getName())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" name ILIKE ? ");
            preparedStmtList.add("%" + criteria.getName() + "%");
        }
        if(!ObjectUtils.isEmpty(criteria.getCategory())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" category = ? ");
            preparedStmtList.add(criteria.getCategory());
        }
        if(!ObjectUtils.isEmpty(criteria.getPostedBy())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" postedby ILIKE ? ");
            preparedStmtList.add("%" + criteria.getPostedBy() + "%");
        }
        if(!ObjectUtils.isEmpty(criteria.getUuid())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" uuid = ? ");
            preparedStmtList.add(criteria.getUuid());
        }
        // Provided date range based documents returning capability
        if (!ObjectUtils.isEmpty(criteria.getFromDate())) {
            addClauseIfRequired(query, preparedStmtList);

            // If user does NOT specify toDate, take today's date as the toDate by default
            if (ObjectUtils.isEmpty(criteria.getToDate()))
                criteria.setToDate(Instant.now().toEpochMilli());

            query.append("lastmodifiedtime BETWEEN ? AND ?");
            preparedStmtList.add(criteria.getFromDate());
            preparedStmtList.add(criteria.getToDate());
        } else {
            if(!ObjectUtils.isEmpty(criteria.getToDate()))
                throw new CustomException("INVALID_SEARCH", "toDate parameter cannot be specified without fromDate");
        }
        // return documents only if they are active.
        addClauseIfRequired(query, preparedStmtList);
        query.append((" active = ? "));
        if(!ObjectUtils.isEmpty(criteria.getViewDeletedDocuments()) && criteria.getViewDeletedDocuments())
            preparedStmtList.add(Boolean.FALSE);
        else
            preparedStmtList.add(Boolean.TRUE);

        // order documents based on their createdtime in latest first manner
        query.append(ORDERBY_CREATEDTIME);

        // Pagination to limit results, do not paginate query in case of count call.
        if(!criteria.getIsCountCall())
            addPagination(query, preparedStmtList, criteria);

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

    private void addPagination(StringBuilder query,List<Object> preparedStmtList,DocumentSearchCriteria criteria){
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

    public String getDocumentCountQuery(DocumentSearchCriteria criteria, List<Object> preparedStmtList) {
        String query = getDocumentSearchQuery(criteria, preparedStmtList);
        return COUNT_WRAPPER.replace("{INTERNAL_QUERY}", query);
    }

    public String getDocumentStatusCountQuery(DocumentSearchCriteria criteria, List<Object> preparedStmtList) {
        String query = getDocumentSearchQuery(criteria, preparedStmtList);
        return STATUS_COUNT_WRAPPER.replace("{INTERNAL_QUERY}", query);
    }
}
