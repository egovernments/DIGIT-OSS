package org.egov.encryption.util;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;

import java.io.IOException;
import java.util.List;

public class ConvertClass {

    public static <E,P> P convertTo(JsonNode jsonNode, Class<E> valueType) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper(new JsonFactory());

        if(jsonNode.isArray())
        {
            ObjectReader reader =
                    objectMapper.readerFor(objectMapper.getTypeFactory().constructCollectionType(List.class, valueType));
            return reader.readValue(jsonNode);
        } else {
            return (P)objectMapper.treeToValue(jsonNode, valueType);
        }
    }

}
