package org.egov.batchtelemetry.processor;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.Configuration;
import com.jayway.jsonpath.JsonPath;
import com.jayway.jsonpath.Option;
import lombok.extern.slf4j.Slf4j;
import org.egov.batchtelemetry.config.AppProperties;
import org.egov.batchtelemetry.constants.TelemetryConstants;
import org.egov.batchtelemetry.models.InputNode;
import org.egov.batchtelemetry.models.InputPath;
import org.egov.batchtelemetry.models.Node;
import org.egov.batchtelemetry.producer.Producer;
import org.egov.batchtelemetry.util.URLComparator;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.*;

@Slf4j
public class PathProcessor {

    private ObjectMapper mapper;
    private String kafkaTopic;
    private Producer producer;
    private Configuration configuration;


    private List<InputPath> inputPaths;

    public PathProcessor(AppProperties appProperties) {

        mapper = new ObjectMapper();
        producer = new Producer();
        kafkaTopic = appProperties.getOutputKafkaTopic();
        configuration = Configuration.defaultConfiguration().addOptions(Option.DEFAULT_PATH_LEAF_TO_NULL, Option.SUPPRESS_EXCEPTIONS);

        inputPaths = new ArrayList<>();

        initPaths();
    }

    private void initPaths() {
        List<InputNode> inputNodes;

        inputNodes = new ArrayList<>();
        inputNodes.add(InputNode.builder().nodeName("/citizen/user/login").url("/citizen/user/login").build());
        inputNodes.add(InputNode.builder().nodeName("/citizen/user/otp").url("/citizen/user/otp").build());
        inputNodes.add(InputNode.builder().nodeName("/citizen").url("/citizen").build());

        inputPaths.add(InputPath.builder().pathId("path-1").inputNodes(inputNodes).build());

        inputNodes = new ArrayList<>();
        inputNodes.add(InputNode.builder().nodeName("/citizen").url("/citizen").build());
        inputNodes.add(InputNode.builder().nodeName("/citizen/property-tax").url("/citizen/property-tax").build());

        inputPaths.add(InputPath.builder().pathId("path-2").inputNodes(inputNodes).build());
    }


    public void findAndPushPaths(List<Map<String, Object>> sessionContent, String sessionId) {
//        log.info("Finding paths for sessionId : " + sessionId);
        List<Map<String, Object>> summaryEvents = new ArrayList<>();
        for(Map<String, Object> event : sessionContent) {
            String jsonRecord = new JSONObject(event).toString();
            if("SUMMARY".equalsIgnoreCase(JsonPath.using(configuration).parse(jsonRecord).read("$.eid"))) {
                summaryEvents.add(event);
            }
        }

        for(InputPath inputPath : inputPaths) {
            checkForPath(summaryEvents, inputPath, sessionId);
        }
    }

    public void checkForPath(List<Map<String, Object>> summaryEvents, InputPath inputPath, String sessionId) {
        int nodePointer = 0;
        for(int eventPointer = 0; eventPointer < summaryEvents.size(); eventPointer++) {

            String event = new JSONObject(summaryEvents.get(eventPointer)).toString();
            String eventURL = JsonPath.using(configuration).parse(event).read("$.edata.url");
            if(eventURL == null)
                continue;

            InputNode inputNode = inputPath.getInputNodes().get(nodePointer);
            String nodeURL = inputNode.getUrl();

            if(URLComparator.compareURLs(eventURL, nodeURL)) {

                String nodeId = UUID.randomUUID().toString();
                Long timestamp = JsonPath.using(configuration).parse(event).read("$.ets");
                Long timeSpent = Long.valueOf(JsonPath.using(configuration).parse(event).read("$.edata.timeSpent").toString());

                Node node = Node.builder().type(TelemetryConstants.pathTypeName).nodeId(nodeId).pathId(inputPath.getPathId())
                        .sessionId(sessionId).nodeName(inputNode.getNodeName()).url(inputNode.getUrl()).nodeTime(timestamp)
                        .timeSpent(timeSpent).timestamp(getTimestamp(timestamp)).build();
                pushNodeDetails(node);

                nodePointer++;
                if(nodePointer == inputPath.getInputNodes().size())
                    nodePointer = 0;

            } else if(nodePointer > 0 && URLComparator.compareURLs(eventURL, inputPath.getInputNodes()
                    .get(nodePointer - 1).getUrl())) {
                continue;
            } else {
                nodePointer = 0;
            }
        }
    }

    private static String getTimestamp(Long timestamp) {
        Date date = new Date(Long.valueOf(timestamp));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
        formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
        return formatter.format(date);
    }

    private void pushNodeDetails(Node node) {
        JsonNode jsonNode = mapper.valueToTree(node);
        producer.push(kafkaTopic, node.getNodeId(), node.getNodeTime(), jsonNode);
    }
}
