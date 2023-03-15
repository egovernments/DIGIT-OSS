package org.egov.auditservice.repository.rowmapper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.auditservice.web.models.AuditLog;
import org.egov.auditservice.web.models.enums.OperationType;
import org.egov.tracer.model.CustomException;
import org.postgresql.util.PGobject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class AuditRowMapper implements ResultSetExtractor<List<AuditLog>> {

    @Autowired
    private ObjectMapper objectMapper;

    public List<AuditLog> extractData(ResultSet rs) throws SQLException, DataAccessException {
        Map<String,AuditLog> auditLogMap = new LinkedHashMap<>();

        while (rs.next()){
            String id = rs.getString("id");
            AuditLog auditLog = auditLogMap.get(id);

            if(auditLog == null) {

                auditLog = AuditLog.builder()
                        .id(rs.getString("id"))
                        .tenantId(rs.getString("tenantid"))
                        .userUUID(rs.getString("useruuid"))
                        .module(rs.getString("module"))
                        .transactionCode(rs.getString("transactioncode"))
                        .changeDate(rs.getLong("changedate"))
                        .entityName(rs.getString("entityname"))
                        .objectId(rs.getString("objectid"))
                        .operationType(OperationType.fromValue(rs.getString("operationtype")))
                        .integrityHash(rs.getString("integrityhash"))
                        .auditCorrelationId(rs.getString("auditcorrelationid"))
                        .build();

                JsonNode keyValuePairsJson = getKeyValuePairs("keyvaluemap", rs);

                Map<String, Object> keyValuePairs = objectMapper.convertValue(keyValuePairsJson, new TypeReference<Map<String, Object>>(){});

                auditLog.setKeyValueMap(keyValuePairs);

            }

            auditLogMap.put(id, auditLog);
        }
        return new ArrayList<>(auditLogMap.values());
    }

    private JsonNode getKeyValuePairs(String columnName, ResultSet rs){

        JsonNode keyValuePairs = null;
        try {
            PGobject pgObj = (PGobject) rs.getObject(columnName);
            if(pgObj!=null){
                keyValuePairs = objectMapper.readTree(pgObj.getValue());
            }
        }
        catch (IOException | SQLException e){
            throw new CustomException("PARSING_ERROR","Failed to parse additionalDetail object");
        }
        return keyValuePairs;
    }

}
