package org.egov.enc.utils;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.*;

@Component
public class SignatureUtil {

    public static String signatureMethod;

    @Autowired
    public void setSymmetricEncryptionMethod(@Value("${method.signature}") String method) {
        signatureMethod = method;
    }

    @Autowired
    public SignatureUtil() { init(); }

    //Initialize Security Provider to BouncyCastleProvider
    public static void init() {
        Security.addProvider(new BouncyCastleProvider());
    }

    public static byte[] hashAndSign(byte[] data, PrivateKey privateKey) throws NoSuchAlgorithmException, InvalidKeyException, SignatureException {
        Signature signature = Signature.getInstance(signatureMethod);
        signature.initSign(privateKey);
        signature.update(data);
        return signature.sign();
    }


    public static boolean hashAndVerify(byte[] data, byte[] sign, PublicKey publicKey) throws NoSuchAlgorithmException, InvalidKeyException, SignatureException {
        Signature signature = Signature.getInstance(signatureMethod);
        signature.initVerify(publicKey);
        signature.update(data);
        return signature.verify(sign);
    }

}
