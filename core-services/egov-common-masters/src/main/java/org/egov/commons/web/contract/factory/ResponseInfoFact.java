package org.egov.commons.web.contract.factory;


import org.egov.common.contract.request.RequestInfo;
import org.springframework.stereotype.Component;

import lombok.EqualsAndHashCode;

import static org.springframework.util.ObjectUtils.isEmpty;

@Component
@EqualsAndHashCode
public class ResponseInfoFact {
	public org.egov.common.contract.response.ResponseInfo createResponseInfoFromRequestInfo(RequestInfo requestInfo, Boolean success) {

		String apiId = null;
		String ver = null;
		String ts = null;
		String resMsgId = "uief87324"; // FIXME : Hard-coded
		String msgId = null;
		if (requestInfo != null) {
			apiId = requestInfo.getApiId();
			ver = requestInfo.getVer();
			ts = isEmpty(requestInfo.getTs()) ? null : requestInfo.getTs().toString();
			msgId = requestInfo.getMsgId();
		}
		String responseStatus = success ? "successful" : "failed";

		return new org.egov.common.contract.response.ResponseInfo(apiId, ver, ts, resMsgId, msgId, responseStatus);
	}
}

