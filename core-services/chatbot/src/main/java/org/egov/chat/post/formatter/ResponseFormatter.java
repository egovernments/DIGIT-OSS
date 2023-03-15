package org.egov.chat.post.formatter;

import com.fasterxml.jackson.databind.JsonNode;

import java.io.IOException;
import java.util.List;

public interface ResponseFormatter {

    public String getStreamName();

    public List<JsonNode> getTransformedResponse(JsonNode response) throws IOException;

}
