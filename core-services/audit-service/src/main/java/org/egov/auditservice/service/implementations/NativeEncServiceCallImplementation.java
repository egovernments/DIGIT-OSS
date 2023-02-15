package org.egov.auditservice.service.implementations;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.auditservice.repository.ServiceRequestRepository;
import org.egov.auditservice.service.ConfigurableSignAndVerify;
import org.egov.auditservice.web.models.AuditLogRequest;
import org.egov.auditservice.web.models.ObjectIdWrapper;
import org.egov.auditservice.web.models.encryptionclient.SignRequest;
import org.egov.auditservice.web.models.encryptionclient.SignResponse;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class NativeEncServiceCallImplementation implements ConfigurableSignAndVerify {

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${egov.enc.sign.host}")
    private String encSignHost;

    @Value("${egov.enc.sign.endpoint}")
    private String encSignEndpoint;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Override
    public void sign(AuditLogRequest auditLogRequest) {
        auditLogRequest.getAuditLogs().forEach(auditLog -> {
            try {
                String dataToBeHashed = objectMapper.writeValueAsString(auditLog.getKeyValueMap());
                SignRequest signRequest = SignRequest.builder().tenantId(auditLog.getTenantId()).value(dataToBeHashed).build();
                String signUri = getSignUri();
                Object response = serviceRequestRepository.fetchResult(signUri, signRequest);
                SignResponse finalResponse = objectMapper.convertValue(response, SignResponse.class);
                //log.info(finalResponse.getSignature());
                auditLog.setIntegrityHash(finalResponse.getSignature());
            } catch (JsonProcessingException e) {
                throw new CustomException("EG_AUDIT_LOG_CREATE_ERR", "Error occurred while parsing keyValueMap as string" + e.getMessage());
            }

        });

    }

    @Override
    public Boolean verify(ObjectIdWrapper objectIdWrapper) {
        return null;
    }

    @Override
    public String getSigningAlgorithm() {
        return "NATIVE_ENC";
    }

    private String getSignUri() {
        StringBuilder signUri = new StringBuilder(encSignHost);
        signUri.append(encSignEndpoint);
        return signUri.toString();
    }
}
