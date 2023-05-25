package com.tarento.analytics.helper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tarento.analytics.dto.AggregateRequestDto;
import com.tarento.analytics.handler.IResponseHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class AverageComputedField implements IComputedField<ObjectNode> {

    public static final Logger logger = LoggerFactory.getLogger(AverageComputedField.class);


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
    public void add(ObjectNode data, List<String> fields, String newField,JsonNode chartNode ) {
        ObjectNode averageNode = JsonNodeFactory.instance.objectNode();

        try {

            List<JsonNode> values = data.findValues(fields.get(0));
            List<Long> vals = new ArrayList<>();
            for(JsonNode valueNode : values){
                vals.add(valueNode.get(IResponseHandler.VALUE).asLong());
            }

            Long sum = vals.stream().reduce(new Long(0), (a, b) -> a + b);
            logger.info("sum value:: "+sum+" vals.size():: "+vals.size());
            Long average = sum >= vals.size()? sum/vals.size() : 0;
            logger.info("average value:: "+average+" total value:: "+sum);

            averageNode.put(IResponseHandler.VALUE, average);
            data.set(newField, averageNode);


        } catch (Exception e) {
            // throw new RuntimeException("Computed field configuration not correctly provided");
            logger.error("average could not be computed " +e.getMessage());
            averageNode.put(IResponseHandler.VALUE,0);
            data.set(newField, averageNode);
        }

    }
}

