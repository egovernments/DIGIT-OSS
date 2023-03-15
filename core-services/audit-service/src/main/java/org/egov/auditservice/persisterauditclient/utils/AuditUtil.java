package org.egov.auditservice.persisterauditclient.utils;

import com.github.zafarkhaja.semver.UnexpectedCharacterException;
import com.github.zafarkhaja.semver.Version;
import lombok.extern.slf4j.Slf4j;
import org.egov.auditservice.persisterauditclient.models.contract.AuditAttributes;
import org.egov.auditservice.persisterauditclient.models.contract.RowData;
import org.egov.auditservice.web.models.AuditLog;
import org.egov.auditservice.web.models.enums.OperationType;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.annotation.PostConstruct;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class AuditUtil {
    private static String INSERT_SQL_KEYWORD = "INSERT";
    private static String UPDATE_SQL_KEYWORD = "UPDATE";
    private static String DELETE_SQL_KEYWORD = "DELETE";

    private Version defaultSemVer;
    @Value("${default.version}")
    private String defaultVersion;

    @PostConstruct
    private void init(){
        defaultSemVer = Version.valueOf(defaultVersion);
    }

    public Version getSemVer(String version) {
        try {
            if(version == null || version.equals("")) {
                log.info("Version not present in API request, falling back to default version: " + defaultVersion);
                return defaultSemVer;
            }
            else {
                log.info("Version present in API request is: " + version);
                return Version.valueOf(version);
            }
        }catch (UnexpectedCharacterException e){
            return defaultSemVer;
        }
    }

    /**
     * Creates AuditLogs for every query execution
     * @param rowDataList The list of RowData
     * @param query The query which is going to be executed
     * @return
     */
    public List<AuditLog> getAuditRecord(List<RowData> rowDataList, String query){
        List<AuditLog> auditLogs = new LinkedList<>();
        for (RowData rowData : rowDataList) {
            AuditAttributes auditAttributes = rowData.getAuditAttributes();
            if (!isAuditAttributeValid(auditAttributes)) {
                throw new CustomException("INVALID_CONFIG", "Failed to fetch required attributes from configuration: " + auditAttributes);
            }
            AuditLog auditLog = AuditLog.builder()
                    .id(UUID.randomUUID().toString())
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

        String[] queryWords = query.split(" ");
        LinkedList<String> words = new LinkedList<>();
        for(String str : queryWords){
            if(!str.equals(""))
                words.add(str);
        }

        if (query.startsWith(INSERT_SQL_KEYWORD)){
            tableName = words.get(2);
        }
        else if(query.startsWith(UPDATE_SQL_KEYWORD)){
            tableName = words.get(1);
        }
        else {
            throw new CustomException("PARSING_ERROR","Failed to fetch table name from the query: "+query);
        }

        if(tableName.contains("(")) {
            tableName = tableName.substring(0, tableName.indexOf("("));
        }
        return tableName;
    }
    /**
     * Returns the type of operation the query is performing
     * @param query The query which is going to be executed
     * @return
     */
    private OperationType getOperationType(String query){
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
        return OperationType.fromValue(operationType);
    }
    private Boolean isAuditAttributeValid(AuditAttributes auditAttributes){
        if(auditAttributes.getModule() != null && auditAttributes.getObjectId() != null
                 && auditAttributes.getTenantId() != null )
            return true;
        else return false;
    }
}
