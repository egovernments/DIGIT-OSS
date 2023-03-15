package org.egov.auditservice.validator;

import org.egov.auditservice.web.models.AuditLog;
import org.egov.auditservice.web.models.AuditLogSearchCriteria;
import org.egov.auditservice.web.models.enums.OperationType;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import javax.annotation.PostConstruct;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class AuditServiceValidator {

    @Value("${audit.log.create.max.list.size}")
    private Integer auditLogCreateMaxListSize;

    private Set<String> setOfOperationTypes;

    @PostConstruct
    private void init(){
        setOfOperationTypes = new HashSet<>();
        for(int i = 0; i < OperationType.values().length; i++){
            setOfOperationTypes.add(OperationType.values()[i].toString());
        }
    }

    public void validateAuditLogSearch(AuditLogSearchCriteria criteria){
        if(ObjectUtils.isEmpty(criteria.getObjectId()) || ObjectUtils.isEmpty(criteria.getTenantId()))
            throw new CustomException("EG_AUDIT_LOGS_SEARCH_ERR", "Providing both objectId and tenantId is mandatory for audit logs search");
    }

    public void validateOperationType(List<AuditLog> auditLogs){
        auditLogs.forEach(auditLog -> {
            if(ObjectUtils.isEmpty(auditLog.getOperationType())){
                throw new CustomException("EG_AUDIT_LOGS_CREATE_ERR", "Operation type in audit log request is invalid");
            }
        });
    }

    public void validateAuditRequestSize(List<AuditLog> auditLogs) {
        if(auditLogs.size() > auditLogCreateMaxListSize){
            throw new CustomException("EG_AUDIT_LOGS_CREATE_ERR", "Maximum allowed size for pushing audit logs is: " + auditLogCreateMaxListSize);
        }
    }

    public void validateKeyValueMap(List<AuditLog> auditLogs) {
        auditLogs.forEach(auditLog -> {
            if(CollectionUtils.isEmpty(auditLog.getKeyValueMap().keySet()))
                throw new CustomException("EG_AUDIT_LOGS_CREATE_ERR", "Key value map cannot be empty");
        });
    }
}
