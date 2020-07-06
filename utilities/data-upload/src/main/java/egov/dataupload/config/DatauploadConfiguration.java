package egov.dataupload.config;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import com.github.mustachejava.DefaultMustacheFactory;
import com.github.mustachejava.Mustache;
import com.github.mustachejava.MustacheFactory;
import egov.dataupload.models.DataUploadConfig;
import egov.dataupload.models.Mapping;
import egov.dataupload.models.Step;
import lombok.extern.slf4j.Slf4j;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.StringReader;
import java.util.HashMap;
import java.util.Map;

@Configuration
@Slf4j
public class DatauploadConfiguration {

    @Value("${config.repo.path}")
    private String configPaths;

    @Autowired
    private ResourceLoader resourceLoader;

    private MustacheFactory mf = new DefaultMustacheFactory();

    @PostConstruct
    @Bean
    public Map<String, DataUploadConfig> init(){
        Map<String, DataUploadConfig> dataUploadConfigs = new HashMap<>();
        Map<String, String> errorMap = new HashMap<>();

        log.info("====================== EGOV DATA UPLOAD SERVICE ======================");
        log.info("LOADING CONFIGS: "+ configPaths);
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());

        String[] yamlUrls = configPaths.split(",");
        for (String configPath : yamlUrls) {
            try {
                log.info("Attempting to load config: "+configPath);
                Resource resource = resourceLoader.getResource(configPath);
                DataUploadConfig config = mapper.readValue(resource.getInputStream(), DataUploadConfig.class);

                for(Mapping mapping : config.getMappings()){
                    for(Step step : mapping.getSteps()){
                        Mustache mustache = mf.compile(new StringReader(step.getBody()), step.getId());
                        step.setMustacheTemplate(mustache);
                    }
                }
                dataUploadConfigs.put(config.getService(), config);
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

        return dataUploadConfigs;
    }
}
