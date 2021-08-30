package org.egov.pt.calculator;

import org.egov.tracer.config.TracerConfiguration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

@SpringBootApplication
@EnableCaching
@Import({ TracerConfiguration.class })
public class PropertyCalculatorApplication {

	@Value("${cache.expiry.billing.slab.minutes:360}")
	private long billingSlabCachedExpiry;

	@Value("${cache.expiry.masterdata.minutes:5}")
	private long masterDataCachedExpiry;

	public static void main(String[] args) {
		SpringApplication.run(PropertyCalculatorApplication.class, args);
	}

	@Bean
	@Primary
	public ObjectMapper getObjectMapper(){
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
		return objectMapper;
	}

	@Bean(name = "secondaryMapper")
	public ObjectMapper objectMapperForRepository(){
		ObjectMapper mapper = new ObjectMapper();
		mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
		mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
		//objectMapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);
		return mapper;
	}

}