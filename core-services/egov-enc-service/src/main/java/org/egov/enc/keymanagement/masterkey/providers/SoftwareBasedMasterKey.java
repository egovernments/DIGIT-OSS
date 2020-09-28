package org.egov.enc.keymanagement.masterkey.providers;


import org.egov.enc.config.AppProperties;
import org.egov.enc.keymanagement.masterkey.MasterKeyProvider;
import org.egov.enc.utils.SymmetricEncryptionUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.util.Base64;

@Component
@Order(1)
@ConditionalOnProperty( value = "master.password.provider", havingValue = "software")
public class SoftwareBasedMasterKey implements MasterKeyProvider {

    @Value("${master.password:}")
    private String masterPassword;

    @Value("${master.salt:}")
    private String masterSalt;

    @Value("${master.initialvector:}")
    private String masterInitialVectorString;

    @Autowired
    private AppProperties appProperties;

    private SecretKey masterKey;
    private byte[] masterInitialVector;

    //Master Key will be used to decrypt the keys read from the database
    @PostConstruct
    private void initializeMasterKey() throws NoSuchAlgorithmException, InvalidKeySpecException {
        String masterPassword = this.masterPassword;

        char[] masterSalt = this.masterSalt.toCharArray();
        byte[] salt = new byte[8];
        for(int i = 0; i < salt.length; i++) {
            salt[i] = (byte) masterSalt[i];
        }

        char[] masterIV = this.masterInitialVectorString.toCharArray();
        masterInitialVector = new byte[appProperties.getInitialVectorSize()];
        for(int i = 0; i < masterInitialVector.length; i++) {
            masterInitialVector[i] = (byte) masterIV[i];
        }

        SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        KeySpec spec = new PBEKeySpec(masterPassword.toCharArray(), salt, 65536, 256);
        SecretKey tmp = factory.generateSecret(spec);
        masterKey = new SecretKeySpec(tmp.getEncoded(), "AES");
    }


    @Override
    public String encryptWithMasterPassword(String key) throws Exception {
        byte[] encryptedKey = SymmetricEncryptionUtil.encrypt(key.getBytes(StandardCharsets.UTF_8), masterKey, masterInitialVector);
        return Base64.getEncoder().encodeToString(encryptedKey);
    }

    @Override
    public String decryptWithMasterPassword(String encryptedKey) throws Exception {
        byte[] decryptedKey = SymmetricEncryptionUtil.decrypt(Base64.getDecoder().decode(encryptedKey), masterKey, masterInitialVector);
        return new String(decryptedKey, StandardCharsets.UTF_8);
    }


}
