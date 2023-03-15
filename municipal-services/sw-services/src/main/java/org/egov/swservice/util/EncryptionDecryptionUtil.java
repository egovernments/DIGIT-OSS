package org.egov.swservice.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.request.User;
import org.egov.encryption.EncryptionService;
import org.egov.encryption.audit.AuditService;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;

import java.io.IOException;
import java.util.*;

import static org.egov.swservice.util.SWConstants.*;

@Slf4j
@Component
public class EncryptionDecryptionUtil {

    private EncryptionService encryptionService;

    @Autowired
    private AuditService auditService;

    @Autowired
    private ObjectMapper objectMapper;

    @Value(("${state.level.tenant.id}"))
    private String stateLevelTenantId;

    @Value(("${sewerage.decryption.abac.enabled}"))
    private boolean abacEnabled;

    public EncryptionDecryptionUtil(EncryptionService encryptionService) {
        this.encryptionService = encryptionService;
    }

    public <T> T encryptObject(Object objectToEncrypt, String key, Class<T> classType) {
        try {
            if (objectToEncrypt == null) {
                return null;
            }
            T encryptedObject = encryptionService.encryptJson(objectToEncrypt, key, stateLevelTenantId, classType);
            if (encryptedObject == null) {
                throw new CustomException("ENCRYPTION_NULL_ERROR", "Null object found on performing encryption");
            }
            return encryptedObject;
        } catch (Exception e) {
            log.error("Unknown Error occurred while encrypting", e);
            throw new CustomException("UNKNOWN_ERROR", "Unknown error occurred in encryption process");
        }
    }

    public <E, P> P decryptObject(Object objectToDecrypt, String key, Class<E> classType, RequestInfo requestInfo) {

        try {
            boolean objectToDecryptNotList = false;
            if (objectToDecrypt == null) {
                return null;
            } else if (requestInfo == null || requestInfo.getUserInfo() == null) {
                User userInfo = User.builder().uuid("no uuid").type("EMPLOYEE").build();
                requestInfo = RequestInfo.builder().userInfo(userInfo).build();
            }
            if (!(objectToDecrypt instanceof List)) {
                objectToDecryptNotList = true;
                objectToDecrypt = Collections.singletonList(objectToDecrypt);
            }

            Map<String, String> keyPurposeMap = getKeyToDecrypt(objectToDecrypt, key);
            String purpose = keyPurposeMap.get("purpose");

            if (key.equalsIgnoreCase(WNS_ENCRYPTION_MODEL) || key.equalsIgnoreCase(WNS_OWNER_ENCRYPTION_MODEL) || key.equalsIgnoreCase(WNS_PLUMBER_ENCRYPTION_MODEL))
                key = keyPurposeMap.get("key");

            P decryptedObject = (P) encryptionService.decryptJson(requestInfo, objectToDecrypt, key, purpose, classType);
            if (decryptedObject == null) {
                throw new CustomException("DECRYPTION_NULL_ERROR", "Null object found on performing decryption");
            }

            if (objectToDecryptNotList) {
                decryptedObject = (P) ((List<E>) decryptedObject).get(0);
            }
            return decryptedObject;
        } catch (IOException | HttpClientErrorException | HttpServerErrorException | ResourceAccessException e) {
            log.error("Error occurred while decrypting", e);
            throw new CustomException("DECRYPTION_SERVICE_ERROR", "Error occurred in decryption process");
        } catch (Exception e) {
            log.error("Unknown Error occurred while decrypting", e);
            throw new CustomException("UNKNOWN_ERROR", "Unknown error occurred in decryption process");
        }
    }

    public Map<String, String> getKeyToDecrypt(Object objectToDecrypt, String key) {
        Map<String, String> keyPurposeMap = new HashMap<>();

        if (!abacEnabled) {
            if (key.equals(WNS_ENCRYPTION_MODEL) || key == null) {
                keyPurposeMap.put("key", "WnSConnectionDecrypDisabled");
                keyPurposeMap.put("purpose", "WnSConnectionDecryptionDisabled");
            } else if (key.equals(WNS_OWNER_ENCRYPTION_MODEL)) {
                keyPurposeMap.put("key", "WnSConnectionOwnerDecrypDisabled");
                keyPurposeMap.put("purpose", "WnSConnectionDecryptionDisabled");
            } else if (key.equals(WNS_PLUMBER_ENCRYPTION_MODEL)) {
                keyPurposeMap.put("key", "WnSConnectionPlumberDecrypDisabled");
                keyPurposeMap.put("purpose", "WnSConnectionPlumberDecrypDisabled");
            }
        } else {
            if (key.equals(WNS_ENCRYPTION_MODEL) || key == null) {
                keyPurposeMap.put("key", WNS_ENCRYPTION_MODEL);
                keyPurposeMap.put("purpose", "WnSConnectionSearch");
            } else if (key.equals(WNS_OWNER_ENCRYPTION_MODEL)) {
                keyPurposeMap.put("key", WNS_OWNER_ENCRYPTION_MODEL);
                keyPurposeMap.put("purpose", "WnSConnectionSearch");
            } else if (key.equals(WNS_PLUMBER_ENCRYPTION_MODEL)) {
                keyPurposeMap.put("key", WNS_PLUMBER_ENCRYPTION_MODEL);
                keyPurposeMap.put("purpose", "WnSConnectionPlumberSearch");
            }
        }

        return keyPurposeMap;
    }

}
