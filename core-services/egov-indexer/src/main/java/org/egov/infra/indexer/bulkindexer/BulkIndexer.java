package org.egov.infra.indexer.bulkindexer;

import java.util.Map;

import org.egov.infra.indexer.util.IndexerUtils;
import org.egov.infra.indexer.web.contract.Index;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class BulkIndexer {

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private IndexerUtils indexerUtils;

	/**
	 * Methods that makes a REST API call to /_bulk API of the ES. This method
	 * triggers the listener orchestration method in case the ES cluster is down.
	 * 
	 * @param url
	 * @param indexJson
	 * @param index
	 * @throws Exception
	 */
	public void indexJsonOntoES(String url, String indexJson, Index index) throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		try {
			log.debug("Record being indexed: " + indexJson);
			final HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
			final HttpEntity<String> entity = new HttpEntity<>(indexJson, headers);
			Object response = restTemplate.postForObject(url.toString(), entity, Map.class);
			if (url.contains("_bulk")) {
				if (JsonPath.read(mapper.writeValueAsString(response), "$.errors").equals(true)) {
					log.info("Indexing FAILED!!!!");
					log.info("Response from ES: " + response);
				}
			}
		} catch (final ResourceAccessException e) {
			log.error("ES is DOWN, Pausing kafka listener.......");
			indexerUtils.orchestrateListenerOnESHealth();
		} catch (Exception e) {
			log.error("Exception while trying to index to ES. Note: ES is not Down.", e);
		}
	}

	/**
	 * Fetches mapping from es for a given index and type.
	 * 
	 * @param url
	 * @return
	 */
	public Object getIndexMappingfromES(String url) {
		Object response = null;
		try {
			log.debug("URI: " + url.toString());
			response = restTemplate.getForObject(url.toString(), Map.class);
		} catch (final ResourceAccessException e) {
			log.error("ES is DOWN, Pausing kafka listener.......");
			indexerUtils.orchestrateListenerOnESHealth();
		} catch (Exception e) {
			log.error("Exception while trying to fetch index mapping from ES. Note: ES is not Down.", e);
			return response;
		}
		log.debug("Mapping from ES: " + response);
		return response;

	}

	/**
	 * A common method to make API called ES for data retrieval, it can be used to
	 * get data from ES, modify settings of an index etc
	 * 
	 * @param url
	 * @param body
	 * @param httpMethod
	 * @return
	 */
	public Object getESResponse(String url, Object body, String httpMethod) {
		Object response = null;
		if (null != body) {
			if (httpMethod.equals("POST")) {
				try {
					response = restTemplate.postForObject(url, body, Map.class);
				} catch (Exception e) {
					log.error("POST: Exception while fetching from es: " + e);
				}
			} else if (httpMethod.equals("PUT")) {
				try {
					restTemplate.put(url, body);
					response = "OK";
				} catch (Exception e) {
					log.error("PUT: Exception while updating settings on es: " + e);
				}
			}
		} else {
			try {
				response = restTemplate.getForObject(url, Map.class);
			} catch (Exception e) {
				log.error("GET: Exception while fetching from es: " + e);
			}
		}
		return response;
	}

}
