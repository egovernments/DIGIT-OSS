package org.egov;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootApplication
public class CustomConsumerApplication {

	public static void main(String[] args) {
		SpringApplication.run(CustomConsumerApplication.class, args);
	}
	
	@Bean
	public RestTemplate restTemplate()	{
		return new RestTemplate();
	}
	
	@Bean
	public ObjectMapper objectMapper()	{
		return new ObjectMapper();
	}
	
}
