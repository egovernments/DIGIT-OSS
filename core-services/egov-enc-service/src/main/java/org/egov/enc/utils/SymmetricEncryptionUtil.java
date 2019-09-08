package org.egov.enc.utils;

import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.egov.enc.config.AppProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.*;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.IvParameterSpec;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.Security;

@Slf4j
@Component
public class SymmetricEncryptionUtil {

    private static String symmetricEncryptionMethod;

    @Autowired
    public void setSymmetricEncryptionMethod(@Value("${method.symmetric}") String method) {
        symmetricEncryptionMethod = method;
    }

    public SymmetricEncryptionUtil() { init(); }

    //Initialize Security Provider to BouncyCastleProvider
    public static void init() { Security.addProvider(new BouncyCastleProvider()); }

    public static byte[] encrypt(byte[] plaintext, SecretKey secretKey, byte[] initialVector) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidAlgorithmParameterException, InvalidKeyException, BadPaddingException, IllegalBlockSizeException {
        Cipher cipher = Cipher.getInstance(symmetricEncryptionMethod);
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, new GCMParameterSpec(128, initialVector));
        return cipher.doFinal(plaintext);
    }

    public static byte[] decrypt(byte[] ciphertext, SecretKey secretKey, byte[] initialVector) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidAlgorithmParameterException, InvalidKeyException, BadPaddingException, IllegalBlockSizeException {
        Cipher cipher = Cipher.getInstance(symmetricEncryptionMethod);
        cipher.init(Cipher.DECRYPT_MODE, secretKey, new GCMParameterSpec(128, initialVector));
        return cipher.doFinal(ciphertext);
    }

}
