package org.egov;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.commons.io.IOUtils;
import org.egov.search.model.SearchDefinition;
import org.egov.search.model.SearchDefinitions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;

import lombok.extern.slf4j.Slf4j;

@Component
@Order(1)
@Slf4j
public class SearchApplicationRunnerImpl implements ApplicationRunner {

    @Autowired
    public static ResourceLoader resourceLoader;

    @Autowired
    private static Environment env;

    @Value("${search.yaml.path}")
    private String yamllist;
    
    private List<String> OffsetAndLimit = Arrays.asList("OFFSET","LIMIT");

    @Autowired
    ApplicationContext applicationContext;

    public static ConcurrentHashMap<String, SearchDefinition> searchDefinitionMap = new ConcurrentHashMap<>();


    public static final Logger logger = LoggerFactory.getLogger(SearchApplicationRunnerImpl.class);

    @Override
    public void run(ApplicationArguments applicationArguments) throws Exception {
        try {
            log.info("Reading yaml files......");
            readFiles();
        } catch (Exception e) {
            log.error("Exception while loading yaml files: ", e);
        }
    }

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

    public List<String> getFilesInFolder(String baseFolderPath, List<String> fileTypes) {
        File folder = new File(baseFolderPath);

        if (!folder.exists()) {
            throw new RuntimeException("The folder doesn't exists - " + baseFolderPath);
        }

        File[] listOfFiles = folder.listFiles();
        List<String> configFolderList = new ArrayList<String>();

        for (int i = 0; i < Objects.requireNonNull(listOfFiles).length; i++) {
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


    public SearchApplicationRunnerImpl(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;
    }

    // 2 file types yaml and yml have to be resolved
    public void readFiles() {
        ConcurrentHashMap<String, SearchDefinition> map = new ConcurrentHashMap<>();
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
        SearchDefinitions searchDefinitions;
        boolean failed = false;

        try {
            List<String> fileUrls = Arrays.asList(yamllist.split(","));
            if (0 == fileUrls.size()) {
                fileUrls.add(yamllist);
            }
            String fileTypes = "yaml,yml";
            List<String> ymlUrlS = resolveAllConfigFolders(fileUrls, fileTypes);
            log.info(" These are all the files " + ymlUrlS);

            if (ymlUrlS.size() == 0) {
                throw new RuntimeException("There are no configs loaded. Service cannot start");
            }

            for (String yamlLocation : ymlUrlS) {
                Resource resource = resourceLoader.getResource(yamlLocation);
                InputStream inputStream = null;
                try {
                    inputStream = resource.getInputStream();
                    searchDefinitions = mapper.readValue(inputStream, SearchDefinitions.class);
                    logger.info("Parsed search definition : " + searchDefinitions.getSearchDefinition().getModuleName());
                    
                    map.put(searchDefinitions.getSearchDefinition().getModuleName(),
                            searchDefinitions.getSearchDefinition());
                } catch (IOException e) {
                    log.error("Failed to load file - " + yamlLocation, e);
                    failed = true;
                } finally {
                    IOUtils.closeQuietly(inputStream);
                }
            }


        } catch (Exception e) {
            logger.error("Exception while loading yaml files: ", e);
            failed = true;
        }

        if (failed) {
            log.error("There are config errors. The service cannot start with any config errors");
            SpringApplication.exit(applicationContext);
            System.exit(1);
        }
        searchDefinitionMap = map;
    }

	public ConcurrentHashMap<String, SearchDefinition> getSearchDefinitionMap() {
        return searchDefinitionMap;
    }
}
