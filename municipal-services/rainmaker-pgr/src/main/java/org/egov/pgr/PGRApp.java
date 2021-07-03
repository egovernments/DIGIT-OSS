package org.egov.pgr;

import org.egov.tracer.config.TracerConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;


@SpringBootApplication
@Import({ TracerConfiguration.class })
public class PGRApp
{
	public static void main(String[] args) {
		SpringApplication.run(PGRApp.class, args);
	}
	
}
