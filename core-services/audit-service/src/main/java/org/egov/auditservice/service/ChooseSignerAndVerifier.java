package org.egov.auditservice.service;

import lombok.extern.slf4j.Slf4j;
import org.egov.auditservice.repository.AuditServiceRepository;
import org.egov.auditservice.web.models.AuditLog;
import org.egov.auditservice.web.models.AuditLogRequest;
import org.egov.auditservice.web.models.ObjectIdWrapper;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ChooseSignerAndVerifier {

    @Value("${audit.log.signing.algorithm}")
    private String signingAlgorithm;

    @Autowired
    private AuditServiceRepository repository;

    private final Map<String, ConfigurableSignAndVerify> signerAndVerifierByImplementationName;

    private ConfigurableSignAndVerify signAndVerifyUtil;

    @Autowired
    public ChooseSignerAndVerifier(List<ConfigurableSignAndVerify> customSignAndVerifyImplementations){
        this.signerAndVerifierByImplementationName = customSignAndVerifyImplementations.stream().collect(Collectors.toMap(ConfigurableSignAndVerify::getSigningAlgorithm, Function.identity()));
    }

    @PostConstruct
    private void signAndVerifyUtilInit(){

        if(!signerAndVerifierByImplementationName.containsKey(signingAlgorithm)) {
            throw new CustomException("EG_AUDIT_LOG_SIGNING_ERR", "Custom signer implementation is not present for the specified signing algorithm: " + signingAlgorithm);
        }

        signAndVerifyUtil = signerAndVerifierByImplementationName.get(signingAlgorithm);
    }

    public List<AuditLog> selectImplementationAndSign(AuditLogRequest auditLogRequest){
        // Signs audit logs
        signAndVerifyUtil.sign(auditLogRequest);

        return auditLogRequest.getAuditLogs();
    }

    public void selectImplementationAndVerify(ObjectIdWrapper objectIdWrapper){
        // Verify audit log
        Boolean isUntampered = signAndVerifyUtil.verify(objectIdWrapper);

        if(!isUntampered)
            throw new CustomException("EG_AUDIT_LOG_VERIFICATION_ERR", "Verification unsuccessful, the db entity with object id - " + objectIdWrapper.getObjectId() + " has been tampered.");

    }
}
