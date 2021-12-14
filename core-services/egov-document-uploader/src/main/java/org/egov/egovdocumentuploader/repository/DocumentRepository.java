package org.egov.egovdocumentuploader.repository;

import lombok.extern.slf4j.Slf4j;
import org.egov.egovdocumentuploader.repository.querybuilder.DocumentQueryBuilder;
import org.egov.egovdocumentuploader.repository.rowmapper.DocumentRowMapper;
import org.egov.egovdocumentuploader.web.models.DocumentEntity;
import org.egov.egovdocumentuploader.web.models.DocumentSearchCriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Repository
public class DocumentRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private DocumentRowMapper rowMapper;

    @Autowired
    private DocumentQueryBuilder documentQueryBuilder;

    public List<DocumentEntity> getDocuments(DocumentSearchCriteria criteria) {
        List<Object> preparedStmtList = new ArrayList<>();
        if(CollectionUtils.isEmpty(criteria.getTenantIds()) && ObjectUtils.isEmpty(criteria.getUuid()))
            return new ArrayList<>();

        String query = documentQueryBuilder.getDocumentSearchQuery(criteria, preparedStmtList);
        log.info("query for search: " + query + " params: " + preparedStmtList);
        return jdbcTemplate.query(query, preparedStmtList.toArray(), rowMapper);
    }

    public Integer getDocumentsCount(DocumentSearchCriteria criteria) {
        List<Object> preparedStmtList = new ArrayList<>();
        if(CollectionUtils.isEmpty(criteria.getTenantIds()) && ObjectUtils.isEmpty(criteria.getUuid()))
            return 0;

        String query = documentQueryBuilder.getDocumentCountQuery(criteria, preparedStmtList);
        log.info("query for search: " + query + " params: " + preparedStmtList);
        return jdbcTemplate.queryForObject(query, preparedStmtList.toArray(), Integer.class);
    }

    public List getDocumentsStatusWiseCount(DocumentSearchCriteria criteria) {
        List<Object> preparedStmtList = new ArrayList<>();
        if(CollectionUtils.isEmpty(criteria.getTenantIds()) && ObjectUtils.isEmpty(criteria.getUuid()))
            return new ArrayList();

        String query = documentQueryBuilder.getDocumentStatusCountQuery(criteria, preparedStmtList);
        log.info("query for search: " + query + " params: " + preparedStmtList);
        return jdbcTemplate.queryForList(query, preparedStmtList.toArray());
    }
}
