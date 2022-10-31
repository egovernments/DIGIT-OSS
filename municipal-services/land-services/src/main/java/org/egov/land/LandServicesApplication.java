package org.egov.land;

import org.egov.tracer.config.TracerConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;

import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import lombok.extern.slf4j.Slf4j;

@SpringBootApplication

@Import({ TracerConfiguration.class })
public class LandServicesApplication {

	
	public static void main(String[] args) {
		SpringApplication.run(LandServicesApplication.class, args);
		System.out.println("Running..");
	}
	
	
	
	 

}
