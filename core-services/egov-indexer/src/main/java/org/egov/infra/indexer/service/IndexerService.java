package org.egov.infra.indexer.service;

import com.github.zafarkhaja.semver.Version;
import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.PathNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.IndexerApplicationRunnerImpl;
import org.egov.infra.indexer.bulkindexer.BulkIndexer;
import org.egov.infra.indexer.util.IndexerUtils;
import org.egov.infra.indexer.web.contract.Index;
import org.egov.infra.indexer.web.contract.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class IndexerService {

	@Autowired
	private BulkIndexer bulkIndexer;

	@Autowired
	private IndexerApplicationRunnerImpl runner;

	@Autowired
	private DataTransformationService dataTransformationService;

	@Autowired
	private IndexerUtils utils;

	@Value("${egov.core.reindex.topic.name}")
	private String reindexTopic;

	@Value("${egov.core.legacyindex.topic.name}")
	private String legacyIndexTopic;

	@Value("${egov.indexer.persister.create.topic}")
	private String persisterCreate;

	@Value("${egov.indexer.persister.update.topic}")
	private String persisterUpdate;

	@Value("${reindex.pagination.size.default}")
	private Integer defaultPageSizeForReindex;

	@Value("${legacyindex.pagination.size.default}")
	private Integer defaultPageSizeForLegacyindex;

	@Value("${egov.service.host}")
	private String serviceHost;

	@Value("${egov.infra.indexer.host}")
	private String esHostUrl;

	/**
	 * Method that processes data according to the config and posts them to es.
	 *
	 * @param topic
	 * @param kafkaJson
	 * @throws Exception
	 */
	public void esIndexer(String topic, String kafkaJson) throws Exception {
		Map<String, List<Mapping>> versionMap = runner.getVersionMap();
		Mapping applicableMapping = getApplicableMapping(topic, versionMap, kafkaJson);
		if (!ObjectUtils.isEmpty(applicableMapping)) {
			Mapping mapping = applicableMapping;
			try {
				for (Index index : mapping.getIndexes()) {
					indexProccessor(index, mapping.getConfigKey(),kafkaJson, index.getIsBulk() != null && index.getIsBulk());
				}
			} catch (Exception e) {
				log.error("Exception while indexing, Uncaught at the indexer level: ", e);
			}
		} else {
			log.error("No mappings found for the service to which the following topic belongs: " + topic);
		}
	}

	private Mapping getApplicableMapping(String requiredTopic, Map<String, List<Mapping>> versionMap, String kafkaJson) {

		Object document = Configuration.defaultConfiguration().jsonProvider().parse(kafkaJson);

		String version = "";

		try {
			version = JsonPath.read(document, "$.RequestInfo.ver");
		}catch (PathNotFoundException ignore){
		}

		Version semVer = utils.getSemVer(version);
		List<Mapping> mappings = versionMap.get(semVer.getNormalVersion());
		for(Mapping mapping : mappings){
			if(mapping.getTopic().equals(requiredTopic)){
				return mapping;
			}
		}
		return null;
	}


	/**
	 * This method deals with 3 types of uses cases that indexer supports: 1. Index
	 * the entire object that you receive from the queue 2. Take just a part of the
	 * record you receive on the queue and index only that 3. Build an entirely
	 * different object and index it Data transformation as mentioned above is
	 * performed and the passed on to a method that posts it to es.
	 *
	 * @param index
	 * @param kafkaJson
	 * @param isBulk
	 * @throws Exception
	 */
	public void indexProccessor(Index index, Mapping.ConfigKeyEnum configkey, String kafkaJson, boolean isBulk) throws Exception {
		Long startTime = null;
		log.debug("index: " + index.getCustomJsonMapping());
		StringBuilder url = new StringBuilder();
		url.append(esHostUrl).append(index.getName()).append("/").append(index.getType()).append("/").append("_bulk");
		startTime = new Date().getTime();
		String jsonToBeIndexed;
		if (null != index.getCustomJsonMapping()) {
			jsonToBeIndexed = dataTransformationService.buildJsonForIndex(index, kafkaJson, isBulk, true);
		} else {
			jsonToBeIndexed = dataTransformationService.buildJsonForIndex(index, kafkaJson, isBulk, false);
		}

		if(index.getName().contains("collection") || index.getName().contains("payment") || configkey.equals(Mapping.ConfigKeyEnum.LEGACYINDEX)) {
			// this is already sent
		} else {
			validateAndIndex(jsonToBeIndexed, url.toString(), index);
		}

		log.info("Total time taken: " + ((new Date().getTime()) - startTime) + "ms");
	}

	/**
	 * Method to index
	 *
	 * @param finalJson
	 * @param url
	 * @param index
	 * @throws Exception
	 */
	public void validateAndIndex(String finalJson, String url, Index index) throws Exception {
		if (!StringUtils.isEmpty(finalJson)) {
			if (finalJson.startsWith("{ \"index\""))
				bulkIndexer.indexJsonOntoES(url.toString(), finalJson, index);
			else
				indexWithESId(index, finalJson);
		} else {
			log.error("Indexing will not be done, please modify the data and retry.");
			log.error("Object: " + finalJson);
		}
	}

	/**
	 * Method to index
	 *
	 * @param finalJson
	 * @param url
	 * @param index
	 * @throws Exception
	 */
	public void indexWithESId(Index index, String finalJson) throws Exception {
		StringBuilder urlForNonBulk = new StringBuilder();
		urlForNonBulk.append(esHostUrl).append(index.getName()).append("/").append(index.getType()).append("/")
				.append("_index");
		bulkIndexer.indexJsonOntoES(urlForNonBulk.toString(), finalJson, index);
	}

}