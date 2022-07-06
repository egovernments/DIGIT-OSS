package org.egov.infra.persist.service;

import com.github.zafarkhaja.semver.Version;
import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.PathNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.egov.infra.persist.repository.PersistRepository;
import org.egov.infra.persist.utils.AuditUtil;
import org.egov.infra.persist.utils.Utils;
import org.egov.infra.persist.web.contract.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
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

	@Autowired
	private AuditUtil auditUtil;

	@Autowired
	private KafkaTemplate kafkaTemplate;

	@Value("${persister.audit.error.queue}")
	private String auditErrorTopic;

	@Value("${persister.audit.kafka.topic}")
	private String auditTopic;

	@Value("${persister.audit.user.jsonpath}")
	private String userJsonPath;

	@Transactional
	public void persist(String topic, String json) {

		Map<String, List<Mapping>> map = topicMap.getTopicMap();

		Object document = Configuration.defaultConfiguration().jsonProvider().parse(json);
		List<Mapping> applicableMappings = filterMappings(map.get(topic), document);
		log.info("{} applicable configs found!", applicableMappings.size());

		List<Map<String, Object>> keyValuePairList;

		for (Mapping mapping : applicableMappings) {

			List<AuditLog> auditLogs = new LinkedList<>();
			AuditAttributes auditAttributes = new AuditAttributes();
			Boolean isAuditEnabled = mapping.getIsAuditEnabled();

			if(isAuditEnabled == null){
				isAuditEnabled = false;
			}
			if(isAuditEnabled){

				// Fetch the values required to attribute using mapping and json
				String module = mapping.getModule();
				String tenantId = getValueFromJsonPath(mapping.getTenantIdJsonPath(), json);
				String transactionCode = getValueFromJsonPath(mapping.getTransactionCodeJsonPath(), json);
				String objectId = getValueFromJsonPath(mapping.getObjecIdJsonPath(), json);
				String userUUID = getValueFromJsonPath(userJsonPath, json);

				// Set the values to auditAttribute
				auditAttributes.setModule(module);
				auditAttributes.setObjectId(objectId);
				auditAttributes.setTenantId(tenantId);
				auditAttributes.setTransactionCode(transactionCode);
				auditAttributes.setUserUUID(userUUID);
			}



			List<QueryMap> queryMaps = mapping.getQueryMaps();
			for (QueryMap queryMap : queryMaps) {
				String query = queryMap.getQuery();
				List<JsonMap> jsonMaps = queryMap.getJsonMaps();
				String basePath = queryMap.getBasePath();
				keyValuePairList = persistRepository.persist(query, jsonMaps, document, basePath);
				/**
				 * The following code block will generate AuditLog objects for each query that is executed
				 */
				try {
					auditLogs.addAll(auditUtil.getAuditRecord(keyValuePairList, auditAttributes, query));

				}
				catch (Exception e){
					log.error("AUDIT_LOG_ERROR","Failed to create audit log for: "+keyValuePairList);
					AuditError auditError = AuditError.builder().mapping(mapping)
																.query(query)
																.keyValuePairList(keyValuePairList)
																.exception(e)
																.build();
					kafkaTemplate.send(auditErrorTopic, auditError);
				}
			}
			kafkaTemplate.send(auditTopic, auditLogs);
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
					persistRepository.persist(query, jsonMaps, jsonObj, basePath);

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

	/**
	 * Function to execute jsonPath on given json. Returns null in case of error
	 * @param jsonPath
	 * @param json
	 * @return
	 */
	private String getValueFromJsonPath(String jsonPath, String json){

		String value = null;
		try {
			value = JsonPath.read(json, jsonPath);
		}
		catch (Exception e){
			log.error("JSONPATH_ERROR","Error while executing jsonPath: ",jsonPath);
		}
		return value;
	}

}