package org.egov;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.egov.dataupload.model.Definition;
import org.egov.dataupload.model.UploadDefinition;
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

import java.io.File;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Order(1)
public class DataUploadApplicationRunnerImpl implements ApplicationRunner {

	@Autowired
	private ResourceLoader resourceLoader;
	        
    @Autowired
    private Environment env;
    
    @Value("${upload.json.path}")
    private String jsonlist;

	private Map<String, UploadDefinition> uploadDefinitionMap  = new HashMap<>();


	private static final Logger logger = LoggerFactory.getLogger(DataUploadApplicationRunnerImpl.class);
	
    @Override
    public void run(final ApplicationArguments arg0) throws Exception {
    	try {
				logger.info("Reading json config files......");
			    readFiles();			
			}catch(Exception e){
				logger.error("Exception while loading json config files: ",e);
			}
    }

    private void readFiles(){
    	ConcurrentHashMap<String, UploadDefinition> map  = new ConcurrentHashMap<>();
    	ObjectMapper mapper = new ObjectMapper();
		UploadDefinition uploadDefinition = null;
		try{
				List<String> ymlUrlS = Arrays.asList(jsonlist.split(","));
				if(0 == ymlUrlS.size()){
					ymlUrlS.add(jsonlist);
				}
				for(String jsonLocation : ymlUrlS){
					if(jsonLocation.startsWith("https://") || jsonLocation.startsWith("http://")) {
						logger.info("Reading....: "+jsonLocation);
						URL jsonFile = new URL(jsonLocation);
						try{
							uploadDefinition = mapper.readValue(new InputStreamReader(jsonFile.openStream()), UploadDefinition.class);
						} catch(Exception e) {
							logger.error("Exception while fetching upload definitions for: "+jsonLocation+" = ",e);
							continue;
						}
						logger.info("Parsed to object: "+uploadDefinition.toString());
						map.put(uploadDefinition.getModuleName(),
								uploadDefinition);
						
					} else if(jsonLocation.startsWith("file://")){
						logger.info("Reading....: "+jsonLocation);
							Resource resource = resourceLoader.getResource(jsonLocation);
							File file = resource.getFile();
							try{
								uploadDefinition = mapper.readValue(file, UploadDefinition.class);
							 } catch(Exception e) {
									logger.error("Exception while fetching upload definitions for: "+jsonLocation+" = ",e);
									continue;
							}
							logger.info("Parsed to object: "+uploadDefinition.toString());
							map.put(uploadDefinition.getModuleName(),
									uploadDefinition);
					}
				}
			}catch(Exception e){
				logger.error("Exception while loading json files: ",e);
			}
		uploadDefinitionMap = map;
    }

    public Optional<Definition> getUploadDefinition(String moduleName, String defName){
        return this.getUploadDefinitionMap().get(moduleName).getDefinitions().stream()
                .filter(def -> (def.getName().equals(defName)))
                .findFirst();
    }
   

	public Map<String, UploadDefinition> getUploadDefinitionMap(){
		return Collections.unmodifiableMap(uploadDefinitionMap);
	}
}
