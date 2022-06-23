package org.egov.auditservice.service;

import org.egov.auditservice.producer.Producer;
import org.egov.auditservice.web.models.AuditLogRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuditLogProcessingService {

    @Autowired
    private Producer producer;

    @Autowired
    private ChooseSignerAndVerifier chooseSignerAndVerifier;

    @Autowired
    private EnrichmentService enrichmentService;

    public void process(AuditLogRequest request) {

        // Enrich audit logs
        enrichmentService.enrichAuditLogs(request);

        // Sign incoming data before persisting
        chooseSignerAndVerifier.selectImplementationAndSign(request);

        // Persister will handle persisting audit records
        producer.push("persist-audit-record", request);
    }


}
