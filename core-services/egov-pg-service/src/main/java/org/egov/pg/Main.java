package org.egov.pg;

import org.egov.common.utils.MultiStateInstanceUtil;
import org.egov.tracer.config.TracerConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import org.springframework.stereotype.Component;

@SpringBootApplication
@Component
@Import({TracerConfiguration.class, MultiStateInstanceUtil.class})
public class Main {

    public static void main(String[] args) {
        SpringApplication.run(Main.class);

    }

}
