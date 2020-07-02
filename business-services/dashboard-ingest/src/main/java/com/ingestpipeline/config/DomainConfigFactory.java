package com.ingestpipeline.config;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.ingestpipeline.configfactory.CollectionDomainConfig;

@Component
public class DomainConfigFactory {

	@Autowired
    private CollectionDomainConfig collectionDomainConfig;
	
	public DomainConfig getConfiguration(String type) {

        if (type.equals("collection")) {
            return collectionDomainConfig;
        }
        return null;
    }
	
	public List<DomainConfig> getAllConfigs() { 
		List<DomainConfig> domainConfigList = new ArrayList<>(); 
		domainConfigList.add(collectionDomainConfig); 
		return domainConfigList;
	}
}
