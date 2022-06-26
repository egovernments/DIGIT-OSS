package org.egov.auditservice.service;

import org.egov.auditservice.web.models.AuditLogRequest;

import java.util.List;

public interface ConfigurableSignAndVerify {
    void sign(AuditLogRequest auditLogRequest);
    Boolean verify(AuditLogRequest auditLogRequest);
    String getSigningAlgorithm();
}
