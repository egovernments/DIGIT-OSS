package org.egov.enc.keymanagement;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.egov.enc.config.AppProperties;
import org.egov.enc.models.AsymmetricKey;
import org.egov.enc.models.SymmetricKey;
import org.egov.enc.utils.SymmetricEncryptionUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.crypto.*;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.util.ArrayList;
import java.util.Base64;

/*
    KeyGenerator is used to generate random keys.
    Keys will be encrypted with a master password.
*/


@Component
public class KeyGenerator {

    private SecureRandom secureRandom;
    private byte[] masterInitialVector;
    private SecretKey masterKey;

    private AppProperties appProperties;

    @Autowired
    private KeyIdGenerator keyIdGenerator;

    @Autowired
    public KeyGenerator(AppProperties appProperties) throws NoSuchAlgorithmException, InvalidKeySpecException {
        this.appProperties = appProperties;

        Security.addProvider(new BouncyCastleProvider());
        secureRandom = new SecureRandom();

        initializeMasterKey();
    }

    //Master Key will be used to encrypt the geenrated keys before returning them to the caller
    private void initializeMasterKey() throws NoSuchAlgorithmException, InvalidKeySpecException {
        String masterPassword = appProperties.getMasterPassword();

        char[] masterSalt = appProperties.getMasterSalt().toCharArray();
        byte[] salt = new byte[8];
        for(int i = 0; i < salt.length; i++) {
            salt[i] = (byte) masterSalt[i];
        }

        char[] masterIV = appProperties.getMasterInitialVector().toCharArray();
        masterInitialVector = new byte[appProperties.getInitialVectorSize()];
        for(int i = 0; i < masterInitialVector.length; i++) {
            masterInitialVector[i] = (byte) masterIV[i];
        }

        SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        KeySpec spec = new PBEKeySpec(masterPassword.toCharArray(), salt, 65536, 256);
        SecretKey tmp = factory.generateSecret(spec);
        masterKey = new SecretKeySpec(tmp.getEncoded(), "AES");
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
    public ArrayList<SymmetricKey> generateSymmetricKeys(ArrayList<String> tenantIds) throws BadPaddingException, InvalidAlgorithmParameterException, NoSuchAlgorithmException, IllegalBlockSizeException, NoSuchPaddingException, InvalidKeyException {
        int numberOfKeys = tenantIds.size();
        SecretKey[] keys = new SecretKey[numberOfKeys];
        byte[][] initialVectors = new byte[numberOfKeys][appProperties.getInitialVectorSize()];
        for(int i = 0; i < numberOfKeys; i++) {
            keys[i] = new SecretKeySpec(getRandomBytes(appProperties.getSymmetricKeySize()/8), "AES");
            initialVectors[i] = getRandomBytes(appProperties.getInitialVectorSize());
        }

        ArrayList<SymmetricKey> symmetricKeyArrayList = new ArrayList<>();

        for(int i = 0; i < keys.length; i++) {
            String keyAsString = encryptWithMasterPassword(Base64.getEncoder().encodeToString(keys[i].getEncoded()));
            String initialVectorAsString = encryptWithMasterPassword(Base64.getEncoder().encodeToString(initialVectors[i]));
            symmetricKeyArrayList.add(new SymmetricKey(i, keyIdGenerator.generateKeyId(), keyAsString,
                    initialVectorAsString, true, tenantIds.get(i)));
        }
        return symmetricKeyArrayList;
    }

    //Returns a list of Asymmetric Keys corresponding to the list of input tenants
    //The returned keys will be encrypted with the master password
    public ArrayList<AsymmetricKey> generateAsymmetricKeys(ArrayList<String> tenantIds) throws NoSuchAlgorithmException, BadPaddingException, InvalidAlgorithmParameterException, IllegalBlockSizeException, NoSuchPaddingException, InvalidKeyException {
        int numberOfKeys = tenantIds.size();
        KeyPair[] keys = new KeyPair[numberOfKeys];
        KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
        keyPairGenerator.initialize(appProperties.getAsymmetricKeySize());
        for(int i = 0; i < numberOfKeys; i++) {
            keys[i] = keyPairGenerator.generateKeyPair();
        }

        ArrayList<AsymmetricKey> asymmetricKeyArrayList = new ArrayList<>();

        for(int i = 0; i < keys.length; i++) {
            String publicKey = encryptWithMasterPassword(Base64.getEncoder().encodeToString(keys[i].getPublic().getEncoded()));
            String privateKey = encryptWithMasterPassword(Base64.getEncoder().encodeToString(keys[i].getPrivate().getEncoded()));
            asymmetricKeyArrayList.add(new AsymmetricKey(i, keyIdGenerator.generateKeyId(), publicKey, privateKey, true, tenantIds.get(i)));
        }

        return asymmetricKeyArrayList;
    }

    //All keys will get encrypted before returning to the caller
    private String encryptWithMasterPassword(String key) throws NoSuchAlgorithmException, IllegalBlockSizeException, InvalidKeyException, BadPaddingException, InvalidAlgorithmParameterException, NoSuchPaddingException {
        byte[] encryptedKey = SymmetricEncryptionUtil.encrypt(key.getBytes(StandardCharsets.UTF_8), masterKey, masterInitialVector);
        return Base64.getEncoder().encodeToString(encryptedKey);
    }
}
