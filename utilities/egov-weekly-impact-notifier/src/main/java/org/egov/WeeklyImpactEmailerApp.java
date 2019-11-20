package org.egov;


import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import org.egov.win.service.CronService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import lombok.extern.slf4j.Slf4j;

@SpringBootApplication
@Configuration
@PropertySource("classpath:application.properties")
@Slf4j
public class WeeklyImpactEmailerApp
{	
	@Autowired
	private CronService service;
	
	public static void main(String[] args) {
		SpringApplication.run(WeeklyImpactEmailerApp.class, args);
	}
		
	@PostConstruct
	private void start() {
		try {
			log.info("Job STARTED.....");
			service.fetchData();
		}catch(Exception e) {
			log.error("Job FAILED!: ", e);
		}
	}
	
	@PreDestroy
	private void onDestroy() {
		log.info("Application Stopped!");
	}
	
	
}