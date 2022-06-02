package org.egov.hash;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Slf4j
@Service
public class HashService {

    private MessageDigest messageDigest;

    @PostConstruct
    public void init() throws NoSuchAlgorithmException {
        messageDigest = MessageDigest.getInstance("SHA-256");
    }

    public String getHashValue(Object object) {
        String value = object.toString();
        byte[] bytes = messageDigest.digest(value.getBytes(StandardCharsets.UTF_8));
        return Base64.encodeBase64URLSafeString(bytes);
    }

}
