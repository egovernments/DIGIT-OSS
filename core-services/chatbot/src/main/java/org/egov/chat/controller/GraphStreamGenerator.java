package org.egov.chat.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;
import org.egov.chat.ChatBot;
import org.egov.chat.config.graph.GraphReader;
import org.egov.chat.config.graph.TopicNameGetter;
import org.egov.chat.service.streams.CreateBranchStream;
import org.egov.chat.service.streams.CreateEndpointStream;
import org.egov.chat.service.streams.CreateStepStream;
import org.egov.chat.util.KafkaTopicCreater;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Iterator;
import java.util.Set;

@Component
public class GraphStreamGenerator {

    @Autowired
    private CreateStepStream createStepStream;
    @Autowired
    private CreateBranchStream createBranchStream;
    @Autowired
    private CreateEndpointStream createEndpointStream;
    @Autowired
    private GraphReader graphReader;
    @Autowired
    private TopicNameGetter topicNameGetter;
    @Autowired
    private KafkaTopicCreater kafkaTopicCreater;

    String rootFolder = "graph/";
    String fileExtension = ".yaml";


    public void generateGraphStreams() throws IOException {
        Set<String> vertices = graphReader.getAllVertices();
        Iterator<String> vertexIterator = vertices.iterator();

        while (vertexIterator.hasNext()) {
            String node = vertexIterator.next();

            String pathToFile = getPathToConfigFileForNode(node);

            JsonNode config = getConfigForFile(pathToFile);

            String nodeType = config.get("nodeType").asText();

            if (nodeType.equalsIgnoreCase("step")) {
                String answerInputTopicName = topicNameGetter.getAnswerInputTopicNameForNode(node);
                String questionTopicName = topicNameGetter.getQuestionTopicNameForNode(node);
                String answerOutputTopicName = topicNameGetter.getAnswerOutputTopicNameForNode(node);
                kafkaTopicCreater.createTopic(answerInputTopicName);
                kafkaTopicCreater.createTopic(questionTopicName);
                kafkaTopicCreater.createTopic(answerOutputTopicName);
                createStepStream.createEvaluateAnswerStreamForConfig(config,
                        answerInputTopicName,
                        answerOutputTopicName,
                        questionTopicName);

                createStepStream.createQuestionStreamForConfig(config,
                        topicNameGetter.getQuestionTopicNameForNode(node),
                        "send-message");

            } else if (nodeType.equalsIgnoreCase("branch")) {
                String answerInputTopicName = topicNameGetter.getAnswerInputTopicNameForNode(node);
                String questionTopicName = topicNameGetter.getQuestionTopicNameForNode(node);
                kafkaTopicCreater.createTopic(questionTopicName);
                kafkaTopicCreater.createTopic(answerInputTopicName);

                createBranchStream.createEvaluateAnswerStreamForConfig(config,
                        answerInputTopicName,
                        questionTopicName);

                createBranchStream.createQuestionStreamForConfig(config,
                        topicNameGetter.getQuestionTopicNameForNode(node),
                        "send-message");
            } else if (nodeType.equalsIgnoreCase("endpoint")) {

                String questionTopicName = topicNameGetter.getQuestionTopicNameForNode(node);
                kafkaTopicCreater.createTopic(questionTopicName);
                createEndpointStream.createEndpointStream(config, questionTopicName,
                        "send-message");
            }
        }
    }

    private String getPathToConfigFileForNode(String node) {
        String path = "";
        path += rootFolder;
        String subFolders[] = node.split("\\.");
        for (int i = 0; i < subFolders.length - 1; i++) {
            path += subFolders[i] + "/";
        }
        path += node;
        path += fileExtension;
        return path;
    }

    private JsonNode getConfigForFile(String pathToFile) throws IOException {
        ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
        JsonNode config = mapper.readTree(ChatBot.class.getClassLoader().getResource(pathToFile));
        return config;
    }


}
