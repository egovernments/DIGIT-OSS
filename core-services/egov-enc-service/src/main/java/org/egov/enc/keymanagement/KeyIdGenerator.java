package org.egov.enc.keymanagement;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.egov.enc.config.AppProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.security.Security;
import java.util.ArrayList;

@Component
@Order(2)
public class KeyIdGenerator implements ApplicationRunner {

    private SecureRandom secureRandom;

    private static ArrayList<Integer> presentKeyIds;

    @Autowired
    private KeyStore keyStore;

    @Autowired
    private AppProperties appProperties;

    @Autowired
    public KeyIdGenerator() {
        Security.addProvider(new BouncyCastleProvider());
        secureRandom = new SecureRandom();
    }

    public void refreshKeyIds() {
        presentKeyIds = keyStore.getKeyIds();
    }

    public Integer generateKeyId() {
        Integer keyId = getRandomNumber(appProperties.getKeyIdLength());
        while(presentKeyIds.contains(keyId)) {
            keyId = getRandomNumber(appProperties.getKeyIdLength());
        }
        return keyId;
    }

    private Integer getRandomNumber(int digCount) {
        StringBuilder sb = new StringBuilder(digCount);
        for(int i = 0; i < digCount; i++)
            sb.append((char)('0' + secureRandom.nextInt(10)));
        return Integer.parseInt(sb.toString());
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        refreshKeyIds();
    }
}
