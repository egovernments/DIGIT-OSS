package org.egov.chat.pre.formatter;

import com.fasterxml.jackson.databind.JsonNode;
import org.egov.tracer.model.CustomException;

public interface RequestFormatter {

    public String getStreamName();

    public boolean isValid(JsonNode inputRequest);

    public JsonNode getTransformedRequest(JsonNode inputRequest) throws CustomException;

}
