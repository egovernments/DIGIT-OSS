package org.egov.utils;

import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class RoutingConfig {

	@Value("${egov.service.config.path}")
	private String serviceConfigPath;

	private Map<String, Map<String, String>> tenantRoutingConfigWrapper;

	@PostConstruct
	public void loadServiceConfigurationYaml() {
		
		log.info(" Translator Service Reading Configuration from tenant-config givne in path : " + serviceConfigPath);
		ObjectMapper mapper = new ObjectMapper();
		try {
			URL serviceConfigUrl = new URL(serviceConfigPath);
			tenantRoutingConfigWrapper = mapper.readValue(new InputStreamReader(serviceConfigUrl.openStream()),
					new TypeReference<Map<String, Map<String, String>>>(){});
			
			log.info("loging the map constructed from the cofig file : " + tenantRoutingConfigWrapper.toString());
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public Map<String, Map<String, String>> getTeanantRoutingConfigWrapper() {
		return tenantRoutingConfigWrapper;
	}
	
}
