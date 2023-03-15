package org.egov.nationaldashboardingest.utils;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.BooleanNode;
import com.fasterxml.jackson.databind.node.JsonNodeType;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
public class JsonProcessorUtil {

    public void enrichKeyNamesInList(JsonNode seedData, List<String> keyNames){
        seedData.fieldNames().forEachRemaining(field -> keyNames.add(field));
    }

    public Object convertJsonNodeToNativeType(JsonNode value) {
        if (value.getNodeType() == JsonNodeType.STRING) {
            return value.asText();
        } else if (value.getNodeType() == JsonNodeType.NUMBER) {
            if (value.numberType() == JsonParser.NumberType.INT) {
                return Integer.valueOf(value.asInt());
            } else if (value.numberType() == JsonParser.NumberType.LONG) {
                return Long.valueOf(value.asLong());
            } else if (value.numberType() == JsonParser.NumberType.DOUBLE) {
                return Double.valueOf(value.asDouble());
            }
        } else if (value.getNodeType() == JsonNodeType.BOOLEAN) {
            return Boolean.valueOf(value.asBoolean());
        } /*else if ( value instanceof ArrayNode ) {
            List<Object> array = new ArrayList<Object>();
            value.elements().forEachRemaining( (e)->{
                array.add( toRS( e ) );
            });
            return array;
        } else if (value instanceof ObjectNode) {
            return convert( (ObjectNode) value );
        }*/
        return null;
    }

    public void addAppropriateBoxedTypeValueToBaseDocument(ObjectNode baseDocumentStructure, String keyName, Object convertedValue) {
        if(convertedValue instanceof Integer){
            baseDocumentStructure.put(keyName, (Integer)convertedValue);
        }else if(convertedValue instanceof Long){
            baseDocumentStructure.put(keyName, (Long)convertedValue);
        }else if(convertedValue instanceof Double){
            baseDocumentStructure.put(keyName, (Double)convertedValue);
        }else if(convertedValue instanceof String){
            baseDocumentStructure.put(keyName, (String)convertedValue);
        }
    }
}
