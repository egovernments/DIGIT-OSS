package org.egov.waterconnection;

import java.util.TimeZone;

import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.encryption.config.EncryptionConfiguration;

import org.egov.tracer.config.TracerConfiguration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootApplication(scanBasePackages = "org.egov")
@EnableAutoConfiguration
@Import({ TracerConfiguration.class, MultiStateInstanceUtil.class, EncryptionConfiguration.class  })
public class WaterConnectionApplication{
	@Value("${app.timezone}")
	private String timeZone;

	public static void main(String[] args) {
		SpringApplication.run(WaterConnectionApplication.class, args);

	}

	@Bean
	public ObjectMapper objectMapper() {
		return new ObjectMapper().configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true)
				.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES).setTimeZone(TimeZone.getTimeZone(timeZone));
	}

}
