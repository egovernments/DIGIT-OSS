package com.ingestpipeline;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import com.ingestpipeline.util.Constants;


@SpringBootApplication(scanBasePackages={"com.ingestpipeline"})// same as @Configuration @EnableAutoConfiguration @ComponentScan combined
public class IngestApp {

	public static void main(String[] args) {
		SpringApplication.run(IngestApp.class, args);
	}
	
	@Bean
	public RestTemplate restTemplate() {
	    return new RestTemplate();
	}
	
	 @Bean
	    public WebMvcConfigurer corsConfigurer() {
	        return new WebMvcConfigurerAdapter() {
	            @Override
	            public void addCorsMappings(CorsRegistry registry) {
	                registry.addMapping("/**").allowedMethods(Constants.ALLOWED_METHODS_GET,Constants.ALLOWED_METHODS_POST
	                		).allowedOrigins("*")
	                        .allowedHeaders("*");
	            }
	        };
	    }
}
