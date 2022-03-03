package org.egov.infra.indexer.util;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.*;
import com.github.zafarkhaja.semver.UnexpectedCharacterException;
import com.github.zafarkhaja.semver.Version;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.egov.common.contract.request.RequestInfo;
import org.egov.infra.indexer.consumer.config.ReindexConsumerConfig;
import org.egov.infra.indexer.models.AuditDetails;
import org.egov.infra.indexer.producer.IndexerProducer;
import org.egov.infra.indexer.web.contract.*;
import org.egov.mdms.model.MasterDetail;
import org.egov.mdms.model.MdmsCriteria;
import org.egov.mdms.model.MdmsCriteriaReq;
import org.egov.mdms.model.ModuleDetail;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class IndexerUtils {

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private ReindexConsumerConfig kafkaConsumerConfig;

	private Version defaultSemVer;

	@Value("${default.service.map.version}")
	private String defaultVersion;


	@Value("${egov.infra.indexer.host}")
	private String esHostUrl;

	@Value("${elasticsearch.poll.interval.seconds}")
	private String pollInterval;

	@Value("${egov.mdms.host}")
	private String mdmsHost;

	@Value("${egov.mdms.search.endpoint}")
	private String mdmsEndpoint;

	@Value("${egov.service.host}")
	private String serviceHost;

	@Value("${egov.indexer.dss.collectionindex.topic}")
	private String dssTopicForCollection;

	@Value("${dss.collectionindex.topic.push.enabled}")
	private Boolean dssTopicPushEnabled;

	@Value("${topic.push.enabled}")
	private Boolean topicPushEnable;

	@Value("${id.timezone}")
	private String timezone;

	@Autowired
	private IndexerProducer producer;

	private ObjectMapper mapper = new ObjectMapper();

	private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

	/**
	 * A Poll thread that polls es for its status and keeps the kafka container
	 * paused until ES is back up. Once ES is up, container is resumed and all the
	 * stacked up records in the queue are processed.
	 *
	 */
	public void orchestrateListenerOnESHealth() {
		kafkaConsumerConfig.pauseContainer();
		log.info("Polling ES....");
		final Runnable esPoller = new Runnable() {
			boolean threadRun = true;

			public void run() {
				if (threadRun) {
					Object response = null;
					try {
						StringBuilder url = new StringBuilder();
						url.append(esHostUrl).append("/_search");
						response = restTemplate.getForObject(url.toString(), Map.class);
					} catch (Exception e) {
						log.error("ES is DOWN..");
					}
					if (response != null) {
						log.info("ES is UP!");
						kafkaConsumerConfig.startContainer();
						threadRun = false;
					}
				}
			}
		};
		scheduler.scheduleAtFixedRate(esPoller, 0, Long.valueOf(pollInterval), TimeUnit.SECONDS);
	}

	/**
	 * Helper method in data transformation
	 *
	 * @param jsonString
	 * @return
	 */
	public String pullArrayOutOfString(String jsonString) {
		String[] array = jsonString.split(":");
		StringBuilder jsonArray = new StringBuilder();
		for (int i = 1; i < array.length; i++) {
			jsonArray.append(array[i]);
			if (i != array.length - 1)
				jsonArray.append(":");
		}
		jsonArray.deleteCharAt(jsonArray.length() - 1);

		return jsonArray.toString();
	}

	/**
	 * Helper method in data transformation
	 *
	 * @param object
	 * @return
	 */
	public String buildString(Object object) {
		// JsonPath cannot be applied on the type JSONObject. String has to be built of
		// it and then used.
		String[] array = object.toString().split(":");
		StringBuilder jsonArray = new StringBuilder();
		for (int i = 0; i < array.length; i++) {
			jsonArray.append(array[i]);
			if (i != array.length - 1)
				jsonArray.append(":");
		}
		return jsonArray.toString();
	}

	/**
	 * A part of use-case where custom object it to be indexed. This method builds
	 * the uri for external service call based on config.
	 *
	 * @param uriMapping
	 * @param kafkaJson
	 * @return
	 */
	public String buildUri(UriMapping uriMapping, String kafkaJson) {
		StringBuilder serviceCallUri = new StringBuilder();
		String uriWithPathParam = null;
		if (!StringUtils.isEmpty(uriMapping.getPath())) {
			uriWithPathParam = uriMapping.getPath();
			if (!StringUtils.isEmpty(uriMapping.getPathParam())) {
				uriWithPathParam = uriWithPathParam.replace("$",
						JsonPath.read(kafkaJson, uriMapping.getPathParam()).toString());
			}
			serviceCallUri.append(uriWithPathParam);
			if (!StringUtils.isEmpty(uriMapping.getQueryParam())) {
				String[] queryParamsArray = uriMapping.getQueryParam().split(",");
				for (int i = 0; i < queryParamsArray.length; i++) {
					String[] queryParamExpression = queryParamsArray[i].trim().split("=");
					Object queryParam = null;
					try {
						if (queryParamExpression[1].trim().contains("$.")) {
							queryParam = JsonPath.read(kafkaJson, queryParamExpression[1].trim());
						} else {
							queryParam = queryParamExpression[1].trim();
						}
					} catch (Exception e) {
						log.error("Error while building URI: " + e.getMessage());
						continue;
					}
					StringBuilder resolvedParam = new StringBuilder();
					if (queryParam instanceof List) {
						StringBuilder values = new StringBuilder();
						for (Object param : (List) queryParam) {
							if (StringUtils.isEmpty(values.toString())) {
								values.append(param.toString());
							} else {
								values.append(",").append(param.toString());
							}
						}
						queryParam = values.toString();
					}
					if(null == queryParam) {
						log.error("No value found for queryParam {}", queryParamsArray[i]);
						continue;
					}
					resolvedParam.append(queryParamExpression[0].trim()).append("=")
							.append(queryParam.toString().trim());
					queryParamsArray[i] = resolvedParam.toString().trim();
				}
				StringBuilder queryParams = new StringBuilder();
				for (int i = 0; i < queryParamsArray.length; i++) {
					queryParams.append(queryParamsArray[i]);
					if (i != queryParamsArray.length - 1)
						queryParams.append("&");
				}
				serviceCallUri.append("?").append(queryParams.toString());
			}
		} else {
			serviceCallUri.append(uriMapping.getPath());
		}
		return serviceCallUri.toString();
	}


	@Cacheable(value = "masterData", sync = true)
	public Object fetchMdmsData(String uri, String tenantId, String moduleName, String masterName, String filter) {
		MasterDetail masterDetail = org.egov.mdms.model.MasterDetail.builder().name(masterName)
				.filter(filter).build();
		List<MasterDetail> masterDetails = new ArrayList<>();
		masterDetails.add(masterDetail);
		ModuleDetail moduleDetail = ModuleDetail.builder().moduleName(moduleName)
				.masterDetails(masterDetails).build();
		List<ModuleDetail> moduleDetails = new ArrayList<>();
		moduleDetails.add(moduleDetail);
		MdmsCriteria mdmsCriteria = MdmsCriteria.builder().tenantId(tenantId)
				.moduleDetails(moduleDetails).build();

		RequestInfo requestInfo = new RequestInfo();
		MdmsCriteriaReq req = MdmsCriteriaReq.builder().requestInfo(requestInfo).mdmsCriteria(mdmsCriteria).build();

		return restTemplate.postForObject(uri, req, Map.class);
	}


	/**
	 * Method that builds filter for mdms.
	 *
	 * @param mdmsMppings
	 * @param kafkaJson
	 * @return
	 */
	public String buildFilter(UriMapping mdmsMppings, String kafkaJson) {
		String modifiedFilter = mdmsMppings.getFilter();
		log.debug("buildfilter, kafkaJson: " + kafkaJson);
		for (FilterMapping mdmsMapping : mdmsMppings.getFilterMapping()) {
			Object value = JsonPath.read(kafkaJson, mdmsMapping.getValueJsonpath());
			if (null == value) {
				log.info("MDMS filter, No value found at: " + mdmsMapping.getValueJsonpath());
				continue;
			} else if (value.toString().startsWith("[") && value.toString().endsWith("]")) {
				value = value.toString().substring(1, value.toString().length() - 1);
			}
			modifiedFilter = modifiedFilter.replace(mdmsMapping.getVariable(), "'" + value.toString() + "'");
		}
		return modifiedFilter;
	}

	/**
	 * Helper method that builds id for the index while bulk indexing.
	 *
	 * @param index
	 * @param stringifiedObject
	 * @return
	 */
	public String buildIndexId(Index index, String stringifiedObject) {
		String[] idFormat = index.getId().split("[,]");
		StringBuilder id = new StringBuilder();
		try {
			if (0 == idFormat.length) {
				id.append(JsonPath.read(stringifiedObject, index.getId()).toString());
			} else {
				for (int j = 0; j < idFormat.length; j++) {
					String fieldVaue = JsonPath.read(stringifiedObject, idFormat[j]);
					if(fieldVaue !=null)
						id.append(fieldVaue);
				}
				if(id.toString().equals("")){
					log.error("No id found at the given jsonpath: all id fields returned empty");
					return null;
				}
			}
		} catch (Exception e) {
			log.error("No id found at the given jsonpath: ", e);
			return null;
		}
		return id.toString();
	}

	/**
	 * Helper method for data transformation.
	 *
	 * @param kafkaJson
	 * @param index
	 * @param isBulk
	 * @return
	 * @throws Exception
	 */
	public JSONArray constructArrayForBulkIndex(String kafkaJson, Index index, boolean isBulk) throws Exception {
		JSONArray kafkaJsonArray = null;
		try {
			if (isBulk) {
				// Validating if the request is a valid json array.
				if (null != index.getJsonPath()) {
					if (JsonPath.read(kafkaJson, index.getJsonPath()) instanceof net.minidev.json.JSONArray) {
						String inputArray = mapper.writeValueAsString(JsonPath.read(kafkaJson, index.getJsonPath()));
						kafkaJsonArray = new JSONArray(inputArray);
					}
				} else if (pullArrayOutOfString(kafkaJson).startsWith("[")
						&& pullArrayOutOfString(kafkaJson).endsWith("]")) {
					kafkaJsonArray = new JSONArray(pullArrayOutOfString(kafkaJson));
				} else {
					log.info("Invalid request for a json array!");
					return null;
				}
			} else {
				String jsonArray = null;
				if (null != index.getJsonPath()) {
					kafkaJson = mapper.writeValueAsString(JsonPath.read(kafkaJson, index.getJsonPath()));
					jsonArray = "[" + kafkaJson + "]";
				} else {
					jsonArray = "[" + kafkaJson + "]";
				}
				kafkaJsonArray = new JSONArray(jsonArray);
			}
		} catch (Exception e) {
			log.error("Exception while constructing json array for bulk index: ", e);
			log.error("Object: " + kafkaJson);
			throw e;
		}
		return transformData(index, kafkaJsonArray);
	}


	/**
	 * Helper method that returns jsonpath and key from a given jsonpath string. This reqd while using DocumentContext
	 * @param jsonPath
	 * @return
	 */
	public String getProcessedJsonPath(String jsonPath) {
		String[] expressionArray = (jsonPath).split("[.]");
		StringBuilder expression = new StringBuilder();
		for (int i = 0; i < (expressionArray.length - 1); i++) {
			expression.append(expressionArray[i]);
			if (i != expressionArray.length - 2)
				expression.append(".");
		}
		return expression.toString();
	}

	/**
	 * Helper method to get search url for es
	 * @param reindexRequest
	 * @return
	 */
	public String getESSearchURL(ReindexRequest reindexRequest) {
		StringBuilder uri = new StringBuilder();
		uri.append(esHostUrl).append(reindexRequest.getIndex()).append("/" + reindexRequest.getType())
				.append("/_search");
		return uri.toString();
	}

	/**
	 * Helper method to get settings url for es
	 * @param reindexRequest
	 * @return
	 */
	public String getESSettingsURL(ReindexRequest reindexRequest) {
		StringBuilder uri = new StringBuilder();
		uri.append(esHostUrl).append(reindexRequest.getIndex()).append("/_settings");
		return uri.toString();
	}

	/**
	 * Helper method to get search body
	 * @param from
	 * @param size
	 * @return
	 */
	public Object getESSearchBody(Integer from, Integer size) {
		Map<String, Integer> searchBody = new HashMap<>();
		searchBody.put("from", from);
		searchBody.put("size", size);
		return searchBody;
	}

	/**
	 * Helper method to get settings body
	 * @param totalRecords
	 * @return
	 */
	public Object getESSettingsBody(Integer totalRecords) {
		Map<String, Map<String, Long>> settingsBody = new HashMap<>();
		Map<String, Long> innerBody = new HashMap<>();
		Long window = Long.valueOf(totalRecords.toString()) + 50000L;
		innerBody.put("max_result_window", window);
		settingsBody.put("index", innerBody);
		return settingsBody;
	}

	/**
	 * Modifies dynamic mapping property of an index on es.
	 * @param index
	 * @return
	 */
	public String setDynamicMapping(Index index) {
		String requestTwo = "{ \"settings\": {\"index.mapping.ignore_malformed\": true}}";
		StringBuilder uriForUpdateMapping = new StringBuilder();
		uriForUpdateMapping.append(esHostUrl).append(index.getName()).append("/_settings");
		try {
			restTemplate.put(uriForUpdateMapping.toString(), requestTwo, Map.class);
			return "OK";
		} catch (Exception e) {
			log.error("Updating mapping failed for index: " + index.getName() + " and type: " + index.getType());
			log.error("Trace: ", e);
			return null;
		}

	}

	/**
	 * Helper method in transforming data to es readable form.
	 *
	 * @param index
	 * @param kafkaJsonArray
	 * @return
	 */
	public JSONArray transformData(Index index, JSONArray kafkaJsonArray) {
		JSONArray tranformedArray = new JSONArray();
		for (int i = 0; i < kafkaJsonArray.length(); i++) {
			try {
				if (null != kafkaJsonArray.get(i)) {
					if (!kafkaJsonArray.get(i).toString().equals("null")) {
						DocumentContext context = null;
						try {
							context = JsonPath.parse(kafkaJsonArray.get(i).toString());
							context = maskFields(index, context);
							context = addTimeStamp(index, context);
							tranformedArray.put(context.jsonString());
						} catch (Exception e) {
							log.error("Exception while transforiming data: ", e);
							log.info("Data: " + kafkaJsonArray.get(i));
							continue;
						}
					} else {
						log.info("null json in kafkaJsonArray, index: " + i);
						continue;
					}
				} else {
					log.info("null json in kafkaJsonArray, index: " + i);
					continue;
				}
			} catch (Exception e) {
				log.error("Exception while transforiming data: ", e);
				continue;
			}
		}
		if (tranformedArray.length() != kafkaJsonArray.length()) {
			return kafkaJsonArray;
		}
		return tranformedArray;
	}

	/**
	 * Method to mask fields as mentioned in the config
	 *
	 * @param index
	 * @param context
	 * @return
	 */
	public DocumentContext maskFields(Index index, DocumentContext context) {
		if (!CollectionUtils.isEmpty(index.getFieldsToBeMasked())) {
			for (String fieldJsonPath : index.getFieldsToBeMasked()) {
				try {
					String[] expressionArray = (fieldJsonPath).split("[.]");
					String expression = getProcessedJsonPath(fieldJsonPath);
					context.put(expression, expressionArray[expressionArray.length - 1], "XXXXXXXX");
				} catch (Exception e) {
					log.error("Exception while masking field: ", e);
					log.error("Data: " + context.jsonString());
				}
			}
			return context;
		} else {
			return context;
		}
	}

	/**
	 * Method to add timestamp at the root level as mentioned in the config.
	 *
	 * @param index
	 * @param context
	 * @return
	 */
	public DocumentContext addTimeStamp(Index index, DocumentContext context) {
		try {
			String epochValue = mapper
					.writeValueAsString(JsonPath.read(context.jsonString(), index.getTimeStampField()));
			if(null == epochValue) {
				log.info("NULL found in place of timestamp field.");
				return context;
			}
			Date date = new Date(Long.valueOf(convertEpochToLong(epochValue)));
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
			formatter.setTimeZone(TimeZone.getTimeZone(timezone));
			context.put("$", "@timestamp", formatter.format(date));
		} catch (Exception e) {
			log.error("Exception while adding timestamp: ",e);
			log.error("Time stamp field: "+index.getTimeStampField());
		}

		return context;

	}

	/**
	 * Method to encode non ascii characters.
	 *
	 * @return
	 */
	public String encode(String stringToBeEncoded) {
		String encodedString = null;
		try {
			encodedString = getObjectMapper().writeValueAsString(stringToBeEncoded);
		} catch (Exception e) {
			log.error("Exception while encoding non ascii characters ", e);
			log.error("Data: " + stringToBeEncoded);
			encodedString = stringToBeEncoded;
		}
		return encodedString;
	}

	/**
	 * Returns mapper with all the appropriate properties reqd in our
	 * functionalities.
	 *
	 * @return ObjectMapper
	 */
	public ObjectMapper getObjectMapper() {
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);
		mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
		mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
		mapper.getFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);
		return mapper;
	}

	/**
	 * Returns mapper with all the appropriate properties reqd in our
	 * functionalities.
	 * Includes null values
	 * @return ObjectMapper
	 */
	public ObjectMapper getObjectMapperWithNull() {
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		mapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);
		mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
		mapper.getFactory().configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);
		return mapper;
	}

	/**
	 * Util method to return Auditdetails for create and update processes
	 *
	 * @param by
	 * @param isCreate
	 * @return
	 */
	public AuditDetails getAuditDetails(String by, Boolean isCreate) {
		Long dt = new Date().getTime();
		if (isCreate)
			return AuditDetails.builder().createdBy(by).createdTime(dt).lastModifiedBy(by).lastModifiedTime(dt).build();
		else
			return AuditDetails.builder().lastModifiedBy(by).lastModifiedTime(dt).build();
	}

	/**
	 * Method to fetch estimated time for the indexing to finish
	 *
	 * @param totalRecords
	 * @return
	 */
	public String fetchEstimatedTime(Integer totalRecords) {
		StringBuilder estimatedTime = new StringBuilder();
		Double actualTime = totalRecords * 0.000250; // on an avg one record gets reindexed in 0.000125s.
		if (actualTime > 60) {
			Double mins = actualTime / 60;
			Double seconds = actualTime % 60;
			estimatedTime.append(mins).append("mins ").append(seconds).append("secs");
		} else if (actualTime < 1) {
			estimatedTime.append("less than a second");
		} else {
			estimatedTime.append(actualTime).append("secs");
		}
		return estimatedTime.toString();
	}

	/**
	 * Helper method to build uri for paged search
	 *
	 * @param apiDetails
	 * @param offset
	 * @param size
	 * @return
	 */
	public String buildPagedUriForLegacyIndex(APIDetails apiDetails, Integer offset, Integer size) {
		StringBuilder url = new StringBuilder();
		if (apiDetails.getUri().contains("http://") || apiDetails.getUri().contains("https://"))
			url.append(apiDetails.getUri());
		else
			url.append(serviceHost).append(apiDetails.getUri());

		String offsetKey = null;
		String sizeKey = null;
		offsetKey = null != apiDetails.getPaginationDetails().getOffsetKey()
				? apiDetails.getPaginationDetails().getOffsetKey()
				: "offset";
		sizeKey = null != apiDetails.getPaginationDetails().getSizeKey()
				? apiDetails.getPaginationDetails().getSizeKey()
				: "size";
		if (!StringUtils.isEmpty(apiDetails.getTenantIdForOpenSearch()))
			url.append("?tenantId=").append(apiDetails.getTenantIdForOpenSearch())
					.append("&" + offsetKey + "=" + offset).append("&" + sizeKey + "=" + size);
		else
			url.append("?" + offsetKey + "=" + offset).append("&" + sizeKey + "=" + size);

		if(!StringUtils.isEmpty(apiDetails.getCustomQueryParam())) {
			url.append("&").append(apiDetails.getCustomQueryParam());
		}

		return url.toString();
	}

	/**
	 * Helper method in transformation
	 *
	 * @param s
	 * @return
	 */
	public String splitCamelCase(String s) {
		return s.replaceAll(String.format("%s|%s|%s", "(?<=[A-Z])(?=[A-Z][a-z])", "(?<=[^A-Z])(?=[A-Z])",
				"(?<=[A-Za-z])(?=[^A-Za-z])"), " ");
	}

	/**
	 * Method to convert double with scientific precision to plain long
	 * ex:- 1.5534533434E10-->15534533434
	 *
	 * @param value
	 * @return
	 */
	public String convertEpochToLong(String value){
		DecimalFormat df = new DecimalFormat("#");
		df.setMaximumFractionDigits(0);
		return df.format(Double.valueOf(value));
	}


	/**
	 * For the sake of DSS, collections data is being used from a different index.
	 * This method pushes only the collections data to a different topic, for the dss ingest to pick.
	 *
	 * @param enrichedObject
	 * @param index
	 */
	public void pushCollectionToDSSTopic(String key, String enrichedObject, Index index) {
		if(dssTopicPushEnabled) {
			if(index.getName().contains("collection") || index.getName().contains("payment")) {
				log.info("Index name: "+ index.getName());
				log.info("Pushing collections data to the DSS topic: "+dssTopicForCollection);
				try{
					JsonNode enrichedObjectNode = new ObjectMapper().readTree(enrichedObject);
					producer.producer(dssTopicForCollection, enrichedObjectNode);
					producer.producer(index.getName() + "-" + "enriched", key, enrichedObjectNode);
				} catch (IOException e){
					log.error("Failed pushing collections data to the DSS topic: "+dssTopicForCollection);

				}
			}
		}
	}

	public void pushToKafka(String key, String enrichedObject, Index index) {
		// skip collection and payment since already handled in pushCollectionToDSSTopic()
		if (topicPushEnable && !index.getName().contains("collection") && !index.getName().contains("payment")) {
			String topicName = index.getName() + "-" + "enriched";
			try {
				JsonNode enrichedObjectNode = getObjectMapper().readTree(enrichedObject);
				producer.producer(topicName, key, enrichedObjectNode);
			} catch (IOException e) {
				log.error("Failed pushing data to the ES topic: " + topicName);
			}
		}
	}

	@PostConstruct
	private void init(){
		defaultSemVer = Version.valueOf(defaultVersion);
	}

	public Version getSemVer(String version) {
		try {
			if(version == null || version.equals("")) {
				log.info("No version present in the API request, falling back to default version: " + defaultSemVer.toString());
				return defaultSemVer;
			}
			else {
				log.info("Version found in API request: " + version);
				return Version.valueOf(version);
			}
		}catch (UnexpectedCharacterException e){
			return defaultSemVer;
		}
	}
}
