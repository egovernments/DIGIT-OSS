package org.egov.enc.services;

import org.egov.enc.keymanagement.KeyStore;
import org.egov.enc.models.AsymmetricKey;
import org.egov.enc.utils.SignatureUtil;
import org.egov.enc.web.models.*;
import org.egov.enc.models.Signature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;

@Service
public class SignatureService {

    @Autowired
    private KeyStore keyStore;

    public SignResponse hashAndSign(SignRequest signRequest) throws InvalidKeySpecException, NoSuchAlgorithmException,
            SignatureException, InvalidKeyException {
        AsymmetricKey asymmetricKey = keyStore.getAsymmetricKey(signRequest.getTenantId());
        PrivateKey privateKey = keyStore.getPrivateKey(asymmetricKey);

        byte[] signBytes = SignatureUtil.hashAndSign(signRequest.getValue().getBytes(StandardCharsets.UTF_8), privateKey);
        String sign = Base64.getEncoder().encodeToString(signBytes);

        Signature signature = new Signature(asymmetricKey.getKeyId(), sign);

        return new SignResponse(signRequest.getValue(), signature.toString());
    }

    public VerifyResponse hashAndVerify(VerifyRequest verifyRequest) throws InvalidKeySpecException, NoSuchAlgorithmException,
            SignatureException, InvalidKeyException {
        AsymmetricKey asymmetricKey = keyStore.getAsymmetricKey(verifyRequest.getSignature().getKeyId());
        PublicKey publicKey = keyStore.getPublicKey(asymmetricKey);

        boolean verified = SignatureUtil.hashAndVerify(verifyRequest.getValue().getBytes(StandardCharsets.UTF_8), Base64.getDecoder()
                .decode(verifyRequest.getSignature().getSignatureValue()), publicKey);

        return new VerifyResponse(verified);
    }

}
