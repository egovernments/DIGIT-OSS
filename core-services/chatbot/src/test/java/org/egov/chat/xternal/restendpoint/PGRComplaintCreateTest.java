package org.egov.chat.xternal.restendpoint;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.WriteContext;
import lombok.extern.slf4j.Slf4j;
import org.egov.chat.models.Message;
import org.junit.Test;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
public class PGRComplaintCreateTest {

    @Test
    public void test() throws IOException {
        List<Message> messageList = new ArrayList<>();

        messageList.add(Message.builder().nodeId("type").messageContent("1").build());
        messageList.add(Message.builder().nodeId("address").messageContent("my address").build());

        Optional<Message> message = messageList.stream().filter(message1 -> message1.getNodeId() == "type").findFirst();

        System.out.println(message.get().getMessageContent());

        ObjectMapper mapper = new ObjectMapper(new JsonFactory());
        ObjectNode objectNode = mapper.createObjectNode();

        objectNode.set("asd", TextNode.valueOf("qwe"));

        log.info(String.valueOf(objectNode.at("/asd")));

        log.info(objectNode.toString());

    }

    @Test
    public void testParams() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper(new JsonFactory());

        String paramString = "{\"pgr.create.complaintType\":\"StreetLightNotWorking\",\"pgr.create.locality\":\"Ajit Nagar\",\"pgr.create.complaintDetails\":\"D\",\"pgr.create.address\":\"H\",\"tenantId\":\"pb.amritsar\",\"mobileNumber\":\"\",\"authToken\":\"a3aa6972-8231-4e4b-a256-3b36f3f03e4b\",\"refreshToken\":\"8925fd84-ca6f-4256-a1b4-039f33325a29\",\"userInfo\":\"{\\\"id\\\":1341,\\\"uuid\\\":\\\"160231df-4407-4ea7-b15f-cd21821375b5\\\",\\\"userName\\\":\\\"\\\",\\\"name\\\":\\\"Rushang Dhanesha\\\",\\\"mobileNumber\\\":\\\"\\\",\\\"emailId\\\":null,\\\"locale\\\":null,\\\"type\\\":\\\"CITIZEN\\\",\\\"roles\\\":[{\\\"name\\\":\\\"Citizen\\\",\\\"code\\\":\\\"CITIZEN\\\",\\\"tenantId\\\":\\\"pb\\\"}],\\\"active\\\":true,\\\"tenantId\\\":\\\"pb\\\"}\"}";

        ObjectNode objectNode = (ObjectNode) objectMapper.readTree(paramString);

        log.info(objectNode.get("userInfo").asText());

        DocumentContext documentContext = JsonPath.parse(objectNode.get("userInfo").asText());

        log.info(documentContext.jsonString());

        DocumentContext requestBody = JsonPath.parse("{\"RequestInfo\":{\"authToken\":\"\", \"userInfo\": {}},\"actionInfo\":[{\"media\":[]}],\"services\":[{\"addressDetail\":{\"city\":\"\",\"mohalla\":\"\"},\"city\":\"\",\"mohalla\":\"\",\"phone\":\"\",\"serviceCode\":\"\",\"source\":\"web\",\"tenantId\":\"\"}]}");

        requestBody.set("$.RequestInfo.userInfo", documentContext.json());

        log.info(requestBody.jsonString());

    }

    @Test
    public void testAddElementToArrayDocumentContext() {
        String pgrCreateRequestBody = "{\"RequestInfo\":{\"authToken\":\"\", \"userInfo\": {}}," +
                "\"actionInfo\":[{\"media\":[]}],\"services\":[{\"addressDetail\":{\"city\":\"\",\"mohalla\": \"\"," +
                "\"latitude\" : \"\",\"longitude\" : \"\"},\"city\":\"\",\"phone\":\"\",\"serviceCode\":\"\"," +
                "\"source\":\"web\",\"tenantId\":\"\",\"description\":\"\"}]}";

        WriteContext request = JsonPath.parse(pgrCreateRequestBody);

        request.add("$.actionInfo.[0].media", "asd");

        log.info(request.jsonString());
    }

}
