package org.egov.pg.service.gateways.easypay;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.SecretKeySpec;

import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class EasyPayUtil {

    @Value("${easypay.separator:|}")
    public String separator;

    @Value("${easypay.aes.key}")
    public String aesKey;

    public String encrypt(String inputParam) {
        byte[] abyte2 = (byte[]) null;
        byte[] abyte1 = aesKey.getBytes();
        // TODO check below
        SecretKeySpec secretkeyspec = new SecretKeySpec(abyte1, "AES");
        SecretKeySpec secretkeyspec1 = secretkeyspec;
        try {
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(1, secretkeyspec1);
            abyte2 = cipher.doFinal(inputParam.getBytes());
        } catch (IllegalBlockSizeException e) {
            log.error("encryption failed ", e);
            throw new CustomException("ENCRYPTION_FAILED", "encryption failed");
        } catch (NoSuchAlgorithmException e) {
            log.error("encryption failed ", e);
            throw new CustomException("ENCRYPTION_FAILED", "encryption failed");
        } catch (NoSuchPaddingException e) {
            log.error("encryption failed ", e);
            throw new CustomException("ENCRYPTION_FAILED", "encryption failed");
        } catch (InvalidKeyException e) {
            log.error("encryption failed ", e);
            throw new CustomException("ENCRYPTION_FAILED", "encryption failed");
        } catch (BadPaddingException e) {
            log.error("encryption failed ", e);
            throw new CustomException("ENCRYPTION_FAILED", "encryption failed");
        }
        return new String(Base64.getEncoder().encode(abyte2));
    }

    public String getEncryptedMandatoryFields(String referenceNo, String subReferenceNum, String transactionAmt) {

        String encryptedMandatoryFields = new StringBuilder(referenceNo).append(separator).append(subReferenceNum)
                .append(separator).append(transactionAmt).toString();

        return encrypt(encryptedMandatoryFields);
    }

}