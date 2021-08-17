package org.egov.demoutility.config;



import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.ui.freemarker.FreeMarkerConfigurationFactoryBean;

@Component
public class ApplicationConfig {
	 @Bean(name="freemarkerConfiguration")
    public freemarker.template.Configuration getFreeMarkerConfiguration() {
    	 freemarker.template.Configuration config = new freemarker.template.Configuration(freemarker.template.Configuration.getVersion());
         config.setClassForTemplateLoading(this.getClass(), "/templates/");
         return config;
    }
}