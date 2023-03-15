package com.ingestpipeline.service;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ingestpipeline.model.SourceReferences;
import com.ingestpipeline.model.TargetReferences;
import org.apache.tomcat.util.codec.binary.Base64;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.google.common.hash.Hashing;
import com.ingestpipeline.config.DomainConfig;
import com.ingestpipeline.config.DomainConfigFactory;
import com.ingestpipeline.configfactory.CollectionDomainConfig;
import com.ingestpipeline.configfactory.EnhanceDomainConfig;
import com.ingestpipeline.model.DomainIndexConfig;
import com.ingestpipeline.model.TargetData;
import com.ingestpipeline.repository.ElasticSearchRepository;
import com.ingestpipeline.repository.TargetDataDao;
import com.ingestpipeline.util.Constants;
import com.ingestpipeline.util.JSONUtil;

/**
 * This is a Service Implementation for all the actions which are with respect
 * to Elastic Search
 * 
 * @author Darshan Nagesh
 *
 */
@Service(Constants.Qualifiers.ENRICHMENT_SERVICE)
public class EnrichmentServiceImpl implements EnrichmentService {

	public static final Logger LOGGER = LoggerFactory.getLogger(EnrichmentServiceImpl.class);
	private static final String SEPARATOR = "_";
	private static final String JSON_EXTENSION = ".json";
	private static final String OBJECTIVE = "enrichment";
	private final String indexServiceHost;
	private final String userName;
	private final String password;
	private final String elasticSearchIndexName;
	private final String elasticSearchDocumentType;

	private static final String AUTHORIZATION = "Authorization";
	private static final String US_ASCII = "US-ASCII";
	private static final String BASIC_AUTH = "Basic %s";

	private static final String BUSINESS_SERVICE = "businessService";
	private static final String DATA_OBJECT = "dataObject";
	private static final String DATA_CONTEXT = "dataContext";
	private static final String DATA_ENHANCEMENT = "dataEnhancement";
	private static final String TENANTID = "tenantId";
	private static final String MCOLLECT = "MCOLLECT";

	@Autowired
	private ElasticSearchRepository elasticRepository;

	@Autowired
	private CollectionDomainConfig collectionDomainConfig;
	
	@Autowired 
	private DomainConfigFactory domainConfigFactory; 

	@Autowired
	private IESService elasticService;

	@Autowired
	private TargetDataDao targetDataDao;

	@Autowired
	private EnrichTransform enrichTransform;
	
	@Autowired
	private JSONUtil util;

	public EnrichmentServiceImpl(@Value("${services.esindexer.host}") String indexServiceHost,
			@Value("${services.esindexer.username}") String userName,
			@Value("${services.esindexer.password}") String password,
			@Value("${es.index.name}") String elasticSearchIndexName,
			@Value("${es.document.type}") String elasticSearchDocumentType, JSONUtil util) {
		this.indexServiceHost = indexServiceHost;
		this.userName = userName;
		this.password = password;
		this.elasticSearchIndexName = elasticSearchIndexName;
		this.elasticSearchDocumentType = elasticSearchDocumentType;
		this.util=util;
	}

	@Override
	public Map enrichData(Map incomingData) {
		
		Map<String,Object> dataObject = new ObjectMapper().convertValue(incomingData.get(DATA_OBJECT), Map.class);
		String tenantId = dataObject.get(TENANTID).toString();
		
		List<String> mCollectCategories = util.fetchMCollectCategories(tenantId);

		DomainConfig domainConfig = domainConfigFactory.getConfiguration(incomingData.get(DATA_CONTEXT).toString());
		LOGGER.info("domainConfig ## "+domainConfig);

		if(domainConfig instanceof CollectionDomainConfig) {
			// prepare the query required based on incoming data businessType
			ObjectNode incomingNode = new ObjectMapper().convertValue(incomingData.get(DATA_OBJECT), ObjectNode.class);
			ObjectNode copyNode = incomingNode.deepCopy();
			String businessTypeVal = copyNode.findValue(BUSINESS_SERVICE).asText();
			
			for(String category : mCollectCategories) {
				if(category.equalsIgnoreCase(businessTypeVal)) {
					businessTypeVal = MCOLLECT;
					break;
				}
			}

			DomainIndexConfig indexConfig = domainConfig.getIndexConfig(businessTypeVal.toString());
			LOGGER.info("indexConfig ## "+indexConfig);
			if(indexConfig != null){
				String indexName = indexConfig.getIndexName();

				String query = indexConfig.getQuery();					

				try {
					ObjectNode queryNode = new ObjectMapper().readValue(query, ObjectNode.class);

					Map<String, Object> expValMap = new HashMap<>();
					// Source references to be prepare a map of fieldName & value
					for (SourceReferences ref : indexConfig.getSourceReferences()){
						String arg = ref.getFieldName();
						String argVal = copyNode.findValue(arg).asText();
						String[] values = argVal.split(ref.getSeperator());

						String[] exps = ref.getExpression().split(ref.getSeperator());		

						for(int i=0; i<exps.length; i++){
							if(values[i] != null)
								expValMap.put(exps[i], values[i]);
						}
					}

					// To use produce the value of fieldNames and replace the query field value
					for (TargetReferences ref : indexConfig.getTargetReferences()) {
						String[] exps = ref.getExpression().split(ref.getSeperator());

						StringBuffer buff = new StringBuffer();
						for(String exp : exps){
							buff.append(expValMap.get(exp)+ref.getSeperator());
						}
						ref.setValue(buff.substring(0,buff.length()-1));
						JSONUtil.replaceFieldValue(queryNode, ref.getArgument(), ref.getValue());

					}
					LOGGER.info("Query node "+ queryNode);
					Map domainNode = elasticService.search(indexName, queryNode.toString());
					if(domainNode != null){
						Object transDomainResponse = enrichTransform.transform(domainNode, businessTypeVal.toString());
						incomingData.put("domainObject", transDomainResponse);
						enhanceData(incomingData);

					} else {
						LOGGER.info("Fetching record from ES for domain:: {} failed ",  businessTypeVal);
					}
					LOGGER.info("Data Transformed");

				} catch (Exception e) {
					LOGGER.error("Pre-processing enrichment - failed  :: {}" , e.getMessage());
				}
			} else {
				LOGGER.info("No indexConfig for businessType::  {}",businessTypeVal);
			}

		}
		if (incomingData.get(DATA_CONTEXT).toString().equalsIgnoreCase("target")) {
			ArrayNode values = new ObjectMapper().convertValue(incomingData.get(Constants.DATA_OBJECT), ArrayNode.class);
			//System.out.println("incomingData 1209 values " + values);

			values.forEach(val -> {
				TargetData targetData = new ObjectMapper().convertValue(val, TargetData.class);
				String hashId = targetData.getFinancialYear() + "-" + targetData.getBusinessService()+"-"+targetData.getUlbName();
				hashId = hashId.replaceAll("(\\s)+", "");
				String sha256hex = Hashing.sha256().hashString(hashId, StandardCharsets.UTF_8).toString();
				targetData.setId(sha256hex.hashCode());
				//targetData.setId(hashId);
				try{
					elasticService.push(targetData);
				}catch (Exception e ){
					LOGGER.error("Exception occurred while pushing data to ES: " + e.getMessage());
				}

			});
		} 

		return incomingData;
	}

	private Boolean pushToElasticSearchIndex(Object object) {
		Long currentDateTime = new Date().getTime();
		String url = String.format("%s%s/%s/%s", this.indexServiceHost, elasticSearchIndexName,
				elasticSearchDocumentType, currentDateTime);
		HttpHeaders headers = getHttpHeaders();
		LOGGER.info("Data Object to be added to ES : " + object);
		LOGGER.info("URL to invoke : " + url);
		elasticRepository.saveMyDataObject(object, url, headers);
		return Boolean.TRUE;
	}

	/**
	 * A helper method to create the headers for Rest Connection with UserName and
	 * Password
	 * 
	 * @return HttpHeaders
	 */
	private HttpHeaders getHttpHeaders() {
		HttpHeaders headers = new HttpHeaders();
		headers.add(AUTHORIZATION, getBase64Value(userName, password));
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
		headers.setContentType(MediaType.APPLICATION_JSON);
		return headers;
	}

	/**
	 * Helper Method to create the Base64Value for headers
	 * 
	 * @param userName
	 * @param password
	 * @return
	 */
	private String getBase64Value(String userName, String password) {
		String authString = String.format("%s:%s", userName, password);
		byte[] encodedAuthString = Base64.encodeBase64(authString.getBytes(Charset.forName(US_ASCII)));
		return String.format(BASIC_AUTH, new String(encodedAuthString));
	}
	
	/**
	 * This method used to add the external index data into the es index
	 * 
	 * @param incomingData
	 * @return
	 */
	private Map enhanceData(Map incomingData) {
		DomainConfig domainConfig = domainConfigFactory.getConfiguration(DATA_ENHANCEMENT);
		LOGGER.info("enhanceDomainConfig ## "+domainConfig);

		if(domainConfig instanceof EnhanceDomainConfig	) {
			// prepare the query required based on incoming data businessType
			ObjectNode incomingNode = new ObjectMapper().convertValue(incomingData.get(DATA_OBJECT), ObjectNode.class);
			ObjectNode copyNode = incomingNode.deepCopy();
			String businessTypeVal = copyNode.findValue(BUSINESS_SERVICE).asText();

			DomainIndexConfig indexConfig = domainConfig.getIndexConfig(businessTypeVal.toString());
			LOGGER.info("indexConfig ## "+indexConfig);
			if(indexConfig != null){
				String indexName = indexConfig.getIndexName();
				String query = indexConfig.getQuery();
							

				try {
					ObjectNode queryNode = new ObjectMapper().readValue(query, ObjectNode.class);
					LOGGER.info("queryNode 114 ## "+queryNode.toString());

					Map<String, Object> expValMap = new HashMap<>();
					// Source references to be prepare a map of fieldName & value
					for (SourceReferences ref : indexConfig.getSourceReferences()){
						String arg = ref.getFieldName();
						LOGGER.info("arg350## " + arg);
						String argVal = copyNode.findValue(arg).asText();
						String[] values = argVal.split(ref.getSeperator());
						String[] exps = ref.getExpression().split(ref.getSeperator());
						
						for(int i=0; i<exps.length; i++){
							if(i < values.length && values[i] != null)
								expValMap.put(exps[i], values[i]);
						}
					}

					// To use produce the value of fieldNames and replace the query field value
					for (TargetReferences ref : indexConfig.getTargetReferences()) {
						String[] exps = ref.getExpression().split(ref.getSeperator());

						StringBuffer buff = new StringBuffer();
						for(String exp : exps){
							buff.append(expValMap.get(exp)+ref.getSeperator());
						}
						ref.setValue(buff.substring(0,buff.length()-1));
						JSONUtil.replaceFieldValue(queryNode, ref.getArgument(), ref.getValue());

					}
					LOGGER.info("Enhance Query node "+ queryNode);
					List domainNode = elasticService.searchMultiple(indexName, queryNode.toString());
					if(domainNode != null){
						Object transDomainResponse = enrichTransform.transformEnhanceData(domainNode, businessTypeVal.toString());
						Object domainObject = incomingData.get("domainObject");
						Map domainMap = (Map) domainObject;
						domainMap.put("assessmentsDetails", transDomainResponse);

					} else {
						LOGGER.info("Fetching record from ES for domain:: {} failed ",  businessTypeVal);
					}
					LOGGER.info("Enhance Data Transformed");

				} catch (Exception e) {
					LOGGER.error("Pre-processing Enhance data - failed  :: {}" , e.getMessage());
				}
			} else {
				LOGGER.info("No enhance indexConfig for businessType::  {}",businessTypeVal);
			}

		}

		return incomingData;
	}

}
