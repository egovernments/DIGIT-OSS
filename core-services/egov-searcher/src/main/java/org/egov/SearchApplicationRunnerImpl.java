package org.egov;

import java.io.File;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import org.egov.search.model.SearchDefinition;
import org.egov.search.model.SearchDefinitions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;

@Component
@Order(1)
public class SearchApplicationRunnerImpl implements ApplicationRunner {

	@Autowired
	public static ResourceLoader resourceLoader;
	        
    @Autowired
    private static Environment env;
    
    @Value("${search.yaml.path}")
    private String yamllist;
    
    public static ConcurrentHashMap<String, SearchDefinition> searchDefinitionMap  = new ConcurrentHashMap<>();

	
	public static final Logger logger = LoggerFactory.getLogger(SearchApplicationRunnerImpl.class);
	
    @Override
    public void run(final ApplicationArguments arg0) throws Exception {
    	try {
				logger.info("Reading yaml files......");			
			    readFiles();			
			}catch(Exception e){
				logger.error("Exception while loading yaml files: ",e);
			}
    }
    
	public SearchApplicationRunnerImpl(ResourceLoader resourceLoader) {
    	this.resourceLoader = resourceLoader;
    }
       
    public void readFiles(){
    	ConcurrentHashMap<String, SearchDefinition> map  = new ConcurrentHashMap<>();
    	ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
		SearchDefinitions searchDefinitions = null;
		try{
				List<String> ymlUrlS = Arrays.asList(yamllist.split(","));
				if(0 == ymlUrlS.size()){
					ymlUrlS.add(yamllist);
				}
				for(String yamlLocation : ymlUrlS){
					if(yamlLocation.startsWith("https://") || yamlLocation.startsWith("http://")) {
						logger.info("Reading....: "+yamlLocation);
						URL yamlFile = new URL(yamlLocation);
						try{
							searchDefinitions = mapper.readValue(new InputStreamReader(yamlFile.openStream()), SearchDefinitions.class);
						} catch(Exception e) {
							logger.error("Exception while fetching search definitions for: "+yamlLocation+" = ",e);
							continue;
						}
						logger.info("Parsed to object: "+searchDefinitions.toString());
						map.put(searchDefinitions.getSearchDefinition().getModuleName(), 
								searchDefinitions.getSearchDefinition());
						
					} else if(yamlLocation.startsWith("file://")){
						logger.info("Reading....: "+yamlLocation);
							Resource resource = resourceLoader.getResource(yamlLocation);
							File file = resource.getFile();
							try{
								searchDefinitions = mapper.readValue(file, SearchDefinitions.class);
							 } catch(Exception e) {
									logger.error("Exception while fetching search definitions for: "+yamlLocation+" = ",e);
									continue;
							}
							logger.info("Parsed to object: "+searchDefinitions.toString());
							map.put(searchDefinitions.getSearchDefinition().getModuleName(), 
									searchDefinitions.getSearchDefinition());
					}
				}
			}catch(Exception e){
				logger.error("Exception while loading yaml files: ",e);
			}
		searchDefinitionMap = map;
    }
   

	public ConcurrentHashMap<String, SearchDefinition> getSearchDefinitionMap(){
		return searchDefinitionMap;
	}
}
