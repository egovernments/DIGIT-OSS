package com.tarento.analytics.handler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tarento.analytics.ConfigurationLoader;
import com.tarento.analytics.dto.AggregateDto;
import com.tarento.analytics.dto.AggregateRequestDto;
import com.tarento.analytics.dto.Data;
import com.tarento.analytics.dto.Plot;
import com.tarento.analytics.enums.ChartType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
/**
 * This handles ES response for single index, multiple index to represent data as pie figure
 * Creates plots by merging/computing(by summation) index values for same key
 * AGGS_PATH : this defines the path/key to be used to search the tree
 * VALUE_TYPE : defines the data type for the value formed, this could be amount, percentage, number
 *
 */
@Component
public class PieChartResponseHandler implements IResponseHandler {
    public static final Logger logger = LoggerFactory.getLogger(PieChartResponseHandler.class);


    @Override
    public AggregateDto translate(AggregateRequestDto requestDto, ObjectNode aggregations) throws IOException {

        List<Data> dataList = new ArrayList<>();

        JsonNode aggregationNode = aggregations.get(AGGREGATIONS);
        JsonNode chartNode = requestDto.getChartNode();
        String headerKey = chartNode.get(CHART_NAME).asText();
        List<Plot> headerPlotList = new ArrayList<>();
        List<Double> totalValue = new ArrayList<>();
        Map<String, Double> plotMap = new LinkedHashMap<>();
        
        String symbol = chartNode.get(IResponseHandler.VALUE_TYPE).asText();
        ArrayNode aggrsPaths = (ArrayNode) chartNode.get(IResponseHandler.AGGS_PATH);

        /**
         * For every aggregation on plot object is added
         */
        aggrsPaths.forEach(headerPath -> {
            aggregationNode.findValues(headerPath.asText()).stream().forEach(valueNode->{
                if(valueNode.has(BUCKETS)){
                    JsonNode buckets = valueNode.findValue(BUCKETS);
                    buckets.forEach(bucket -> {
                        Double val = valueNode.findValues(VALUE).isEmpty() ? bucket.findValue(DOC_COUNT).asInt() : bucket.findValue(VALUE).asDouble();
                        totalValue.add(val);
                        if(plotMap.containsKey(bucket.findValue(KEY).asText())) {
                        	val = val + plotMap.get(bucket.findValue(KEY).asText());
                        }
                        plotMap.put(bucket.findValue(KEY).asText(), new Double("0") + val);
//                        Plot plot = new Plot(bucket.findValue(KEY).asText(), val, symbol);
//                        headerPlotList.add(plot);
                    });

                } else {
                    List<JsonNode> valueNodes = valueNode.findValues(VALUE).isEmpty() ? valueNode.findValues(DOC_COUNT) : valueNode.findValues(VALUE);
                    double sum = valueNodes.stream().mapToLong(o -> o.asLong()).sum();
                    totalValue.add(sum);
                    if(plotMap.containsKey(headerPath.asText())) {
                    	plotMap.put(headerPath.asText(),plotMap.get(headerPath.asText())+sum);
                    }
                    else {
                    	plotMap.put(headerPath.asText(), sum);
                    }
//                    Plot plot = new Plot(headerPath.asText(), sum, symbol);
//                    headerPlotList.add(plot);
                }
            });
        });
        headerPlotList = plotMap.entrySet().stream().map(e -> new Plot(e.getKey(), e.getValue(), symbol)).collect(Collectors.toList());
        Data data = new Data(headerKey, totalValue.stream().reduce(0.0, Double::sum), symbol);
        data.setPlots(headerPlotList);
        dataList.add(data);

        return getAggregatedDto(chartNode, dataList, requestDto.getVisualizationCode());

    }
}
