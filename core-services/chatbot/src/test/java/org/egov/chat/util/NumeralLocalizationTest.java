package org.egov.chat.util;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.Before;
import org.junit.Test;

public class NumeralLocalizationTest {

    private ObjectMapper objectMapper;

    @Before
    public void init() {
        objectMapper = new ObjectMapper(new JsonFactory());
    }

    @Test
    public void testNumberDetection() {
        String stringWithNumbers = "19/07/2019";
        for(char c : stringWithNumbers.toCharArray()) {
            System.out.println(c + " is Numberic : " + Character.isDigit(c));
        }
    }

    @Test
    public void testArrayNodeAdd() {
        ArrayNode arrayNode = objectMapper.createArrayNode();

        ObjectNode objectNode = objectMapper.createObjectNode();
        objectNode.put("value", "1");
        arrayNode.add(objectNode);

        ArrayNode newArrayNode = objectMapper.createArrayNode();

        objectNode = objectMapper.createObjectNode();
        objectNode.put("value", "2");
        newArrayNode.add(objectNode);

        objectNode = objectMapper.createObjectNode();
        objectNode.put("value", "3");
        newArrayNode.add(objectNode);

        arrayNode.addAll(newArrayNode);

        System.out.println(arrayNode.toString());
    }

}