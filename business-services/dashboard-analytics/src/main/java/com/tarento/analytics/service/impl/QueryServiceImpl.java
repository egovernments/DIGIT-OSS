package com.tarento.analytics.service.impl;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.egov.tracer.model.CustomException;
import org.elasticsearch.action.search.MultiSearchResponse;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.search.aggregations.Aggregation;
import org.elasticsearch.search.aggregations.Aggregations;
import org.elasticsearch.search.aggregations.bucket.terms.ParsedLongTerms;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.aggregations.metrics.avg.ParsedAvg;
import org.elasticsearch.search.aggregations.metrics.sum.ParsedSum;
import org.elasticsearch.search.aggregations.metrics.valuecount.ParsedValueCount;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tarento.analytics.ConfigurationLoader;
import com.tarento.analytics.constant.Constants;
import com.tarento.analytics.dao.ElasticSearchDao;
import com.tarento.analytics.dto.AggregateRequestDto;
import com.tarento.analytics.dto.AggregateRequestDto;
import com.tarento.analytics.enums.ChartType;
import com.tarento.analytics.exception.AINException;
import com.tarento.analytics.model.ElasticSearchDictator;
import com.tarento.analytics.model.KeyData;
import com.tarento.analytics.model.Query;
import com.tarento.analytics.model.ServiceQuery;
import com.tarento.analytics.service.QueryService;
import com.tarento.analytics.utils.ElasticProperties;

@Component
public class QueryServiceImpl implements QueryService {
	
	public static final Logger logger = LoggerFactory.getLogger(QueryServiceImpl.class);


	@Autowired
	private ElasticSearchDao elasticSearchDao;
	

	@Autowired
    private ConfigurationLoader configurationLoader;

	private static final Map<Integer, String> WeekDayMap = createMap();

	private static Map<Integer, String> createMap() {
		Map<Integer, String> result = new HashMap<Integer, String>();
		result.put(1, "SUN");
		result.put(2, "MON");
		result.put(3, "TUE");
		result.put(4, "WED");
		result.put(5, "THU");
		result.put(6, "FRI");
		result.put(7, "SAT");

		return Collections.unmodifiableMap(result);
	}



	@SuppressWarnings("unchecked")
	void getAggregateLabelRecursively(Map<String, Object> queryMap, Map<String, String> labelMap ){
		try { 
			if(queryMap.containsKey(ElasticProperties.Query.AGGREGATION_CONDITION.toLowerCase())){
				
				Map<String, Object> valueMap =(HashMap<String, Object>)queryMap.get(ElasticProperties.Query.AGGREGATION_CONDITION.toLowerCase());
				getAggregateLabelRecursively(valueMap, labelMap);
			}
			for (Map.Entry<String, Object> itrQuery : queryMap.entrySet()) {
				if(itrQuery.getKey().equals(ElasticProperties.Query.AGGREGATION_CONDITION.toLowerCase())){
					continue;
				}
				Map<String, Object> propertiesMap = (HashMap<String, Object>)itrQuery.getValue();
				labelMap.put(itrQuery.getKey(), propertiesMap.get(ElasticProperties.Query.LABEL.toLowerCase()).toString());
			}
		} catch (Exception e) {
			logger.error("Encountered an Exception : " + e.getMessage());
		}
	}



	@Override
	public ObjectNode getChartConfigurationQuery(AggregateRequestDto request, JsonNode query, String indexName, String interval) {
		String aggrQuery = query.get(Constants.JsonPaths.AGGREGATION_QUERY).asText();
		if(interval!=null && !interval.isEmpty())
			aggrQuery = aggrQuery.replace(Constants.JsonPaths.INTERVAL_VAL, interval);
		String rqMs = query.get(Constants.JsonPaths.REQUEST_QUERY_MAP).asText();
		String dateReferenceField = query.get(Constants.JsonPaths.DATE_REF_FIELD).asText(); 
		JsonNode requestQueryMaps = null;
		ObjectNode objectNode = null; 
		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> esFilterMap = new HashMap<>();
	    try {
			requestQueryMaps = new ObjectMapper().readTree(rqMs);
			request.setEsFilters(esFilterMap);
			if(query.get(Constants.JsonPaths.MODULE).asText().equals(Constants.Modules.COMMON) && 
					!request.getModuleLevel().equals(Constants.Modules.HOME_REVENUE) &&
					!request.getModuleLevel().equals(Constants.Modules.HOME_SERVICES)) { 
				request.getFilters().put(Constants.Filters.MODULE, request.getModuleLevel()); 
			}
			Iterator<Entry<String, Object>> filtersItr = request.getFilters().entrySet().iterator();
			while(filtersItr.hasNext()) { 
				Entry<String, Object> entry = filtersItr.next();
				if(null != requestQueryMaps.get(entry.getKey()) && !String.valueOf(entry.getValue()).equals(Constants.Filters.FILTER_ALL)) {
					// Filters in put filters are added as esfilters usign mapping in requestQueryMap
					String esQueryKey = requestQueryMaps.get(entry.getKey()).asText();
					request.getEsFilters().put(esQueryKey, entry.getValue());
				}
			}

			ElasticSearchDictator dictator = elasticSearchDao.createSearchDictatorV2(request, indexName, "", dateReferenceField);

			SearchRequest searchRequest = elasticSearchDao.buildElasticSearchQuery(dictator);
			JsonNode querySegment = mapper.readTree(searchRequest.source().toString());
			objectNode = (ObjectNode) querySegment;
			objectNode.put(Constants.JsonPaths.AGGS, mapper.readTree(aggrQuery).get(Constants.JsonPaths.AGGS));
		} catch (Exception ex) {
			logger.error("Encountered an Exception while parsing the JSON : " + ex.getMessage());
			throw new CustomException("JSON_PARSING_ERROR",ex.getMessage());
	    }
	    return objectNode; 
		
	}

}
