package org.egov.enc.keymanagement.masterkey;

public interface MasterKeyProvider {

    public String encryptWithMasterPassword(String key) throws Exception;

    public String decryptWithMasterPassword(String encryptedKey) throws Exception;

}
