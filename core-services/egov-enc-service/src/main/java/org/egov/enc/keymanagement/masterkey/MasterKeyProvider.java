package org.egov.enc.keymanagement.masterkey;

public interface MasterKeyProvider {

    public String encryptWithMasterPassword(String key) throws CustomException;

    public String decryptWithMasterPassword(String encryptedKey) throws CustomException;

}
