package org.egov.demoutility;


import org.egov.tracer.config.TracerConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

import io.micrometer.spring.autoconfigure.MetricsAutoConfiguration;

@SpringBootApplication
@Import({ TracerConfiguration.class })

public class DemoUtility
{	
	
	public static void main(String[] args) {
		
		SpringApplication.run(DemoUtility.class, args);
	}
	
}