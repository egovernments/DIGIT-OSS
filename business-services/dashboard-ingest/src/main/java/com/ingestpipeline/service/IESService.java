package com.ingestpipeline.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ingestpipeline.model.TargetData;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.http.HttpHost;
import org.apache.http.HttpStatus;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public interface IESService {

    public final String DOC_TYPE = "/doc/";

    public ResponseEntity<Object> post(String index, String type, String id, String authToken, String requestNode);

    /**
     * Holds client for each indices.
     */
    static Map<String, RestHighLevelClient> esClient = new HashMap<String, RestHighLevelClient>();
    static final String INVALID_QUERY_ERROR ="invalid query: must be boolean, match_phrase ";

    /** searches documents from ES based on query using RestHighLevelClient
     * @param index - ElasticSearch Index
     * @param searchQuery - which contains details for search
     * @return
     */
    JsonNode search(String index, ObjectNode searchQuery) throws IOException;

    Boolean push(TargetData requestBody) throws Exception;

    /**
     * searches documents from ES based on query using restTemplate
     * @param index
     * @param query
     * @return
     * @throws Exception
     */
    Map search(String index, String query) throws Exception;
    
    List searchMultiple(String index, String query) throws Exception;
    Boolean push(Map requestBody) throws Exception;


    /**
     * Translates a string query to SearchRequest
     * valid query string has bool type query
     * @param queryNode
     * @return
     */
    default SearchRequest buildSearchRequest(String index, ObjectNode queryNode) throws IOException{
        final BoolQueryBuilder query = QueryBuilders.boolQuery();

        ArrayNode mustNodeArr = (ArrayNode) queryNode.get("query").get("bool").get("must");
        if(null == mustNodeArr)
            throw new IllegalArgumentException(INVALID_QUERY_ERROR);

        mustNodeArr.elements().forEachRemaining(mustNode -> {
            mustNode.fields().forEachRemaining(entry -> {
                if(entry.getKey().equalsIgnoreCase("match_phrase") && entry.getValue().isObject()){
                    JsonNode node = entry.getValue();
                    Map.Entry<String, JsonNode> dataNode = node.fields().next();
                    query.must(QueryBuilders.matchPhraseQuery(dataNode.getKey(), dataNode.getValue().textValue()));
                }
            });

        });
        return new SearchRequest(index).source(new SearchSourceBuilder().query(query));
    }

    /**
     *
     * @param indexName
     * @param hostName
     * @param port
     * @param schema
     * @return
     */
    default RestHighLevelClient getClient(String indexName, String hostName, Integer port, String schema){
        RestHighLevelClient client = esClient.get(indexName);
        if(null == client){
            client = new RestHighLevelClient(RestClient.builder(new HttpHost(hostName, port, schema)));
            esClient.put(indexName, client);
        }
        return client;
    }

    /*default boolean isIndexExists(String indexName) {
        Response response;
        try {
            response = getClient(indexName).getLowLevelClient().performRequest(new Request("HEAD", "/" + indexName));
            return (200 == response.getStatusLine().getStatusCode());
        } catch (IOException e) {
            return false;
        }

    }*/

    default boolean createIndex(String indexName){
        //TODO
        return Boolean.TRUE;
    }

    Boolean searchIndex(String index, String query, String dataContextVersion) throws Exception;
}
