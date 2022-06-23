package org.egov.auditservice.service;

import org.egov.auditservice.web.models.AuditLogRequest;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class EnrichmentService {

    public void enrichAuditLogs(AuditLogRequest request){
        request.getAuditLogs().forEach(auditLog -> {
            auditLog.setId(UUID.randomUUID().toString());
        });
    }
}
