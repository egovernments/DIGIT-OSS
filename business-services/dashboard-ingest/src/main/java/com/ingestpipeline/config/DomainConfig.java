package com.ingestpipeline.config;

import com.ingestpipeline.model.DomainIndexConfig;

public interface DomainConfig {
	
	public static final String DOMAIN_CONFIG ="domainConfig";
	public DomainIndexConfig getIndexConfig(String domainName);
	public void loadDomains(); 

}
