package org.egov.auditservice.service;

import org.egov.auditservice.producer.Producer;
import org.egov.auditservice.repository.AuditServiceRepository;
import org.egov.auditservice.validator.AuditServiceValidator;
import org.egov.auditservice.web.models.AuditLog;
import org.egov.auditservice.web.models.AuditLogRequest;
import org.egov.auditservice.web.models.AuditLogSearchCriteria;
import org.egov.auditservice.web.models.ObjectIdWrapper;
import org.egov.common.contract.request.RequestInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AuditLogProcessingService {

    @Value("${persister.audit.kafka.topic}")
    private String auditTopic;

    @Autowired
    private Producer producer;

    @Autowired
    private ChooseSignerAndVerifier chooseSignerAndVerifier;

    @Autowired
    private EnrichmentService enrichmentService;

    @Autowired
    private AuditServiceRepository repository;

    @Autowired
    private AuditServiceValidator validator;

    public List<AuditLog> process(AuditLogRequest request) {

        // Validate audit logs size
        validator.validateAuditRequestSize(request.getAuditLogs());

        // Validate operation types present in audit log request
        validator.validateOperationType(request.getAuditLogs());

        // Validate keyValuePair has db fields
        validator.validateKeyValueMap(request.getAuditLogs());

        // Enrich audit logs
        enrichmentService.enrichAuditLogs(request);

        // Sign incoming data before persisting
        List<AuditLog> signedAuditLogs = chooseSignerAndVerifier.selectImplementationAndSign(request);

        // Persister will handle persisting audit records
        producer.push(auditTopic, request);

        return signedAuditLogs;
    }


    public List<AuditLog> getAuditLogs(RequestInfo requestInfo, AuditLogSearchCriteria criteria) {

        validator.validateAuditLogSearch(criteria);

        List<AuditLog> auditLogs = repository.getAuditLogsFromDb(criteria);

        if(CollectionUtils.isEmpty(auditLogs))
            return new ArrayList<>();

        return auditLogs;
    }

    public void verifyDbEntity(String objectId, Map<String, Object> keyValuePairs){
        chooseSignerAndVerifier.selectImplementationAndVerify(ObjectIdWrapper.builder().objectId(objectId).keyValuePairs(keyValuePairs).build());
    }
}
