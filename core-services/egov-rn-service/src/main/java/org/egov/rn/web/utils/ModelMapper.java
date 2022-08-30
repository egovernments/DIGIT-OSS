package org.egov.rn.web.utils;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;

public class ModelMapper {
    private ModelMapper() {}

    public static ResponseInfo map(RequestInfo requestInfo, boolean isOk) {
        final String apiId = requestInfo != null ? requestInfo.getApiId() : "";
        final String ver = requestInfo != null ? requestInfo.getVer() : "";
        Long ts = null;
        if(requestInfo!=null)
            ts = requestInfo.getTs();
        final String resMsgId = "uief87324";
        final String msgId = requestInfo != null ? requestInfo.getMsgId() : "";
        final String responseStatus = isOk ? "successful" : "failed";

        return ResponseInfo.builder().apiId(apiId).ver(ver).ts(ts)
                .resMsgId(resMsgId).msgId(msgId).resMsgId(resMsgId)
                .status(responseStatus).build();
    }
}
