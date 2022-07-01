package org.egov.auditservice.service;

import org.egov.auditservice.producer.Producer;
import org.egov.auditservice.repository.AuditServiceRepository;
import org.egov.auditservice.web.models.AuditLog;
import org.egov.auditservice.web.models.AuditLogRequest;
import org.egov.auditservice.web.models.AuditLogSearchCriteria;
import org.egov.common.contract.request.RequestInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;

@Service
public class AuditLogProcessingService {

    @Autowired
    private Producer producer;

    @Autowired
    private ChooseSignerAndVerifier chooseSignerAndVerifier;

    @Autowired
    private EnrichmentService enrichmentService;

    @Autowired
    private AuditServiceRepository repository;

    public void process(AuditLogRequest request) {

        // Enrich audit logs
        enrichmentService.enrichAuditLogs(request);

        // Sign incoming data before persisting
        chooseSignerAndVerifier.selectImplementationAndSign(request);

        // Persister will handle persisting audit records
        producer.push("persist-audit-logs", request);
    }


    public List<AuditLog> getAuditLogs(RequestInfo requestInfo, AuditLogSearchCriteria criteria) {

        List<AuditLog> auditLogs = repository.getAuditLogsFromDb(criteria);

        if(CollectionUtils.isEmpty(auditLogs))
            return new ArrayList<>();

        return auditLogs;
    }
}
