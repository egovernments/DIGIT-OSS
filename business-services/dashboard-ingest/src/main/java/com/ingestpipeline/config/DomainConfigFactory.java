package com.ingestpipeline.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ingestpipeline.configfactory.CollectionDomainConfig;
import com.ingestpipeline.configfactory.EnhanceDomainConfig;

@Component
public class DomainConfigFactory {

	@Autowired
    private CollectionDomainConfig collectionDomainConfig;
	
	@Autowired
	private EnhanceDomainConfig enhanceDomainConfig;
	
	public DomainConfig getConfiguration(String type) {

        if (type.equals("collection")) {
            return collectionDomainConfig;
            
        } else if(type.equals("dataEnhancement")) {
        	return enhanceDomainConfig;
        	
        }
        return null;
    }
	
	public List<DomainConfig> getAllConfigs() { 
		List<DomainConfig> domainConfigList = new ArrayList<>(); 
		domainConfigList.add(collectionDomainConfig);
		domainConfigList.add(enhanceDomainConfig);
		return domainConfigList;
	}
}
