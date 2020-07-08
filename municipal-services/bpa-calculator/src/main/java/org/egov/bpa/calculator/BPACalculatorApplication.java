package org.egov.bpa.calculator;

import org.egov.tracer.config.TracerConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@ComponentScan(basePackages = { "org.egov.bpa.calculator", "org.egov.bpa.calculator.web.controllers" , "org.egov.bpa.calculator.config"})
@Import({ TracerConfiguration.class })
public class BPACalculatorApplication {

	public static void main(String[] args) {
		SpringApplication.run(BPACalculatorApplication.class, args);
	}

}
