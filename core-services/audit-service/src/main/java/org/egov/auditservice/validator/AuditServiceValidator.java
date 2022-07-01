package org.egov.auditservice.validator;

import org.egov.auditservice.web.models.AuditLogSearchCriteria;
import org.egov.tracer.model.CustomException;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;

@Component
public class AuditServiceValidator {

    public void validateAuditLogSearch(AuditLogSearchCriteria criteria){
        if((ObjectUtils.isEmpty(criteria.getModule()) && ObjectUtils.isEmpty(criteria.getUserUUID()) && ObjectUtils.isEmpty(criteria.getObjectId()) && ObjectUtils.isEmpty(criteria.getTenantId())))
            throw new CustomException("EG_AUDIT_LOGS_SEARCH_ERR", "At least one criteria needs to be provided to search audit logs");
    }

}
