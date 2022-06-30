package org.egov.auditservice.repository.rowmapper;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.auditservice.web.models.AuditLog;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Component;

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
                        .operationType(rs.getString("operationtype"))
                        .integrityHash(rs.getString("integrityhash"))
                        .build();

                try {
                    Map<String, Object> keyValuePairs = objectMapper
                            .readValue(rs.getString("keyvaluepairs"),
                                    new TypeReference<Map<String, Object>>() {
                                    });
                } catch (JsonParseException e1) {
                    throw new CustomException("EG_AUDIT_ROW_MAPPER_ERR", "Error while parsing key value pairs");

                } catch (JsonMappingException e2) {
                    throw new CustomException("EG_AUDIT_ROW_MAPPER_ERR", "Error while mapping key value pairs");

                } catch (JsonProcessingException e3) {
                    throw new CustomException("EG_AUDIT_ROW_MAPPER_ERR", "Error while processing key value pairs");
                }

            }

            auditLogMap.put(id, auditLog);
        }
        return new ArrayList<>(auditLogMap.values());
    }
}
