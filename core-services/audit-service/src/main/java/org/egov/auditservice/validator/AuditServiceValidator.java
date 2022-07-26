package org.egov.auditservice.validator;

import org.egov.auditservice.web.models.AuditLog;
import org.egov.auditservice.web.models.AuditLogSearchCriteria;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;

import java.util.List;

@Component
public class AuditServiceValidator {

    @Value("${audit.log.create.max.list.size}")
    private Integer auditLogCreateMaxListSize;

    public void validateAuditLogSearch(AuditLogSearchCriteria criteria){
        if((ObjectUtils.isEmpty(criteria.getModule()) && ObjectUtils.isEmpty(criteria.getUserUUID()) && ObjectUtils.isEmpty(criteria.getObjectId()) && ObjectUtils.isEmpty(criteria.getTenantId())))
            throw new CustomException("EG_AUDIT_LOGS_SEARCH_ERR", "At least one criteria needs to be provided to search audit logs");
    }

    public void validateAuditRequestSize(List<AuditLog> auditLogs) {
        if(auditLogs.size() > auditLogCreateMaxListSize){
            throw new CustomException("EG_AUDIT_LOGS_CREATE_ERR", "Maximum allowed size for pushing audit logs is: " + auditLogCreateMaxListSize);
        }
    }
}
