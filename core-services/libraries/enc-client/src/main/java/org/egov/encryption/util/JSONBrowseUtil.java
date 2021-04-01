package org.egov.encryption.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.*;

import java.util.Iterator;
import java.util.function.Function;

public class JSONBrowseUtil {

    public static <T, R> JsonNode mapValues(JsonNode jsonNode, Function<T, R> valueMapper) {
        if(jsonNode.isArray()) {
            jsonNode = mapValuesForArrayNode((ArrayNode) jsonNode, valueMapper);
        } else if(jsonNode.isObject()) {
            jsonNode = mapValuesForObjectNode((ObjectNode) jsonNode, valueMapper);
        } else if(jsonNode.isValueNode()) {
            jsonNode = mapValuesForValueNode((ValueNode) jsonNode, valueMapper);
        }
        return jsonNode;
    }

    private static  <T, R> ArrayNode mapValuesForArrayNode(ArrayNode arrayNode, Function<T, R> valueMapper) {
        for(int i = 0; i < arrayNode.size(); i++) {
            arrayNode.set(i, mapValues(arrayNode.get(i), valueMapper));
        }
        return arrayNode;
    }

    private static  <T, R> ObjectNode mapValuesForObjectNode(ObjectNode objectNode, Function<T, R> valueMapper) {
        Iterator<String> fields = objectNode.fieldNames();
        while(fields.hasNext()) {
             String field = fields.next();
             objectNode.set(field, mapValues(objectNode.get(field), valueMapper));
        }
        return objectNode;
    }

    private static <T, R> ValueNode mapValuesForValueNode(ValueNode valueNode, Function<T, R> valueMapper) {
        if(valueNode.isNull())
            return NullNode.getInstance();
        return new TextNode(String.valueOf(valueMapper.apply( (T) valueNode.asText())));
    }

}
