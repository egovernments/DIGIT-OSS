package org.egov;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootApplication
public class UrlSorteningApplication {

	public static void main(String[] args) {
		SpringApplication.run(UrlSorteningApplication.class, args);
	}

	@Bean
	public ObjectMapper getObjectMapper() {
		return new ObjectMapper();
	}
}
