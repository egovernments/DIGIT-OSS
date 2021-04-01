package org.egov.batchtelemetry.connector;

import com.jayway.jsonpath.JsonPath;
import lombok.extern.slf4j.Slf4j;
import org.egov.batchtelemetry.config.AppProperties;
import org.apache.spark.SparkConf;
import org.apache.spark.SparkContext;
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.elasticsearch.spark.rdd.api.java.JavaEsSpark;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
public class ElasticsearchConnector {

    private AppProperties appProperties;

    public ElasticsearchConnector() {
        appProperties = new AppProperties();
    }

    public JavaPairRDD<String, Map<String, Object>> getTelemetryRecords(Long startTime, Long endTime) {
        SparkConf sparkConf = new SparkConf().setAppName("batch-telemetry").setMaster("local[*]");
        sparkConf.set("es.index.auto.create", "true");
        sparkConf.set("es.nodes.wan.only", appProperties.getEsNodesWANOnly());
        sparkConf.set("es.nodes", appProperties.getEsHost());
        sparkConf.set("es.port", appProperties.getEsPort());

        sparkConf.set("es.query", "{\"query\":{\"bool\":{\"must\":[{\"match_all\":{}},{\"match_phrase\":{\"edata" +
                ".type\":{\"query\":\"page\"}}},{\"range\":{\"ets\":{\"gte\":" + startTime + ",\"lte\":" + endTime + "," +
                "\"format\":\"epoch_millis\"}}}],\"must_not\":[]}}}");

        SparkContext sparkContext = new SparkContext(sparkConf);

        JavaPairRDD<String, Map<String, Object>> esRDD = JavaEsSpark.esRDD(JavaSparkContext.fromSparkContext(sparkContext),
                appProperties.getInputTelemetryIndex());

        return esRDD;
    }

    public List<String> getExistingUserIds()  {
        List<String> userIds = new ArrayList<>();

        Integer numberOfUsers = getNumberOfExistingUsers();
        String distinctUserQuery = "{\"size\":0,\"aggs\":{\"distinct_uid\":{\"terms\":{\"field\":\"userId.keyword\"," +
                "\"size\":" + numberOfUsers + "}}}}";

        log.info("Number of Existing users : " + numberOfUsers);

        try {
            URL esURL = new URL(appProperties.getEsURL() + appProperties.getOutputTelemetrySessionsIndex() +
                    "_search/");
            String response = executeQuery(esURL, distinctUserQuery);
            userIds = JsonPath.read(response, "$.aggregations.distinct_uid.buckets.[*].key");

        } catch (Exception e) {
            log.info(e.getMessage());
        }

        return userIds;
    }

    public Integer getNumberOfExistingUsers() {
        String distinctUserQuery = "{\"size\":0,\"aggs\":{\"numberOfUsers\":{\"cardinality\":{\"field\":\"userId" +
                ".keyword\"}}}}";

        try {
            URL esURL = new URL(appProperties.getEsURL() + appProperties.getOutputTelemetrySessionsIndex() +
                    "_search/");
            String response = executeQuery(esURL, distinctUserQuery);
            return JsonPath.read(response, "$.aggregations.numberOfUsers.value");
        } catch (Exception e) {
            log.info(e.getMessage());
        }
        return 10000;
    }


    private String executeQuery(URL url, String queryContent) {
        String esResponse = null;

        try {
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");

            connection.setDoOutput(true);
            OutputStream connectionOutputStream =  connection.getOutputStream();

            connectionOutputStream.write(queryContent.getBytes());

            if(connection.getResponseCode() == HttpURLConnection.HTTP_OK) {
                BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                String inputLine;
                StringBuffer response = new StringBuffer();
                while ((inputLine = in .readLine()) != null) {
                    response.append(inputLine);
                }
                in .close();
                esResponse = response.toString();
            } else {
                log.info("Error in Elasticsearch Query");
            }

        } catch (IOException e) {
            log.error(e.getMessage());
        }


        return esResponse;
    }
}
