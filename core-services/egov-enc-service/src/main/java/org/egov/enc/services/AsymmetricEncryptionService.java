package org.egov.enc.services;

import org.egov.enc.keymanagement.KeyStore;
import org.egov.enc.models.AsymmetricKey;
import org.egov.enc.models.Ciphertext;
import org.egov.enc.models.Plaintext;
import org.egov.enc.utils.AsymmetricEncryptionUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;

@Service
public class AsymmetricEncryptionService implements EncryptionServiceInterface {

    @Autowired
    private KeyStore keyStore;

    public Ciphertext encrypt(Plaintext plaintext) throws InvalidKeySpecException, NoSuchAlgorithmException, IllegalBlockSizeException, InvalidKeyException, BadPaddingException, NoSuchPaddingException, InvalidAlgorithmParameterException {
        AsymmetricKey asymmetricKey = keyStore.getAsymmetricKey(plaintext.getTenantId());
        PublicKey publicKey = keyStore.getPublicKey(asymmetricKey);

        byte[] cipherBytes = AsymmetricEncryptionUtil.encrypt(plaintext.getPlaintext().getBytes(StandardCharsets.UTF_8), publicKey);

        Ciphertext ciphertext = new Ciphertext(asymmetricKey.getKeyId(), Base64.getEncoder().encodeToString
                (cipherBytes));

        return ciphertext;
    }


    public Plaintext decrypt(Ciphertext ciphertext) throws InvalidKeySpecException, NoSuchAlgorithmException, IllegalBlockSizeException, InvalidKeyException, BadPaddingException, NoSuchPaddingException, InvalidAlgorithmParameterException {
        AsymmetricKey asymmetricKey = keyStore.getAsymmetricKey(ciphertext.getKeyId());
        PrivateKey privateKey = keyStore.getPrivateKey(asymmetricKey);

        byte[] plainBytes = AsymmetricEncryptionUtil.decrypt(Base64.getDecoder().decode(ciphertext.getCiphertext()), privateKey);
        String plain = new String(plainBytes, StandardCharsets.UTF_8);

        Plaintext plaintext = new Plaintext(plain);

        return plaintext;
    }

}
