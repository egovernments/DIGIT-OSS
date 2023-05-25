package org.egov.encryption;

import com.fasterxml.jackson.databind.JsonNode;
import org.egov.common.contract.request.User;

import java.io.IOException;
import java.util.List;

public interface EncryptionService {

    public JsonNode encryptJson(Object plaintextJson, String key, String tenantId) throws IOException;

    public <E,P> P encryptJson(Object plaintextJson, String key, String tenantId, Class<E> valueType) throws IOException;

    public JsonNode decryptJson(Object ciphertextJson, String key, User user) throws IOException;

    public <E,P> P decryptJson(Object ciphertextJson, String key, User user, Class<E> valueType) throws IOException;

    public String encryptValue(Object plaintext, String tenantId, String type) throws IOException;

    public List<String> encryptValue(List<Object> plaintext, String tenantId, String type) throws IOException;

}
