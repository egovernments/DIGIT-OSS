package org.egov;

import org.egov.filter.route.RequestRoutFilter;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.context.annotation.Bean;

import lombok.extern.slf4j.Slf4j;

@SpringBootApplication
@EnableZuulProxy
@Slf4j
public class TranslatorApplication {
	
	public static void main(String[] args) {
		SpringApplication.run(TranslatorApplication.class, args);
	}
	
	@Bean
	public RequestRoutFilter authFilter() {
		return new RequestRoutFilter();
	}
}
