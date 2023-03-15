package com.tarento.analytics.handler;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tarento.analytics.dto.AggregateDto;
import com.tarento.analytics.dto.AggregateRequestDto;
import com.tarento.analytics.dto.Data;
import com.tarento.analytics.dto.Plot;
import com.tarento.analytics.helper.ComputedFieldFactory;
import com.tarento.analytics.helper.IComputedField;
import com.tarento.analytics.model.ComputedFields;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * This handles ES response for single index, multiple index to represent data as pie figure
 * Creates plots by merging/computing(by summation) index values for same key
 *
 */
@Component
public class AdvanceTableChartResponseHandler implements IResponseHandler {
    public static final Logger logger = LoggerFactory.getLogger(AdvanceTableChartResponseHandler.class);

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private ComputedFieldFactory computedFieldFactory;


    @Override
    public AggregateDto translate(AggregateRequestDto requestDto, ObjectNode aggregations) throws IOException {

        JsonNode aggregationNode = aggregations.get(AGGREGATIONS);
        JsonNode chartNode = requestDto.getChartNode();
        String plotLabel = chartNode.get(PLOT_LABEL).asText();
        JsonNode computedFields = chartNode.get(COMPUTED_FIELDS);
        JsonNode excludedFields = chartNode.get(EXCLUDED_COLUMNS);

        boolean executeComputedFields = computedFields !=null && computedFields.isArray();
        List<JsonNode> aggrNodes = aggregationNode.findValues(BUCKETS);
        boolean isPathSpecified = chartNode.get(IResponseHandler.AGGS_PATH)!=null && chartNode.get(IResponseHandler.AGGS_PATH).isArray();
        ArrayNode aggrsPaths = isPathSpecified ? (ArrayNode) chartNode.get(IResponseHandler.AGGS_PATH) : JsonNodeFactory.instance.arrayNode();



        int[] idx = { 1 };
        List<Data> dataList = new ArrayList<>();
        Map<String, Map<String, Plot>> mappings = new HashMap<>();


        aggrNodes.stream().forEach(node -> {

            ArrayNode buckets = (ArrayNode) node;
            buckets.forEach(bucket -> {

                Map<String, Plot> plotMap = new LinkedHashMap<>();
                String key = bucket.get(IResponseHandler.KEY).asText();

                //If aggrPath is specified.
                if(aggrsPaths.size()>0){
                    processWithSpecifiedKeys(aggrsPaths, bucket, mappings, key, plotMap,chartNode);

                } else {
                    processNestedObjects(bucket, mappings, key, plotMap,chartNode);
                }

                if (plotMap.size() > 0) {
                    Map<String, Plot> plots = new LinkedHashMap<>();
                    Plot sno = new Plot(SERIAL_NUMBER, TABLE_TEXT);
                    sno.setLabel("" + idx[0]++);
                    Plot plotkey = new Plot(plotLabel.isEmpty() ? TABLE_KEY : plotLabel, TABLE_TEXT);
                    plotkey.setLabel(key);

                    plots.put(SERIAL_NUMBER, sno);
                    plots.put(plotLabel.isEmpty() ? TABLE_KEY : plotLabel, plotkey);
                    plots.putAll(plotMap);
                    mappings.put(key, plots);

                }

            });

        });
        mappings.entrySet().stream().forEach(plotMap -> {
            List<Plot> plotList = plotMap.getValue().values().stream().collect(Collectors.toList());
            //filter out data object with all zero data.
            List<Plot> filterPlot = plotList.stream().filter(c -> (!c.getName().equalsIgnoreCase(SERIAL_NUMBER) && !c.getName().equalsIgnoreCase(plotLabel) && c.getValue() != 0.0)).collect(Collectors.toList());

            if(filterPlot.size()>0){
                Data data = new Data(plotMap.getKey(), Integer.parseInt(String.valueOf(plotMap.getValue().get(SERIAL_NUMBER).getLabel())), null);
                data.setPlots(plotList);
                //
                if(executeComputedFields){
                    try {
                        List<ComputedFields> computedFieldsList = mapper.readValue(computedFields.toString(), new TypeReference<List<ComputedFields>>(){});
                        computedFieldsList.forEach(cfs -> {
                            IComputedField computedFieldObject = computedFieldFactory.getInstance(cfs.getActionName());
                            computedFieldObject.set(requestDto, cfs.getPostAggregationTheory());
                            computedFieldObject.add(data, cfs.getFields(), cfs.getNewField(), chartNode );

                        });
                        // exclude the fields no to be displayed
                        if(excludedFields!=null){
                            List<String> list = mapper.readValue(excludedFields.toString(), new TypeReference<List<String>>(){});
                            List<Plot> removeplots = data.getPlots().stream().filter(c -> list.contains(c.getName())).collect(Collectors.toList());
                            data.getPlots().removeAll(removeplots);
                        }


                    } catch (Exception e){
                        logger.error("execution of computed field :"+e.getMessage());
                    }
                }
                dataList.add(data);
            }

        });
        //dataList.sort((o1, o2) -> ((Integer) o1.getHeaderValue()).compareTo((Integer) o2.getHeaderValue()));
       
        if (chartNode.get(IResponseHandler.CHART_SPECIFIC)!=null) {
            JsonNode specificData = chartNode.get(IResponseHandler.CHART_SPECIFIC);
            JsonNode orderColumns = specificData.get(IResponseHandler.XTABLE_COLUMN);
            if (orderColumns != null) {
                dataList.forEach(finaldata -> {
                    List<Plot> newDataList = new ArrayList<>();
                    orderColumns.forEach(columnName -> {
                        List<Plot> plotObj = finaldata.getPlots().stream()
                                .filter(plot -> plot.getName().equals(columnName.asText()))
                                .collect(Collectors.toList());
                        newDataList.add(plotObj.get(0));
                    });
                    finaldata.setPlots(newDataList);
                });
            }
        }
        
        return getAggregatedDto(chartNode, dataList, requestDto.getVisualizationCode());

    }


    /**
     * Preparing the plots
     * @param bucketNode
     * @param mappings
     * @param key
     * @param headerName
     * @param plotMap
     */
    private void process(JsonNode bucketNode, Map<String, Map<String, Plot>> mappings, String key, String headerName, Map<String, Plot> plotMap,JsonNode chartNode){
        JsonNode valNode = bucketNode.findValue(VALUE) != null ? bucketNode.findValue(VALUE) : bucketNode.findValue(DOC_COUNT);
        Double value = valNode.isDouble() ? valNode.asDouble() : valNode.asInt();
        String dataType = getDataType(chartNode, headerName, valNode);
        //String headerName = bucketNode.findValue(KEY).asText();
        Plot plot = new Plot(headerName, value, dataType);

        if (mappings.containsKey(key)) {
            double newval = mappings.get(key).get(headerName) == null ? value : (mappings.get(key).get(headerName).getValue() + value);
            plot.setValue(newval);
            mappings.get(key).put(headerName, plot);
        } else {
            plotMap.put(headerName, plot);
        }
    }

    /**
     * Recursively processing the nodes
     * @param node
     * @param mappings
     * @param key
     * @param plotMap
     */
    private void processNestedObjects(JsonNode node, Map<String, Map<String, Plot>> mappings, String key, Map<String, Plot> plotMap,JsonNode chartNode ){

        Iterator<String> fieldNames = node.fieldNames();
        while(fieldNames.hasNext()) {
            String fieldName = fieldNames.next();
            if(node.get(fieldName).isArray()){
                ArrayNode bucketNodes = (ArrayNode) node.get(fieldName);
                bucketNodes.forEach(bucketNode -> {
                    process(bucketNode, mappings, key, bucketNode.findValue(KEY).asText() , plotMap,chartNode);
                });

            } else if(node.get(fieldName).isObject() && node.get(fieldName).get(VALUE)!=null){
                process(node.get(fieldName), mappings, key, fieldName , plotMap,chartNode);

            } else {
                processNestedObjects(node.get(fieldName), mappings, key, plotMap,chartNode );
            }

        }


    }

    private void processWithSpecifiedKeys(ArrayNode aggrsPaths, JsonNode bucket, Map<String, Map<String, Plot>> mappings, String key, Map<String, Plot> plotMap,JsonNode chartNode ){

        aggrsPaths.forEach(headerPath -> {
            JsonNode valueNode = bucket.findValue(headerPath.asText());
            //Double value = (null == valueNode || null == valueNode.get(VALUE)) ? 0.0 : valueNode.get(VALUE).asDouble();
            Double doc_value = 0.0;
            if(valueNode!=null)
                doc_value = (null == valueNode.findValue(DOC_COUNT)) ? 0.0 : valueNode.findValue(DOC_COUNT).asDouble();
            Double value = (null == valueNode || null == valueNode.findValue(VALUE)) ? doc_value : valueNode.findValue(VALUE).asDouble();
            String dataType = getDataType(chartNode, headerPath.asText(), valueNode);
            
            if(chartNode.get(IS_ROUND_OFF)!=null && chartNode.get(IS_ROUND_OFF).asBoolean()) {
            	value =  (double) Math.round(value);
            }
            Plot plot = new Plot(headerPath.asText(), value, dataType);
            if (mappings.containsKey(key)) {
                double newval = mappings.get(key).get(headerPath.asText()) == null ? value : (mappings.get(key).get(headerPath.asText()).getValue() + value);
                plot.setValue(newval);
                mappings.get(key).put(headerPath.asText(), plot);
            } else {
                plotMap.put(headerPath.asText(), plot);
            }
        });
    }
    
    
    private String getDataType(JsonNode chartNode, String headerName, JsonNode valueNode) {
		// TODO Auto-generated method stub
		if (chartNode.get("pathDataTypeMapping") != null) {
			JsonNode pathDataMapping = chartNode.get("pathDataTypeMapping");
			JsonNode node = pathDataMapping.findValue(headerName);
			return node.textValue();
		} else if( chartNode.get(VALUE_TYPE) != null) {
			return chartNode.get(VALUE_TYPE).asText();
		}else {
			return valueNode.isDouble() ? "amount" : "number";
		}
	}

}
