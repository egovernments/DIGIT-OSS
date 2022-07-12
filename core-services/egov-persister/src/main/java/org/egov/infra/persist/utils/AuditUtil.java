package org.egov.infra.persist.utils;

import org.egov.infra.persist.web.contract.AuditAttributes;
import org.egov.infra.persist.web.contract.AuditLog;
import org.egov.infra.persist.web.contract.RowData;
import org.egov.tracer.model.CustomException;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

@Service
public class AuditUtil {


    private static String INSERT_SQL_KEYWORD = "INSERT";

    private static String UPDATE_SQL_KEYWORD = "UPDATE";

    private static String DELETE_SQL_KEYWORD = "DELETE";

    /**
     * Creates AuditLogs for every query execution
     * @param rowDataList The list of RowData
     * @param query The query which is going to be executed
     * @return
     */
    public List<AuditLog> getAuditRecord(List<RowData> rowDataList,String query){

        List<AuditLog> auditLogs = new LinkedList<>();

        for (RowData rowData : rowDataList) {

            AuditAttributes auditAttributes = rowData.getAuditAttributes();
            if (!isAuditAttributeValid(auditAttributes)) {
                throw new CustomException("INVALID_CONFIG", "Failed to fetch required attributes from configuration: " + auditAttributes);
            }


                AuditLog auditLog = AuditLog.builder()
                        .userUUID(auditAttributes.getUserUUID())
                        .tenantId(auditAttributes.getTenantId())
                        .changeDate(System.currentTimeMillis())
                        .objectId(auditAttributes.getObjectId())
                        .operationType(getOperationType(query))
                        .transactionCode(auditAttributes.getTransactionCode())
                        .module(auditAttributes.getModule())
                        .entityName(getTableName(query))
                        .keyValueMap(rowData.getKeyValueMap())
                        .build();

                auditLogs.add(auditLog);

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

    private Boolean isAuditAttributeValid(AuditAttributes auditAttributes){

        if(auditAttributes.getModule() != null && auditAttributes.getObjectId() != null
          && auditAttributes.getTransactionCode() != null && auditAttributes.getTenantId() != null )
            return true;

        else return false;
    }


}
