package org.egov.auditservice.repository.querybuilder;

import org.egov.auditservice.config.AuditServiceConfiguration;
import org.egov.auditservice.web.models.AuditLogSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import java.util.List;

@Component
public class AuditQueryBuilder {

    @Autowired
    private AuditServiceConfiguration config;

    private static final String BASE_QUERY = "SELECT id, useruuid, module, tenantid, transactioncode, changedate, entityname, objectid, keyvaluemap, operationtype, integrityhash, auditcorrelationid FROM eg_audit_logs ";

    public String getAuditLogQuery(AuditLogSearchCriteria criteria, List<Object> preparedStmtList) {
        StringBuilder query = new StringBuilder(BASE_QUERY);
        if(!ObjectUtils.isEmpty(criteria.getTenantId())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" tenantid = ? ");
            preparedStmtList.add(criteria.getTenantId());
        }
        if(!ObjectUtils.isEmpty(criteria.getId())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" id = ? ");
            preparedStmtList.add(criteria.getId());
        }
        if(!ObjectUtils.isEmpty(criteria.getModule())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" module = ? ");
            preparedStmtList.add(criteria.getModule());
        }
        if(!ObjectUtils.isEmpty(criteria.getObjectId())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" objectid = ? ");
            preparedStmtList.add(criteria.getObjectId());
        }
        if(!ObjectUtils.isEmpty(criteria.getUserUUID())){
            addClauseIfRequired(query, preparedStmtList);
            query.append(" useruuid = ? ");
            preparedStmtList.add(criteria.getUserUUID());
        }

        addPagination(query, preparedStmtList, criteria);

        return query.toString();

    }

    private void addPagination(StringBuilder query,List<Object> preparedStmtList, AuditLogSearchCriteria criteria){
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

    private void addClauseIfRequired(StringBuilder query, List<Object> preparedStmtList){
        if(CollectionUtils.isEmpty(preparedStmtList))
            query.append(" WHERE ");
        else
            query.append(" AND ");
    }
}
