package org.egov.auditservice.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.crypto.Digest;
import org.bouncycastle.crypto.digests.SHA256Digest;
import org.bouncycastle.crypto.macs.HMac;
import org.bouncycastle.crypto.params.KeyParameter;
import org.bouncycastle.util.encoders.Hex;
import org.egov.auditservice.repository.AuditServiceRepository;
import org.egov.auditservice.web.models.AuditLog;
import org.egov.auditservice.web.models.AuditLogRequest;
import org.egov.auditservice.web.models.AuditLogSearchCriteria;
import org.egov.auditservice.web.models.ObjectIdWrapper;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.List;

@Slf4j
@Service
public class HmacImplementation implements ConfigurableSignAndVerify {

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AuditServiceRepository repository;

    @Value("${hmac.key}")
    private String hmacKey;

    @Override
    public void sign(AuditLogRequest auditLogRequest) {
        auditLogRequest.getAuditLogs().forEach(auditLog -> {
            try {
                objectMapper.configure(SerializationFeature.ORDER_MAP_ENTRIES_BY_KEYS, true);
                String dataToBeHashed = objectMapper.writeValueAsString(auditLog.getKeyValueMap());
                auditLog.setIntegrityHash(hashData(dataToBeHashed, hmacKey));
            } catch (JsonProcessingException e) {
                throw new CustomException("EG_AUDIT_SIGNING_ERR", "Error while parsing key value pairs");
            } catch (Exception e){
                throw new CustomException("EG_AUDIT_SIGNING_ERR", "Some unknown error occurred while signing: " + e.getMessage());
            }
        });
    }

    public String hashData(String data, String key) {
        Digest digest = new SHA256Digest();

        HMac hMac = new HMac(digest);
        hMac.init(new KeyParameter(key.getBytes()));

        byte[] hmacIn = data.getBytes();
        hMac.update(hmacIn, 0, hmacIn.length);
        byte[] hmacOut = new byte[hMac.getMacSize()];

        hMac.doFinal(hmacOut, 0);
        return new String(Hex.encode(hmacOut));
    }

    @Override
    public Boolean verify(ObjectIdWrapper objectIdWrapper) {

        Boolean isUntampered = false;

        List<AuditLog> auditLogs = repository.getAuditLogsFromDb(AuditLogSearchCriteria.builder().objectId(objectIdWrapper.getObjectId()).build());

        if(CollectionUtils.isEmpty(auditLogs))
            throw new CustomException("EG_AUDIT_LOG_VERIFICATION_ERR", "No audit log entry found with object id - " + objectIdWrapper.getObjectId());

        objectMapper.configure(SerializationFeature.ORDER_MAP_ENTRIES_BY_KEYS, true);

        try {
            objectMapper.configure(SerializationFeature.ORDER_MAP_ENTRIES_BY_KEYS, true);
            String dataToBeHashed = objectMapper.writeValueAsString(objectIdWrapper.getKeyValuePairs());
            if(hashData(dataToBeHashed, hmacKey).equals(auditLogs.get(0).getIntegrityHash())){
                log.info("Verification of the object with objectId - " + objectIdWrapper.getObjectId() +  " is successful. This record has not been tampered.");
                isUntampered = true;
            }else
                throw new CustomException("EG_AUDIT_LOG_VERIFICATION_ERR", "Verification unsuccessful, record has been tampered.");
        } catch (JsonProcessingException e) {
            throw new CustomException("EG_AUDIT_LOG_VERIFICATION_ERR", "Error while parsing key value pairs");
        }

        return isUntampered;

    }

    @Override
    public String getSigningAlgorithm() {
        return "HMAC";
    }
}
