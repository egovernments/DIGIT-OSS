package org.egov.chat.post.systeminitiated;

import com.fasterxml.jackson.databind.JsonNode;
import org.egov.tracer.model.CustomException;

import java.util.List;

public interface SystemInitiatedEventFormatter {

    public String getStreamName() ;

    public void startStream(String inputTopic, String outputTopic) ;

    public List<JsonNode> createChatNodes(JsonNode event) throws CustomException;
}
