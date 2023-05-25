package org.egov;

import java.io.File;
import java.io.InputStream;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.commons.io.IOUtils;
import org.egov.infra.indexer.web.contract.Mapping;
import org.egov.infra.indexer.web.contract.Services;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.*;
import org.springframework.context.*;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@Order(1)
public class IndexerApplicationRunnerImpl implements ApplicationRunner {

	@Autowired
	public static ResourceLoader resourceLoader;

	@Value("${egov.indexer.yml.repo.path}")
	private String yamllist;

	public static final Logger logger = LoggerFactory.getLogger(IndexerApplicationRunnerImpl.class);

	public static ConcurrentHashMap<String, Mapping> mappingMaps = new ConcurrentHashMap<>();

	public static ConcurrentHashMap<String, List<Mapping>> versionMap = new ConcurrentHashMap<>();

	public static ConcurrentHashMap<String, List<String>> topicMap = new ConcurrentHashMap<>();

	@Autowired
	private ApplicationContext applicationContext;

	@Override
	public void run(final ApplicationArguments applicationArguments) throws Exception {
		try {
			logger.info("Reading yaml files......");
			readFiles();
		} catch (Exception e) {
			logger.error("Exception while loading yaml files: ", e);
		}
	}

	public IndexerApplicationRunnerImpl(ResourceLoader resourceLoader) {
		this.resourceLoader = resourceLoader;
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

	public List<String> getFilesInFolder(String baseFolderPath,List<String> fileTypes) {
		File folder = new File(baseFolderPath);

		if (!folder.exists())
			throw new RuntimeException("Folder doesn't exists - " + baseFolderPath);

		File[] listOfFiles = folder.listFiles();
		List<String> configFolderList = new ArrayList<String>();

		for (int i = 0; i < listOfFiles.length; i++) {
			log.info("File " + listOfFiles[i].getName());
			File file = listOfFiles[i];
			String name = file.getName();
			String[] fileName = name.split("[.]");
			if (fileTypes.contains(fileName[fileName.length - 1])) {
				configFolderList.add(file.toURI().toString());
			}

		}
		return configFolderList;
	}


	public void readFiles() {
		ConcurrentHashMap<String, Mapping> mappingsMap = new ConcurrentHashMap<>();
		ConcurrentHashMap<String, List<Mapping>> versionsMap = new ConcurrentHashMap<>();
		ConcurrentHashMap<String, List<String>> topicsMap = new ConcurrentHashMap<>();
		ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
		Services service = null;
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
				throw new RuntimeException("There are no config files loaded. Service cannot start");
			}

			for (String yamlLocation : ymlUrlS) {
				logger.info("Reading....: " + yamlLocation);
				Resource resource = resourceLoader.getResource(yamlLocation);
				InputStream inputStream = null;
				try {
						inputStream = resource.getInputStream();
						service = mapper.readValue(inputStream, Services.class);
						String version = service.getServiceMaps().getVersion();
						for (Mapping mapping : (service.getServiceMaps().getMappings())) {
							 mappingsMap.put(mapping.getTopic(), mapping);
							 if(!CollectionUtils.isEmpty(versionsMap.get(version))){
							 	versionsMap.get(version).add(mapping);
							 }else{
							 	List<Mapping> mappings = new ArrayList<>();
							 	mappings.add(mapping);
							 	versionsMap.put(version, mappings);
							 }
							if (!CollectionUtils.isEmpty(topicsMap.get(mapping.getConfigKey().toString()))) {
								List<String> topics = topicsMap.get(mapping.getConfigKey().toString());
								topics.add(mapping.getTopic());
								topicsMap.put(mapping.getConfigKey().toString(), topics);
							} else {
								List<String> topics = new ArrayList<String>();
								topics.add(mapping.getTopic());
								topicsMap.put(mapping.getConfigKey().toString(), topics);
							}
						}
					} catch (Exception e) {
						logger.error("Exception while fetching service map for: " + yamlLocation , e);
						failed = true;
					} finally {
							IOUtils.closeQuietly(inputStream);
					}
			}
		} catch (Exception e) {
			logger.error("Exception while loading yaml files: ", e);
			failed = true;
		}

		mappingMaps = mappingsMap;
		versionMap = versionsMap;
		topicMap = topicsMap;

		if (failed) {
			log.error("Some of the config's file failed to Load. The service cannot be started");
			SpringApplication.exit(applicationContext);
			System.exit(1);
		}
	}

	public ConcurrentHashMap<String, Mapping> getMappingMaps() {
		return mappingMaps;
	}

	public ConcurrentHashMap<String, List<Mapping> > getVersionMap(){
		return versionMap;
	}

	public ConcurrentHashMap<String, List<String>> getTopicMaps() {
		return topicMap;
	}
}
