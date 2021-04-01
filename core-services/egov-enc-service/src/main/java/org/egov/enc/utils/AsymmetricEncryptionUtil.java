package org.egov.enc.utils;

import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.egov.enc.config.AppProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.security.*;

@Slf4j
@Component
public class AsymmetricEncryptionUtil {

    private static String asymmetricEncryptionMethod;

    @Autowired
    public void setAsymmetricEncryptionMethod(@Value("${method.asymmetric}") String method) {
        asymmetricEncryptionMethod = method;
    }

    @Autowired
    public AsymmetricEncryptionUtil() { init(); }

    //Initialize Security Provider to BouncyCastleProvider
    public static void init() {
        Security.addProvider(new BouncyCastleProvider());
    }

    public static byte[] encrypt(byte[] plaintext, PublicKey publicKey) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, BadPaddingException, IllegalBlockSizeException {
        Cipher cipher = Cipher.getInstance(asymmetricEncryptionMethod);
        cipher.init(Cipher.ENCRYPT_MODE, publicKey);
        return cipher.doFinal(plaintext);
    }

    public static byte[] decrypt(byte[] ciphertext, PrivateKey privateKey) throws NoSuchPaddingException, NoSuchAlgorithmException, InvalidKeyException, BadPaddingException, IllegalBlockSizeException {
        Cipher cipher = Cipher.getInstance(asymmetricEncryptionMethod);
        cipher.init(Cipher.DECRYPT_MODE, privateKey);
        return cipher.doFinal(ciphertext);
    }

}
