package org.egov.auditservice.service;

import org.egov.auditservice.web.models.AuditLogRequest;

import java.util.List;

public interface ConfigurableSignAndVerify {
    List<String> sign(AuditLogRequest auditLogRequest);
    Boolean verify(AuditLogRequest auditLogRequest);
    String getSigningAlgorithm();
}
