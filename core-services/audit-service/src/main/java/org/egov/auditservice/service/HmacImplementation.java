package org.egov.auditservice.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.bouncycastle.crypto.Digest;
import org.bouncycastle.crypto.digests.SHA256Digest;
import org.bouncycastle.crypto.macs.HMac;
import org.bouncycastle.crypto.params.KeyParameter;
import org.bouncycastle.util.encoders.Hex;
import org.egov.auditservice.web.models.AuditLogRequest;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HmacImplementation implements ConfigurableSignAndVerify {

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${hmac.key}")
    private String hmacKey;

    @Override
    public List<String> sign(AuditLogRequest auditLogRequest) {
        System.out.println("INSIDE HMAC IMPLEMENTATION!!!!!!!");
        auditLogRequest.getAuditLogs().forEach(auditLog -> {
            try {
                String dataToBeHashed = objectMapper.writeValueAsString(auditLog.getKeyValuePairs());
                auditLog.setIntegrityHash(hashData(dataToBeHashed, hmacKey));
            } catch (JsonProcessingException e) {
                throw new CustomException("EG_AUDIT_SIGNING_ERR", "Error while parsing key value pairs");
            } catch (Exception e){
                throw new CustomException("EG_AUDIT_SIGNING_ERR", "Some unknown error occurred while signing: " + e.getMessage());
            }
        });
        return null;
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
    public Boolean verify(AuditLogRequest auditLogRequest) {
        return null;
    }

    @Override
    public String getSigningAlgorithm() {
        return "HMAC";
    }
}
