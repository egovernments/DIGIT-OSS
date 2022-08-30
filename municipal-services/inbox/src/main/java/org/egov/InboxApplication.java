package org.egov;

import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.encryption.config.EncryptionConfiguration;
import org.egov.tracer.config.TracerConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@EnableAutoConfiguration
@Import({ TracerConfiguration.class, MultiStateInstanceUtil.class, EncryptionConfiguration.class   })
public class InboxApplication {

	public static void main(String[] args) {
		SpringApplication.run(InboxApplication.class, args);
	}

}
