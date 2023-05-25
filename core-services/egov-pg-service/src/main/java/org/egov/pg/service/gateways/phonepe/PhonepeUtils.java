package org.egov.pg.service.gateways.phonepe;

import lombok.extern.slf4j.Slf4j;

import javax.xml.bind.DatatypeConverter;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Slf4j
class PhonepeUtils {

    private PhonepeUtils() {
    }

    static String buildHash(String payload) throws NoSuchAlgorithmException {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(payload.getBytes(StandardCharsets.UTF_8));
            return DatatypeConverter.printHexBinary(hash);
    }

}
