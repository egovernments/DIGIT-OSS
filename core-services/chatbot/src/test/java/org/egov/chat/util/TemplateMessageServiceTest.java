package org.egov.chat.util;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.Before;
import org.junit.Test;

import java.io.IOException;
import java.util.Iterator;
import java.util.Map;

public class TemplateMessageServiceTest {

    private ObjectMapper objectMapper;

    private ObjectNode params;

    @Before
    public void init() throws IOException {
        objectMapper = new ObjectMapper(new JsonFactory());
        params = (ObjectNode) objectMapper.readTree("{\"url\":{\"value\":\"https://asd.com\"}," +
                "\"serviceRequestId\":{\"value\":\"123/34\"}}");
    }

    @Test
    public void testFetchParams() throws IOException {

        Iterator<Map.Entry<String, JsonNode>> paramIterator = params.fields();
        System.out.println(params.size());
        while (paramIterator.hasNext()) {
            Map.Entry<String, JsonNode> param = paramIterator.next();
            System.out.println(param.getKey());
            System.out.println(param.getValue().toString());
        }

    }

    @Test
    public void testTemplateReplaceString() {
        String templateString = "Complaint registered successfully!\nYour complaint number is : " +
                "{{serviceRequestId}}\nYou can view your complaint at : {{url}}, {{serviceRequestId}}";

        Iterator<Map.Entry<String, JsonNode>> paramIterator = params.fields();
        while (paramIterator.hasNext()) {
            Map.Entry<String, JsonNode> param = paramIterator.next();
            String key = param.getKey();
            String localizedValue = param.getValue().get("value").asText();

            templateString = templateString.replace("{{" + key + "}}" , localizedValue);
        }

        System.out.println(templateString);
    }

}