package org.egov.encryption;

import com.fasterxml.jackson.databind.JsonNode;
import org.egov.common.contract.request.RequestInfo;

import java.io.IOException;
import java.util.List;

public interface EncryptionService {

    public JsonNode encryptJson(Object plaintextJson, String model, String tenantId) throws IOException;

    public <E, P> P encryptJson(Object plaintextJson, String model, String tenantId, Class<E> valueType) throws IOException;

    public JsonNode decryptJson(RequestInfo requestInfo, Object ciphertextJson, String model,
                                String purpose) throws IOException;

    public <E, P> P decryptJson(RequestInfo requestInfo, Object ciphertextJson, String model, String purpose,
                                Class<E> valueType) throws IOException;

    public String encryptValue(Object plaintext, String tenantId) throws IOException;

    public String encryptValue(Object plaintext, String tenantId, String type) throws IOException;

    public List<String> encryptValue(List<Object> plaintext, String tenantId, String type) throws IOException;

}
