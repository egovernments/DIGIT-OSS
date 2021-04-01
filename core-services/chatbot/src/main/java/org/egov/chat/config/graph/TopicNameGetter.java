package org.egov.chat.config.graph;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TopicNameGetter {

    @Autowired
    private GraphReader graphReader;

    public String getQuestionTopicNameForNode(String nodeName) {
        return nodeName + "-question";
    }

    public String getAnswerInputTopicNameForNode(String nodeName) {
        return nodeName + "-answer";
    }

    public String getAnswerOutputTopicNameForNode(String nodeName) {
        List<String> nextNodes = graphReader.getNextNodes(nodeName);
        if (nextNodes.size() == 1)
            return nextNodes.get(0) + "-question";
        if (nextNodes.size() == 0)
            return nodeName + "-end";
        return null;
    }
}
