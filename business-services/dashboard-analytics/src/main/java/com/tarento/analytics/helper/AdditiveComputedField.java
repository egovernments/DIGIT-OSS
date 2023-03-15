package com.tarento.analytics.helper;

import com.fasterxml.jackson.databind.JsonNode;
import com.tarento.analytics.dto.AggregateRequestDto;
import com.tarento.analytics.dto.Data;
import com.tarento.analytics.dto.Plot;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class AdditiveComputedField implements IComputedField<Data> {

    public static final Logger logger = LoggerFactory.getLogger(AdditiveComputedField.class);


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
    public void add(Data data, List<String> fields, String newField,JsonNode chartNode ) {
        String dataType = "amount";
        try {
            Map<String, Plot> plotMap = data.getPlots().stream().collect(Collectors.toMap(Plot::getName, Function.identity()));

            double total = 0.0;
            for (String field: fields){
                dataType = plotMap.get(field).getSymbol();
                total = total+ plotMap.get(field).getValue();
            }
            if(postAggrTheoryName != null && !postAggrTheoryName.isEmpty()) {
                ComputeHelper computeHelper = computeHelperFactory.getInstance(postAggrTheoryName);

                total = computeHelper.compute(aggregateRequestDto,total );
            }


            data.getPlots().add(new Plot(newField, total, dataType));

        } catch (Exception e) {
            // throw new RuntimeException("Computed field configuration not correctly provided");
            logger.error("percentage could not be computed " +e.getMessage());
            data.getPlots().add(new Plot(newField, 0.0, dataType));
        }

    }
}

