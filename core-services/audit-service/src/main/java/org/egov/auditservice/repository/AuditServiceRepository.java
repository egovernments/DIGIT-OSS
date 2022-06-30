package org.egov.auditservice.repository;

import lombok.extern.slf4j.Slf4j;
import org.egov.auditservice.repository.querybuilder.AuditQueryBuilder;
import org.egov.auditservice.repository.rowmapper.AuditRowMapper;
import org.egov.auditservice.web.models.AuditLog;
import org.egov.auditservice.web.models.AuditLogSearchCriteria;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.util.ObjectUtils;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Repository
public class AuditServiceRepository {

    @Autowired
    private AuditQueryBuilder queryBuilder;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private AuditRowMapper rowMapper;

    public List<AuditLog> getAuditLogsFromDb(AuditLogSearchCriteria criteria){
        List<Object> preparedStmtList = new ArrayList<>();

        if(ObjectUtils.isEmpty(criteria))
            throw new CustomException("EG_AUDIT_SEARCH_ERR", "Search criteria cannot be empty for searching audit logs");

        String query = queryBuilder.getAuditLogQuery(criteria, preparedStmtList);
        log.info("query for search: " + query + " params: " + preparedStmtList);
        return jdbcTemplate.query(query, preparedStmtList.toArray(), rowMapper);
    }

}
