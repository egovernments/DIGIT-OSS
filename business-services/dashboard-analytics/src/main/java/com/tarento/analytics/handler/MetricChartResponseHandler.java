package com.tarento.analytics.handler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.egov.tracer.model.CustomException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tarento.analytics.ConfigurationLoader;
import com.tarento.analytics.dto.AggregateDto;
import com.tarento.analytics.dto.AggregateRequestDto;
import com.tarento.analytics.dto.Data;
import com.tarento.analytics.dto.Plot;
import com.tarento.analytics.helper.ComputeHelper;
import com.tarento.analytics.helper.ComputeHelperFactory;
import com.tarento.analytics.utils.ResponseRecorder;

/**
 * This handles ES response for single index, multiple index to represent single data value
 * Creates plots by merging/computing(by summation or by percentage) index values for same key
 * ACTION:  for the chart config defines the type either summation or computing percentage
 * AGGS_PATH : this defines the path/key to be used to search the tree
 *
 */
@Component
public class MetricChartResponseHandler implements IResponseHandler{
    public static final Logger logger = LoggerFactory.getLogger(MetricChartResponseHandler.class);
    
    char insightPrefix = 'i';

    @Autowired
    ConfigurationLoader configurationLoader;
    
    @Autowired 
    ComputeHelperFactory computeHelperFactory; 
    



    /**
     * Adds the data into ResponseResponder
     * @param request
     * @param aggregations
     * @return
     * @throws IOException
     */

    @Override
    public AggregateDto translate(AggregateRequestDto request, ObjectNode aggregations) throws IOException {
        List<Data> dataList = new ArrayList<>();
        String requestId = request.getRequestId(); 
        String visualizationCode = request.getVisualizationCode();

        JsonNode aggregationNode = aggregations.get(AGGREGATIONS);
        JsonNode chartNode = null; 

        // Fetches the chart config
        if(request.getVisualizationCode().charAt(0) == insightPrefix) { 
        	String internalChartId = request.getVisualizationCode().substring(1);
        	chartNode = configurationLoader.get(API_CONFIG_JSON).get(internalChartId);
        } else {
        	chartNode = configurationLoader.get(API_CONFIG_JSON).get(request.getVisualizationCode());
        }

        List<Double> totalValues = new ArrayList<>();
        String chartName = chartNode.get(CHART_NAME).asText();
        String action = chartNode.get(ACTION).asText();


        /*
        * Aggreagation paths are the name of aggregations
        * Could have been inferred from aggregationNode i.e from query Dont know why it was added in config?
        * */
        List<Double> percentageList = new ArrayList<>();
        ArrayNode aggrsPaths = (ArrayNode) chartNode.get(AGGS_PATH);

        /*
        * Sums all value of all aggrsPaths i.e all aggregations
        * */
       boolean isRoundOff = (chartNode.get(IS_ROUND_OFF)!=null && chartNode.get(IS_ROUND_OFF).asBoolean()) ? true : false;
       Plot latestDateplot = new Plot("todaysDate", Double.valueOf(0), "number");;
		Plot lastUpdatedTime = new Plot("lastUpdatedTime", Double.valueOf(0), "number");
		Boolean isTodaysCollection = (chartNode.get("TodaysCollection") == null ? Boolean.FALSE : chartNode.get("TodaysCollection").asBoolean());
		for( JsonNode headerPath : aggrsPaths) {
			List<JsonNode> values = aggregationNode.findValues(headerPath.asText());
			int valueIndex = 0;
			Double headerPathValue = new Double(0);
			for (JsonNode value : values) {
				if (isRoundOff) {
					ObjectMapper mapper = new ObjectMapper();
					JsonNode node = value.get("value");
					if (node != null) {
						Double roundOff = 0.0d;
						try {
							roundOff = mapper.treeToValue(node, Double.class);
						} catch (JsonProcessingException e) {
							e.printStackTrace();
						}
						if (roundOff != null) {
							int finalvalue = (int) Math.round(roundOff);
							((ObjectNode) value).put("value", finalvalue);
						}
					}

				}
				List<JsonNode> valueNodes = value.findValues(VALUE).isEmpty() ? value.findValues(DOC_COUNT)
						: value.findValues(VALUE);
				Double sum = valueNodes.stream().mapToDouble(o -> o.asDouble()).sum();
				
				// PreAction Theory should be consdiered and executed to modify the aggregation value
				JsonNode preActionTheoryNode = chartNode.get("preActionTheory");
				
				if( preActionTheoryNode != null && preActionTheoryNode.findValue(headerPath.asText()) !=null && 
						!preActionTheoryNode.findValue(headerPath.asText()).asText().isEmpty()) {
					ComputeHelper computeHelper = computeHelperFactory.getInstance(preActionTheoryNode.findValue(headerPath.asText()).asText());
					if(computeHelper !=null) {
						sum = computeHelper.compute(request, sum); 
					}
	            	
				}
				
				headerPathValue = Double.sum(headerPathValue, sum);

				if (isTodaysCollection == Boolean.TRUE) {

					String latestDateKey = null;
					String lastUpdatedTimeKey = null;
					List<JsonNode> latestDates = aggregationNode.findValues("todaysDate");
					if (latestDates != null && latestDates.size() > 0) {
						JsonNode latestDate = latestDates.get(valueIndex);
						if (latestDate != null) {
							List<JsonNode> latestDateBuckets = latestDate.findValues(BUCKETS);
							if (latestDateBuckets != null && latestDateBuckets.size() > 0) {
								JsonNode latestDateBucket = latestDateBuckets.get(0);
								latestDateKey = (latestDateBucket.findValue(IResponseHandler.KEY) == null ? null
										: latestDateBucket.findValue(IResponseHandler.KEY).asText());
							}
							if (latestDateKey != null
									&& ((Double.valueOf(latestDateKey)) > latestDateplot.getValue())) {
								latestDateplot.setValue(Double.valueOf(latestDateKey));
							}

						}
						List<JsonNode >lastUpdatedTimeNodes = aggregationNode.findValues("lastUpdatedTime");
						if (lastUpdatedTimeNodes != null && lastUpdatedTimeNodes.size() > 0) {
							JsonNode lastUpdatedTimeNode = lastUpdatedTimeNodes.get(valueIndex);
							if (lastUpdatedTimeNode != null) {
								List<JsonNode> lastUpdatedTimeBuckets = lastUpdatedTimeNode.findValues(BUCKETS);
								if (lastUpdatedTimeBuckets != null && lastUpdatedTimeBuckets.size() > 0) {
									JsonNode lastUpdatedTimeBucket = lastUpdatedTimeBuckets.get(0);
									lastUpdatedTimeKey = (lastUpdatedTimeBucket.findValue(IResponseHandler.KEY) == null
											? null
											: lastUpdatedTimeBucket.findValue(IResponseHandler.KEY).asText());
								}

								if (lastUpdatedTimeKey != null
										&& ((Double.valueOf(lastUpdatedTimeKey)) > lastUpdatedTime.getValue())) {
									lastUpdatedTime.setValue(Double.valueOf(lastUpdatedTimeKey));
								}
							}
						}
					}

				}
				valueIndex++;
			}
			// Why is aggrsPaths.size()==2 required? Is there validation if action =
			// PERCENTAGE and aggrsPaths > 2
			if (action.equals(PERCENTAGE) && aggrsPaths.size() == 2) {
				percentageList.add(headerPathValue);
			} else {
				totalValues.add(headerPathValue);
			}
			
		}

        String symbol = chartNode.get(IResponseHandler.VALUE_TYPE).asText();
       
        try{
            Data data = new Data(chartName, action.equals(PERCENTAGE) && aggrsPaths.size()==2? percentageValue(percentageList, isRoundOff) : (totalValues==null || totalValues.isEmpty())? 0.0 :totalValues.stream().reduce(0.0, Double::sum), symbol);
			//Logic to perform DIVISION action
			if (action.equals(DIVISION)){
				if (totalValues.size() == 2) {
					if (totalValues.get(1) != 0)
						data.setHeaderValue(totalValues.get(0) / totalValues.get(1));
					else
						data.setHeaderValue(Double.valueOf(0));
				}
				else
					throw new CustomException("INVALID_NUMBER_OF_OPERANDS", "Division operation can be performed only with 2 operands.");
			}
			data.setPlots( Arrays.asList(latestDateplot,lastUpdatedTime));
            request.getResponseRecorder().put(visualizationCode, request.getModuleLevel(), data);
            dataList.add(data);
            if(chartNode.get(POST_AGGREGATION_THEORY) != null) { 
            	ComputeHelper computeHelper = computeHelperFactory.getInstance(chartNode.get(POST_AGGREGATION_THEORY).asText());
            	computeHelper.compute(request, dataList); 
            }
        }catch (Exception e){
            logger.info("data chart name = "+chartName +" ex occurred "+e.getMessage());
        }

        return getAggregatedDto(chartNode, dataList, request.getVisualizationCode());
    }
}
