package org.egov.tenant.web.contract.factory;

import org.egov.common.contract.request.RequestInfo;
import org.egov.common.contract.response.ResponseInfo;
import org.springframework.stereotype.Component;

@Component
public class ResponseInfoFactory {

	public ResponseInfo createResponseInfoFromRequestInfo(final RequestInfo requestInfo, final Boolean success) {
		final String apiId = requestInfo != null ? requestInfo.getApiId() : "";
		final String ver = requestInfo != null ? requestInfo.getVer() : "";
		String ts = "";
		if (requestInfo != null && requestInfo.getTs() != null) {
			ts = requestInfo.getTs().toString();

		}
		final String resMsgId = "uief87324"; // FIXME : Hard-coded
		final String msgId = requestInfo != null ? requestInfo.getMsgId() : "";
		final String responseStatus = success ? "successful" : "failed";
		return new ResponseInfo(apiId, ver, ts, resMsgId, msgId, responseStatus);
	}

}
