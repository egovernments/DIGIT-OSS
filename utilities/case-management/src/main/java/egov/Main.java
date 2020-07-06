package egov;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = { "egov", "egov.casemanagement.web.controllers" , "egov.casemanagement.config"})
public class Main {
        public static void main(String[] args) throws Exception {
            SpringApplication.run(Main.class, args);
        }
}
