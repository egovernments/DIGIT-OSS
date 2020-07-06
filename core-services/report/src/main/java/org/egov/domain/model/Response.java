package org.egov.domain.model;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.springframework.stereotype.Component;

@Component
public class Response {

    public ResponseInfo createResponseInfoFromRequestInfo(final RequestInfo requestInfo, final Boolean success) {
        final String apiId = requestInfo != null ? requestInfo.getApiId() : "";
        final String ver = requestInfo != null ? requestInfo.getVer() : "";
        final String ts = requestInfo != null ? requestInfo.getTs().toString() : "";
        final String resMsgId = "uief87324"; // FIXME : Hard-coded
        final String msgId = requestInfo != null ? requestInfo.getMsgId() : "";
        final String responseStatus = success ? "successful" : "failed";
        return new ResponseInfo(apiId, ver, Long.valueOf(ts), resMsgId, msgId, responseStatus);
    }

}
