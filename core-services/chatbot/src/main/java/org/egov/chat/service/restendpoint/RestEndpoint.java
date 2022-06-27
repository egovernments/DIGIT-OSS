package org.egov.chat.service.restendpoint;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.egov.tracer.model.CustomException;

public interface RestEndpoint {

    public ObjectNode getMessageForRestCall(ObjectNode params) throws CustomException;

}
