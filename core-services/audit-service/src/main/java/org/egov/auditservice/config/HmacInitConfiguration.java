package org.egov.auditservice.config;

import org.bouncycastle.crypto.Digest;
import org.bouncycastle.crypto.digests.SHA256Digest;
import org.bouncycastle.crypto.macs.HMac;
import org.bouncycastle.crypto.params.KeyParameter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

@Component
public class HmacInitConfiguration {

    @Value("${hmac.key}")
    private String hmacKey;

    @Bean
    @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
    private HMac initHmacDigest(){
        Digest digest = new SHA256Digest();

        HMac hMac = new HMac(digest);
        hMac.init(new KeyParameter(hmacKey.getBytes()));

        return hMac;
    }
}
