package org.egov.encryption.util;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.NullNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.Option;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.Iterator;
import java.util.List;

@Slf4j
@Deprecated
public class JSONUtils {

    public static JsonNode merge(JsonNode newNode, JsonNode originalNode) {
        Iterator<String> fieldNames = originalNode.fieldNames();

        while (fieldNames.hasNext()) {

            String fieldName = fieldNames.next();
            JsonNode jsonNode = newNode.get(fieldName);

            if (jsonNode != null) {
                if (jsonNode.isObject()) {
                    merge(jsonNode, originalNode.get(fieldName));
                } else if (jsonNode.isArray()) {
                    for (int i = 0; i < jsonNode.size(); i++) {
                        merge(jsonNode.get(i), originalNode.get(fieldName).get(i));
                    }
                }
            } else {
                if (newNode instanceof ObjectNode) {
                    // Overwrite field
                    JsonNode value = originalNode.get(fieldName);

                    ((ObjectNode) newNode).set(fieldName, value);
                }
            }
        }

        return newNode;
    }

    public static JsonNode filterJsonNodeWithFields(JsonNode jsonNode, List<String> filterFields) {
        if(checkIfNoFieldExistsInJsonNode(jsonNode, filterFields))
            return null;

        ObjectMapper mapper = new ObjectMapper(new JsonFactory());


        if(jsonNode.isObject()) {
            ObjectNode objectNode = (ObjectNode) jsonNode;
            ObjectNode filteredObjectNode = mapper.createObjectNode();
            Iterator<String> fieldIterator = objectNode.fieldNames();
            while (fieldIterator.hasNext()) {
                String field = fieldIterator.next();
                if(filterFields.contains(field) && !objectNode.get(field).isNull()) {
                    filteredObjectNode.set(field, objectNode.get(field));
                } else {
                    JsonNode filteredJsonNode = filterJsonNodeWithFields(objectNode.get(field), filterFields);
                    if(filteredJsonNode != null) {
                        filteredObjectNode.set(field, filteredJsonNode);
                    }
                }
            }
            if(filteredObjectNode.isEmpty(mapper.getSerializerProvider()))
                return null;
            return filteredObjectNode;
        } else if(jsonNode.isArray()) {
            ArrayNode arrayNode = (ArrayNode) jsonNode;
            ArrayNode filteredArrayNode = mapper.createArrayNode();
            for(int i = 0; i < arrayNode.size(); i++) {
                JsonNode filteredJsonNode = filterJsonNodeWithFields(arrayNode.get(i), filterFields);
                if(filteredJsonNode == null) {
                    if(arrayNode.get(i).isArray())
                        filteredJsonNode = mapper.createArrayNode();
                    else if(arrayNode.get(i).isObject())
                        filteredJsonNode = mapper.createObjectNode();
                    else
                        filteredJsonNode = NullNode.getInstance();
                }
                filteredArrayNode.add(filteredJsonNode);
            }
            return filteredArrayNode;
        }

        return null;
    }

    public static JsonNode filterJsonNodeWithPaths2(JsonNode jsonNode, List<String> filterPaths) {
        ObjectMapper mapper = new ObjectMapper(new JsonFactory());

        JsonNode filteredNode = null;
        if(jsonNode instanceof ArrayNode)
            filteredNode = mapper.createArrayNode();
        else if(jsonNode instanceof ObjectNode)
            filteredNode = mapper.createObjectNode();
        else
            return null;

        for(String path : filterPaths) {
            JsonNode singlePathFilterNode = filterJsonNodeForPath(jsonNode, path);
            filteredNode = merge(singlePathFilterNode, filteredNode);
        }

        return filteredNode;
    }

    public static JsonNode filterJsonNodeForPath(JsonNode jsonNode, String filterPath) {
        ObjectMapper objectMapper = new ObjectMapper(new JsonFactory());

        if(filterPath == null)
            return jsonNode;
        else if(jsonNode == null)
            return null;

        String key = getFirstJsonKeyForPath(filterPath);
        JsonNode newNode = null;

        if(key.contains("*")) {                                                         //ArrayNode
            newNode = objectMapper.createArrayNode();
            ArrayNode arrayNode = (ArrayNode) jsonNode;
            for(JsonNode value : arrayNode) {
                ((ArrayNode) newNode).add(filterJsonNodeForPath(value, getRemainingJsonKeyForPath(filterPath)));
            }
        } else {                                                                        //ObjectNode
            newNode = objectMapper.createObjectNode();
            ObjectNode objectNode = (ObjectNode) jsonNode;
            JsonNode value = objectNode.get(key);
            ((ObjectNode) newNode).set(key, filterJsonNodeForPath(value, getRemainingJsonKeyForPath(filterPath)));
        }

        return newNode;
    }

    static String getFirstJsonKeyForPath(String path) {
        String keys[] = path.split("/", 2);
        return keys[0];
    }

    static String getRemainingJsonKeyForPath(String path) {
        String keys[] = path.split("/", 2);
        if(keys.length == 1)
            return null;
        return keys[1];
    }


    public static ArrayNode filterJsonNodeWithPaths(JsonNode jsonNode, List<String> filterPaths) {
        Configuration configuration = Configuration.defaultConfiguration().addOptions(Option.DEFAULT_PATH_LEAF_TO_NULL,
                Option.SUPPRESS_EXCEPTIONS);
        ObjectMapper mapper = new ObjectMapper(new JsonFactory());
        DocumentContext jsonDocument = JsonPath.using(configuration).parse(jsonNode.toString());
        ArrayNode filteredNode = mapper.createArrayNode();

        for(String path : filterPaths) {
            Object value = jsonDocument.read(path);
            filteredNode.add(mapper.convertValue(value, JsonNode.class));
        }
        return filteredNode;
    }

    public static JsonNode mergeNodesForGivenPaths(JsonNode newNode, JsonNode originalNode, List<String> filterPaths) throws IOException {
        Configuration configuration = Configuration.defaultConfiguration().addOptions(Option.DEFAULT_PATH_LEAF_TO_NULL,
                Option.SUPPRESS_EXCEPTIONS);
        ObjectMapper mapper = new ObjectMapper(new JsonFactory());

        JsonNode mergedNode = originalNode.deepCopy();
        DocumentContext mergedNodeDocumentContext = JsonPath.using(configuration).parse(mergedNode.toString());

        ArrayNode newArrayNode = (ArrayNode) newNode;

        for(int i = 0; i < filterPaths.size(); i++) {
            String path = filterPaths.get(i);
            if(mergedNodeDocumentContext.read(path) == null)
                continue;
            if(path.contains("*")) {
                ArrayNode values = (ArrayNode) newArrayNode.get(i);

                for(int j = 0; j < values.size(); j++) {
                    String absolutePath = path.replace("*", String.valueOf(j));
                    mergedNodeDocumentContext.set(absolutePath, values.get(j).textValue());
                }

            } else {
                mergedNodeDocumentContext.set(path, newArrayNode.get(i).textValue());
            }
        }

        return mapper.readTree(mergedNodeDocumentContext.jsonString());
    }


    static boolean checkIfNoFieldExistsInJsonNode(JsonNode jsonNode, List<String> fields) {
        for(String field : fields) {
            if(! String.valueOf(jsonNode.findPath(field)).isEmpty())
                return false;
        }
        return true;
    }

}