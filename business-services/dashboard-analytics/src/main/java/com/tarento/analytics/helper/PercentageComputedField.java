package com.tarento.analytics.helper;

import com.fasterxml.jackson.databind.JsonNode;
import com.tarento.analytics.dto.AggregateRequestDto;
import com.tarento.analytics.dto.Data;
import com.tarento.analytics.dto.Plot;
import com.tarento.analytics.handler.IResponseHandler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class PercentageComputedField implements IComputedField<Data>{

    public static final Logger logger = LoggerFactory.getLogger(PercentageComputedField.class);


    private String postAggrTheoryName;
    private AggregateRequestDto aggregateRequestDto;
    @Autowired
    private ComputeHelperFactory computeHelperFactory;

    @Override
    public void set(AggregateRequestDto requestDto, String postAggrTheoryName){
        this.aggregateRequestDto = requestDto;
        this.postAggrTheoryName = postAggrTheoryName;
    }

    @Override
    public void add(Data data, List<String> fields, String newField, JsonNode chartNode ) {
        try {
            Map<String, Plot> plotMap = data.getPlots().stream().collect(Collectors.toMap(Plot::getName, Function.identity()));

            if (plotMap.get(fields.get(0)).getValue() == 0.0 || plotMap.get(fields.get(1)).getValue() == 0.0) {

                data.getPlots().add(new Plot(newField, 0.0, "percentage"));
            } else {
                double wholeValue = plotMap.get(fields.get(1)).getValue();
                double fieldValue = plotMap.get(fields.get(0)).getValue() / plotMap.get(fields.get(1)).getValue() * 100;
                if(chartNode.get(IResponseHandler.IS_ROUND_OFF)!=null && chartNode.get(IResponseHandler.IS_ROUND_OFF).asBoolean()) {
                	fieldValue =  (double) Math.round(fieldValue);
                }

                if(postAggrTheoryName != null && !postAggrTheoryName.isEmpty()) {
                    ComputeHelper computeHelper = computeHelperFactory.getInstance(postAggrTheoryName);
                    fieldValue = computeHelper.compute(aggregateRequestDto, fieldValue);
                    wholeValue = computeHelper.compute(aggregateRequestDto, wholeValue);
                }
                data.getPlots().stream().filter(plot -> fields.get(1).equalsIgnoreCase(plot.getName())).findAny().orElse(null).setValue(wholeValue);
                data.getPlots().add(new Plot(newField, fieldValue, "percentage"));
            }

        } catch (Exception e) {
            // throw new RuntimeException("Computed field configuration not correctly provided");
            logger.error("percentage could not be computed " +e.getMessage());
            data.getPlots().add(new Plot(newField, 0.0, "percentage"));
        }

    }
}

