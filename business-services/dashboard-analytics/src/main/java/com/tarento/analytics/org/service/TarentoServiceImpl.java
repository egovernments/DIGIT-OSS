package com.tarento.analytics.org.service;

import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tarento.analytics.ConfigurationLoader;
import com.tarento.analytics.constant.Constants;
import com.tarento.analytics.dto.AggregateDto;
import com.tarento.analytics.dto.AggregateRequestDto;
import com.tarento.analytics.dto.CummulativeDataRequestDto;
import com.tarento.analytics.dto.DashboardHeaderDto;
import com.tarento.analytics.dto.RoleDto;
import com.tarento.analytics.enums.ChartType;
import com.tarento.analytics.exception.AINException;
import com.tarento.analytics.handler.IResponseHandler;
import com.tarento.analytics.handler.InsightsHandler;
import com.tarento.analytics.handler.InsightsHandlerFactory;
import com.tarento.analytics.handler.ResponseHandlerFactory;
import com.tarento.analytics.model.InsightsConfiguration;
import com.tarento.analytics.service.QueryService;
import com.tarento.analytics.service.impl.RestService;
import com.tarento.analytics.utils.ResponseRecorder;


@Component
public class TarentoServiceImpl implements ClientService {

	public static final Logger logger = LoggerFactory.getLogger(TarentoServiceImpl.class);
	
	ObjectMapper mapper = new ObjectMapper();
	char insightPrefix = 'i'; 


	@Autowired
	private QueryService queryService;

	@Autowired
	private RestService restService;

	@Autowired
	private ConfigurationLoader configurationLoader;

	@Autowired
	private ResponseHandlerFactory responseHandlerFactory;

	@Autowired
	private InsightsHandlerFactory insightsHandlerFactory;

	@Autowired
	private MdmsApiMappings mdmsApiMappings;


	@Override
	@Cacheable(value="versions", key="#request.hashKey")
	public AggregateDto getAggregatedData(AggregateRequestDto request, List<RoleDto> roles) throws AINException, IOException {
		// Read visualization Code
		String internalChartId = request.getVisualizationCode();
		ObjectNode aggrObjectNode = JsonNodeFactory.instance.objectNode();
		ObjectNode insightAggrObjectNode = JsonNodeFactory.instance.objectNode();
		ObjectNode nodes = JsonNodeFactory.instance.objectNode();
		ObjectNode insightNodes = JsonNodeFactory.instance.objectNode();
		Boolean continueWithInsight = Boolean.FALSE; 

		//TODO should be remove temporary fix for national dashboard
		Map<String, Object> filters = request.getFilters();
		if( filters != null && filters.get("ulb") != null) {
			filters.put("tenantId", filters.get("ulb"));
		}
		
		
		// Load Chart API configuration to Object Node for easy retrieval later
		ObjectNode node = configurationLoader.get(Constants.ConfigurationFiles.CHART_API_CONFIG);
		ObjectNode chartNode = (ObjectNode) node.get(internalChartId);
		InsightsConfiguration insightsConfig = null;
		if(chartNode.get(Constants.JsonPaths.INSIGHT) != null) { 
			insightsConfig = mapper.treeToValue(chartNode.get(Constants.JsonPaths.INSIGHT), InsightsConfiguration.class);
		}
		ChartType chartType = ChartType.fromValue(chartNode.get(Constants.JsonPaths.CHART_TYPE).asText());
		boolean isDefaultPresent = chartType.equals(ChartType.LINE) && chartNode.get(Constants.JsonPaths.INTERVAL)!=null;
		boolean isRequestContainsInterval = null == request.getRequestDate() ? false : (request.getRequestDate().getInterval()!=null && !request.getRequestDate().getInterval().isEmpty()) ;
		String interval = isRequestContainsInterval? request.getRequestDate().getInterval(): (isDefaultPresent ? chartNode.get(Constants.JsonPaths.INTERVAL).asText():"");

		executeConfiguredQueries(chartNode, aggrObjectNode, nodes, request, interval);
		request.setChartNode(chartNode);
		ResponseRecorder responseRecorder = new ResponseRecorder();
		request.setResponseRecorder(responseRecorder);
		
		IResponseHandler responseHandler = responseHandlerFactory.getInstance(chartType);
		AggregateDto aggregateDto = new AggregateDto();
		if(aggrObjectNode.fields().hasNext()){
			aggregateDto = responseHandler.translate(request, aggrObjectNode);
		}
		
		if(insightsConfig != null && StringUtils.isNotBlank(insightsConfig.getInsightInterval())) { 
			continueWithInsight = getInsightsDate(request, insightsConfig.getInsightInterval());
			if(continueWithInsight) { 
				String insightVisualizationCode = insightPrefix  + request.getVisualizationCode(); 
				request.setVisualizationCode(insightVisualizationCode);
				/*
						Data is fetched with updated RequestDates (updated in getInsightsDate which subtracted one interval from the dates)
				*
				* */
				executeConfiguredQueries(chartNode, insightAggrObjectNode, insightNodes, request, interval);

				request.setChartNode(chartNode);
				responseHandler = responseHandlerFactory.getInstance(chartType);
				if(insightAggrObjectNode.fields().hasNext()){
					responseHandler.translate(request, insightAggrObjectNode);
				}
				InsightsHandler insightsHandler = insightsHandlerFactory.getInstance(chartType);
				aggregateDto = insightsHandler.getInsights(aggregateDto, request.getVisualizationCode(), request.getModuleLevel(), insightsConfig,request.getResponseRecorder());
			}
		}

		return aggregateDto;
	}

	/**
	 * Executes queries and enriches the respons in aggrObjectNode
	 * @param chartNode The Chart Config defined in ChartApiConfig.json
	 * @param aggrObjectNode Object in which response is enriched
	 * @param nodes Don't know why passed as argument should have been defined in function itself
	 * @param request The API request
	 * @param interval Interval ( eg: Month) defines in RequestDate in AggregateRequestDto noot needed as seperate argument as it can
	 *                 be fetched from  AggregateRequestDto
	 */
	private void executeConfiguredQueries(ObjectNode chartNode, ObjectNode aggrObjectNode, ObjectNode nodes, AggregateRequestDto request, String interval) {
		preHandle(request, chartNode, mdmsApiMappings);

		ArrayNode queries = (ArrayNode) chartNode.get(Constants.JsonPaths.QUERIES);
		int randIndexCount = 1;
		for(JsonNode query : queries) {
			String module = query.get(Constants.JsonPaths.MODULE).asText();
			if(request.getModuleLevel().equals(Constants.Modules.HOME_REVENUE) || 
					request.getModuleLevel().equals(Constants.Modules.HOME_SERVICES) ||
					query.get(Constants.JsonPaths.MODULE).asText().equals(Constants.Modules.COMMON) ||
					request.getModuleLevel().equals(module)) {
				
				String indexName = query.get(Constants.JsonPaths.INDEX_NAME).asText();
				ObjectNode objectNode = queryService.getChartConfigurationQuery(request, query, indexName, interval);
				try {
					JsonNode aggrNode = restService.search(indexName,objectNode.toString());
					if(nodes.has(indexName)) { 
						indexName = indexName + "_" + randIndexCount;
						randIndexCount += 1;
					}
					nodes.set(indexName,aggrNode.get(Constants.JsonPaths.AGGREGATIONS));
				}catch (Exception e) {
					logger.error("Encountered an Exception while Executing the Query : " + e.getMessage());
					throw new RuntimeException(e);
				}
				aggrObjectNode.set(Constants.JsonPaths.AGGREGATIONS, nodes);

			}
		}
	}

	/**
	 * Updates the RequestDate for insight data
	 * @param request
	 * @param insightInterval
	 * @return
	 */
	private Boolean getInsightsDate(AggregateRequestDto request, String insightInterval) { 
		Long daysBetween = daysBetween(Long.parseLong(request.getRequestDate().getStartDate()), 
				Long.parseLong(request.getRequestDate().getEndDate()));
		if(insightInterval.equals(Constants.Interval.month.toString()) && daysBetween > 32) {
			return Boolean.FALSE; 
		}
		if(insightInterval.equals(Constants.Interval.week.toString()) && daysBetween > 8) {
			return Boolean.FALSE; 
		}
		if(insightInterval.equals(Constants.Interval.year.toString()) && daysBetween > 366) {
			return Boolean.FALSE; 
		}
		Calendar startCal = Calendar.getInstance();
		Calendar endCal = Calendar.getInstance();
		startCal.setTime(new Date(Long.parseLong(request.getRequestDate().getStartDate())));
		endCal.setTime(new Date(Long.parseLong(request.getRequestDate().getEndDate()))); 
		if(insightInterval.equals(Constants.Interval.month.toString())) { 
			startCal.add(Calendar.MONTH, -1);
			endCal.add(Calendar.MONTH, -1);
		} else if(insightInterval.equals(Constants.Interval.week.toString())) { 
			startCal.add(Calendar.WEEK_OF_YEAR, -1);
			endCal.add(Calendar.WEEK_OF_YEAR, -1);
		} else if(StringUtils.isBlank(insightInterval) || insightInterval.equals(Constants.Interval.year.toString())) { 
			startCal.add(Calendar.YEAR, -1);
			endCal.add(Calendar.YEAR, -1);
		}
		request.getRequestDate().setStartDate(String.valueOf(startCal.getTimeInMillis()));
		request.getRequestDate().setEndDate(String.valueOf(endCal.getTimeInMillis()));
		return Boolean.TRUE;
	}
	
	public long daysBetween(Long start, Long end) {
	    return TimeUnit.MILLISECONDS.toDays(Math.abs(end - start));
	}



	@Override
	public List<DashboardHeaderDto> getHeaderData(CummulativeDataRequestDto requestDto, List<RoleDto> roles) throws AINException {
		// TODO Auto-generated method stub
		return null;
	}



}
