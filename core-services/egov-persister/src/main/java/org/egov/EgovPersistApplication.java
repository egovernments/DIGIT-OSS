package org.egov;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import lombok.extern.slf4j.Slf4j;
import org.egov.infra.persist.web.contract.Mapping;
import org.egov.infra.persist.web.contract.Service;
import org.egov.infra.persist.web.contract.TopicMap;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@SpringBootApplication
@Slf4j
public class EgovPersistApplication {

    @Autowired
    private ResourceLoader resourceLoader;

    @Value("${egov.persist.yml.repo.path}")
    private String configPaths;


    public static void main(String[] args) {
        SpringApplication.run(EgovPersistApplication.class, args);
    }

    @PostConstruct
    @Bean
    public TopicMap loadConfigs() {
        TopicMap topicMap = new TopicMap();
        Map<String, List<Mapping>> mappingsMap = new HashMap<>();
        Map<String, String> errorMap = new HashMap<>();

        log.info("====================== EGOV PERSISTER ======================");
        log.info("LOADING CONFIGS: "+ configPaths);
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());

        String[] yamlUrls = configPaths.split(",");
        for (String configPath : yamlUrls) {
            try {
                log.info("Attempting to load config: "+configPath);
                Resource resource = resourceLoader.getResource(configPath);
                Service service = mapper.readValue(resource.getInputStream(), Service.class);

                for (Mapping mapping : service.getServiceMaps().getMappings()) {
                    if(mappingsMap.containsKey(mapping.getFromTopic())){
                        mappingsMap.get(mapping.getFromTopic()).add(mapping);
                    }
                    else{
                        List<Mapping> mappings = new ArrayList<>();
                        mappings.add(mapping);
                        mappingsMap.put(mapping.getFromTopic(), mappings);
                    }

                }
            }
            catch (JsonParseException e){
                log.error("Failed to parse yaml file: " + configPath, e);
                errorMap.put("PARSE_FAILED", configPath);
            }
            catch (IOException e) {
                log.error("Exception while fetching service map for: " + configPath, e);
                errorMap.put("FAILED_TO_FETCH_FILE", configPath);
            }
        }

        if( !  errorMap.isEmpty())
            throw new CustomException(errorMap);
        else
            log.info("====================== CONFIGS LOADED SUCCESSFULLY! ====================== ");

        topicMap.setTopicMap(mappingsMap);

        return topicMap;
    }
}
