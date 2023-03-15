package org.egov.encryption;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TestConfiguration {

    @Bean
    public EncryptionServiceImpl encryptionService() {
        return new EncryptionServiceImpl();
    }

}
