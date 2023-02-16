package org.egov.auditservice.service;

import org.egov.auditservice.web.models.AuditLogRequest;
import org.egov.auditservice.web.models.ObjectIdWrapper;

import java.util.List;

public interface ConfigurableSignAndVerify {
    void sign(AuditLogRequest auditLogRequest);
    Boolean verify(ObjectIdWrapper objectIdWrapper);
    String getSigningAlgorithm();
}
