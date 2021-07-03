package egov.dataupload;

import org.egov.tracer.config.TracerConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Configuration
@ComponentScan(basePackages = { "egov.dataupload" , "egov.dataupload.config", "egov.dataupload.web.controllers"})
@Import({TracerConfiguration.class})
public class DataUploadMain {
        public static void main(String[] args) throws Exception {
            SpringApplication.run(DataUploadMain.class, args);
        }
}
