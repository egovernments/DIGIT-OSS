package org.egov;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;

@SpringBootApplication
@Configuration
@PropertySource("classpath:application.properties")
public class IndexerInfraApplication
{	
    @Autowired
    private static Environment env;
    
    @Value("${egov.indexer.file.path}")
    private static String yamllistfile;
    
    public void setEnvironment(final Environment env) {
    	IndexerInfraApplication.env = env;
    }
	
	public static void main(String[] args) {
		SpringApplication.run(IndexerInfraApplication.class, args);
	}    

	@Bean
	public RestTemplate restTemplate() {
	    return new RestTemplate();
	}
	
	private static ObjectMapper getMapperConfig() {
		ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);
		mapper.setSerializationInclusion(Include.NON_NULL);
		return mapper;
	}
	
	
}
