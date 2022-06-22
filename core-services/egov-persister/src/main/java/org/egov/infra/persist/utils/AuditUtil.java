package org.egov.infra.persist.utils;

import org.egov.infra.persist.web.contract.AuditLog;
import org.egov.infra.persist.web.contract.Mapping;
import org.egov.tracer.model.CustomException;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@Service
public class AuditUtil {


    private static String INSERT_SQL_KEYWORD = "INSERT";

    private static String UPDATE_SQL_KEYWORD = "UPDATE";

    private static String DELETE_SQL_KEYWORD = "DELETE";

    /**
     * Creates AuditLogs for every query execution
     * @param keyValuePairsList The list of key value pairs which are getting inserted/updated in table
     * @param mapping Persister Configuration for the particular Entity
     * @param query The query which is going to be executed
     * @return
     */
    public List<AuditLog> getAuditRecord(List<Map<String, Object>> keyValuePairsList, Mapping mapping, String query){

        List<AuditLog> auditLogs = new LinkedList<>();
        String module = mapping.getModule();

        for(Map<String, Object> value : keyValuePairsList){

        }

        return auditLogs;
    }

    /**
     * Returns the table name on which the query is going to be executed
     * @param query The query which is going to be executed
     * @return
     */
    private String getTableName(String query){

        String tableName = null;
        if (query.startsWith(INSERT_SQL_KEYWORD)){
            // TODO
        }
        else if(query.startsWith(UPDATE_SQL_KEYWORD)){
            // TODO
        }
        else {
            throw new CustomException("PARSING_ERROR","Failed to fetch table name from the query: "+query);
        }

        return tableName;
    }

    /**
     * Returns the type of operation the query is performing
     * @param query The query which is going to be executed
     * @return
     */
    private String getOperationType(String query){

        String operationType = null;
        if (query.startsWith(INSERT_SQL_KEYWORD)){
            operationType = "CREATE";
        }
        else if(query.startsWith(UPDATE_SQL_KEYWORD)){
            operationType = "UPDATE";
        }
        else if(query.startsWith(DELETE_SQL_KEYWORD)){
            operationType = "DELETE";
        }
        else {
            throw new CustomException("PARSING_ERROR","Failed to fetch table name from the query: "+query);
        }

        return operationType;
    }

}
