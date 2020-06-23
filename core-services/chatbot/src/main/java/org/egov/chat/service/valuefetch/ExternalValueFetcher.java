package org.egov.chat.service.valuefetch;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public interface ExternalValueFetcher {

    public ArrayNode getValues(ObjectNode params);

    public String getCodeForValue(ObjectNode params, String value);

    public String createExternalLinkForParams(ObjectNode params);

}
