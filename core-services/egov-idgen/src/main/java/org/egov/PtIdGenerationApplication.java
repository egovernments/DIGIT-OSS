package org.egov;

import org.egov.tracer.config.TracerConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

import java.security.SecureRandom;

/**
 * Description : This is initialization class for pt-idGeneration module
 * 
 * @author Pavan Kumar Kamma
 *
 */
@SpringBootApplication
@Import({TracerConfiguration.class})
public class PtIdGenerationApplication {
	@Bean
	SecureRandom getSecureRandom(){
		return new SecureRandom();
	}
	public static void main(String[] args) {
		SpringApplication.run(PtIdGenerationApplication.class, args);
	}
}
