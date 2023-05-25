package org.egov.chat;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.jayway.jsonpath.DocumentContext;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.WriteContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.List;

@Slf4j
@Controller
@ConditionalOnProperty( value = "test.data.cleanup.enabled", havingValue = "true")
public class RemoveTestData {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private ObjectMapper objectMapper;

    @Value("${elasticsearch.host}")
    private String esHost;
    @Value("${elasticsearch.chatbot.messages.index.name}")
    private String indexName;

    private static String deleteConversationStateFromDBQuery = "DELETE FROM eg_chat_conversation_state WHERE user_id=?";

    private static String deleteFromElasticsearchByUserIdQuery = "{\"query\":{\"match\":{\"user.userId\":\"\"}}}";

    @RequestMapping(value = "/removetestdata", method = RequestMethod.POST)
    public ResponseEntity<Object> removeTestData(@RequestBody List<String> uuids) throws IOException {
        deleteDataFromDB(uuids);
        deleteDataFromElasticsearch(uuids);
        return new ResponseEntity<>(uuids, HttpStatus.OK);
    }

    private void deleteDataFromDB(List<String> uuids) {
        for(String userId : uuids) {
            jdbcTemplate.update(deleteConversationStateFromDBQuery, userId);
            log.info("Test user's data deleted from database : " + userId);
        }
    }

    private void deleteDataFromElasticsearch(List<String> uuids) throws IOException {
        String url = esHost + indexName + "/_delete_by_query";

        for(String userId : uuids) {
            WriteContext writeContext = JsonPath.parse(deleteFromElasticsearchByUserIdQuery);
            writeContext.set("$.query.match['user.userId']", userId);

            JsonNode request = objectMapper.readTree(writeContext.jsonString());

            restTemplate.postForEntity(url, request, JsonNode.class);
            log.info("Test user's data deleted from elasticsearch : " + userId);
        }
    }

}
