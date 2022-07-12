package org.egov.auditservice.persisterauditclient;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.egov.auditservice.persisterauditclient.models.contract.Mapping;
import org.egov.auditservice.persisterauditclient.models.contract.Service;
import org.egov.auditservice.persisterauditclient.models.contract.TopicMap;
import org.egov.tracer.model.CustomException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Slf4j
@Component
public class PersisterConfigInit {

    @Autowired
    private ResourceLoader resourceLoader;

    @Value("${egov.persist.yml.repo.path}")
    private String configPaths;

    @Autowired
    private ApplicationContext applicationContext;



    //file types to be resolved have to be passed as comma separated types.
    public List<String> resolveAllConfigFolders(List<String> listOfFiles, String fileTypesToResolve) {
        List<String> fileList = new ArrayList<String>();
        List<String> fileTypes = Arrays.asList(fileTypesToResolve.split("[,]"));

        for (String listOfFile : listOfFiles) {
            String[] fileName = listOfFile.split("[.]");
            if (fileTypes.contains(fileName[fileName.length - 1])) {
                fileList.add(listOfFile);
            } else {
                fileList.addAll(getFilesInFolder(listOfFile, fileTypes));
            }

        }
        return fileList;
    }


    public List<String> getFilesInFolder(String baseFolderPath,List<String> fileTypes) {
        File folder = new File(baseFolderPath);

        if (!folder.exists()) {
            throw new RuntimeException("The folder doesn't exist - " + baseFolderPath);
        }

        File[] listOfFiles = folder.listFiles();
        List<String> configFolderList = new ArrayList<String>();

        for (int i = 0; i < listOfFiles.length; i++) {
            log.info("File " + listOfFiles[i].getName());
            File file = listOfFiles[i];
            String name = file.getName();
            String[] fileName = name.split("[.]");
            if (fileTypes.contains(fileName[fileName.length - 1])) {
                log.debug(" Resolving folder....:- " + name);
                configFolderList.add(file.toURI().toString());
            }

        }
        return configFolderList;
    }

    @PostConstruct
    @Bean
    public TopicMap loadConfigs() {
        TopicMap topicMap = new TopicMap();
        Map<String, List<Mapping>> mappingsMap = new HashMap<>();
        Map<String, String> errorMap = new HashMap<>();
        boolean failed = false;

        try {
            log.info("====================== EGOV PERSISTER ======================");
            log.info("LOADING CONFIGS: " + configPaths);
            ObjectMapper mapper = new ObjectMapper(new YAMLFactory());

            List<String> fileUrls = Arrays.asList(configPaths.split(","));
            String fileTypes = "yaml,yml";
            List<String> yamlUrls = resolveAllConfigFolders(fileUrls, fileTypes);
            log.info(" These are all the files " + yamlUrls);

            if (yamlUrls.size() == 0) {
                throw new RuntimeException("There are no config files loaded. Service cannot start");
            }

            for (String configPath : yamlUrls) {
                InputStream inputStream = null;
                try {
                    log.info("Attempting to load config: " + configPath);
                    Resource resource = resourceLoader.getResource(configPath);
                    inputStream = resource.getInputStream();
                    Service service = mapper.readValue(inputStream, Service.class);

                    for (Mapping mapping : service.getServiceMaps().getMappings()) {
                        if (mappingsMap.containsKey(mapping.getFromTopic())) {
                            mappingsMap.get(mapping.getFromTopic()).add(mapping);
                        } else {
                            List<Mapping> mappings = new ArrayList<>();
                            mappings.add(mapping);
                            mappingsMap.put(mapping.getFromTopic(), mappings);
                        }

                    }
                } catch (JsonParseException e) {
                    log.error("Failed to parse yaml file: " + configPath, e);
                    errorMap.put("PARSE_FAILED", configPath);
                    failed = true;
                } catch (IOException e) {
                    log.error("Exception while fetching service map for: " + configPath, e);
                    errorMap.put("FAILED_TO_FETCH_FILE", configPath);
                    failed = true;
                }
                finally {
                    IOUtils.closeQuietly(inputStream);
                }
            }

            if (!errorMap.isEmpty())
                throw new CustomException(errorMap);
            else
                log.info("====================== CONFIGS LOADED SUCCESSFULLY! ====================== ");
        } catch (Exception ex) {
            log.error("Failed to load configs", ex);
            failed = true;
        }

        if (failed) {
            log.error("Failed to load some of the config files. The service cannot start");
            SpringApplication.exit(applicationContext);
            System.exit(1);
        }

        topicMap.setTopicMap(mappingsMap);

        return topicMap;
    }
}
