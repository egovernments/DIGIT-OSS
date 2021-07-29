package org.egov.echallancalculation;


import org.egov.tracer.config.TracerConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;


@SpringBootApplication
@ComponentScan(basePackages = { "org.egov.echallancalculation", "org.egov.echallancalculation.web.controllers" , "org.egov.echallancalculation.config"})
@Import({ TracerConfiguration.class })
public class EchallanCalMain {

    public static void main(String[] args) throws Exception {
        SpringApplication.run(EchallanCalMain.class, args);
    }

}
