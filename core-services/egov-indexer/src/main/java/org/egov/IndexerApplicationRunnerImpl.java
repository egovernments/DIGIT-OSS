package org.egov;

import java.io.File;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import org.egov.infra.indexer.web.contract.Mapping;
import org.egov.infra.indexer.web.contract.Services;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;

import lombok.extern.slf4j.Slf4j;

@Component
@Order(1)
public class IndexerApplicationRunnerImpl implements ApplicationRunner {

	@Autowired
	public static ResourceLoader resourceLoader;

	@Value("${egov.indexer.yml.repo.path}")
	private String yamllist;

	public static final Logger logger = LoggerFactory.getLogger(IndexerApplicationRunnerImpl.class);

	public static ConcurrentHashMap<String, Mapping> mappingMaps = new ConcurrentHashMap<>();

	public static ConcurrentHashMap<String, List<String>> topicMap = new ConcurrentHashMap<>();

	@Override
	public void run(final ApplicationArguments arg0) throws Exception {
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

	public void readFiles() {
		ConcurrentHashMap<String, Mapping> mappingsMap = new ConcurrentHashMap<>();
		ConcurrentHashMap<String, List<String>> topicsMap = new ConcurrentHashMap<>();
		ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
		Services service = null;
		try {
			List<String> ymlUrlS = Arrays.asList(yamllist.split(","));
			if (0 == ymlUrlS.size()) {
				ymlUrlS.add(yamllist);
			}
			for (String yamlLocation : ymlUrlS) {
				if (yamlLocation.startsWith("https://") || yamlLocation.startsWith("http://")) {
					logger.info("Reading....: " + yamlLocation);
					URL yamlFile = new URL(yamlLocation);
					try {
						service = mapper.readValue(new InputStreamReader(yamlFile.openStream()), Services.class);
						for (Mapping mapping : (service.getServiceMaps().getMappings())) {
							 mappingsMap.put(mapping.getTopic(), mapping);
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
						logger.error("Exception while fetching service map for: " + yamlLocation + " = ", e);
						continue;
					}
					logger.info("Parsed: " + service);

				} else if (yamlLocation.startsWith("file://")) {
					logger.info("Reading....: " + yamlLocation);
					Resource resource = resourceLoader.getResource(yamlLocation);
					File file = resource.getFile();
					try {
						service = mapper.readValue(file, Services.class);
						for (Mapping mapping : (service.getServiceMaps().getMappings())) {
							mappingsMap.put(mapping.getTopic(), mapping);
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
						logger.error("Exception while fetching service map for: " + yamlLocation);
						continue;
					}
					logger.info("Parsed to object: " + service);
				}
			}
		} catch (Exception e) {
			logger.error("Exception while loading yaml files: ", e);
		}
		mappingMaps = mappingsMap;
		topicMap = topicsMap;
	}

	public ConcurrentHashMap<String, Mapping> getMappingMaps() {
		return mappingMaps;
	}

	public ConcurrentHashMap<String, List<String>> getTopicMaps() {
		return topicMap;
	}
}
