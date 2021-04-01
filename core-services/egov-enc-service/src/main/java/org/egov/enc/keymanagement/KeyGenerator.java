package org.egov.enc.keymanagement;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.egov.enc.config.AppProperties;
import org.egov.enc.keymanagement.masterkey.MasterKeyProvider;
import org.egov.enc.models.AsymmetricKey;
import org.egov.enc.models.SymmetricKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.crypto.*;
import javax.crypto.spec.SecretKeySpec;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.util.ArrayList;
import java.util.Base64;

/*
    KeyGenerator is used to generate random keys.
    Keys will be encrypted with a master password.
*/

@Order(2)
@Component
public class KeyGenerator {

    private SecureRandom secureRandom;

    private AppProperties appProperties;

    @Autowired
    private KeyIdGenerator keyIdGenerator;
    @Autowired
    private MasterKeyProvider masterKeyProvider;

    @Autowired
    public KeyGenerator(AppProperties appProperties) throws NoSuchAlgorithmException, InvalidKeySpecException {
        this.appProperties = appProperties;

        Security.addProvider(new BouncyCastleProvider());
        secureRandom = new SecureRandom();
    }

    //Generate random bytes with use of SecureRandom
    //Being used to generate Initial Vector and Symmetric Key
    private byte[] getRandomBytes(int size) {
        byte[] randomBytes = new byte[size];
        secureRandom.nextBytes(randomBytes);
        return randomBytes;
    }

    //Returns a list of Symmetric Keys corresponding to the list of input tenants
    //The returned keys will be encrypted with the master password
    public ArrayList<SymmetricKey> generateSymmetricKeys(ArrayList<String> tenantIds) throws Exception {
        int numberOfKeys = tenantIds.size();
        SecretKey[] keys = new SecretKey[numberOfKeys];
        byte[][] initialVectors = new byte[numberOfKeys][appProperties.getInitialVectorSize()];
        for(int i = 0; i < numberOfKeys; i++) {
            keys[i] = new SecretKeySpec(getRandomBytes(appProperties.getSymmetricKeySize()/8), "AES");
            initialVectors[i] = getRandomBytes(appProperties.getInitialVectorSize());
        }

        ArrayList<SymmetricKey> symmetricKeyArrayList = new ArrayList<>();

        for(int i = 0; i < keys.length; i++) {
            String keyAsString =
                    masterKeyProvider.encryptWithMasterPassword(Base64.getEncoder().encodeToString(keys[i].getEncoded()));
            String initialVectorAsString =
                    masterKeyProvider.encryptWithMasterPassword(Base64.getEncoder().encodeToString(initialVectors[i]));
            symmetricKeyArrayList.add(new SymmetricKey(i, keyIdGenerator.generateKeyId(), keyAsString,
                    initialVectorAsString, true, tenantIds.get(i)));
        }
        return symmetricKeyArrayList;
    }

    //Returns a list of Asymmetric Keys corresponding to the list of input tenants
    //The returned keys will be encrypted with the master password
    public ArrayList<AsymmetricKey> generateAsymmetricKeys(ArrayList<String> tenantIds) throws Exception {
        int numberOfKeys = tenantIds.size();
        KeyPair[] keys = new KeyPair[numberOfKeys];
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        keyPairGenerator.initialize(appProperties.getAsymmetricKeySize());
        for(int i = 0; i < numberOfKeys; i++) {
            keys[i] = keyPairGenerator.generateKeyPair();
        }

        ArrayList<AsymmetricKey> asymmetricKeyArrayList = new ArrayList<>();

        for(int i = 0; i < keys.length; i++) {
            String publicKey =
                    masterKeyProvider.encryptWithMasterPassword(Base64.getEncoder().encodeToString(keys[i].getPublic().getEncoded()));
            String privateKey =
                    masterKeyProvider.encryptWithMasterPassword(Base64.getEncoder().encodeToString(keys[i].getPrivate().getEncoded()));
            asymmetricKeyArrayList.add(new AsymmetricKey(i, keyIdGenerator.generateKeyId(), publicKey, privateKey, true, tenantIds.get(i)));
        }

        return asymmetricKeyArrayList;
    }

}
