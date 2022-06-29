package org.egov.enc.keymanagement.masterkey;

import org.egov.tracer.model.CustomException;

public interface MasterKeyProvider {

    public String encryptWithMasterPassword(String key) throws CustomException;

    public String decryptWithMasterPassword(String encryptedKey) throws CustomException;

}
