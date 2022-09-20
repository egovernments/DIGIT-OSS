package org.egov.auditservice.repository;

import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.egov.auditservice.repository.querybuilder.AuditQueryBuilder;
import org.egov.auditservice.repository.rowmapper.AuditRowMapper;
import org.egov.auditservice.web.models.AuditLog;
import org.egov.auditservice.web.models.AuditLogSearchCriteria;
import org.egov.tracer.model.CustomException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ContextConfiguration(classes = {AuditServiceRepository.class})
@ExtendWith(SpringExtension.class)
class AuditServiceRepositoryTest {
    @MockBean
    private AuditQueryBuilder auditQueryBuilder;

    @MockBean
    private AuditRowMapper auditRowMapper;

    @Autowired
    private AuditServiceRepository auditServiceRepository;

    @MockBean
    private JdbcTemplate jdbcTemplate;


    ////@Test
    void testGetAuditLogsFromDb() throws DataAccessException {
        when(jdbcTemplate.query((String) any(), (Object[]) any(), (ResultSetExtractor<Object>) any())).thenReturn("Query");
        when(auditQueryBuilder.getAuditLogQuery((AuditLogSearchCriteria) any(), (List<Object>) any()))
                .thenThrow(new CustomException("query for search: ", "An error occurred"));
        assertThrows(CustomException.class, () -> auditServiceRepository.getAuditLogsFromDb(new AuditLogSearchCriteria()));
        verify(auditQueryBuilder).getAuditLogQuery((AuditLogSearchCriteria) any(), (List<Object>) any());
    }

    ////@Test
    void testGetAuditLogsFromDbWithAuditLogQuery() throws DataAccessException {
        ArrayList<Object> objectList = new ArrayList<>();
        when(jdbcTemplate.query((String) any(), (Object[]) any(), (ResultSetExtractor<Object>) any()))
                .thenReturn(objectList);
        when(auditQueryBuilder.getAuditLogQuery((AuditLogSearchCriteria) any(), (List<Object>) any()))
                .thenReturn("Audit Log Query");
        List<AuditLog> actualAuditLogsFromDb = auditServiceRepository.getAuditLogsFromDb(new AuditLogSearchCriteria());
        assertSame(objectList, actualAuditLogsFromDb);
        assertTrue(actualAuditLogsFromDb.isEmpty());
        verify(jdbcTemplate).query((String) any(), (Object[]) any(), (ResultSetExtractor<Object>) any());
        verify(auditQueryBuilder).getAuditLogQuery((AuditLogSearchCriteria) any(), (List<Object>) any());
    }


    ////@Test
    void testGetAuditLogsFromDbWithNullAuditLogQuery() throws DataAccessException {
        when(jdbcTemplate.query((String) any(), (Object[]) any(), (ResultSetExtractor<Object>) any())).thenReturn("Query");
        when(auditQueryBuilder.getAuditLogQuery((AuditLogSearchCriteria) any(), (List<Object>) any()))
                .thenReturn("Audit Log Query");
        assertThrows(CustomException.class, () -> auditServiceRepository.getAuditLogsFromDb(null));
    }
}

