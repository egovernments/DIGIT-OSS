package org.egov.infra.persist.service;

import com.github.zafarkhaja.semver.Version;
import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.PathNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.egov.infra.persist.repository.PersistRepository;
import org.egov.infra.persist.utils.Utils;
import org.egov.infra.persist.web.contract.JsonMap;
import org.egov.infra.persist.web.contract.Mapping;
import org.egov.infra.persist.web.contract.QueryMap;
import org.egov.infra.persist.web.contract.TopicMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Slf4j
public class PersistService {

	@Autowired
	private TopicMap topicMap;

	@Autowired
	private PersistRepository persistRepository;

	@Autowired
	private Utils utils;

	@Transactional
	public void persist(String topic, String json) {

		Map<String, List<Mapping>> map = topicMap.getTopicMap();

		Object document = Configuration.defaultConfiguration().jsonProvider().parse(json);
		List<Mapping> applicableMappings = filterMappings(map.get(topic), document);
		log.info("{} applicable configs found!", applicableMappings.size());

		for (Mapping mapping : applicableMappings) {
			List<QueryMap> queryMaps = mapping.getQueryMaps();
			for (QueryMap queryMap : queryMaps) {
				String query = queryMap.getQuery();
				List<JsonMap> jsonMaps = queryMap.getJsonMaps();
				String basePath = queryMap.getBasePath();
				persistRepository.persist(query, jsonMaps, document, basePath);

			}

		}
	}

	@Transactional
	public void persist(String topic, List<String> jsons) {

		Map<String, List<Mapping>> map = topicMap.getTopicMap();
		Map<Object, List<Mapping>> applicableMappings = new LinkedHashMap<>();

		for (String json : jsons){
			Object document = Configuration.defaultConfiguration().jsonProvider().parse(json);
			applicableMappings.put(document, filterMappings(map.get(topic), document));
		}

		applicableMappings.forEach((jsonObj, mappings) -> {
			for (Mapping mapping : mappings) {
				List<QueryMap> queryMaps = mapping.getQueryMaps();
				for (QueryMap queryMap : queryMaps) {
					String query = queryMap.getQuery();
					List<JsonMap> jsonMaps = queryMap.getJsonMaps();
					String basePath = queryMap.getBasePath();

					List<Object[]> rows = new LinkedList<>(persistRepository.getRows(jsonMaps, jsonObj, basePath));

					persistRepository.persist(query, rows);
				}

			}
		});
	}

	private List<Mapping> filterMappings(List<Mapping> mappings, Object json){
		List<Mapping> filteredMaps = new ArrayList<>();
		String version = "";
		try {
			version = JsonPath.read(json, "$.RequestInfo.ver");
		}catch (PathNotFoundException ignore){
		}
		Version semVer = utils.getSemVer(version);
		for (Mapping map: mappings) {
			if(semVer.satisfies(map.getVersion()))
				filteredMaps.add(map);
		}

		return filteredMaps;
	}

}