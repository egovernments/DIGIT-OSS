package org.egov.auditservice.repository.rowmapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.MissingNode;
import org.egov.auditservice.web.models.AuditLog;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.postgresql.util.PGInterval;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataAccessException;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ContextConfiguration(classes = {AuditRowMapper.class})
@ExtendWith(SpringExtension.class)
class AuditRowMapperTest {

    @Autowired
    private AuditRowMapper auditRowMapper;

    @MockBean
    private ObjectMapper objectMapper;

    //@Test
    @DisplayName("Should return empty list when the result set is empty")
    void extractDataWhenResultSetIsEmptyThenReturnEmptyList() throws SQLException {
        ResultSet resultSet = mock(ResultSet.class);
        when(resultSet.next()).thenReturn(false);
        List<AuditLog> auditLogs = auditRowMapper.extractData(resultSet);
        assertTrue(auditLogs.isEmpty());
    }

    //@Test
    @DisplayName("Should return list of audit logs when the result set is not empty")
    void extractDataWhenResultSetIsNotEmptyThenReturnListOfAuditLogs() {
        ResultSet resultSet = mock(ResultSet.class);
        PGobject pgObject = mock(PGobject.class);
        Map<String, Object> keyValuePairs = new HashMap<>();
        keyValuePairs.put("key1", "value1");
        keyValuePairs.put("key2", "value2");
        when(objectMapper.convertValue((Object) any(), (Class<Object>) any())).thenReturn(keyValuePairs);
        when(pgObject.getValue()).thenReturn("{\"key1\":\"value1\",\"key2\":\"value2\"}");
        try {
            when(resultSet.next()).thenReturn(true, true, false);
            when(resultSet.getString("id")).thenReturn("id1", "id2");
            when(resultSet.getString("tenantid")).thenReturn("tenantid1", "tenantid2");
            when(resultSet.getString("useruuid")).thenReturn("useruuid1", "useruuid2");
            when(resultSet.getString("module")).thenReturn("module1", "module2");
            when(resultSet.getString("transactioncode"))
                    .thenReturn("transactioncode1", "transactioncode2");
            when(resultSet.getLong("changedate")).thenReturn(12345L, 67890L);
            when(resultSet.getString("entityname")).thenReturn("entityname1", "entityname2");
            when(resultSet.getString("objectid")).thenReturn("objectid1", "objectid2");
            when(resultSet.getString("operationtype"))
                    .thenReturn("operationtype1", "operationtype2");
            when(resultSet.getString("integrityhash"))
                    .thenReturn("integrityhash1", "integrityhash2");
            when(resultSet.getObject("keyvaluepairs")).thenReturn(pgObject, pgObject);

            List<AuditLog> auditLogs = auditRowMapper.extractData(resultSet);

            assertEquals(2, auditLogs.size());

            AuditLog auditLog = auditLogs.get(0);

            assertEquals("id2", auditLog.getId());
            assertEquals("tenantid1", auditLog.getTenantId());
            assertEquals("useruuid1", auditLog.getUserUUID());
            assertEquals("module1", auditLog.getModule());
            assertEquals("transactioncode1", auditLog.getTransactionCode());
            assertEquals(12345L, auditLog.getChangeDate());
            assertEquals("entityname1", auditLog.getEntityName());
            assertEquals("objectid1", auditLog.getObjectId());
            assertEquals("operationtype1", auditLog.getOperationType());
            assertEquals("integrityhash1", auditLog.getIntegrityHash());

            Map<String, Object> actualKeyValuePairs = auditLog.getKeyValueMap();

            assertEquals(2, actualKeyValuePairs.size());

            assertTrue(actualKeyValuePairs.containsKey("key1"));
            assertTrue(actualKeyValuePairs.containsKey("key2"));

        } catch (Exception e) {

        }
    }

    //@Test
    void testExtractData() throws JsonProcessingException, IllegalArgumentException, SQLException, DataAccessException {
        when(objectMapper.readTree((String) any())).thenReturn(MissingNode.getInstance());
        when(objectMapper.convertValue((Object) any(), (TypeReference<Object>) any())).thenReturn("Convert Value");
        ResultSet resultSet = mock(ResultSet.class);
        when(resultSet.getObject((String) any())).thenReturn(new PGInterval());
        when(resultSet.getString((String) any())).thenReturn("String");
        when(resultSet.getLong((String) any())).thenReturn(1L);
        when(resultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false);
    }

    //@Test
    void testExtractDataWithNull() throws JsonProcessingException, IllegalArgumentException, SQLException, DataAccessException {
        when(objectMapper.readTree((String) any())).thenReturn(MissingNode.getInstance());
        when(objectMapper.convertValue((Object) any(), (TypeReference<Object>) any())).thenReturn("Convert Value");
        ResultSet resultSet = mock(ResultSet.class);
        when(resultSet.getObject((String) any())).thenReturn(null);
        when(resultSet.getString((String) any())).thenReturn("String");
        when(resultSet.getLong((String) any())).thenReturn(1L);
        when(resultSet.next()).thenReturn(true).thenReturn(true).thenReturn(false);
    }
}

