package org.egov.pt.util;



import lombok.extern.slf4j.Slf4j;
import org.egov.encryption.EncryptionService;
import org.egov.pt.config.PropertyConfiguration;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class EncryptionDecryptionUtil {


    private EncryptionService encryptionService;

    @Autowired
    private PropertyConfiguration config;

    public <T> T encryptObject(Object objectToEncrypt, String key, Class<T> classType) {
        try {
            if (objectToEncrypt == null) {
                return null;
            }
            T encryptedObject = encryptionService.encryptJson(objectToEncrypt, key, config.getStateLevelTenantId(), classType);
            if (encryptedObject == null) {
                throw new CustomException("ENCRYPTION_NULL_ERROR", "Null object found on performing encryption");
            }
            return encryptedObject;
        } catch (Exception e) {
            log.error("Unknown Error occurred while encrypting", e);
            throw new CustomException("UNKNOWN_ERROR", "Unknown error occurred in encryption process");
        }
    }


}
